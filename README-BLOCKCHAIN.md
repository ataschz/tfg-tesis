# 🔗 Integración Blockchain - Contrato Escrow

Este documento explica la implementación del contrato inteligente Escrow para la aplicación Trato, desarrollado con Hardhat y Solidity.

## 📋 Descripción del Contrato

El contrato **Escrow** es un sistema de depósito en garantía que facilita transacciones seguras entre tres partes:

- **Buyer (Contratante)**: Quien contrata el servicio y deposita los fondos
- **Seller (Contratista)**: Quien proporciona el servicio
- **Administrator (Administrador)**: Quien gestiona el contrato y puede resolver disputas

### 🔄 Estados del Contrato

1. **AWAITING_PAYMENT**: Esperando que el buyer deposite fondos
2. **AWAITING_DELIVERY**: Fondos depositados, esperando entrega del servicio
3. **COMPLETE**: Contrato completado, fondos liberados
4. **DISPUTED**: En disputa, requiere intervención del administrador

### 📅 Gestión Temporal

El contrato incluye manejo de fechas:

- **Fecha de inicio**: Se establece automáticamente cuando se depositan los fondos
- **Fecha de finalización**: Se define al crear el contrato
- **Verificación de expiración**: Funciones para verificar si el contrato ha expirado

## 🚀 Instalación y Configuración

### Prerequisitos

- Node.js >= 22
- pnpm

### Paso 1: Instalar Dependencias

Las dependencias ya están incluidas en el `package.json`:

```bash
pnpm install
```

### Paso 2: Compilar el Contrato

```bash
pnpm run blockchain:compile
```

### Paso 3: Iniciar Red Local de Blockchain

En una terminal separada, ejecuta:

```bash
pnpm run blockchain:node
```

Esto iniciará una blockchain local en `http://127.0.0.1:8545` con 20 cuentas de prueba, cada una con 10,000 ETH.

### Paso 4: Desplegar el Contrato

En otra terminal:

```bash
pnpm run blockchain:deploy
```

## 📝 Scripts Disponibles

| Comando                              | Descripción                             |
| ------------------------------------ | --------------------------------------- |
| `pnpm run blockchain:node`           | Inicia la blockchain local de Hardhat   |
| `pnpm run blockchain:compile`        | Compila los contratos Solidity          |
| `pnpm run blockchain:deploy`         | Despliega el contrato en la red local   |
| `pnpm run blockchain:deploy:hardhat` | Despliega en la red temporal de Hardhat |
| `pnpm run blockchain:clean`          | Limpia archivos de compilación          |

## 🔧 Funciones del Contrato

### Para el Buyer (Contratante)

#### `deposit()`

- **Propósito**: Depositar fondos en el contrato
- **Requisitos**: Ser el buyer, contrato en estado AWAITING_PAYMENT
- **Efecto**: Cambia el estado a AWAITING_DELIVERY, establece fecha de inicio

```javascript
// Ejemplo de uso
await escrowContract.deposit({ value: ethers.parseEther(\"1.0\") });
```

#### `releaseFunds()`

- **Propósito**: Liberar fondos al seller voluntariamente
- **Requisitos**: Ser el buyer, contrato en estado AWAITING_DELIVERY
- **Efecto**: Transfiere fondos al seller, marca contrato como COMPLETE

```javascript
await escrowContract.releaseFunds();
```

### Para el Administrator

#### `refundToBuyer()`

- **Propósito**: Devolver fondos al buyer
- **Requisitos**: Ser el administrador, contrato en estado AWAITING_DELIVERY
- **Efecto**: Transfiere fondos al buyer, marca contrato como COMPLETE

#### `releaseToSeller()`

- **Propósito**: Liberar fondos al seller
- **Requisitos**: Ser el administrador, contrato en estado AWAITING_DELIVERY
- **Efecto**: Transfiere fondos al seller, marca contrato como COMPLETE

#### `setDisputed()`

- **Propósito**: Marcar el contrato como en disputa
- **Efecto**: Cambia el estado a DISPUTED

#### `resolveDispute(bool favorBuyer)`

