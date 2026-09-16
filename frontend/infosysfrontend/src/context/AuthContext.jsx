import React, {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext =
  createContext(null);

function getStoredUser() {

  try {

    const stored =
      localStorage.getItem(
        "procura_user"
      );

    return stored
      ? JSON.parse(stored)
      : null;

  } catch {

    return null;

  }

}

export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState(getStoredUser);

  const [role, setRole] =
    useState(
      localStorage.getItem(
        "procura_role"
      ) || null
    );

  function login(
    userData,
    userRole
  ) {

    localStorage.setItem(
      "procura_user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "procura_role",
      userRole
    );

    setUser(userData);

    setRole(userRole);

  }

  function logout() {

    localStorage.removeItem(
      "procura_user"
    );

    localStorage.removeItem(
      "procura_role"
    );

    setUser(null);

    setRole(null);

  }

  return (

    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        logout,
        isAuthenticated:
          Boolean(user)
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export function useAuth() {

  return useContext(
    AuthContext
  );

}