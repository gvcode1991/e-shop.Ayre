import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, required: true },
    color: { type: String, default: "" },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    status: { type: String, default: "pending", enum: ["pending", "confirmed", "delivered", "cancelled"] },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: "" },
      notifyByEmail: { type: Boolean, default: true },
    },
    fulfillment: {
      delivery: { type: String, required: true },
      address: { type: String, default: "" },
      shippingCost: { type: Number, default: 0, min: 0 },
    },
    payment: { type: String, required: true },
    notes: { type: String, default: "" },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

orderSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
