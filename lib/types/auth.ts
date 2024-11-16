export type UserRole = 'contractor' | 'company';

export interface ContractorSignUp {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface CompanySignUp {
  companyName: string;
  website: string;
  email: string;
  password: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}