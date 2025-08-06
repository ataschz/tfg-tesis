"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

interface MetaMaskState {
  isAvailable: boolean;
  isConnected: boolean;
  account: string | null;
  isConnecting: boolean;
  error: string | null;
}

interface UseMetaMaskReturn extends MetaMaskState {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  makeDeposit: (
    contractAddress: string,
    contractId: string,
    amount: string
  ) => Promise<boolean>;
  releaseFunds: (
    contractAddress: string,
    contractId: string
  ) => Promise<boolean>;
  resolveDispute: (
    contractAddress: string,
    contractId: string,
    favorBuyer: boolean
  ) => Promise<boolean>;
  checkNetwork: () => Promise<boolean>;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const HARDHAT_CHAIN_ID = "0x539"; // 1337 in hex
const HARDHAT_RPC_URL = "http://127.0.0.1:8545";
const DISCONNECT_STORAGE_KEY = "metamask_disconnected";

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
      const isAvailable =
        typeof window !== "undefined" && typeof window.ethereum !== "undefined";
      setState((prev) => ({ ...prev, isAvailable }));

      // Check if user manually disconnected
      const wasDisconnected =
        localStorage.getItem(DISCONNECT_STORAGE_KEY) === "true";

      if (isAvailable && window.ethereum.selectedAddress && !wasDisconnected) {
        setState((prev) => ({
          ...prev,
          isConnected: true,
          account: window.ethereum.selectedAddress,
        }));
      }
    };

    checkMetaMask();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          setState((prev) => ({
            ...prev,
            isConnected: false,
            account: null,
          }));
        } else {
          // Only auto-connect if user hasn't manually disconnected
          const wasDisconnected =
            localStorage.getItem(DISCONNECT_STORAGE_KEY) === "true";
          if (!wasDisconnected) {
            setState((prev) => ({
              ...prev,
              isConnected: true,
              account: accounts[0],
            }));
          }
        }
      });
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  const connect = useCallback(async (): Promise<boolean> => {
    if (!state.isAvailable) {
      setState((prev) => ({ ...prev, error: "MetaMask no está instalado" }));
      return false;
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setState((prev) => ({
          ...prev,
          isConnected: true,
          account: accounts[0],
          isConnecting: false,
        }));
        // Clear disconnected flag when user manually connects
        localStorage.removeItem(DISCONNECT_STORAGE_KEY);
        return true;
      } else {
        throw new Error("No se pudo conectar a MetaMask");
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message || "Error al conectar con MetaMask",
      }));
      return false;
    }
  }, [state.isAvailable]);

  const disconnect = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isConnected: false,
      account: null,
      error: null,
    }));
    // Set flag to prevent auto-reconnection
    localStorage.setItem(DISCONNECT_STORAGE_KEY, "true");
  }, []);

  const checkNetwork = useCallback(async (): Promise<boolean> => {
    if (!window.ethereum) return false;

    try {
      // Force MetaMask to refresh its state
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      if (chainId !== HARDHAT_CHAIN_ID) {
        // Try to switch to Hardhat network
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: HARDHAT_CHAIN_ID }],
          });

          // Wait a bit for network to switch
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return true;
        } catch (switchError: any) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: HARDHAT_CHAIN_ID,
                  chainName: "Hardhat Local",
                  rpcUrls: [HARDHAT_RPC_URL],
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                },
              ],
            });

            // Wait a bit for network to be added
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return true;
          }
          throw switchError;
        }
      }
      return true;
    } catch (error) {
      console.error("Network check error:", error);
      setState((prev) => ({
        ...prev,
        error: "Error verificando la red. Asegúrate de estar en Hardhat Local.",
      }));
      return false;
    }
  }, []);

  const createProvider = useCallback(async () => {
    if (!window.ethereum) throw new Error("MetaMask no disponible");

    // Create provider with polling for better sync
    const provider = new ethers.BrowserProvider(window.ethereum, {
      name: "hardhat-local",
      chainId: 1337,
      ensAddress: null, // Disable ENS for local network
    });

    // Force provider to sync with latest block
    await provider.getBlockNumber();

    return provider;
  }, []);

  const makeDeposit = useCallback(
    async (
      contractAddress: string,
      contractId: string,
      amount: string
    ): Promise<boolean> => {
      if (!state.isConnected || !window.ethereum) {
        setState((prev) => ({ ...prev, error: "MetaMask no está conectado" }));
        return false;
      }

      try {
        setState((prev) => ({ ...prev, error: null }));

        // Check network first
        const networkOk = await checkNetwork();
        if (!networkOk) return false;

        // Create provider with improved configuration
        const provider = await createProvider();
        const signer = await provider.getSigner();

        // Verify we're on the right network
        const network = await provider.getNetwork();
        if (network.chainId !== 1337n) {
          setState((prev) => ({
            ...prev,
            error: "Red incorrecta. Cambia a Hardhat Local.",
          }));
          return false;
        }

        // Verify contract exists at address
        const code = await provider.getCode(contractAddress);
        if (code === "0x") {
          setState((prev) => ({
            ...prev,
            error: `Contrato no encontrado en la dirección: ${contractAddress}. Verifica que Hardhat esté ejecutándose y el contrato esté desplegado.`,
          }));
          return false;
        }

        const contract = new ethers.Contract(
          contractAddress,
          ["function deposit(string contractId) payable"],
          signer
        );

        console.log("Attempting deposit:", {
          contractAddress,
          contractId,
          amount,
        });

        // Add gas configuration for local network with lower gas limit first
        const tx = await contract.deposit(contractId, {
          value: ethers.parseEther(amount),
          gasLimit: 200000, // Lower gas limit
          gasPrice: ethers.parseUnits("20", "gwei"), // Explicit gas price
        });

        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");
        return true;
      } catch (error: any) {
        console.error("Deposit error:", error);
        let errorMessage = "Error al realizar el depósito";

        if (error.code === 4001) {
          errorMessage = "Transacción cancelada por el usuario";
        } else if (error.message?.includes("insufficient funds")) {
          errorMessage = "Fondos insuficientes para realizar la transacción";
        } else if (error.message?.includes("user rejected")) {
          errorMessage = "Transacción rechazada por el usuario";
        } else if (error.message?.includes("invalid block tag")) {
          errorMessage =
            "Error de sincronización con blockchain. Inténtalo de nuevo en unos segundos.";
        } else if (
          error.message?.includes("nonce too high") ||
          error.message?.includes("nonce")
        ) {
          errorMessage =
            "Error de nonce. Ve a MetaMask → Settings → Advanced → Reset Account";
        } else if (error.message?.includes("network")) {
          errorMessage =
            "Error de red. Verifica que Hardhat esté ejecutándose en puerto 8545";
        }

        setState((prev) => ({ ...prev, error: errorMessage }));
        return false;
      }
    },
    [state.isConnected, checkNetwork, createProvider]
  );

  const releaseFunds = useCallback(
    async (contractAddress: string, contractId: string): Promise<boolean> => {
      if (!state.isConnected || !window.ethereum) {
        setState((prev) => ({ ...prev, error: "MetaMask no está conectado" }));
        return false;
      }

      try {
        // Check network first
        const networkOk = await checkNetwork();
        if (!networkOk) return false;

        const provider = new ethers.BrowserProvider(window.ethereum, {
          name: "hardhat-local",
          chainId: 1337,
        });
        const signer = await provider.getSigner();

        // Verify network
        const network = await provider.getNetwork();
        if (network.chainId !== 1337n) {
          setState((prev) => ({
            ...prev,
            error: "Red incorrecta. Cambia a Hardhat Local.",
          }));
          return false;
        }

        const contract = new ethers.Contract(
          contractAddress,
          ["function releaseFunds(string contractId)"],
          signer
        );

        setState((prev) => ({ ...prev, error: null }));

        const tx = await contract.releaseFunds(contractId, {
          gasLimit: 300000,
        });
        await tx.wait();
        return true;
      } catch (error: any) {
        console.error("Release funds error:", error);
        let errorMessage = "Error al liberar los fondos";

        if (error.code === 4001) {
          errorMessage = "Transacción cancelada por el usuario";
        } else if (error.message?.includes("user rejected")) {
          errorMessage = "Transacción rechazada por el usuario";
        } else if (
          error.message?.includes("Solo el buyer puede ejecutar esta funcion")
        ) {
          errorMessage =
            "Solo el creador del contrato puede liberar los fondos";
        } else if (error.message?.includes("invalid block tag")) {
          errorMessage =
            "Error de sincronización. Resetea MetaMask y vuelve a intentar";
        }

        setState((prev) => ({ ...prev, error: errorMessage }));
        return false;
      }
    },
    [state.isConnected, checkNetwork]
  );

  const setDisputed = useCallback(
    async (contractAddress: string, contractId: string): Promise<boolean> => {
      if (!state.isConnected || !window.ethereum) {
        setState((prev) => ({ ...prev, error: "MetaMask no está conectado" }));
        return false;
      }

      try {
        setState((prev) => ({ ...prev, error: null }));

        // Check network first
        const networkOk = await checkNetwork();
        if (!networkOk) return false;

        const provider = new ethers.BrowserProvider(window.ethereum, {
          name: "hardhat-local",
          chainId: 1337,
        });
        const signer = await provider.getSigner();

        // Verify network
        const network = await provider.getNetwork();
        if (network.chainId !== 1337n) {
          setState((prev) => ({
            ...prev,
            error: "Red incorrecta. Cambia a Hardhat Local.",
          }));
          return false;
        }

        const contract = new ethers.Contract(
          contractAddress,
          ["function setDisputed(string contractId)"],
          signer
        );

        const tx = await contract.setDisputed(contractId, {
          gasLimit: 300000,
        });
        await tx.wait();
        return true;
      } catch (error: any) {
        console.error("Set disputed error:", error);
        let errorMessage = "Error al marcar como disputado";

        if (error.code === 4001) {
          errorMessage = "Transacción cancelada por el usuario";
        } else if (error.message?.includes("user rejected")) {
          errorMessage = "Transacción rechazada por el usuario";
        } else if (error.message?.includes("invalid block tag")) {
          errorMessage =
            "Error de sincronización. Resetea MetaMask y vuelve a intentar";
        }

        setState((prev) => ({ ...prev, error: errorMessage }));
        return false;
      }
    },
    [state.isConnected, checkNetwork]
  );

  const resolveDispute = useCallback(
    async (
      contractAddress: string,
      contractId: string,
      favorBuyer: boolean
    ): Promise<boolean> => {
      if (!state.isConnected || !window.ethereum) {
        setState((prev) => ({ ...prev, error: "MetaMask no está conectado" }));
        return false;
      }

      try {
        // Check network first
        const networkOk = await checkNetwork();
        if (!networkOk) return false;

        const provider = new ethers.BrowserProvider(window.ethereum, {
          name: "hardhat-local",
          chainId: 1337,
        });
        const signer = await provider.getSigner();

        // Verify network
        const network = await provider.getNetwork();
        if (network.chainId !== 1337n) {
          setState((prev) => ({
            ...prev,
            error: "Red incorrecta. Cambia a Hardhat Local.",
          }));
          return false;
        }

        const contract = new ethers.Contract(
          contractAddress,
          ["function resolveDispute(string contractId, bool favorBuyer)"],
          signer
        );

        setState((prev) => ({ ...prev, error: null }));

        const tx = await contract.resolveDispute(contractId, favorBuyer, {
          gasLimit: 300000,
        });
        await tx.wait();
        return true;
      } catch (error: any) {
        console.error("Resolve dispute error:", error);
        let errorMessage = "Error al resolver la disputa";

        if (error.code === 4001) {
          errorMessage = "Transacción cancelada por el usuario";
        } else if (error.message?.includes("user rejected")) {
          errorMessage = "Transacción rechazada por el usuario";
        } else if (
          error.message?.includes(
            "Solo el administrator puede ejecutar esta funcion"
          )
        ) {
          errorMessage = "Solo el administrador puede resolver disputas";
        } else if (error.message?.includes("invalid block tag")) {
          errorMessage =
            "Error de sincronización. Resetea MetaMask y vuelve a intentar";
        }

        setState((prev) => ({ ...prev, error: errorMessage }));
        return false;
      }
    },
    [state.isConnected, checkNetwork]
  );

  return {
    ...state,
    connect,
    disconnect,
    makeDeposit,
    releaseFunds,
    setDisputed,
    resolveDispute,
    checkNetwork,
  };
}
