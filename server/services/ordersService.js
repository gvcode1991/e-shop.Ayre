import { connectToDatabase } from "../db/mongo.js";
import { Order } from "../models/Order.js";
import { createMemoryOrder, listMemoryOrders } from "../utils/ordersStore.js";

export async function listOrders() {
  const database = await connectToDatabase();

  if (!database.connected) {
    return { storage: "memory", orders: listMemoryOrders() };
  }

  const orders = await Order.find().sort({ createdAt: -1 });
  return { storage: "mongodb", orders: orders.map((order) => order.toJSON()) };
}

export async function createOrder(orderData) {
  const database = await connectToDatabase();

  if (!database.connected) {
    return { storage: "memory", order: createMemoryOrder(orderData) };
  }

  const order = await Order.create(orderData);
  return { storage: "mongodb", order: order.toJSON() };
}
