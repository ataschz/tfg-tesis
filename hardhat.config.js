require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: {
		version: '0.8.24',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	networks: {
		hardhat: {
			chainId: 1337,
			accounts: {
				count: 10,
				accountsBalance: '10000000000000000000000', // 10,000 ETH in wei
			},
			mining: {
				auto: true,
				interval: 0
			}
		},
		localhost: {
			url: 'http://127.0.0.1:8545',
			chainId: 1337,
		},
	},
	paths: {
		sources: './blockchain/contracts',
		tests: './blockchain/test',
		cache: './blockchain/cache',
		artifacts: './blockchain/artifacts',
	},
};