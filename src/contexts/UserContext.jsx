import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { storageKeys } from "../config/storeConfig";

const emptyUserForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  acceptsMarketing: true,
};

const emptyAccountLookup = {
  email: "",
  password: "",
};

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [accountLookup, setAccountLookup] = useState(emptyAccountLookup);
  const [userAccount, setUserAccount] = useState(null);
  const [userToken, setUserToken] = useState(() => localStorage.getItem(storageKeys.userToken) || "");
  const [userStatus, setUserStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    if (userToken) localStorage.setItem(storageKeys.userToken, userToken);
    else localStorage.removeItem(storageKeys.userToken);
  }, [userToken]);

  function updateUserForm(field, value) {
    setUserStatus({ state: "idle", message: "" });
    setUserForm((currentUser) => ({ ...currentUser, [field]: value }));
  }

  function updateAccountLookup(field, value) {
    setUserStatus({ state: "idle", message: "" });
    setAccountLookup((currentLookup) => ({ ...currentLookup, [field]: value }));
  }

  function logoutUser() {
    setUserAccount(null);
    setUserToken("");
    setAccountLookup(emptyAccountLookup);
    setUserStatus({ state: "idle", message: "" });
  }

  const value = useMemo(() => ({
    accountLookup,
    emptyAccountLookup,
    emptyUserForm,
    logoutUser,
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
  }), [accountLookup, userAccount, userForm, userStatus, userToken]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext debe usarse dentro de UserProvider");
  }
  return context;
}
