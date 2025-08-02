import {
  UserProfile,
  ClientProfile,
  ContractorProfile,
} from "@/lib/db/schema/platform";

export type Company = UserProfile & {
  clientProfile?: ClientProfile | null;
  contractorProfile?: ContractorProfile | null;
};

export type Contractor = UserProfile & {
  contractorProfile?: ContractorProfile | null;
  clientProfile?: ClientProfile | null;
};

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  completed: boolean;
}