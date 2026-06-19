import { getApi, putApi } from "../../core/client";
import { Notification, NotificationUnreadCount } from "./types";
import type { AuthResponse } from "../auth/types";

export const notificationApi = {
  getMyNotifications: async () => {
    return getApi<AuthResponse<Notification[]>>("/notifications");
  },

  getUnreadCount: async () => {
    return getApi<AuthResponse<NotificationUnreadCount>>("/notifications/unread-count");
  },

  markAsRead: async (id: string) => {
    return putApi<AuthResponse<null>>(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    return putApi<AuthResponse<null>>("/notifications/read-all");
  },
};
