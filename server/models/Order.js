import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
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
    },
    fulfillment: {
      delivery: { type: String, required: true },
      address: { type: String, default: "" },
    },
    payment: { type: String, required: true },
    notes: { type: String, default: "" },
    items: { type: [orderItemSchema], required: true },
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
