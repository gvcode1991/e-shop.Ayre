import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createOrder, listOrders } from "./services/ordersService.js";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "./services/productsService.js";
import { uploadProductImage } from "./services/cloudinaryService.js";
import { sendAccountConfirmationEmail, isEmailConfigured, verifyEmailConnection } from "./services/emailService.js";
import { attachPurchaseToUser, confirmUserEmail, getUserByEmail, isVerifiedUserEmail, registerUser, setFavorite, updateUserPreferences } from "./services/usersService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../dist");
const freeShippingThreshold = 60000;
const shippingCost = 4500;
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
  app.use(express.json());

  app.get("/api/health", (_request, response) => {
    response.json({
      ok: true,
      service: "ayre-api",
      mongoConfigured: Boolean(process.env.MONGODB_URI),
      cloudinaryConfigured: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
      emailConfigured: isEmailConfigured(),
      mongoState: mongoose.connection.readyState,
    });
  });

  app.get("/api/health/email", async (_request, response) => {
    const email = await verifyEmailConnection();
    response.status(email.ok ? 200 : 503).json(email);
  });

  app.post("/api/uploads/products", upload.single("image"), async (request, response, next) => {
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

  app.post("/api/products", async (request, response, next) => {
    try {
      const product = await createProduct(request.body);
      response.status(201).json({ product });
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/products/:id", async (request, response, next) => {
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

  app.delete("/api/products/:id", async (request, response, next) => {
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

  app.get("/api/orders", async (_request, response, next) => {
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
      let email;

      try {
        email = await sendAccountConfirmationEmail(user, user.confirmationToken);
      } catch (error) {
        console.warn(`No pudimos enviar el email de activacion: ${error.message}`);
        email = {
          sent: false,
          reason: "send-failed",
          message: "Cuenta creada, pero no pudimos enviar el email de activacion. Revisa SMTP en Render.",
        };
      }

      const { confirmationToken, ...publicUser } = user;
      response.status(201).json({ user: publicUser, email });
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
            <p>Tu email ${user.email} ya esta confirmado. Ya podes comprar en AyRe.</p>
            <a href="/" style="display:inline-block;margin-top:16px;padding:12px 18px;border-radius:999px;background:#9b7350;color:white;text-decoration:none">Volver a la tienda</a>
          </section>
        </main>
      `);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/users/:email", async (request, response, next) => {
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

  app.put("/api/users/:email/favorites/:productId", async (request, response, next) => {
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

  app.put("/api/users/:email/preferences", async (request, response, next) => {
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

      if (customer.delivery === "Envio a domicilio" && !customer.address) {
        response.status(400).json({ message: "Necesitamos la direccion para enviar el pedido." });
        return;
      }

      const orderItems = await Promise.all(items.map(async (item) => {
        const product = await getProductById(item.id);
        const quantity = Number(item.quantity || 0);
        const size = String(item.size || "").trim();

        if (!product || product.active === false || quantity < 1 || !size) {
          return null;
        }

        return {
          id: product.id,
          name: product.name,
          quantity,
          size,
          unitPrice: product.price,
          subtotal: product.price * quantity,
        };
      }));

      if (orderItems.some((item) => item === null)) {
        response.status(400).json({ message: "Hay productos invalidos o sin talle en el pedido." });
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

      response.status(201).json(result);
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
