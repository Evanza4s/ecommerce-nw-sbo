"use client";

import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";
import { Bell, CheckCircle2, Package, CreditCard, RefreshCw } from "lucide-react";
import { notificationApi } from "@/server/index";
import { Notification } from "@/server/modules/notifications/types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await notificationApi.getMyNotifications();
      if (res.status === true && res.data) {
        setNotifications(res.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await notificationApi.markAsRead(id);
      if (res.status === true) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
      }
    } catch (error: any) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await notificationApi.markAllAsRead();
      if (res.status === true) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        toast.success("All notifications marked as read");
      }
    } catch (error: any) {
      toast.error("Failed to mark all as read");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-6 w-6 text-blue-500" />;
      case "payment":
        return <CreditCard className="h-6 w-6 text-green-500" />;
      case "refund":
        return <RefreshCw className="h-6 w-6 text-orange-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            You have {unreadCount} unread messages.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No notifications yet</h3>
            <p className="text-sm text-muted-foreground">
              When you get notifications, they will show up here.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex gap-4 p-4 sm:p-6 transition-colors ${
                  !notification.is_read ? "bg-primary/5" : "hover:bg-muted/50"
                }`}
              >
                <div className="mt-1 flex-shrink-0">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${!notification.is_read ? "bg-background shadow-sm" : "bg-muted"}`}>
                    {getIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-sm font-medium ${!notification.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(parseISO(notification.created_at), "MMM d, HH:mm")}
                    </span>
                  </div>
                  <p className={`text-sm ${!notification.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                    {notification.message}
                  </p>
                  
                  {!notification.is_read && (
                    <button
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                      className="text-xs font-medium text-primary hover:underline mt-2 inline-block"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
                {!notification.is_read && (
                  <div className="flex items-center h-full">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
