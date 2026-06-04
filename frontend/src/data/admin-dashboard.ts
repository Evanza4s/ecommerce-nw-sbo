export type AdminPaymentStatus = "pending" | "paid" | "failed";
export type AdminOrderStatus =
  | "processing"
  | "shipped"
  | "delivered"
  | "canceled"
  | "refunded"
  | "returned";
export type AdminRefundStatus =
  | "pending_confirmation"
  | "processing"
  | "completed"
  | "rejected";
export type AdminActivationStatus = "active" | "inactive" | "suspended";
export type AdminVerificationStatus = "verified" | "unverified";
export type AdminPromotionStatus = "scheduled" | "active" | "expired" | "draft";
export type AdminShippingStatus =
  | "ready_to_ship"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "exception";

export interface AdminOrderRecord {
  id: string;
  customerName: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: AdminPaymentStatus;
  orderStatus: AdminOrderStatus;
}

export interface AdminRefundRecord {
  id: string;
  orderId: string;
  customerName: string;
  totalRefund: number;
  status: AdminRefundStatus;
  requestedAt: string;
}

export interface AdminCustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: "Male" | "Female" | "Prefer not to say";
  registeredAt: string;
  status: AdminActivationStatus;
  totalOrders: number;
}

export interface AdminPromotionRecord {
  id: string;
  code: string;
  discountType: "Percentage" | "Nominal";
  quota: number;
  validFrom: string;
  validUntil: string;
  status: AdminPromotionStatus;
}

export interface AdminPaymentRecord {
  id: string;
  paymentReference: string;
  orderId: string;
  paymentMethod: string;
  paymentProvider: string;
  paymentStatus: AdminPaymentStatus;
  paidAt: string;
}

export interface AdminShippingRecord {
  id: string;
  trackingNumber: string;
  orderId: string;
  courierName: string;
  currentLocation: string;
  shippingStatus: AdminShippingStatus;
  estimatedArrival: string;
}

export interface AdminSystemUserRecord {
  id: string;
  name: string;
  username: string;
  roleName: string;
  verified: AdminVerificationStatus;
  status: AdminActivationStatus;
}

export interface AdminRoleRecord {
  id: string;
  roleName: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  createdAt: string;
}

export interface AdminCategoryRecord {
  id: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
}

export interface AdminProductRecord {
  id: string;
  image: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: "active" | "draft" | "archived";
}

export const adminOrders: AdminOrderRecord[] = [
  {
    id: "ORD-20260603-0012A9X1",
    customerName: "Alya Putri",
    createdAt: "2026-06-03T09:24:00+07:00",
    totalAmount: 1899000,
    paymentStatus: "paid",
    orderStatus: "processing",
  },
  {
    id: "ORD-20260602-0091BQW8",
    customerName: "Rizky Maulana",
    createdAt: "2026-06-02T16:15:00+07:00",
    totalAmount: 745000,
    paymentStatus: "pending",
    orderStatus: "shipped",
  },
  {
    id: "ORD-20260601-0077NMK2",
    customerName: "Citra Dewi",
    createdAt: "2026-06-01T11:02:00+07:00",
    totalAmount: 2350000,
    paymentStatus: "failed",
    orderStatus: "canceled",
  },
  {
    id: "ORD-20260531-0038PKT5",
    customerName: "Bagas Pratama",
    createdAt: "2026-05-31T13:42:00+07:00",
    totalAmount: 1245000,
    paymentStatus: "paid",
    orderStatus: "delivered",
  },
];

export const adminRefunds: AdminRefundRecord[] = [
  {
    id: "RF-001",
    orderId: "ORD-20260528-0044UYP9",
    customerName: "Salsa Rahma",
    totalRefund: 560000,
    status: "pending_confirmation",
    requestedAt: "2026-05-29T10:30:00+07:00",
  },
  {
    id: "RF-002",
    orderId: "ORD-20260527-0018JMN1",
    customerName: "Dafa Irawan",
    totalRefund: 899000,
    status: "processing",
    requestedAt: "2026-05-28T14:10:00+07:00",
  },
  {
    id: "RF-003",
    orderId: "ORD-20260526-0011LKS4",
    customerName: "Nadia Maharani",
    totalRefund: 375000,
    status: "completed",
    requestedAt: "2026-05-27T09:05:00+07:00",
  },
];

export const adminCustomers: AdminCustomerRecord[] = [
  {
    id: "CUS-001",
    name: "Alya Putri",
    email: "alya.putri@example.com",
    phone: "+62 812-1111-2201",
    gender: "Female",
    registeredAt: "2026-01-14T08:45:00+07:00",
    status: "active",
    totalOrders: 6,
  },
  {
    id: "CUS-002",
    name: "Rizky Maulana",
    email: "rizky.maulana@example.com",
    phone: "+62 812-2222-3302",
    gender: "Male",
    registeredAt: "2026-02-03T15:10:00+07:00",
    status: "active",
    totalOrders: 4,
  },
  {
    id: "CUS-003",
    name: "Nadia Maharani",
    email: "nadia.maharani@example.com",
    phone: "+62 812-3333-4403",
    gender: "Female",
    registeredAt: "2026-03-21T12:20:00+07:00",
    status: "suspended",
    totalOrders: 2,
  },
];

