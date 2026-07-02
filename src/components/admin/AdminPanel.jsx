import React from "react";
import { AdminProductsList } from "./AdminProductsList";
import { ProductForm } from "./ProductForm";
import { adminContent } from "../../config/storeConfig";

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
          <p className="eyebrow">{adminContent.panelEyebrow}</p>
          <h2>{adminContent.panelTitle}</h2>
          <p className="catalog-note">{adminContent.panelNote}</p>
        </div>
        <button className="secondary-admin-button" type="button" onClick={resetProductForm}>{adminContent.newProductButton}</button>
      </div>

      <form className="admin-form admin-unlock" onSubmit={unlockAdmin}>
        <h3>{adminContent.accessTitle}</h3>
        <label>
          {adminContent.emailLabel}
          <input value={adminLogin.email} onChange={(event) => updateAdminLogin("email", event.target.value)} type="email" placeholder={adminContent.emailPlaceholder} />
        </label>
        <label>
          {adminContent.passwordLabel}
          <input value={adminLogin.password} onChange={(event) => updateAdminLogin("password", event.target.value)} type="password" placeholder={adminContent.passwordPlaceholder} />
        </label>
        {adminStatus.message && <p className={`checkout-message ${adminStatus.state}`}>{adminStatus.message}</p>}
        <button className="secondary-admin-button" type="submit">{adminContent.unlockButton}</button>
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
