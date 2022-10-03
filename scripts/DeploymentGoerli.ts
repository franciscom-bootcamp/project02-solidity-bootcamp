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
  console.log({voterStructForAccount1}); // => weight: 1

  console.log("Delegate Account 0 (Chair) vote to Voter")
  const delegateVoteTx = await ballotContract.delegate(process.env.VOTER_ADDRESS ?? "");
  const delegateVoteTxReceipt = await delegateVoteTx.wait();
  console.log({delegateVoteTxReceipt});

  let voterStructForChair = await ballotContract.voters(process.env.CHAIR_ADDRESS ?? "");
  console.log({voterStructForChair}); // => show delegate to Voter addreess

  console.log("Cast vote to proposal 0 using Voter account including delegated votes");

  const voter = new ethers.Wallet(process.env.PRIVATE_KEY_VOTER || "", provider);

  const castVoteTx = await ballotContract
    .connect(voter)
    .vote(0);

  const castVoteTxReceipt = await castVoteTx.wait();
  console.log({castVoteTxReceipt});
  
  voterStructForAccount1 = await ballotContract.voters(process.env.VOTER_ADDRESS ?? "");
  console.log({voterStructForAccount1}); // => voted: true
  voterStructForChair = await ballotContract.voters(process.env.CHAIR_ADDRESS ?? "");
  console.log({voterStructForChair}); // => voted: true
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
