export interface Module {
  id: string;
  name: string;
  slug: string;
  description?: string;
  priceMonthly: number;
  priceAnnual: number;
  currency: string;
  isActive: boolean;
}

export interface ModuleRequest {
  name: string;
  slug: string;
  description?: string;
  priceMonthly: number;
  priceAnnual: number;
  currency?: string;
}

export type SubscriptionModuleStatus = 'ACTIVE' | 'CANCELLED';
export type BillingCycle = 'MONTHLY' | 'ANNUAL';

export interface SubscriptionModule {
  id: string;
  subscriptionId: string;
  moduleSlug: string;
  moduleName: string;
  moduleDescription?: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  status: SubscriptionModuleStatus;
  activatedAt: string;
  cancelledAt?: string;
}

export interface AddModuleRequest {
  moduleSlug: string;
  billingCycle: BillingCycle;
}