- **Propósito**: Resolver una disputa
- **Parámetros**: `favorBuyer` - true para favorecer al buyer, false para el seller
- **Efecto**: Transfiere fondos según la decisión, marca como COMPLETE

### Funciones de Consulta

#### `getContractInfo()`

Retorna información completa del contrato:

- Direcciones de buyer, seller y administrator
- Monto del contrato y balance actual
- Fechas de inicio y finalización
- Descripción del contrato
- Estado actual
- Si el contrato está expirado

#### `getBalance()`

Retorna el balance actual del contrato.

#### `isContractExpired()`

Verifica si el contrato ha expirado.

#### `getRemainingTime()`

Retorna el tiempo restante hasta la fecha de finalización.

## 📊 Eventos del Contrato

El contrato emite eventos para tracking:

- `FundsDeposited`: Cuando se depositan fondos
- `FundsReleasedToSeller`: Cuando el buyer libera fondos
- `FundsRefundedToBuyer`: Cuando se reembolsa al buyer
- `FundsReleasedByAdmin`: Cuando el admin libera fondos
- `ContractStateChanged`: Cuando cambia el estado del contrato

## 🔍 Ejemplo de Uso Completo

### 1. Despliegue

```bash
pnpm run blockchain:node
pnpm run blockchain:deploy
```

### 2. Interacción Básica (JavaScript/ethers.js)

```javascript
const { ethers } = require('ethers');

// Conectar a la red local
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const signer = provider.getSigner(0); // Buyer
const contract = new ethers.Contract(contractAddress, abi, signer);

// 1. Depositar fondos
await contract.deposit({ value: ethers.parseEther('1.0') });

// 2. Verificar información
const info = await contract.getContractInfo();
console.log('Estado:', info[8]); // 1 = AWAITING_DELIVERY

// 3. Liberar fondos (buyer satisfecho)
await contract.releaseFunds();
```

### 3. Gestión por Administrator

```javascript
const adminSigner = provider.getSigner(0); // Administrator
const adminContract = contract.connect(adminSigner);

// Resolver disputa a favor del buyer
await adminContract.resolveDispute(true);

// O liberar fondos al seller
await adminContract.releaseToSeller();
```

## 🛡️ Consideraciones de Seguridad

1. **Control de Acceso**: Cada función tiene modificadores que verifican la identidad del llamador
2. **Estados**: El contrato valida el estado antes de ejecutar operaciones
3. **Fechas**: Se verifica la expiración del contrato cuando es necesario
4. **Fondos**: Se valida que haya fondos suficientes antes de las transferencias

## 🔗 Integración con Next.js

Para integrar este contrato con tu aplicación Next.js:

1. **Instalar ethers.js en el frontend**:

```bash
pnpm add ethers
```

2. **Crear un provider de Web3**:

```javascript
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
```

3. **Usar la dirección del contrato desplegado** (se muestra después del deployment)

4. **Importar el ABI del contrato** desde `blockchain/artifacts/contracts/Escrow.sol/Escrow.json`

## 📁 Estructura de archivos

```
/
├── blockchain/
│   ├── contracts/
│   │   └── Escrow.sol          # Contrato principal
│   ├── scripts/
│   │   └── deploy.js           # Script de deployment
│   ├── artifacts/              # Archivos compilados (generado)
│   ├── cache/                  # Cache de Hardhat (generado)
│   └── test/                   # Tests (vacío por ahora)
├── hardhat.config.js           # Configuración de Hardhat
└── README-BLOCKCHAIN.md        # Esta documentación
```

## 🎯 Próximos Pasos

1. **Conectar el frontend**: Integrar el contrato con la interfaz de usuario de Next.js
2. **Gestión de cuentas**: Implementar conexión con MetaMask u otros wallets
3. **Interfaz de usuario**: Crear componentes para interactuar con el contrato
4. **Notificaciones**: Implementar sistema de eventos en tiempo real
5. **Tests**: Agregar tests automatizados para el contrato

---

**¡El contrato está listo para usar!** 🎉

Para cualquier duda sobre la implementación o integración, consulta esta documentación o revisa el código del contrato en `blockchain/contracts/Escrow.sol`.
