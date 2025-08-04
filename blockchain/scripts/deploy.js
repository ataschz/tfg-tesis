const { ethers } = require('hardhat');

async function main() {
	console.log('🚀 Iniciando deployment del contrato Escrow...\n');

	// Obtener las cuentas disponibles
	const [deployer, buyer, seller] = await ethers.getSigners();

	console.log('📋 Información de deployment:');
	console.log('Deployer (Administrator):', deployer.address);
	console.log('Buyer (ejemplo):', buyer.address);
	console.log('Seller (ejemplo):', seller.address);
	console.log('Balance del deployer:', ethers.formatEther(await deployer.provider.getBalance(deployer.address)), 'ETH\n');

	// Parámetros del contrato
	const buyerAddress = buyer.address;
	const sellerAddress = seller.address;
	const endDate = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 días desde ahora
	const description = 'Contrato de desarrollo web - Aplicación Next.js con integración blockchain';

	console.log('🔧 Parámetros del contrato:');
	console.log('Buyer:', buyerAddress);
	console.log('Seller:', sellerAddress);
	console.log('Fecha de finalización:', new Date(endDate * 1000).toLocaleString());
	console.log('Descripción:', description);
	console.log('');

	// Deploy del contrato
	console.log('⏳ Desplegando contrato Escrow...');
	const Escrow = await ethers.getContractFactory('Escrow');
	const escrow = await Escrow.deploy(buyerAddress, sellerAddress, endDate, description);

	await escrow.waitForDeployment();
	const contractAddress = await escrow.getAddress();

	console.log('✅ Contrato Escrow desplegado exitosamente!');
	console.log('📍 Dirección del contrato:', contractAddress);
	console.log('🔗 Network:', (await ethers.provider.getNetwork()).name);
	console.log('⛽ Gas usado en deployment:', (await escrow.deploymentTransaction().wait()).gasUsed.toString());

	// Verificar información del contrato
	console.log('\n🔍 Verificando información del contrato...');
	const contractInfo = await escrow.getContractInfo();
	
	console.log('Información del contrato desplegado:');
	console.log('- Buyer:', contractInfo[0]);
	console.log('- Seller:', contractInfo[1]);
	console.log('- Administrator:', contractInfo[2]);
	console.log('- Monto del contrato:', ethers.formatEther(contractInfo[3]), 'ETH');
	console.log('- Balance actual:', ethers.formatEther(contractInfo[4]), 'ETH');
	console.log('- Fecha de inicio:', contractInfo[5].toString() === '0' ? 'No iniciado' : new Date(Number(contractInfo[5]) * 1000).toLocaleString());
	console.log('- Fecha de finalización:', new Date(Number(contractInfo[6]) * 1000).toLocaleString());
	console.log('- Descripción:', contractInfo[7]);
	console.log('- Estado actual:', getStateName(contractInfo[8]));
	console.log('- ¿Expirado?:', contractInfo[9] ? 'Sí' : 'No');

	console.log('\n📝 Información para el frontend:');
	console.log('CONTRACT_ADDRESS=' + contractAddress);
	console.log('BUYER_ADDRESS=' + buyerAddress);
	console.log('SELLER_ADDRESS=' + sellerAddress);
	console.log('ADMINISTRATOR_ADDRESS=' + deployer.address);

	console.log('\n🎉 ¡Deployment completado! El contrato está listo para usar.');
	console.log('\n💡 Próximos pasos:');
	console.log('1. Copiar la dirección del contrato para usar en el frontend');
	console.log('2. El buyer puede depositar fondos usando la función deposit()');
	console.log('3. El buyer puede liberar fondos con releaseFunds()');
	console.log('4. El administrador puede gestionar disputas con refundToBuyer() o releaseToSeller()');
}

function getStateName(stateNumber) {
	const states = ['AWAITING_PAYMENT', 'AWAITING_DELIVERY', 'COMPLETE', 'DISPUTED'];
	return states[stateNumber] || 'UNKNOWN';
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('❌ Error durante el deployment:', error);
		process.exit(1);
	});