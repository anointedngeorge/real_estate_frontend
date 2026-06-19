import { PaymentPlan, SalesStatusType } from "@/types";
import { UUID } from "crypto";
import { RealtorShortProfile } from "./auth";

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


export interface RealtorCreateInterface {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  password: string,
  sponsor?: string
}


export interface ClientCreateInterface {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  password: string
}


export interface UsersListingQueryInterface {
  id?: string;
  exclude_users_roles?: string | null;
  page?: number;
  page_size?: number;
  url: string;
  size?: number
}


export interface PropertyPlotsInterface {
  id: string;
  plot_number: number;
  plot_price: number;
  uid: string;
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
  selling_price?: number;
  features?: Record<string, any>;
  plots?: PropertyPlotsInterface[];
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
    selling_price?: number;
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
  // 
  plots?:Record<string, any>[]
}


export interface SalesPaymentPlanOutInterface {
    id:string;
    billing_name: string;
    billing_period_number:number;
    billing_amount_to_pay: number;
    billing_date: string;
    status: string;
}


export interface ReferralRealtorList {
    realtor: RealtorShortProfile,
    sponsor: RealtorShortProfile
}


export interface SalesOutInterface {
    id: string;
    properties : PropertyInterface
    client : Record<string, string>;
    realtor : RealtorShortProfile;
    payment_plan : string;
    status : string;
    amount : number
    sales_date: string;
    sales_date_time: string;
    year: number;
    month: number;
    commission: Record<string, string>;
    payment_plan_spread?: Record<string, string>[];
    referralList: ReferralRealtorList;
    payment_plan_list: SalesPaymentPlanOutInterface[]
}

export interface SalesInInterface {
    properties_id : string;
    client : string;
    realtor : string;
    payment_plan : PaymentPlan;
    status : SalesStatusType;
    amount : number;
    plot_ids?: Record<string, any>;
    plot_ids_price?: Record<string, any>;
    plots?: string[]

}


