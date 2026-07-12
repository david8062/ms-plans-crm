export type BillingCycle = 'MONTHLY' | 'ANNUAL';
export type SubscriptionStatus = 'PENDING' | 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'SUSPENDED' | 'CANCELLED';

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  planName: string;
  planSlug: string;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  notes?: string;
  createdAt: string;
}

export interface SubscriptionRequest {
  tenantId: string;
  planId: string;
  billingCycle: BillingCycle;
  notes?: string;
  startAsTrial?: boolean;
}

export interface CancelSubscriptionRequest {
  cancelReason?: string;
}
