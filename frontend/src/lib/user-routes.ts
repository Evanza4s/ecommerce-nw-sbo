export const DEMO_ORDER_ID = "ORD-ABC-123566-34423";

export const userRoutes = {
  home: "/",
  products: "/products",
  productDetail: (slug: string) => `/products/${slug}`,
  cart: "/cart",
  checkout: "/checkout",
  orders: "/orders",
  orderDetail: (orderId: string) => `/orders/${orderId}`,
  orderVerify: (orderId: string) => `/orders/${orderId}/verify`,
  orderRefund: (orderId: string) => `/orders/${orderId}/refund`,
  login: "/login",
  register: "/register",
  verify: "/verify",
} as const;
