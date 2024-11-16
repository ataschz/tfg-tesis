'use server';

import { SignInCredentials, ContractorSignUp, CompanySignUp } from '@/lib/types/auth';
import { redirect } from 'next/navigation';

export async function signIn(credentials: SignInCredentials) {
  try {
    // TODO: Implementar autenticación con Supabase
    const mockUserRole = credentials.email.includes('company') ? 'company' : 'contractor';
    
    if (mockUserRole === 'company') {
      redirect('/company');
    } else {
      redirect('/contractor');
    }
  } catch (error) {
    return {
      error: 'Credenciales inválidas'
    };
  }
}

export async function signUpContractor(data: ContractorSignUp) {
  try {
    // TODO: Implementar registro con Supabase
    console.log('Registrando contratista:', data);
    redirect('/signin');
  } catch (error) {
    return {
      error: 'Error al registrar el usuario'
    };
  }
}

export async function signUpCompany(data: CompanySignUp) {
  try {
    // TODO: Implementar registro con Supabase
    console.log('Registrando empresa:', data);
    redirect('/signin');
  } catch (error) {
    return {
      error: 'Error al registrar la empresa'
    };
  }
}