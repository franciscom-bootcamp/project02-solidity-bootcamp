import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";

dotenv.config();

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  const provider = ethers.getDefaultProvider("goerli");

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY_1 ?? "", provider);

  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log({
    "Address1": signer.address,
    "balance": balance
  });

  const ballotFactory = new Ballot__factory(signer);
  
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  
  const ballotContract = await ballotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS)
    );
  
  await ballotContract.deployed();

  console.log(`Ballot deployed to ${ballotContract.address} on Goerli`);

  let voterStructForAccount1 = await ballotContract.voters(process.env.VOTER_ADDRESS ?? "");
  console.log({voterStructForAccount1});

  console.log("Giving right to vote to address");
  const giveRightToVoteTx = await ballotContract.giveRightToVote(process.env.VOTER_ADDRESS ?? "");
  const giveRightToVoteTxReceipt = await giveRightToVoteTx.wait()
  console.log({giveRightToVoteTxReceipt});

  voterStructForAccount1 = await ballotContract.voters(process.env.VOTER_ADDRESS ?? "");
  console.log({voterStructForAccount1});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
