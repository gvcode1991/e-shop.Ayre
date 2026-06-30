import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    images: { type: [String], default: [] },
    badge: { type: String, default: "" },
    stock: { type: mongoose.Schema.Types.Mixed, default: [] },
    colors: { type: [String], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
