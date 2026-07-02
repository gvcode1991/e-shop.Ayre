import { useState } from "react";

import { categories, orderMessages } from "../config/storeConfig";
import { createProduct, deleteProduct, updateProduct } from "../services/productsApi";
import { parseListText, parseStockText, stockToText } from "../utils/stock";

const emptyProductForm = {
  id: "",
  name: "",
  category: categories[2],
  tags: "",
  description: "",
  price: "",
  image: "",
  images: "",
  badge: "",
  stock: "S: 0\nM: 0\nL: 0",
  colors: "",
  active: true,
};

export function useAdminProducts({ adminHeaders, adminUnlocked, loadProducts, setAdminStatus, onResetProductMedia }) {
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState("");

  function updateProductForm(field, value) {
    setAdminStatus({ state: "idle", message: "" });
    setProductForm((currentProduct) => ({ ...currentProduct, [field]: value }));
  }

  function appendProductImage(url) {
    setProductForm((currentProduct) => {
      const images = currentProduct.images
        .split(/[\n,]+/)
        .map((image) => image.trim())
        .filter(Boolean);
      const nextImages = [...new Set([currentProduct.image || url, ...images, url].filter(Boolean))];

      return {
        ...currentProduct,
        image: currentProduct.image || url,
        images: nextImages.join("\n"),
      };
    });
  }

  function resetProductForm() {
    setProductForm(emptyProductForm);
    setEditingProductId("");
    onResetProductMedia?.();
    setAdminStatus({ state: "idle", message: "" });
  }

  function editProduct(product) {
    setEditingProductId(product.id);
    setProductForm({
      id: product.id,
      name: product.name,
      category: product.category,
      tags: (product.tags || []).join(", "),
      description: product.description,
      price: String(product.price),
      image: product.imageUrl || product.sourceImage || product.image || "",
      images: (product.images || []).join("\n"),
      badge: product.badge || "",
      stock: stockToText(product.stock),
      colors: (product.colors || []).join(", "),
      active: product.active ?? true,
    });
    document.getElementById("admin")?.scrollIntoView({ behavior: "smooth" });
  }

  async function submitProduct(event) {
    event.preventDefault();
    if (!adminUnlocked) {
      setAdminStatus({ state: "error", message: "Desbloquea el panel admin antes de guardar." });
      return;
    }

    setAdminStatus({ state: "loading", message: editingProductId ? "Actualizando producto..." : "Creando producto..." });

    const payload = {
      ...productForm,
      price: Number(productForm.price || 0),
      stock: parseStockText(productForm.stock),
      colors: parseListText(productForm.colors),
      tags: productForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      imageUrl: productForm.image,
      images: productForm.images.split(/[\n,]+/).map((image) => image.trim()).filter(Boolean),
      active: Boolean(productForm.active),
    };

    try {
      const { response, data } = editingProductId
        ? await updateProduct(editingProductId, payload, { headers: adminHeaders() })
        : await createProduct(payload, { headers: adminHeaders() });

      if (!response.ok) {
        throw new Error(data.message || "No pudimos guardar el producto.");
      }

      await loadProducts();
      setProductForm(emptyProductForm);
      setEditingProductId("");
      setAdminStatus({ state: "success", message: editingProductId ? "Producto actualizado." : "Producto creado." });
    } catch (error) {
      setAdminStatus({ state: "error", message: `${error.message} ${orderMessages.apiErrorSuffix}` });
    }
  }

  async function removeProduct(productId) {
    if (!adminUnlocked) {
      setAdminStatus({ state: "error", message: "Desbloquea el panel admin antes de eliminar." });
      return;
    }

    const shouldDelete = window.confirm("Eliminar este producto del catalogo?");

    if (!shouldDelete) {
      return;
    }

    setAdminStatus({ state: "loading", message: "Eliminando producto..." });

    try {
      const { response, data } = await deleteProduct(productId, { headers: adminHeaders() });

      if (!response.ok) {
        throw new Error(data.message || "No pudimos eliminar el producto.");
      }

      await loadProducts();
      setAdminStatus({ state: "success", message: "Producto eliminado." });
    } catch (error) {
      setAdminStatus({ state: "error", message: `${error.message} ${orderMessages.apiErrorSuffix}` });
    }
  }

  return {
    appendProductImage,
    editingProductId,
    editProduct,
    productForm,
    removeProduct,
    resetProductForm,
    setProductForm,
    submitProduct,
    updateProductForm,
  };
}
