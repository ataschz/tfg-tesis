#!/bin/bash

echo "🧹 Limpiando estado de demo..."

# Detener procesos
pkill -f "hardhat node" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

# Limpiar deployments (blockchain:node ya limpia automáticamente)
echo "🗑️  Limpiando deployments..."
rm -f blockchain/deployments/*.json

echo "✅ Limpieza completada"
echo ""
echo "📋 Pasos para reiniciar completamente:"
echo "1. 🔄 En MetaMask (CADA BROWSER): Settings → Advanced → Reset Account"
echo "2. 🔗 Reiniciar blockchain: pnpm blockchain:node (auto-limpia cache)"
echo "3. 📝 Redesplegar contrato: pnpm blockchain:deploy"  
echo "4. ⚙️  Actualizar .env.local con nueva dirección"
echo "5. 🚀 Reiniciar app: pnpm dev"
echo ""
echo "⚠️  IMPORTANTE: Reset Account en MetaMask es OBLIGATORIO"
echo "   Sin esto, las transacciones pueden fallar por problemas de nonce"
echo ""
echo "🔍 Para diagnosticar problemas: http://localhost:3001/debug"