"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  RefreshCcw,
  Users,
  TicketPercent,
  CreditCard,
  Truck,
  Shield,
  UserCog,
  Settings,
  HelpCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Logo from "@/assets/images/icon_e-commerce.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Refunds",
    url: "/admin/refunds",
    icon: RefreshCcw,
  },
  {
    title: "Customers",
    url: "/admin/customers",
    icon: Users,
  },
  {
    title: "Promotions",
    url: "/admin/promotions",
    icon: TicketPercent,
  },
  {
    title: "Payments",
    url: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Shipping",
    url: "/admin/shipping",
    icon: Truck,
  },
];

const systemItems = [
  {
    title: "Users",
    url: "/admin/users",
    icon: UserCog,
  },
  {
    title: "Roles",
    url: "/admin/roles",
    icon: Shield,
  },
  {
    title: "FAQ",
    url: "/admin/faq",
    icon: HelpCircle,
  },
];

import { useAuth } from "@/hooks/useAuth";

const AdminSidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const isMenuActive = (url: string) =>
    pathname === url || pathname.startsWith(`${url}/`);

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <Image
                  src={Logo}
                  alt="logo"
                  height={32}
                  width={32}
                  className="rounded-lg"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">NWV Admin</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Ecommerce Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive = isMenuActive(item.url);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={
                      isActive
                        ? "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarMenu>
            {systemItems.map((item) => {
              const isActive = isMenuActive(item.url);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="border">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.username || 'Admin User'}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email || 'admin@nwv.com'}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
