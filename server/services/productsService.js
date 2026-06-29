import { products as seedProducts } from "../data/products.js";
import { connectToDatabase } from "../db/mongo.js";
import { Product } from "../models/Product.js";

let memoryProducts = seedProducts.map((product) => ({ ...product }));

export async function listProducts(filters = {}) {
  const products = await getProducts();
  return applyFilters(products, filters);
}

export async function getProductById(id) {
  const database = await connectToDatabase();

  if (!database.connected) {
    return memoryProducts.find((product) => product.id === id) || null;
  }

  await seedProductsIfNeeded();
  return Product.findOne({ id });
}

export async function createProduct(productData) {
  const product = normalizeProduct(productData);
  const database = await connectToDatabase();

  if (!database.connected) {
    if (memoryProducts.some((item) => item.id === product.id)) {
      throw new Error("Ya existe un producto con ese codigo.");
    }

    memoryProducts = [product, ...memoryProducts];
    return product;
  }

  await seedProductsIfNeeded();
  const createdProduct = await Product.create(product);
  return createdProduct.toJSON();
}

export async function updateProduct(id, productData) {
  const product = normalizeProduct({ ...productData, id });
  const database = await connectToDatabase();

  if (!database.connected) {
    const index = memoryProducts.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    memoryProducts[index] = product;
    return product;
  }

  await seedProductsIfNeeded();
  return Product.findOneAndUpdate({ id }, product, { returnDocument: "after", runValidators: true });
}

export async function deleteProduct(id) {
  const database = await connectToDatabase();

  if (!database.connected) {
    const beforeCount = memoryProducts.length;
    memoryProducts = memoryProducts.filter((product) => product.id !== id);
    return beforeCount !== memoryProducts.length;
  }

  await seedProductsIfNeeded();
  const result = await Product.deleteOne({ id });
  return result.deletedCount > 0;
}

async function getProducts() {
  const database = await connectToDatabase();

  if (!database.connected) {
    return memoryProducts;
  }

  await seedProductsIfNeeded();
  return Product.find().sort({ createdAt: -1 });
}

async function seedProductsIfNeeded() {
  const count = await Product.countDocuments();

  if (count === 0) {
    await Product.insertMany(seedProducts);
  }
}

function applyFilters(products, filters) {
  const category = String(filters.category || "").trim().toLowerCase();
  const query = String(filters.q || "").trim().toLowerCase();

  return products.filter((product) => {
    const tags = product.tags || [];
    const matchesCategory = !category || product.category.toLowerCase() === category || tags.some((tag) => tag.toLowerCase() === category);
    const searchableText = [product.name, product.category, product.description, ...tags].join(" ").toLowerCase();
    return matchesCategory && (!query || searchableText.includes(query));
  });
}

function normalizeProduct(productData) {
  const name = String(productData.name || "").trim();
  const id = String(productData.id || slugify(name)).trim();
  const tags = Array.isArray(productData.tags)
    ? productData.tags
    : String(productData.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
  const imageUrl = String(productData.imageUrl || productData.image || "").trim();
  const images = normalizeImages(productData.images, imageUrl);

  if (!id || !name || !productData.category || !productData.description) {
    throw new Error("Codigo, nombre, categoria y descripcion son obligatorios.");
  }

  return {
    id,
    name,
    category: String(productData.category).trim(),
    tags,
    description: String(productData.description).trim(),
    price: Number(productData.price || 0),
    image: imageUrl,
    imageUrl,
    images,
    badge: String(productData.badge || "").trim(),
    stock: Number(productData.stock || 0),
    active: parseActive(productData.active),
  };
}

function parseActive(value) {
  if (value === undefined || value === null || value === "") return true;
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() !== "false";
}

function normalizeImages(imagesData, imageUrl) {
  const images = Array.isArray(imagesData)
    ? imagesData
    : String(imagesData || "")
        .split(/[\n,]+/)
        .map((image) => image.trim())
        .filter(Boolean);

  const uniqueImages = [...new Set([imageUrl, ...images].filter(Boolean))];
  return uniqueImages;
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
