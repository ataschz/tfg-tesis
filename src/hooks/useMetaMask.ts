'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

interface MetaMaskState {
  isAvailable: boolean;
  isConnected: boolean;
  account: string | null;
  isConnecting: boolean;
  error: string | null;
}

interface UseMetaMaskReturn extends MetaMaskState {
  connect: () => Promise<void>;
  disconnect: () => void;
  makeDeposit: (contractAddress: string, contractId: string, amount: string) => Promise<boolean>;
  releaseFunds: (contractAddress: string, contractId: string) => Promise<boolean>;
  resolveDispute: (contractAddress: string, contractId: string, favorBuyer: boolean) => Promise<boolean>;
  checkNetwork: () => Promise<boolean>;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const HARDHAT_CHAIN_ID = '0x539'; // 1337 in hex
const HARDHAT_RPC_URL = 'http://127.0.0.1:8545';

export function useMetaMask(): UseMetaMaskReturn {
  const [state, setState] = useState<MetaMaskState>({
    isAvailable: false,
    isConnected: false,
    account: null,
    isConnecting: false,
    error: null,
  });

  // Check if MetaMask is available
  useEffect(() => {
    const checkMetaMask = () => {
      const isAvailable = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
      setState(prev => ({ ...prev, isAvailable }));
      
      if (isAvailable && window.ethereum.selectedAddress) {
        setState(prev => ({
          ...prev,
          isConnected: true,
          account: window.ethereum.selectedAddress,
        }));
      }
    };

    checkMetaMask();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setState(prev => ({
            ...prev,
            isConnected: false,
            account: null,
          }));
        } else {
          setState(prev => ({
            ...prev,
            isConnected: true,
            account: accounts[0],
          }));
        }
      });
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const connect = useCallback(async () => {
    if (!state.isAvailable) {
      setState(prev => ({ ...prev, error: 'MetaMask no está instalado' }));
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setState(prev => ({
          ...prev,
          isConnected: true,
          account: accounts[0],
          isConnecting: false,
        }));
      } else {
        throw new Error('No se pudo conectar a MetaMask');
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Error al conectar con MetaMask',
      }));
    }
  }, [state.isAvailable]);

  const disconnect = useCallback(() => {
    setState(prev => ({
      ...prev,
      isConnected: false,
      account: null,
      error: null,
    }));
  }, []);

  const checkNetwork = useCallback(async (): Promise<boolean> => {
    if (!window.ethereum) return false;

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (chainId !== HARDHAT_CHAIN_ID) {
        // Try to switch to Hardhat network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: HARDHAT_CHAIN_ID }],
          });
          return true;
        } catch (switchError: any) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: HARDHAT_CHAIN_ID,
                chainName: 'Hardhat Local',
                rpcUrls: [HARDHAT_RPC_URL],
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
              }],
            });
            return true;
          }
          throw switchError;
        }
      }
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Error verificando la red. Asegúrate de estar en Hardhat Local.' }));
      return false;
    }
  }, []);

  const makeDeposit = useCallback(async (
    contractAddress: string,
    contractId: string,
    amount: string
  ): Promise<boolean> => {
    if (!state.isConnected || !window.ethereum) {
      setState(prev => ({ ...prev, error: 'MetaMask no está conectado' }));
      return false;
    }

    try {
      // Check network first
      const networkOk = await checkNetwork();
      if (!networkOk) return false;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        ['function deposit(string contractId) payable'],
        signer
      );

      setState(prev => ({ ...prev, error: null }));

      const tx = await contract.deposit(contractId, {
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      return true;
    } catch (error: any) {
      let errorMessage = 'Error al realizar el depósito';
      
      if (error.code === 4001) {
        errorMessage = 'Transacción cancelada por el usuario';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Fondos insuficientes para realizar la transacción';
      } else if (error.message?.includes('user rejected')) {
        errorMessage = 'Transacción rechazada por el usuario';
      }

      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, [state.isConnected, checkNetwork]);

  const releaseFunds = useCallback(async (
    contractAddress: string,
    contractId: string
  ): Promise<boolean> => {
    if (!state.isConnected || !window.ethereum) {
      setState(prev => ({ ...prev, error: 'MetaMask no está conectado' }));
      return false;
    }

    try {
      // Check network first
      const networkOk = await checkNetwork();
      if (!networkOk) return false;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        ['function releaseFunds(string contractId)'],
        signer
      );

      setState(prev => ({ ...prev, error: null }));

      const tx = await contract.releaseFunds(contractId);
      await tx.wait();
      return true;
    } catch (error: any) {
      let errorMessage = 'Error al liberar los fondos';
      
      if (error.code === 4001) {
        errorMessage = 'Transacción cancelada por el usuario';
      } else if (error.message?.includes('user rejected')) {
        errorMessage = 'Transacción rechazada por el usuario';
      } else if (error.message?.includes('Solo el buyer puede ejecutar esta funcion')) {
        errorMessage = 'Solo el creador del contrato puede liberar los fondos';
      }

      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, [state.isConnected, checkNetwork]);

  const resolveDispute = useCallback(async (
    contractAddress: string,
    contractId: string,
    favorBuyer: boolean
  ): Promise<boolean> => {
    if (!state.isConnected || !window.ethereum) {
      setState(prev => ({ ...prev, error: 'MetaMask no está conectado' }));
      return false;
    }

    try {
      // Check network first
      const networkOk = await checkNetwork();
      if (!networkOk) return false;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        ['function resolveDispute(string contractId, bool favorBuyer)'],
        signer
      );

      setState(prev => ({ ...prev, error: null }));

      const tx = await contract.resolveDispute(contractId, favorBuyer);
      await tx.wait();
      return true;
    } catch (error: any) {
      let errorMessage = 'Error al resolver la disputa';
      
      if (error.code === 4001) {
        errorMessage = 'Transacción cancelada por el usuario';
      } else if (error.message?.includes('user rejected')) {
        errorMessage = 'Transacción rechazada por el usuario';
      } else if (error.message?.includes('Solo el administrator puede ejecutar esta funcion')) {
        errorMessage = 'Solo el administrador puede resolver disputas';
      }

      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, [state.isConnected, checkNetwork]);

  return {
    ...state,
    connect,
    disconnect,
    makeDeposit,
    releaseFunds,
    resolveDispute,
    checkNetwork,
  };
}