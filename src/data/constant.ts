import { FeatureTypes, PropertyStatus, PropertyTypes, UserRole } from "@/types";

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