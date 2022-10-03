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
  
  for(let i=1; i <= 5; i++) {
    console.log(`Chairman is giving voting rights to: ${accounts[i].address}`);
    const giveRightToVoteTx = await ballotContract.giveRightToVote(accounts[i].address);
    const giveRightToVoteReceipt = await giveRightToVoteTx.wait();  
  }
  
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

  const proposalTwoStruct = await ballotContract.proposals(1);

  for(let i=3; i<=5; i++){
    console.log(`Address (${accounts[i].address}) votes on Proposal 3`);
  
    const addressVotesonProposalThreeTx = await ballotContract
      .connect(accounts[i])
      .vote(2);
  
    const addressVotesonProposalThreeReceipt = await addressVotesonProposalThreeTx.wait();
  }

  for(let i = 0; i < PROPOSALS.length; i++) {
    const proposalStruct = await ballotContract.proposals(i);
    console.log({proposalStruct});
  }

  console.log("Votes have been sorted, and the winner is...");
  const bWinnerProposalName = await ballotContract.winnerName();
  const winnerProposalName = ethers.utils.parseBytes32String(bWinnerProposalName);
  const winnerProposalId = await ballotContract.winningProposal();
  const proposalStruct = await ballotContract.proposals(winnerProposalId);
  console.log({winnerProposalName, proposalStruct});

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
