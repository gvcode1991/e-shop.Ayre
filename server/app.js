import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import { createOrder, listOrders } from "./services/ordersService.js";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "./services/productsService.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://127.0.0.1:5173" }));
  app.use(express.json());

  app.get("/api/health", (_request, response) => {
    response.json({
      ok: true,
      service: "ayre-api",
      mongoConfigured: Boolean(process.env.MONGODB_URI),
      mongoState: mongoose.connection.readyState,
    });
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

        if (!product || quantity < 1) {
          return null;
        }

        return {
          id: product.id,
          name: product.name,
          quantity,
          unitPrice: product.price,
          subtotal: product.price * quantity,
        };
      }));

      if (orderItems.some((item) => item === null)) {
        response.status(400).json({ message: "Hay productos invalidos en el pedido." });
        return;
      }

      const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
      const result = await createOrder({
        customer: {
          name: String(customer.name).trim(),
          phone: String(customer.phone).trim(),
          email: String(customer.email || "").trim(),
        },
        fulfillment: {
          delivery: customer.delivery || "Retiro en tienda",
          address: String(customer.address || "").trim(),
        },
        payment: customer.payment || "Efectivo",
        notes: String(customer.notes || "").trim(),
        items: orderItems,
        total,
      });

      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  app.use((_request, response) => {
    response.status(404).json({ message: "Ruta no encontrada." });
  });

  app.use((error, _request, response, _next) => {
    console.error(error);
    if (error.code === 11000) {
      response.status(409).json({ message: "Ya existe un registro con ese codigo." });
      return;
    }

    if (error.name === "ValidationError" || error.message.includes("obligatorios") || error.message.includes("Ya existe")) {
      response.status(400).json({ message: error.message });
      return;
    }

    response.status(500).json({ message: "Error interno del servidor." });
  });

  return app;
}
