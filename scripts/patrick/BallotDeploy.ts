import { ethers } from "ethers";
import { convertStringArrayToBytes32, getDefaultProposals } from "./_helper";
import { Ballot__factory } from "../../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

export async function getSigner() {
  const options = {
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: process.env.INFURA_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
  };
  const provider = ethers.getDefaultProvider("goerli", options);
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
  console.log(`Using address ${wallet.address}`);
  const signer = wallet.connect(provider);
  return signer;
}

export async function deploy() {
  const signer = await getSigner();
  const factory = new Ballot__factory(signer);
  const contract = await factory.deploy(
    convertStringArrayToBytes32(getDefaultProposals())
  );
  await contract.deployed();
  return contract;
}

export async function getContract() {
  const signer = await getSigner();
  const factory = new Ballot__factory(signer);
  const contract = await factory.attach(process.env.CONTRACT_ADDRESS ?? "");
  return contract;
}
