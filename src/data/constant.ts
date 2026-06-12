import { FeatureTypes, PaymentPlan, PropertyStatus, PropertyTypes, SalesStatusType, UserRole } from "@/types";

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  agent: "Agent",
  buyer: "Buyer",
  super_admin: "Super Admin",
  manager: "Manager",
  finance_admin: "Finance Admin",
  sales_admin: "Sales Admin",
  marketing_admin: "Marketing Admin",
};


export const StatusLabel: Record<PropertyStatus, string> = {
  available: "Available",
  sold: "Sold",
  reserved: "Reserved",
  archived: "Archived"
};

export const PropertyLabel: Record<PropertyTypes, string> = {
  land: "Land",
  house: "House",
  apartment : "Apartment",
  commercial: "Commercial"
};

export const FeaturesLabel: Record<FeatureTypes, string> = {
  square: "Square Meter",
  estate_features: "Estate Features (,)"
};


export const SalesStatusLabel: Record<SalesStatusType, string> = {
    'in_progress': "In Progress",
    'failed': 'Failed',
    'completed': 'completed',
    'cancelled': 'Cancelled',
    'reversed': 'Reversed'
};
export const PaymentPlanLabel: Record<PaymentPlan, string> = {
    '6': "6-Months",
    '3': '3-Months',
    '12': '12-Months',
    'outright': 'Outright'
};