'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function MetaMaskDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const checkEverything = async () => {
    setLoading(true);
    const info: any = {};

    try {
      // Check if MetaMask is available
      info.metamaskAvailable = typeof window.ethereum !== 'undefined';
      
      if (window.ethereum) {
        // Get accounts
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          info.accounts = accounts;
          info.connectedAccount = accounts[0];
        } catch (e) {
          info.accountsError = e.message;
        }

        // Get chain ID
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          info.chainId = chainId;
          info.isHardhatNetwork = chainId === '0x539';
        } catch (e) {
          info.chainIdError = e.message;
        }

        // Get block number via MetaMask
        try {
          const blockNumber = await window.ethereum.request({ method: 'eth_blockNumber' });
          info.blockNumberHex = blockNumber;
          info.blockNumberDecimal = parseInt(blockNumber, 16);
        } catch (e) {
          info.blockNumberError = e.message;
        }

        // Test ethers.js provider
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
          const ethersBlockNumber = await provider.getBlockNumber();
          
          info.ethersNetwork = {
            name: network.name,
            chainId: Number(network.chainId),
            ensAddress: network.ensAddress
          };
          info.ethersBlockNumber = ethersBlockNumber;
        } catch (e) {
          info.ethersError = e.message;
        }

        // Test direct RPC connection
        try {
          const directProvider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
          const directBlockNumber = await directProvider.getBlockNumber();
          info.directRpcBlockNumber = directBlockNumber;
        } catch (e) {
          info.directRpcError = e.message;
        }

        // Test contract address
        const contractAddress = process.env.NEXT_PUBLIC_ESCROW_MANAGER_ADDRESS;
        if (contractAddress) {
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const code = await provider.getCode(contractAddress);
            info.contractAddress = contractAddress;
            info.contractCodeExists = code !== '0x';
            info.contractCodeLength = code.length;
          } catch (e) {
            info.contractError = e.message;
          }
        } else {
          info.contractAddress = 'Not configured';
        }
      }
    } catch (error: any) {
      info.generalError = error.message;
    }

    setDebugInfo(info);
    setLoading(false);
  };

  useEffect(() => {
    checkEverything();
  }, []);

  return (
    <Card className="p-6 m-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">MetaMask Debug Info</h2>
          <Button onClick={checkEverything} disabled={loading}>
            {loading ? 'Checking...' : 'Refresh'}
          </Button>
        </div>
        
        <div className="space-y-2 font-mono text-sm">
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        {debugInfo.blockNumberDecimal === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <h3 className="font-semibold text-yellow-800">⚠️ Blockchain has 0 blocks!</h3>
            <p className="text-yellow-700">
              This suggests Hardhat blockchain was just started. Try:
              <br />1. Deploy a contract: <code>pnpm blockchain:deploy</code>
              <br />2. Or make a simple transaction to create the genesis block
            </p>
          </div>
        )}

        {debugInfo.ethersError?.includes('invalid block tag') && (
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <h3 className="font-semibold text-red-800">🚨 Invalid Block Tag Error Detected</h3>
            <p className="text-red-700">
              This is the exact error you're experiencing. Try:
              <br />1. Reset MetaMask account
              <br />2. Restart Hardhat node
              <br />3. Clear browser cache
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}