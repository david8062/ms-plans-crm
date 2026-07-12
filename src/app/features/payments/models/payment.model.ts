export type PaymentGateway = 'STRIPE' | 'MERCADO_PAGO' | 'ONE_PAY' | 'MANUAL';
export type PaymentStatus  = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  subscriptionId: string;
  tenantId: string;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  gatewayTransactionId?: string;
  status: PaymentStatus;
  paymentMethod?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
}

export interface PaymentRequest {
  subscriptionId: string;
  tenantId: string;
  amount: number;
  currency?: string;
  gateway: PaymentGateway;
  gatewayTransactionId?: string;
  paymentMethod?: string;
  notes?: string;
}
