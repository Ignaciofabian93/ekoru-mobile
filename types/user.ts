import {
  type AdminPermission,
  type AdminRole,
  type AdminType,
  type BusinessSubscriptionPlan,
  type BusinessType,
  type ContactMethod,
  type PersonSubscriptionPlan,
  type SellerType,
} from "./enums";
import { City, Country, County, Region } from "./location";

export type Admin = {
  id: string;
  email: string;
  password: string;
  name: string;
  lastName?: string;

  // Admin type and access control
  adminType: AdminType;
  role: AdminRole;
  permissions: AdminPermission[];

  // Location
  countryId?: number;
  country?: Country;
  regionId?: number;
  region?: Region;
  cityId?: number;
  city?: City;
  countyId?: number;
  county?: County;

  // Business admin relation (null for platform admins)
  sellerId?: string;
  seller?: Seller;

  // Account status and security
  isActive: boolean;
  isEmailVerified: boolean;
  accountLocked: boolean;
  loginAttempts: number;
  lastLoginAt?: string;
  lastLoginIp?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
};

export type AdminActivityLog = {
  id: number;
  adminId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type Seller = {
  id: string;
  email: string;
  password: string;
  sellerType: SellerType;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;

  // Profile Relations - Each seller has ONE profile based on sellerType
  profile: PersonProfile | BusinessProfile;

  // Location information
  address?: string;
  cityId?: number;
  countryId?: number;
  countyId?: number;
  regionId?: number;
  county?: County;
  region?: Region;
  country?: Country;
  city?: City;

  // Contact information
  phone?: string;
  website?: string;
  preferredContactMethod?: ContactMethod;
  socialMediaLinks?: Record<string, string>;

  // Points and Level System
  points: number;
  sellerLevelId?: number;
  sellerLevel?: SellerLevel;
  sellerCategoryId?: number;
  sellerCategory?: SellerCategory;
};

export type PersonProfile = {
  __typename: "PersonProfile";
  id: string;
  sellerId: string;
  firstName: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  birthday?: string;
  profileImage?: string;
  coverImage?: string;
  allowExchanges: boolean;
  personSubscriptionPlan: PersonSubscriptionPlan;
};

export type BusinessProfile = {
  __typename: "BusinessProfile";
  id: string;
  sellerId: string;

  // Basic Information
  businessName: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  businessType: BusinessType;

  // Chilean Legal Requirements
  legalBusinessName?: string;
  taxId?: string;
  businessStartDate?: string;
  legalRepresentative?: string;
  legalRepresentativeTaxId?: string;

  // For RETAIL and MIXED
  shippingPolicy?: string;
  returnPolicy?: string;

  // For SERVICES and MIXED
  serviceArea?: string;
  yearsOfExperience?: number;
  certifications?: string[];
  travelRadius?: number;

  // Operating Hours
  businessHours?: Record<string, unknown>;

  businessSubscriptionPlan: BusinessSubscriptionPlan;
  createdAt: string;
  updatedAt: string;
};

export type SellerCategory = {
  id: number;
  name: string;
  categoryDiscountAmount: number;
  pointsThreshold: number;
  level: number;
};

export type SellerPreferences = {
  id: number;
  sellerId: string;
  preferredLanguage?: string;
  currency?: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  communityUpdates: boolean;
  securityAlerts: boolean;
  weeklySummary: boolean;
  twoFactorAuth: boolean;
};

export type SellerLevel = {
  id: number;
  levelName: string;
  minPoints: number;
  maxPoints?: number;
  benefits?: Record<string, unknown>;
  badgeIcon?: string;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  id: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  sellerId: string; // Changed from userId to sellerId
};
