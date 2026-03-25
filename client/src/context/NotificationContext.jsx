import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import api from "../utils/api";

const NotificationContext = createContext();

const initialState = {
  items: [],
  unreadCount: 0,
  loading: false
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true };
    case "SET":
      return {
        ...state,
        loading: false,
        items: action.payload.notifications,
        unreadCount: action.payload.unreadCount
      };
    case "MARK_ALL":
      return {
        ...state,
        items: state.items.map((item) => ({ ...item, isRead: true })),
        unreadCount: 0
      };
    case "MARK_ONE": {
      const next = state.items.map((item) =>
        item._id === action.payload ? { ...item, isRead: true } : item
      );
      return {
        ...state,
        items: next,
        unreadCount: next.filter((item) => !item.isRead).length
      };
    }
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const fetchNotifications = async () => {
    dispatch({ type: "LOADING" });
    const { data } = await api.get("/notifications");
    dispatch({ type: "SET", payload: data });
  };

  const markAllRead = async () => {
    await api.patch("/notifications/read-all");
    dispatch({ type: "MARK_ALL" });
  };

  const markOneRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    dispatch({ type: "MARK_ONE", payload: id });
  };

  useEffect(() => {
    fetchNotifications().catch(() => {
      dispatch({ type: "SET", payload: { notifications: [], unreadCount: 0 } });
    });
  }, []);

  const value = useMemo(
    () => ({
      notifications: state.items,
      unreadCount: state.unreadCount,
      loading: state.loading,
      fetchNotifications,
      markAllRead,
      markOneRead
    }),
    [state.items, state.unreadCount, state.loading]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};
