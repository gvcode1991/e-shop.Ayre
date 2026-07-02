import React from "react";
import { AdminProductsList } from "./AdminProductsList";
import { ProductForm } from "./ProductForm";

export function AdminPanel({
  adminLogin,
  adminStatus,
  adminUnlocked,
  editingProductId,
  editProduct,
  imageUpload,
  productForm,
  products,
  removeProduct,
  resetProductForm,
  submitProduct,
  unlockAdmin,
  updateAdminLogin,
  updateProductForm,
  updateProductImageFile,
  uploadProductImage,
}) {
  return (
    <section className="admin-section" id="admin">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Gestion</p>
          <h2>Panel admin</h2>
          <p className="catalog-note">Alta, baja y modificacion de productos del catalogo.</p>
        </div>
        <button className="secondary-admin-button" type="button" onClick={resetProductForm}>Nuevo producto</button>
      </div>

      <form className="admin-form admin-unlock" onSubmit={unlockAdmin}>
        <h3>Acceso admin</h3>
        <label>
          Email admin
          <input value={adminLogin.email} onChange={(event) => updateAdminLogin("email", event.target.value)} type="email" placeholder="admin@ayre.com.ar" />
        </label>
        <label>
          Contrasena admin
          <input value={adminLogin.password} onChange={(event) => updateAdminLogin("password", event.target.value)} type="password" placeholder="Contrasena privada" />
        </label>
        {adminStatus.message && <p className={`checkout-message ${adminStatus.state}`}>{adminStatus.message}</p>}
        <button className="secondary-admin-button" type="submit">Desbloquear panel</button>
      </form>

      <div className="admin-layout">
        <ProductForm
          adminStatus={adminStatus}
          adminUnlocked={adminUnlocked}
          editingProductId={editingProductId}
          imageUpload={imageUpload}
          productForm={productForm}
          submitProduct={submitProduct}
          updateProductForm={updateProductForm}
          updateProductImageFile={updateProductImageFile}
          uploadProductImage={uploadProductImage}
        />

        <AdminProductsList
          editProduct={editProduct}
          products={products}
          removeProduct={removeProduct}
        />
      </div>
    </section>
  );
}
