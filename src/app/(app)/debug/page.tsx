'use client';

import { MetaMaskDebug } from '@/components/debug/MetaMaskDebug';

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Diagnóstico del Sistema</h1>
      <p className="text-gray-600 mb-8">
        Esta página te ayuda a diagnosticar problemas de conexión con MetaMask y la blockchain.
      </p>
      <MetaMaskDebug />
    </div>
  );
}