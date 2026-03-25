import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "../context/NotificationContext";

const NotificationDropdown = () => {
  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button type="button" className="relative btn-muted" onClick={() => setOpen((p) => !p)}>
        Bell
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-2 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[90vw] max-w-sm sm:w-80 card p-3 z-50">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="font-semibold">Notifications</h4>
            <button type="button" className="text-cyan text-sm" onClick={markAllRead}>
              Mark all read
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto mt-2 space-y-2">
            {notifications.length === 0 && <p className="text-sm text-slate-400">No notifications yet.</p>}
            {notifications.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => !item.isRead && markOneRead(item._id)}
                className={`w-full text-left rounded-lg p-2 ${item.isRead ? "bg-slate-900" : "bg-slate-800"}`}
              >
                <p className="text-sm">{item.message}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
