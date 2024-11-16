export interface Contractor {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  skills: string[];
  hourlyRate: number;
  availability: 'full-time' | 'part-time';
  timezone: string;
  profileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  companyName: string;
  website: string;
  email: string;
  password: string;
  industry: string;
  size: string;
  country: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  subscription: {
    plan: 'startup' | 'business' | 'enterprise';
    status: 'active' | 'inactive' | 'cancelled';
    startDate: string;
    endDate: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  companyId: string;
  contractorId: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  type: 'fixed-price' | 'hourly';
  title: string;
  description: string;
  amount?: number;
  hourlyRate?: number;
  currency: string;
  startDate: string;
  endDate?: string;
  hoursPerWeek?: number;
  milestones?: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

export interface Payment {
  id: string;
  contractId: string;
  milestoneId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  type: 'milestone' | 'hourly';
  paymentMethod: 'bank_transfer' | 'credit_card' | 'crypto';
  processingFee: number;
  totalAmount: number;
  hoursWorked?: number;
  periodStart?: string;
  periodEnd?: string;
  paidAt?: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  contractId: string;
  milestoneId?: string;
  initiatedBy: 'contractor' | 'company';
  status: 'open' | 'in-review' | 'resolved' | 'cancelled';
  reason: 'payment_delay' | 'quality_issues' | 'scope_change' | 'other';
  description: string;
  resolution?: string;
  resolutionDetails?: string;
  createdAt: string;
  resolvedAt?: string;
  updatedAt: string;
}