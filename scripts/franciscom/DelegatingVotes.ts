import { ethers } from "hardhat";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  const accounts = await ethers.getSigners();
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  const ballotFactory = await ethers.getContractFactory("Ballot");
  const ballotContract = await ballotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS)
    );
  
  await ballotContract.deployed();

  console.log(`Ballot deployed to ${ballotContract.address}`);

  console.log(`Chairman is giving voting rights to ${accounts[1].address}`)
  
  const giveOneRightToVoteTx = await ballotContract.giveRightToVote(accounts[1].address);
  const giveOneRightToVoteReceipt = await giveOneRightToVoteTx.wait();

  const giveTwoRightToVoteTx = await ballotContract.giveRightToVote(accounts[2].address);
  const giveTwoRightToVoteReceipt = await giveTwoRightToVoteTx.wait();
  
  console.log(`Address1 (${accounts[1].address}) delegates to Address2 (${accounts[2].address})`)
  const delegateOneToTwoTx = await ballotContract
    .connect(accounts[1])
    .delegate(accounts[2].address);
  
  const delegateOneToTwoReceipt = await delegateOneToTwoTx.wait();
  console.log({delegateOneToTwoReceipt});
  
  console.log(`Address2 (${accounts[2].address}) votes on Proposal 2`)
  
  const addressTwoVotesonProposalTwoTx = await ballotContract
    .connect(accounts[2])
    .vote(1);
  
  const addressTwoVotesonProposalTwoReceipt = await addressTwoVotesonProposalTwoTx.wait();
  
  console.log({addressTwoVotesonProposalTwoReceipt});

  const proposalTwoStruct = await ballotContract.proposals(1);
  
  console.log({proposalTwoStruct});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