export const adminPromotions: AdminPromotionRecord[] = [
  {
    id: "PROMO-001",
    code: "JUNIHEMAT",
    discountType: "Percentage",
    quota: 250,
    validFrom: "2026-06-01T00:00:00+07:00",
    validUntil: "2026-06-30T23:59:00+07:00",
    status: "active",
  },
  {
    id: "PROMO-002",
    code: "FREESHIP50",
    discountType: "Nominal",
    quota: 100,
    validFrom: "2026-06-05T00:00:00+07:00",
    validUntil: "2026-06-15T23:59:00+07:00",
    status: "scheduled",
  },
  {
    id: "PROMO-003",
    code: "WELCOME10",
    discountType: "Percentage",
    quota: 500,
    validFrom: "2026-01-01T00:00:00+07:00",
    validUntil: "2026-03-31T23:59:00+07:00",
    status: "expired",
  },
];

export const adminPayments: AdminPaymentRecord[] = [
  {
    id: "PAY-001",
    paymentReference: "MID-220019919",
    orderId: "ORD-20260603-0012A9X1",
    paymentMethod: "Bank Transfer",
    paymentProvider: "Midtrans",
    paymentStatus: "paid",
    paidAt: "2026-06-03T09:31:00+07:00",
  },
  {
    id: "PAY-002",
    paymentReference: "XND-110099284",
    orderId: "ORD-20260602-0091BQW8",
    paymentMethod: "E-Wallet",
    paymentProvider: "Xendit",
    paymentStatus: "pending",
    paidAt: "2026-06-02T16:20:00+07:00",
  },
  {
    id: "PAY-003",
    paymentReference: "STR-981112443",
    orderId: "ORD-20260601-0077NMK2",
    paymentMethod: "Credit Card",
    paymentProvider: "Stripe",
    paymentStatus: "failed",
    paidAt: "2026-06-01T11:04:00+07:00",
  },
];

export const adminShipping: AdminShippingRecord[] = [
  {
    id: "SHIP-001",
    trackingNumber: "JNE203948577ID",
    orderId: "ORD-20260603-0012A9X1",
    courierName: "JNE",
    currentLocation: "Jakarta Sorting Center",
    shippingStatus: "ready_to_ship",
    estimatedArrival: "2026-06-05T18:00:00+07:00",
  },
  {
    id: "SHIP-002",
    trackingNumber: "JNT998871220ID",
    orderId: "ORD-20260602-0091BQW8",
    courierName: "J&T",
    currentLocation: "Bandung Hub",
    shippingStatus: "in_transit",
    estimatedArrival: "2026-06-04T20:00:00+07:00",
  },
  {
    id: "SHIP-003",
    trackingNumber: "SICE123450991ID",
    orderId: "ORD-20260531-0038PKT5",
    courierName: "SiCepat",
    currentLocation: "Customer Address",
    shippingStatus: "delivered",
    estimatedArrival: "2026-06-01T14:00:00+07:00",
  },
];

export const adminSystemUsers: AdminSystemUserRecord[] = [
  {
    id: "USR-001",
    name: "Dimas Admin",
    username: "dimas.admin",
    roleName: "Admin",
    verified: "verified",
    status: "active",
  },
  {
    id: "USR-002",
    name: "Tania Manager",
    username: "tania.manager",
    roleName: "Manager",
    verified: "verified",
    status: "active",
  },
  {
    id: "USR-003",
    name: "Arif Staff",
    username: "arif.staff",
    roleName: "Staff",
    verified: "unverified",
    status: "inactive",
  },
];

export const adminRoles: AdminRoleRecord[] = [
  {
    id: "ROLE-001",
    roleName: "Super Admin",
    isAdmin: true,
    isSuperAdmin: true,
    createdAt: "2025-12-01T10:00:00+07:00",
  },
  {
    id: "ROLE-002",
    roleName: "Admin",
    isAdmin: true,
    isSuperAdmin: false,
    createdAt: "2025-12-03T11:15:00+07:00",
  },
  {
    id: "ROLE-003",
    roleName: "Staff",
    isAdmin: false,
    isSuperAdmin: false,
    createdAt: "2025-12-06T09:20:00+07:00",
  },
];

export const adminCategories: AdminCategoryRecord[] = [
  {
    id: "CAT-001",
    name: "Sport",
    slug: "sport",
    status: "active",
  },
  {
    id: "CAT-002",
    name: "Men",
    slug: "men",
    status: "active",
  },
  {
    id: "CAT-003",
    name: "Accessories",
    slug: "accessories",
    status: "inactive",
  },
];

export const adminProducts: AdminProductRecord[] = [
  {
    id: "PRD-001",
    image: "/products/hoodie.jpg",
    name: "NWV Hoodie",
    category: "Men",
    stock: 20,
    price: 300000,
    status: "active",
  },
  {
    id: "PRD-002",
    image: "/products/shoes.jpg",
    name: "NWV Sneakers",
    category: "Sport",
    stock: 3,
    price: 550000,
    status: "draft",
  },
  {
    id: "PRD-003",
    image: "/products/cap.jpg",
    name: "NWV Running Cap",
    category: "Accessories",
    stock: 0,
    price: 175000,
    status: "archived",
  },
];
