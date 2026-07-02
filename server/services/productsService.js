import { products as seedProducts } from "../data/products.js";
import { connectToDatabase } from "../db/mongo.js";
import { Product } from "../models/Product.js";

const defaultStockSize = "Unico";
const legacyImageUrls = {};
let memoryProducts = seedProducts.map((product) => normalizeProduct(product));

export async function listProducts(filters = {}) {
  const products = await getProducts();
  return applyFilters(products, filters);
}

export async function getProductById(id) {
  const database = await connectToDatabase();

  if (!database.connected) {
    const product = memoryProducts.find((product) => product.id === id);
    return product ? normalizeStoredProduct(product) : null;
  }

  await seedProductsIfNeeded();
  const product = await Product.findOne({ id });
  return product ? normalizeStoredProduct(product) : null;
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
  const updatedProduct = await Product.findOneAndUpdate({ id }, product, { returnDocument: "after", runValidators: true });
  return updatedProduct ? normalizeStoredProduct(updatedProduct) : null;
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

export async function decrementProductStock(items) {
  const database = await connectToDatabase();

  if (!database.connected) {
    items.forEach((item) => {
      const product = memoryProducts.find((productItem) => productItem.id === item.id);
      if (!product) return;
      product.stock = decrementStock(product.stock, item.size, item.quantity);
    });
    return;
  }

  await seedProductsIfNeeded();
  await Promise.all(items.map(async (item) => {
    const product = await Product.findOne({ id: item.id });
    if (!product) return;
    product.stock = decrementStock(product.stock, item.size, item.quantity);
    await product.save();
  }));
}

async function getProducts() {
  const database = await connectToDatabase();

  if (!database.connected) {
    return memoryProducts.map((product) => normalizeStoredProduct(product));
  }

  await seedProductsIfNeeded();
  const products = await Product.find().sort({ createdAt: -1 });
  return products.map((product) => normalizeStoredProduct(product));
}

async function seedProductsIfNeeded() {
  const count = await Product.countDocuments();

  if (count === 0) {
    await Product.insertMany(seedProducts.map((product) => normalizeProduct(product)));
  }
}

function applyFilters(products, filters) {
  const category = String(filters.category || "").trim().toLowerCase();
  const query = String(filters.q || "").trim().toLowerCase();
  const size = String(filters.size || "").trim().toLowerCase();
  const color = String(filters.color || "").trim().toLowerCase();

  return products.filter((product) => {
    const tags = product.tags || [];
    const colors = product.colors || [];
    const stock = normalizeStock(product.stock);
    const matchesCategory = !category || product.category.toLowerCase() === category || tags.some((tag) => tag.toLowerCase() === category);
    const matchesSize = !size || stock.some((item) => item.size.toLowerCase() === size && item.quantity > 0);
    const matchesColor = !color || colors.some((item) => item.toLowerCase() === color);
    const searchableText = [product.name, product.category, product.description, ...tags, ...colors, ...stock.map((item) => item.size)].join(" ").toLowerCase();
    return matchesCategory && matchesSize && matchesColor && (!query || searchableText.includes(query));
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
  const imageUrl = resolveImageUrl(productData.imageUrl || productData.image);
  const images = normalizeImages(productData.images, imageUrl);
  const stock = normalizeStock(productData.stock);
  const colors = normalizeList(productData.colors);

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
    stock,
    colors,
    active: parseActive(productData.active),
  };
}

export function getAvailableStock(stock) {
  return normalizeStock(stock).filter((item) => item.quantity > 0);
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

  const uniqueImages = [...new Set([imageUrl, ...images.map((image) => resolveImageUrl(image))].filter(Boolean))];
  return uniqueImages;
}

function normalizeStoredProduct(productData) {
  const product = typeof productData.toJSON === "function" ? productData.toJSON() : { ...productData };
  const imageUrl = resolveImageUrl(product.imageUrl || product.image);
  return {
    ...product,
    image: imageUrl,
    imageUrl,
    images: normalizeImages(product.images, imageUrl),
  };
}

function resolveImageUrl(imageUrl) {
  const normalizedUrl = String(imageUrl || "").trim();
  return legacyImageUrls[normalizedUrl] || normalizedUrl;
}

function normalizeList(value) {
  const values = Array.isArray(value)
    ? value
    : String(value || "")
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean);

  return [...new Set(values.map((item) => String(item).trim()).filter(Boolean))];
}

function normalizeStock(stockData) {
  if (Array.isArray(stockData)) {
    const stock = stockData
      .map((item) => {
        if (typeof item === "string") {
          const [size, quantity] = item.split(/[:=]/).map((part) => part.trim());
          return { size, quantity: Number(quantity || 0) };
        }

        return {
          size: String(item?.size || "").trim(),
          quantity: Number(item?.quantity || 0),
        };
      })
      .filter((item) => item.size);

    return mergeStock(stock);
  }

  if (typeof stockData === "number") {
    return stockData > 0 ? [{ size: defaultStockSize, quantity: stockData }] : [];
  }

  const stockText = String(stockData || "").trim();

  if (!stockText) {
    return [];
  }

  if (/^\d+$/.test(stockText)) {
    return Number(stockText) > 0 ? [{ size: defaultStockSize, quantity: Number(stockText) }] : [];
  }

  const stock = stockText
    .split(/[\n,]+/)
    .map((line) => {
      const [size, quantity] = line.split(/[:=]/).map((part) => part.trim());
      return { size, quantity: Number(quantity || 0) };
    })
    .filter((item) => item.size);

  return mergeStock(stock);
}

function mergeStock(stock) {
  const stockMap = new Map();

  stock.forEach((item) => {
    const size = String(item.size || "").trim();
    const quantity = Math.max(0, Number(item.quantity || 0));

    if (!size) {
      return;
    }

    stockMap.set(size, (stockMap.get(size) || 0) + quantity);
  });

  return [...stockMap.entries()].map(([size, quantity]) => ({ size, quantity }));
}

function decrementStock(stockData, size, quantity) {
  const normalizedSize = String(size || "").trim().toLowerCase();
  const quantityToRemove = Math.max(0, Number(quantity || 0));

  return normalizeStock(stockData).map((item) => {
    if (item.size.toLowerCase() !== normalizedSize) {
      return item;
    }

    return { ...item, quantity: Math.max(0, item.quantity - quantityToRemove) };
  });
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

