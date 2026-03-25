import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import api from "../utils/api";

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem("token") || "",
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
    case "LOGIN":
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
    case "UPDATE_USER":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null, token: "", loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("token");
      const cachedUser = localStorage.getItem("user");
      if (!token) {
        dispatch({ type: "INIT", payload: { user: null, token: "" } });
        return;
      }

      if (cachedUser) {
        dispatch({ type: "INIT", payload: { user: JSON.parse(cachedUser), token } });
      }

      try {
        const { data } = await api.get("/auth/me");
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch({ type: "INIT", payload: { user: data.user, token } });
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "INIT", payload: { user: null, token: "" } });
      }
    };

    bootstrap();
  }, []);

  const login = ({ user, token }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "UPDATE_USER", payload: user });
  };

  const value = useMemo(
    () => ({
      user: state.user,
      token: state.token,
      loading: state.loading,
      isAuthenticated: Boolean(state.token && state.user),
      login,
      logout,
      updateUser
    }),
    [state.user, state.token, state.loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
