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
  
  const giveRightToVoteTx = await ballotContract.giveRightToVote(accounts[1].address);
  const giveRightToVoteReceipt = await giveRightToVoteTx.wait();
  

  console.log(`Address1 (${accounts[1].address}) votes on Proposal 2`)
  const addressOneVotesonProposalTwoTx = await ballotContract
    .connect(accounts[1])
    .vote(1);
  
  const addressOneVotesonProposalTwoReceipt = await addressOneVotesonProposalTwoTx.wait();
  
  console.log({addressOneVotesonProposalTwoReceipt});

  const proposalTwoStruct = await ballotContract.proposals(1);
  
  console.log({proposalTwoStruct});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
