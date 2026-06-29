const orders = [];

export function listMemoryOrders() {
  return orders;
}

export function createMemoryOrder(orderData) {
  const order = {
    id: `order-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    ...orderData,
  };

  orders.push(order);
  return order;
}
