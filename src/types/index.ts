// User Roles - RBAC
export type UserRole =
  | "super_admin"
  | "manager"
  | "finance_admin"
  | "sales_admin"
  | "admin"
  | 'buyer'
  | 'agent'
  | "marketing_admin";

export type UserType = "admin" | "realtor" | "client";

export type PaymentStatus = "paid" | "due" | "overdue";

export type PropertyStatus = "available" | "sold" | "reserved" | "archived";

export type PaymentPlan = "outright" | "3_months" | "6_months" | "10_months";
export type PropertyTypes = "land" | "house" | "apartment" | "commercial"
export type FeatureTypes = "square" | "estate_features"



export const COMMISSION_RULES = {
  DIRECT: 0.1, // 10%
  DOWNLINER: 0.02, // 2%
  COMPANY: 0.78, // 78%
} as const;

// Installment Interest
export const INSTALLMENT_INTEREST_RATE = 0.1; // 10% every 3 months

// User Entity
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  userType: UserType;
  avatar?: string;
  phone?: string;
  status: "active" | "suspended" | "inactive";
  createdAt: string;
  lastLoginAt?: string;
}

// server user entity

export interface UserServer {
  avatar?: string,
  date_joined: string;
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  phone_number: string;
  role: string;
  username: string;
  last_login?: string
  status: "active" | "suspended" | "inactive";
}

// Realtor Entity
export interface Realtor {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  uplineId?: string;
  downlineIds: string[];
  totalSales: number;
  totalCommissionEarned: number;
  paidCommission: number;
  unpaidCommission: number;
  referralCode: string;
  status: "active" | "inactive";
  joinedAt: string;
}

// Client Entity
export interface Client {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  properties: string[];
  totalSpent: number;
  outstandingBalance: number;
  status: "active" | "inactive";
  createdAt: string;
}

// Property Entity
export interface Property {
  id: string;
  title: string;
  location: string;
  address: string;
  price: number;
  type: "land" | "house" | "apartment" | "commercial";
  size: string;
  status: PropertyStatus;
  images: string[];
  description: string;
  features: string[];
  clientId?: string;
  realtorId?: string;
  createdAt: string;
  soldAt?: string;
}

// Sale Entity
export interface Sale {
  id: string;
  propertyId: string;
  clientId: string;
  realtorId: string;
  amount: number;
  paymentPlan: PaymentPlan;
  status: "completed" | "in_progress" | "cancelled";
  commission: {
    direct: number;
    downliner: number;
    company: number;
  };
  createdAt: string;
  completedAt?: string;
}

// Payment Entity
export interface Payment {
  id: string;
  clientId: string;
  saleId: string;
  propertyId: string;
  amount: number;
  amountPaid: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  paymentPlan: PaymentPlan;
  installmentNumber?: number;
  totalInstallments?: number;
  interestApplied: number;
  createdAt: string;
}

// Commission Entity
export interface Commission {
  id: string;
  realtorId: string;
  saleId: string;
  type: "direct" | "downliner";
  amount: number;
  status: "pending" | "approved" | "paid";
  scheduledPayoutDate: string;
  paidDate?: string;
  createdAt: string;
}

// Analytics Types
export interface DashboardStats {
  totalProperties: number;
  totalSales: {
    monthly: number;
    yearly: number;
  };
  totalRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  totalCommissionsPaid: number;
  totalCommissionsUnpaid: number;
  activeRealtors: number;
  activeClients: number;
}

export interface SalesTrend {
  month: string;
  sales: number;
  revenue: number;
}

export interface CommissionDistribution {
  type: string;
  amount: number;
}

export interface PaymentCompliance {
  status: string;
  count: number;
  amount: number;
}

// Permission Type
export interface Permission {
  module: string;
  actions: ("view" | "create" | "edit" | "delete" | "approve")[];
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}
