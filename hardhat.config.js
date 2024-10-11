require('dotenv').config();
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');

const { PRIVATE_KEY } = process.env;

module.exports = {
    solidity: "0.8.20",
    networks: {
        hardhat: {
            chainId: 1337
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            accounts: [PRIVATE_KEY]
        }
    }
};
