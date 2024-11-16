import type { Contract, Contractor, Company } from './database';

export interface ContractWithParties extends Contract {
  contractors: Contractor[];
  companies: Company[];
}