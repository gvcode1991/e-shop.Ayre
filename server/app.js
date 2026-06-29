import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createOrder, listOrders } from "./services/ordersService.js";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "./services/productsService.js";
import { uploadProductImage } from "./services/cloudinaryService.js";
import { attachPurchaseToUser, getUserByEmail, registerUser, setFavorite } from "./services/usersService.js";

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
      mongoState: mongoose.connection.readyState,
    });
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
      response.status(201).json({ user });
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

  app.post("/api/orders", async (request, response, next) => {
    try {
      const { customer, items } = request.body;

      if (!Array.isArray(items) || items.length === 0) {
        response.status(400).json({ message: "El pedido necesita al menos un producto." });
        return;
      }

      if (!customer?.name || !customer?.phone) {
        response.status(400).json({ message: "Necesitamos nombre y telefono para crear el pedido." });
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
