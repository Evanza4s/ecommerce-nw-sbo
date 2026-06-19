"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LogIn, LogOut, Package, User, Bell, Shield, ExternalLink, RefreshCcw } from "lucide-react";

import Logo from "@/assets/images/logo_e-commerce.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CartIcon } from "@/assets/icons/CartIcon";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/components/cart/CartContext";
import { toast } from "react-toastify";
import { getAvatarUrl } from "@/lib/utils";
import DefaultAvatarImage from "@/assets/images/avatar.png";
import { userApi } from "@/server/modules/users/api";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const [identityAvatar, setIdentityAvatar] = useState<string | null>(null);

  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      userApi.identity.get(user.id).then((res) => {
        if (res.data?.avatar_url) {
          setIdentityAvatar(res.data.avatar_url);
        }
      }).catch(err => console.error("Failed to fetch navbar avatar", err));

      import("@/server/index").then(({ notificationApi }) => {
        notificationApi.getUnreadCount().then((res) => {
          if (res.status === true && res.data) {
            setUnreadNotifCount(res.data.unread_count);
          }
        }).catch(err => console.error("Failed to fetch unread notifications count", err));
      });
    }
  }, [isAuthenticated, user?.id]);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 drop-shadow-md backdrop-blur-md">
      <nav className="container mx-auto flex h-20 items-center justify-between px-4">
        <div>
          <Link href={"/"}>
            <Image src={Logo} alt="Logo" height={40} />
          </Link>
        </div>

        <div className="hidden md:block">
          <ul className="flex justify-between gap-6">
            <li className="text-xl font-black text-slate-800 hover:text-primary transition-colors">
              <Link href={"/"}>Home</Link>
            </li>
            <li className="text-xl font-black text-slate-800 hover:text-primary transition-colors">
              <Link href={"/products"}>Products</Link>
            </li>
            {isAuthenticated && (
              <li className="text-xl font-black text-slate-800 hover:text-primary transition-colors">
                <Link href={"/orders"}>Orders</Link>
              </li>
            )}
          </ul>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative">
            <Link href={"/cart"} aria-label="Cart">
              <CartIcon className="h-10 w-10 stroke-dark" />
              {isAuthenticated && cart && cart.total_items > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {cart.total_items > 99 ? '99+' : cart.total_items}
                </span>
              )}
            </Link>
          </div>

          <div className="relative">
            <Link href={"/account/notifications"} aria-label="Notifications">
              <Bell className="h-8 w-8 text-slate-700 hover:text-primary transition-colors mt-1" />
              {isAuthenticated && unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {unreadNotifCount > 99 ? '99+' : unreadNotifCount}
                </span>
              )}
            </Link>
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  <Avatar>
                    <AvatarImage src={getAvatarUrl(identityAvatar || user?.avatar)} />
                    <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold uppercase">
                      {isAuthenticated && user
                        ? (`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` || user.username?.[0] || "U").toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.firstName && user?.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user?.username || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || ''}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/account/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4 text-slate-500" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account/orders" className="cursor-pointer">
                          <Package className="mr-2 h-4 w-4 text-slate-500" />
                          <span>My Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account/refunds" className="cursor-pointer">
                          <RefreshCcw className="mr-2 h-4 w-4 text-slate-500" />
                          <span>My Refunds</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account/notifications" className="cursor-pointer">
                          <Bell className="mr-2 h-4 w-4 text-slate-500" />
                          <span>Notifications</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                      onClick={async () => {
                        try {
                          await logout();
                          toast.success('Successfully logged out.');
                          window.location.href = '/';
                        } catch (err: any) {
                          toast.error('Failed to log out.');
                        }
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="cursor-pointer">
                        <LogIn className="mr-2 h-4 w-4 text-slate-500" />
                        <span>Log In</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4 text-slate-500" />
                        <span>Register</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;