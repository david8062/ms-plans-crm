export type BillingCycle = 'MONTHLY' | 'ANNUAL';
export type FeatureType  = 'NUMERIC' | 'BOOLEAN' | 'TEXT';

export interface PlanPrice {
  id: string;
  billingCycle: BillingCycle;
  basePrice: number;
  discountPercent: number;
  finalPrice: number;
  currency: string;
}

export interface PlanFeature {
  id: string;
  featureKey: string;
  featureValue: string;
  featureType: FeatureType;
  label: string;
  displayOrder: number;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  trialDays?: number;
  graceDays?: number;
  maxUsers?: number;
  maxCases?: number;
  maxStorageGb?: number;
  maxAiTokensMonthly?: number;
  prices: PlanPrice[];
  features: PlanFeature[];
}

export interface PlanRequest {
  name: string;
  description?: string;
  slug: string;
  displayOrder?: number;
  trialDays?: number;
  graceDays?: number;
  maxUsers?: number;
  maxCases?: number;
  maxStorageGb?: number;
  maxAiTokensMonthly?: number;
}

export interface PlanPriceRequest {
  billingCycle: BillingCycle;
  basePrice: number;
  discountPercent?: number;
  currency?: string;
}

export interface PlanFeatureRequest {
  featureKey: string;
  featureValue: string;
  featureType: FeatureType;
  label: string;
  displayOrder?: number;
}
