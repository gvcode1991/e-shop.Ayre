import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createOrder, listOrders } from "./services/ordersService.js";
import { createProduct, decrementProductStock, deleteProduct, getAvailableStock, getProductById, listProducts, updateProduct } from "./services/productsService.js";
import { uploadProductImage } from "./services/cloudinaryService.js";
import { sendAccountConfirmationEmail, isEmailConfigured, verifyEmailConnection } from "./services/emailService.js";
import { createAdminSessionToken, createSessionToken, verifySessionToken } from "./services/authService.js";
import { attachPurchaseToUser, authenticateUser, confirmUserEmail, deletePendingUser, getUserByEmail, isVerifiedUserEmail, listUsers, registerUser, setFavorite, updateUserPreferences, updateUserRole } from "./services/usersService.js";
import { notifyAdminOrder } from "./services/whatsappService.js";
import { getServiceName, getStoreName } from "./config/storeConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../dist");
const freeShippingThreshold = 60000;
const shippingCost = 4500;
const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);
const rateLimitStore = new Map();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("Solo se permiten imagenes."));
      return;
    }

    callback(null, true);
  },
});

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://127.0.0.1:5173" }));
  app.use(express.json({ limit: "80kb" }));
  app.use(securityHeaders);
  app.use(rateLimit({ windowMs: 60_000, max: 120 }));
  app.use("/api/users", rateLimit({ windowMs: 60_000, max: 12 }));
  app.use("/api/auth", rateLimit({ windowMs: 60_000, max: 12 }));
  app.use("/api/admin", rateLimit({ windowMs: 60_000, max: 12 }));
  app.use("/api/orders", rateLimit({ windowMs: 60_000, max: 20 }));
  app.use("/api/uploads", rateLimit({ windowMs: 60_000, max: 8 }));

  app.get("/api/health", (_request, response) => {
    const health = {
      ok: true,
      service: getServiceName(),
    };

    if (!isProduction) {
      health.mongoConfigured = Boolean(process.env.MONGODB_URI);
      health.cloudinaryConfigured = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
      health.emailConfigured = isEmailConfigured();
      health.mongoState = mongoose.connection.readyState;
    }

    response.json(health);
  });

  app.get("/api/health/email", requireAdmin, async (_request, response) => {
    const email = await verifyEmailConnection();
    response.status(email.ok ? 200 : 503).json(email);
  });

  app.post("/api/admin/login", async (request, response, next) => {
    const email = String(request.body.email || "").trim().toLowerCase();
    const password = String(request.body.password || "");
    const configuredEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const configuredPassword = String(process.env.ADMIN_PASSWORD || "");

    try {
      if (configuredEmail && configuredPassword && email === configuredEmail && password === configuredPassword) {
        response.json({ ok: true, token: createAdminSessionToken(email) });
        return;
      }

      const user = await authenticateUser(email, password);

      if (!user || user.role !== "admin") {
        response.status(401).json({ message: "Credenciales admin incorrectas." });
        return;
      }

      response.json({ ok: true, user, token: createSessionToken(user) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/session", requireAdmin, (_request, response) => {
    response.json({ ok: true, role: "admin" });
  });

  app.get("/api/admin/users", requireAdmin, async (_request, response, next) => {
    try {
      const users = await listUsers();
      response.json({ users });
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/admin/users/:email/role", requireAdmin, async (request, response, next) => {
    try {
      const user = await updateUserRole(request.params.email, request.body.role);

      if (!user) {
        response.status(404).json({ message: "Usuario no encontrado." });
        return;
      }

      response.json({ user });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/uploads/products", requireAdmin, upload.single("image"), async (request, response, next) => {
    try {
      const image = await uploadProductImage(request.file);
      response.status(201).json({ image });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products", async (request, response, next) => {
    try {
      const products = await listProducts(request.query);
      response.json({ products });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/:id", async (request, response, next) => {
    try {
      const product = await getProductById(request.params.id);

      if (!product) {
        response.status(404).json({ message: "Producto no encontrado." });
        return;
      }

      response.json({ product });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/products", requireAdmin, async (request, response, next) => {
    try {
      const product = await createProduct(request.body);
      response.status(201).json({ product });
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/products/:id", requireAdmin, async (request, response, next) => {
    try {
      const product = await updateProduct(request.params.id, request.body);

      if (!product) {
        response.status(404).json({ message: "Producto no encontrado." });
        return;
      }

      response.json({ product });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (request, response, next) => {
    try {
      const wasDeleted = await deleteProduct(request.params.id);

      if (!wasDeleted) {
        response.status(404).json({ message: "Producto no encontrado." });
        return;
      }

      response.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders", requireAdmin, async (_request, response, next) => {
    try {
      const result = await listOrders();
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/users", async (request, response, next) => {
    try {
      const user = await registerUser(request.body);

      if (user.alreadyExists) {
        response.status(409).json({ message: "Este email ya esta registrado. Inicia sesion para continuar." });
        return;
      }

      try {
        const email = await sendAccountConfirmationEmail(user, user.confirmationToken);
        const { confirmationToken, ...publicUser } = user;
        response.status(201).json({ user: publicUser, email, token: createSessionToken(publicUser) });
      } catch (error) {
        console.warn(`No pudimos enviar el email de activacion: ${error.message}`);
        await deletePendingUser(user.email);
        response.status(502).json({ message: getEmailFailureMessage(error) });
      }
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/login", async (request, response, next) => {
    try {
      const user = await authenticateUser(request.body.email, request.body.password);

      if (!user) {
        response.status(401).json({ message: "Email o contrasena incorrectos." });
        return;
      }

      response.json({ user, token: createSessionToken(user) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/users/confirm/:token", async (request, response, next) => {
    try {
      const user = await confirmUserEmail(request.params.token);

      if (!user) {
        response.status(404).send("El enlace de confirmacion no es valido o ya fue utilizado.");
        return;
      }

      response.send(`
        <main style="font-family:Arial,sans-serif;min-height:100vh;display:grid;place-items:center;background:#fbf7f2;color:#241913">
          <section style="max-width:520px;padding:32px;border:1px solid #eaded2;background:white;border-radius:8px;text-align:center">
            <h1>Cuenta activada</h1>
            <p>Tu email ${user.email} ya esta confirmado. Ya podes comprar en ${getStoreName()}.</p>
            <a href="/" style="display:inline-block;margin-top:16px;padding:12px 18px;border-radius:999px;background:#9b7350;color:white;text-decoration:none">Volver a la tienda</a>
          </section>
        </main>
      `);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/users/:email", requireUser, requireSameUser, async (request, response, next) => {
    try {
      const user = await getUserByEmail(request.params.email);

      if (!user) {
        response.status(404).json({ message: "Usuario no encontrado." });
        return;
      }

      response.json({ user });
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/users/:email/favorites/:productId", requireUser, requireSameUser, async (request, response, next) => {
    try {
      const user = await setFavorite(request.params.email, request.params.productId, Boolean(request.body.isFavorite));

      if (!user) {
        response.status(404).json({ message: "Registrate para guardar favoritos." });
        return;
      }

      response.json({ user });
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/users/:email/preferences", requireUser, requireSameUser, async (request, response, next) => {
    try {
      const user = await updateUserPreferences(request.params.email, request.body);

      if (!user) {
        response.status(404).json({ message: "Usuario no encontrado." });
        return;
      }

      response.json({ user });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/orders", async (request, response, next) => {
    try {
      const { customer, items } = request.body;
      const session = getUserSession(request);

      if (!Array.isArray(items) || items.length === 0) {
        response.status(400).json({ message: "El pedido necesita al menos un producto." });
        return;
      }

      if (!customer?.name || !customer?.phone || !customer?.email) {
        response.status(400).json({ message: "Necesitamos nombre, telefono y email registrado para crear el pedido." });
        return;
      }

      const isVerified = await isVerifiedUserEmail(customer.email);
      if (!isVerified) {
        response.status(403).json({ message: "Activa tu cuenta desde el email de confirmacion antes de comprar." });
        return;
      }

      if (!session || session.sub !== String(customer.email || "").trim().toLowerCase()) {
        response.status(401).json({ message: "Inicia sesion con el email de la compra para finalizar." });
        return;
      }

      if (customer.delivery === "Envio a domicilio" && !customer.address) {
        response.status(400).json({ message: "Necesitamos la direccion para enviar el pedido." });
        return;
      }

      const orderItems = await Promise.all(items.map(async (item) => {
        const product = await getProductById(item.id);
        const quantity = Number(item.quantity || 0);
        const size = String(item.size || "").trim();
        const color = String(item.color || "").trim();
        const availableStock = getAvailableStock(product?.stock || []);
        const selectedStock = availableStock.find((stockItem) => stockItem.size.toLowerCase() === size.toLowerCase());
        const productColors = product?.colors || [];

        if (!product || product.active === false || quantity < 1 || !size || !selectedStock || selectedStock.quantity < quantity) {
          return null;
        }

        if (productColors.length && !productColors.some((item) => item.toLowerCase() === color.toLowerCase())) {
          return null;
        }

        return {
          id: product.id,
          name: product.name,
          quantity,
          size,
          color,
          unitPrice: product.price,
          subtotal: product.price * quantity,
        };
      }));

      if (orderItems.some((item) => item === null)) {
        response.status(400).json({ message: "Hay productos invalidos, sin talle/color o sin stock suficiente." });
        return;
      }

      const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
      const calculatedShipping = customer.delivery === "Envio a domicilio" && subtotal < freeShippingThreshold ? shippingCost : 0;
      const total = subtotal + calculatedShipping;
      const result = await createOrder({
        customer: {
          name: String(customer.name).trim(),
          phone: String(customer.phone).trim(),
          email: String(customer.email || "").trim(),
          notifyByEmail: Boolean(customer.notifyByEmail ?? true),
        },
        fulfillment: {
          delivery: customer.delivery || "Retiro en tienda",
          address: String(customer.address || "").trim(),
          shippingCost: calculatedShipping,
        },
        payment: customer.payment || "Efectivo",
        notes: String(customer.notes || "").trim(),
        items: orderItems,
        subtotal,
        total,
      });

      if (customer.email && result.order?.id) {
        await attachPurchaseToUser(customer.email, result.order.id);
      }

      await decrementProductStock(orderItems);
      const adminWhatsApp = await notifyAdminOrder(result.order);

      response.status(201).json({
        ...result,
        adminWhatsApp,
        adminWhatsAppUrl: adminWhatsApp.sent ? "" : adminWhatsApp.fallbackUrl,
      });
    } catch (error) {
      next(error);
    }
  });

  app.use(express.static(clientDistPath));

  app.use((_request, response) => {
    response.sendFile(path.join(clientDistPath, "index.html"));
  });

  app.use((error, _request, response, _next) => {
    if (error instanceof multer.MulterError) {
      response.status(400).json({ message: error.code === "LIMIT_FILE_SIZE" ? "La imagen no puede superar 5 MB." : error.message });
      return;
    }

    if (error.code === 11000) {
      response.status(409).json({ message: "Ya existe un registro con ese codigo." });
      return;
    }

    if (
      error.name === "ValidationError" ||
      error.message.includes("obligatorios") ||
      error.message.includes("Ya existe") ||
      error.message.includes("Cloudinary") ||
      error.message.includes("imagen")
    ) {
      response.status(400).json({ message: error.message });
      return;
    }

    console.error(error);
    response.status(500).json({ message: "Error interno del servidor." });
  });

  return app;
}

function securityHeaders(_request, response, next) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
}

function rateLimit({ windowMs, max }) {
  return (request, response, next) => {
    const key = `${request.ip}:${request.baseUrl || request.path}`;
    const now = Date.now();
    const current = rateLimitStore.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > current.resetAt) {
      current.count = 0;
      current.resetAt = now + windowMs;
    }

    current.count += 1;
    rateLimitStore.set(key, current);

    if (current.count > max) {
      response.status(429).json({ message: "Demasiados intentos. Proba nuevamente en unos minutos." });
      return;
    }

    next();
  };
}

function getBearerToken(request) {
  const authorization = request.get("authorization") || "";
  return authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
}

function requireAdmin(request, response, next) {
  const session = verifySessionToken(getBearerToken(request));

  if (session?.role === "admin") {
    next();
    return;
  }

  const configuredKey = process.env.ADMIN_API_KEY;
  const providedKey = request.get("x-admin-key");

  if (!configuredKey || !providedKey || providedKey !== configuredKey) {
    response.status(401).json({ message: "Acceso admin no autorizado." });
    return;
  }

  next();
}

function getUserSession(request) {
  return verifySessionToken(getBearerToken(request));
}

function requireUser(request, response, next) {
  const session = getUserSession(request);

  if (!session) {
    response.status(401).json({ message: "Inicia sesion para continuar." });
    return;
  }

  request.userSession = session;
  next();
}

function requireSameUser(request, response, next) {
  const requestedEmail = String(request.params.email || "").trim().toLowerCase();

  if (request.userSession?.sub !== requestedEmail) {
    response.status(403).json({ message: "No tenes permiso para acceder a esta cuenta." });
    return;
  }

  next();
}

function getEmailFailureMessage(error) {
  const providerMessage = String(error?.message || "");
  const lowerMessage = providerMessage.toLowerCase();
  const looksLikeResendTestLimit =
    error?.status === 403 ||
    lowerMessage.includes("domain") ||
    lowerMessage.includes("verify") ||
    lowerMessage.includes("verified") ||
    lowerMessage.includes("testing");

  if (looksLikeResendTestLimit) {
    return "No pudimos enviar el email de activacion. Con Resend en modo prueba/onboarding solo puede funcionar con emails permitidos por la cuenta. Para registrar clientes reales, verifica un dominio propio en Resend o usa el email de prueba autorizado.";
  }

  return "No pudimos enviar el email de activacion. La cuenta no se guardo; revisa Resend en Render y proba nuevamente.";
}
