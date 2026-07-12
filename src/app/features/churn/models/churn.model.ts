export type ChurnReason =
  | 'PRICE_TOO_HIGH'
  | 'MISSING_FEATURES'
  | 'SWITCHED_TO_COMPETITOR'
  | 'NOT_USING_PRODUCT'
  | 'TECHNICAL_ISSUES'
  | 'BUSINESS_CLOSED'
  | 'OTHER';

export interface Churn {
  id: string;
  tenantId: string;
  tenantName?: string;
  subscriptionId?: string;
  planSlug?: string;
  planName?: string;
  billingCycle?: string;
  churnReason: ChurnReason;
  churnNotes?: string;
  startedAt?: string;
  churnedAt: string;
  mrrLost?: number;
  currency?: string;
  internalNotes?: string;
}

export interface ChurnRequest {
  tenantId: string;
  tenantName?: string;
  subscriptionId?: string;
  planSlug?: string;
  planName?: string;
  billingCycle?: string;
  churnReason: ChurnReason;
  churnNotes?: string;
  startedAt?: string;
  churnedAt: string;
  mrrLost?: number;
  currency?: string;
  internalNotes?: string;
}

export interface ChurnSummary {
  totalChurned: number;
  totalMrrLost: number;
  byReason: Record<ChurnReason, number>;
}
