import { orderMessages } from "../config/storeConfig";
import { useUserContext } from "../contexts/UserContext";
import { loginUser, registerUser, updateFavorite, updatePreferences } from "../services/usersApi";

export function useUserAccount({ navigateTo }) {
  const {
    accountLookup,
    setAccountLookup,
    setUserAccount,
    setUserForm,
    setUserStatus,
    setUserToken,
    updateAccountLookup,
    updateUserForm,
    userAccount,
    userForm,
    userStatus,
    userToken,
  } = useUserContext();

  function authHeaders(extraHeaders = {}) {
    return userToken ? { ...extraHeaders, Authorization: `Bearer ${userToken}` } : extraHeaders;
  }

  async function submitUser(event) {
    event.preventDefault();
    setUserStatus({ state: "loading", message: "Guardando cuenta..." });

    try {
      const { response, data } = await registerUser(userForm);

      if (!response.ok) {
        throw new Error(data.message || "No pudimos registrar el usuario.");
      }

      setUserAccount(data.user);
      setUserToken(data.token || "");
      setAccountLookup({ email: data.user.email, password: "" });
      const emailSent = Boolean(data.email?.sent);
      setUserStatus({
        state: emailSent ? "success" : "error",
        message: emailSent
          ? "Te enviamos un email para activar tu cuenta antes de comprar."
          : data.email?.message || "Cuenta creada, pero no pudimos enviar el email de activacion. Revisa Resend en Render.",
      });
    } catch (error) {
      setUserStatus({ state: "error", message: `${error.message} ${orderMessages.apiErrorSuffix}` });
    }
  }

  async function loadAccount(event, syncCheckoutEmail) {
    event.preventDefault();
    setUserStatus({ state: "loading", message: "Iniciando sesion..." });

    try {
      const { response, data } = await loginUser(accountLookup);

      if (!response.ok) {
        throw new Error(data.message || "No pudimos iniciar sesion.");
      }

      setUserAccount(data.user);
      setUserToken(data.token || "");
      setUserForm({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        password: "",
        acceptsMarketing: Boolean(data.user.acceptsMarketing),
      });
      syncCheckoutEmail?.(data.user.email);
      setUserStatus({ state: "success", message: data.user.emailVerified ? "Sesion iniciada. Cuenta activa." : "Sesion iniciada. Cuenta pendiente de confirmacion por email." });
    } catch (error) {
      setUserStatus({ state: "error", message: error.message });
    }
  }

  async function saveAccountPreferences(acceptsMarketing) {
    if (!userAccount?.email) return;

    setUserStatus({ state: "loading", message: "Guardando preferencias..." });

    try {
      const { response, data } = await updatePreferences(userAccount.email, { acceptsMarketing }, { headers: authHeaders() });

      if (!response.ok) {
        throw new Error(data.message || "No pudimos guardar las preferencias.");
      }

      setUserAccount(data.user);
      setUserStatus({ state: "success", message: "Preferencias guardadas." });
    } catch (error) {
      setUserStatus({ state: "error", message: error.message });
    }
  }

  async function toggleFavorite(productId) {
    if (!userAccount?.email) {
      setUserStatus({ state: "error", message: "Registrate con tu email para guardar favoritos." });
      navigateTo("/");
      setTimeout(() => document.getElementById("cuenta")?.scrollIntoView({ behavior: "smooth" }), 100);
      return;
    }

    const isFavorite = !(userAccount.favorites || []).includes(productId);

    try {
      const { response, data } = await updateFavorite(userAccount.email, productId, { isFavorite }, { headers: authHeaders() });

      if (!response.ok) {
        throw new Error(data.message || "No pudimos actualizar favoritos.");
      }

      setUserAccount(data.user);
      setUserStatus({ state: "success", message: isFavorite ? "Producto agregado a favoritos." : "Producto quitado de favoritos." });
    } catch (error) {
      setUserStatus({ state: "error", message: error.message });
    }
  }

  return {
    accountLookup,
    authHeaders,
    loadAccount,
    saveAccountPreferences,
    setUserAccount,
    submitUser,
    toggleFavorite,
    updateAccountLookup,
    updateUserForm,
    userAccount,
    userForm,
    userStatus,
    userToken,
  };
}
