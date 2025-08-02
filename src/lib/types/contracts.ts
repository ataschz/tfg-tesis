import {
  Contract,
  UserProfile,
  ClientProfile,
  ContractorProfile,
} from "@/lib/db/schema/platform";

export type UserProfileWithRelations = UserProfile & {
  clientProfile?: ClientProfile | null;
  contractorProfile?: ContractorProfile | null;
};

export type ContractWithParties = Contract & {
  companies: UserProfileWithRelations[];
  contractors: UserProfileWithRelations[];
};
