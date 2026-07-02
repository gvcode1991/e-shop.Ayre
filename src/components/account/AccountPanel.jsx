import React from "react";
import { OrderList } from "../orders/OrderList";

import { accountContent } from "../../config/storeConfig";

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
            <p className="eyebrow">{accountContent.register.eyebrow}</p>
            <h2>{accountContent.register.title}</h2>
            <p className="catalog-note">{accountContent.register.note}</p>
          </div>
        </div>
        <div className="account-layout">
          <form className="admin-form" onSubmit={submitUser}>
            <div className="admin-grid">
              <label>Nombre<input value={userForm.name} onChange={(event) => updateUserForm("name", event.target.value)} type="text" required /></label>
              <label>Email<input value={userForm.email} onChange={(event) => updateUserForm("email", event.target.value)} type="email" required /></label>
              <label>Telefono<input value={userForm.phone} onChange={(event) => updateUserForm("phone", event.target.value)} type="tel" /></label>
              <label>Contrasena<input value={userForm.password} onChange={(event) => updateUserForm("password", event.target.value)} type="password" minLength="8" required /></label>
              <label className="checkbox-label"><input checked={userForm.acceptsMarketing} onChange={(event) => updateUserForm("acceptsMarketing", event.target.checked)} type="checkbox" /> {accountContent.register.marketingLabel}</label>
            </div>
            {userStatus.message && <p className={`checkout-message ${userStatus.state}`}>{userStatus.message}</p>}
            <button className="checkout-button" type="submit">{accountContent.register.submitLabel}</button>
          </form>
          <div className="account-summary">
            <h3>{userAccount ? userAccount.name : accountContent.register.pendingTitle}</h3>
            <p>{userAccount ? userAccount.email : accountContent.register.pendingText}</p>
            <strong>{userAccount?.emailVerified ? accountContent.register.activeStatus : accountContent.register.pendingStatus}</strong>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="account-section" id="cuenta-admin">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{accountContent.account.eyebrow}</p>
          <h2>{accountContent.account.title}</h2>
          <p className="catalog-note">{accountContent.account.note}</p>
        </div>
      </div>
      <div className="account-layout">
        <form className="admin-form" onSubmit={loadAccount}>
          <h3>{accountContent.account.loginTitle}</h3>
          <label>{accountContent.account.emailLabel}<input value={accountLookup.email} onChange={(event) => updateAccountLookup("email", event.target.value)} type="email" required /></label>
          <label>{accountContent.account.passwordLabel}<input value={accountLookup.password} onChange={(event) => updateAccountLookup("password", event.target.value)} type="password" required /></label>
          <button className="checkout-button" type="submit">{accountContent.account.loginButton}</button>
          {userStatus.message && <p className={`checkout-message ${userStatus.state}`}>{userStatus.message}</p>}
        </form>
        <div className="account-summary">
          <h3>{userAccount ? userAccount.email : accountContent.account.emptyTitle}</h3>
          <p>{userAccount ? `Estado: ${userAccount.emailVerified ? accountContent.account.activeState : accountContent.account.pendingState}` : accountContent.account.emptyText}</p>
          {userAccount && (
            <>
              <label className="checkbox-label account-check"><input checked={Boolean(userAccount.acceptsMarketing)} onChange={(event) => saveAccountPreferences(event.target.checked)} type="checkbox" /> {accountContent.account.notificationsLabel}</label>
              <strong>{accountContent.account.favoritesLabel}: {(userAccount.favorites || []).length}</strong>
              <strong>{accountContent.account.purchasesLabel}: {(userAccount.purchases || []).length}</strong>
              <OrderList purchases={userAccount.purchases} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
