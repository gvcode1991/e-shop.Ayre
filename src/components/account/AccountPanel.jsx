import React from "react";
import { OrderList } from "../orders/OrderList";

export function AccountPanel({
  accountLookup,
  isRegisterRoute,
  loadAccount,
  saveAccountPreferences,
  submitUser,
  updateAccountLookup,
  updateUserForm,
  userAccount,
  userForm,
  userStatus,
}) {
  if (isRegisterRoute) {
    return (
      <section className="account-section" id="cuenta">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Cuenta</p>
            <h2>Crear cuenta</h2>
            <p className="catalog-note">Registrate para recibir el email de activacion. Necesitas activar la cuenta antes de comprar.</p>
          </div>
        </div>
        <div className="account-layout">
          <form className="admin-form" onSubmit={submitUser}>
            <div className="admin-grid">
              <label>Nombre<input value={userForm.name} onChange={(event) => updateUserForm("name", event.target.value)} type="text" required /></label>
              <label>Email<input value={userForm.email} onChange={(event) => updateUserForm("email", event.target.value)} type="email" required /></label>
              <label>Telefono<input value={userForm.phone} onChange={(event) => updateUserForm("phone", event.target.value)} type="tel" /></label>
              <label>Contrasena<input value={userForm.password} onChange={(event) => updateUserForm("password", event.target.value)} type="password" minLength="8" required /></label>
              <label className="checkbox-label"><input checked={userForm.acceptsMarketing} onChange={(event) => updateUserForm("acceptsMarketing", event.target.checked)} type="checkbox" /> Recibir novedades por email</label>
            </div>
            {userStatus.message && <p className={`checkout-message ${userStatus.state}`}>{userStatus.message}</p>}
            <button className="checkout-button" type="submit">Crear cuenta y enviar confirmacion</button>
          </form>
          <div className="account-summary">
            <h3>{userAccount ? userAccount.name : "Activacion por email"}</h3>
            <p>{userAccount ? userAccount.email : "Despues de registrarte, abri el email de AyRe y confirma tu cuenta para habilitar compras."}</p>
            <strong>{userAccount?.emailVerified ? "Cuenta activa" : "Pendiente de activacion"}</strong>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="account-section" id="cuenta-admin">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Mi cuenta</p>
          <h2>Administracion de cuenta</h2>
          <p className="catalog-note">Inicia sesion para consultar tus preferencias, favoritos y compras.</p>
        </div>
      </div>
      <div className="account-layout">
        <form className="admin-form" onSubmit={loadAccount}>
          <h3>Iniciar sesion</h3>
          <label>Email registrado<input value={accountLookup.email} onChange={(event) => updateAccountLookup("email", event.target.value)} type="email" required /></label>
          <label>Contrasena<input value={accountLookup.password} onChange={(event) => updateAccountLookup("password", event.target.value)} type="password" required /></label>
          <button className="checkout-button" type="submit">Entrar</button>
          {userStatus.message && <p className={`checkout-message ${userStatus.state}`}>{userStatus.message}</p>}
        </form>
        <div className="account-summary">
          <h3>{userAccount ? userAccount.email : "Cuenta"}</h3>
          <p>{userAccount ? `Estado: ${userAccount.emailVerified ? "activa" : "pendiente de confirmacion"}` : "Ingresa con tu email y contrasena para ver tus compras y preferencias."}</p>
          {userAccount && (
            <>
              <label className="checkbox-label account-check"><input checked={Boolean(userAccount.acceptsMarketing)} onChange={(event) => saveAccountPreferences(event.target.checked)} type="checkbox" /> Recibir notificaciones al mail</label>
              <strong>Favoritos: {(userAccount.favorites || []).length}</strong>
              <strong>Compras realizadas: {(userAccount.purchases || []).length}</strong>
              <OrderList purchases={userAccount.purchases} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
