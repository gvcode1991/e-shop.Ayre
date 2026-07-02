import React from "react";
import { Save } from "lucide-react";

import { adminContent, categories } from "../../config/storeConfig";

export function ProductForm({
  adminStatus,
  adminUnlocked,
  editingProductId,
  imageUpload,
  productForm,
  submitProduct,
  updateProductForm,
  updateProductImageFile,
  uploadProductImage,
}) {
  return (
    <form className="admin-form" onSubmit={submitProduct}>
      <h3>{editingProductId ? "Editar producto" : "Agregar producto"}</h3>
      <div className="admin-grid">
        <label>
          Codigo
          <input value={productForm.id} onChange={(event) => updateProductForm("id", event.target.value)} type="text" placeholder="basic-t-shirt" disabled={Boolean(editingProductId)} />
        </label>
        <label>
          Nombre
          <input value={productForm.name} onChange={(event) => updateProductForm("name", event.target.value)} type="text" placeholder="Nombre del producto" required />
        </label>
        <label>
          Categoria
          <select value={productForm.category} onChange={(event) => updateProductForm("category", event.target.value)}>
            {categories.filter((category) => category !== "Todos").map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label>
          Etiqueta
          <input value={productForm.badge} onChange={(event) => updateProductForm("badge", event.target.value)} type="text" placeholder="Nuevo, Stock, Club..." />
        </label>
        <label>
          Precio
          <input value={productForm.price} onChange={(event) => updateProductForm("price", event.target.value)} type="number" min="0" placeholder="34900" required />
        </label>
        <label>
          Colores
          <input value={productForm.colors} onChange={(event) => updateProductForm("colors", event.target.value)} type="text" placeholder="Azul, Blanco, Negro" />
        </label>
        <label className="checkbox-label">
          <input checked={productForm.active} onChange={(event) => updateProductForm("active", event.target.checked)} type="checkbox" />
          Producto activo
        </label>
      </div>

      <label>
        Tags
        <input value={productForm.tags} onChange={(event) => updateProductForm("tags", event.target.value)} type="text" placeholder={adminContent.product.tagsPlaceholder} />
      </label>
      <label>
        Imagen principal
        <input value={productForm.image} onChange={(event) => updateProductForm("image", event.target.value)} type="text" placeholder={adminContent.product.imagePlaceholder} />
      </label>
      <label>
        Galeria de imagenes
        <textarea value={productForm.images} onChange={(event) => updateProductForm("images", event.target.value)} rows="4" placeholder={adminContent.product.galleryPlaceholder} />
      </label>
      <label>
        Stock por talle
        <textarea value={productForm.stock} onChange={(event) => updateProductForm("stock", event.target.value)} rows="4" placeholder={"S: 5\nM: 8\nL: 2"} />
      </label>
      <div className="image-upload-box">
        <div>
          <strong>Subir imagen</strong>
          <span>{adminContent.product.uploadFormats}</span>
        </div>
        <input type="file" accept="image/*" onChange={(event) => updateProductImageFile(event.target.files?.[0] || null)} />
        {(imageUpload.preview || productForm.image) && (
          <img src={imageUpload.preview || productForm.image} alt="Vista previa del producto" />
        )}
        <button className="secondary-admin-button" type="button" onClick={uploadProductImage} disabled={imageUpload.status === "loading" || !imageUpload.file}>
          {imageUpload.status === "loading" ? adminContent.product.uploadLoading : adminContent.product.uploadButton}
        </button>
        {imageUpload.message && <p className={`upload-message ${imageUpload.status}`}>{imageUpload.message}</p>}
      </div>
      <label>
        Descripcion
        <textarea value={productForm.description} onChange={(event) => updateProductForm("description", event.target.value)} rows="3" placeholder={adminContent.product.descriptionPlaceholder} required />
      </label>

      {adminStatus.message && adminUnlocked && <p className={`checkout-message ${adminStatus.state}`}>{adminStatus.message}</p>}

      <button className="checkout-button" type="submit" disabled={adminStatus.state === "loading" || !adminUnlocked}>
        <Save size={18} />
        {editingProductId ? "Guardar cambios" : "Crear producto"}
      </button>
    </form>
  );
}

