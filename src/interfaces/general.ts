import { UUID } from "crypto";

export interface ResponseInterface {
  message: string;
  data: any;
  status: boolean;
  status_code: number;
}

export interface SystemSettingsInterface {
  data: string;
}

export interface UserRolePermissionInterface {
  id: string;
  name: string;
}

export interface UsersListingInterface {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_number: string | null;
  date_joined: Date;
  permissions: string[];
}

export interface ClientListingInterface {
  id: string;
  avatar?: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  outstandingBalance?: number;
  phone_number: string | null;
  date_joined: string;
  is_active?: boolean;
  permissions: string[];
}

export interface UsersRealtorListingInterface {
  id: string;
  avatar?: string;
  referral_code: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_number: string | null;
  date_joined: Date;
  permissions: string[];
  status: string;
  is_active: boolean;
  account_name?: string;
  bank_name?: string;
  bank_type?: string;
  bank_number?: string;
  downlineIds?: string;
  totalSales?: number;
  totalCommissionEarned?: number;
  paidCommission?: number;
  unpaidCommission?: number;
}

export interface UsersListingQueryInterface {
  id?: string;
  exclude_users_roles?: string | null;
  page?: number;
  page_size?: number;
  url: string;
}

export interface PropertyListInterface {
  id: string;
  name: string;
  image: string;
  description: string;
  location: string;
  status: string;
  property_types: string;
  actual_price: number;
  selling_price: number;
  features?: Record<string, any>;
}

export interface PropertyUpdateInterface {
  id: string;
  data: {
    name: string;
    image: string;
    description: string;
    location: string;
    status: string;
    property_types: string;
    actual_price: number;
    selling_price: number;
    features?: Record<string, any>;
  };
}

export interface PropertyInterface {
  name: string;
  image: string;
  description: string;
  location: string;
  status: string;
  property_types: string;
  actual_price: number;
  selling_price: number;
  features?: Record<string, any>;
}
