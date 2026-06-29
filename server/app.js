import cors from "cors";
import express from "express";

import { products } from "./data/products.js";
import { createOrder, listOrders } from "./services/ordersService.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://127.0.0.1:5173" }));
  app.use(express.json());

  app.get("/api/health", (_request, response) => {
    response.json({ ok: true, service: "ayre-api" });
  });

  app.get("/api/products", (request, response) => {
    const category = String(request.query.category || "").trim().toLowerCase();
    const query = String(request.query.q || "").trim().toLowerCase();

    const filteredProducts = products.filter((product) => {
      const matchesCategory = !category || product.category.toLowerCase() === category || product.tags.some((tag) => tag.toLowerCase() === category);
      const searchableText = [product.name, product.category, product.description, ...product.tags].join(" ").toLowerCase();
      return matchesCategory && (!query || searchableText.includes(query));
    });

    response.json({ products: filteredProducts });
  });

  app.get("/api/products/:id", (request, response) => {
    const product = products.find((item) => item.id === request.params.id);

    if (!product) {
      response.status(404).json({ message: "Producto no encontrado." });
      return;
    }

    response.json({ product });
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

      const orderItems = items.map((item) => {
        const product = products.find((candidate) => candidate.id === item.id);
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
      });

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
    response.status(500).json({ message: "Error interno del servidor." });
  });

  return app;
}
