// imports
import { ethers, run, network } from "hardhat";
import "dotenv/config"

// async main
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    );

    console.log("Deploying contract...");
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();


    // what's the private key?
    // what's the rpc url?
    console.log(`Deployed contract to: ${simpleStorage.address}`);
    // what happens when we deploy to our hardhat network?
    console.log(network.config);
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        // Wait six blocks for verify the contract
        console.log("Waiting for block confirmations...")
        await simpleStorage.deployTransaction.wait(6);
        await verify(simpleStorage.address, []);
    }

    const currentValue = await simpleStorage.retrieve();
    console.log(`Current Value is: ${currentValue}`);

    const transactionResponse = await simpleStorage.store(7);
    await transactionResponse.wait(1);
    const updatedValue = await simpleStorage.retrieve();
    console.log(`Updated Value is: ${updatedValue}`);
}

async function verify(contractAddress: string, args: any[]) {
    console.log("Verifying contract...");

    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e: any) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verifed!");
        } else {
            console.log(e);
        }
    }
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
