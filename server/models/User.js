import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    acceptsMarketing: { type: Boolean, default: true },
    favorites: { type: [String], default: [] },
    purchases: { type: [mongoose.Schema.Types.ObjectId], ref: "Order", default: [] },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
