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
  //DEPLOYMENT
  const accounts = await ethers.getSigners();
  const ballotFactory = await ethers.getContractFactory("Ballot");
  const ballotContract = await ballotFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS)
  );
  await ballotContract.deployed();
  console.log(
    `BALLOT CONTRACT WAS DEPLOYED TO ADDRESS ${ballotContract.address}`
  );

  //VIEW PROPOSALS
  for (let i = 0; i < PROPOSALS.length; i++) {
    const proposal = await ballotContract.proposals(i);
    const name = ethers.utils.parseBytes32String(proposal.name);
    console.log(i, name, proposal);
  }

  //VIEW CHAIRPERSON
  const chairperson = await ballotContract.chairperson();
  console.log({ chairperson });

  //VIEW DEFAULT STRUCT
  let voterStructForAccount1 = await ballotContract.voters(accounts[1].address);
  console.log({ voterStructForAccount1 });

  //GIVE RIGHT TO VOTE
  console.log("Giving right to vote");
  const giveRightTOVoteTx = await ballotContract.giveRightToVote(
    accounts[1].address
  );
  const giveRightToVoteTxReceipt = await giveRightTOVoteTx.wait();
  console.log({ giveRightToVoteTxReceipt });

  //VIEW VOTER AFTER RIGHT TO VOTE HAS BEEN GIVEN
  voterStructForAccount1 = await ballotContract.voters(accounts[1].address);
  console.log({ voterStructForAccount1 });

  //CAST VOTE
  console.log("Casting a vote for proposal 0 using account 1");
  const castVoteTx = await ballotContract.connect(accounts[1]).vote(0);
  const castVoteTxReceipt = await castVoteTx.wait();
  console.log({ castVoteTxReceipt });

  //VIEW PROPOSAL 0
  let proposal0 = await ballotContract.proposals(0);
  let name = ethers.utils.parseBytes32String(proposal0.name);
  console.log("PROPOSAL 0", 0, name, proposal0);

  //VIEW VOTER AFTER RIGHT TO VOTE HAS BEEN GIVEN AND VOTE HAS BEEN CASTED
  voterStructForAccount1 = await ballotContract.voters(accounts[1].address);
  console.log({ voterStructForAccount1 });

  //DELEGATE VOTE TO SOMEONE ELSE
  console.log("Delegate vote to another address");
  const delegateTx = await ballotContract
    .connect(accounts[0])
    .delegate(accounts[1].address);
  const delegateTxReceipt = await delegateTx.wait();
  console.log({ delegateTxReceipt });

  //PROPOSAL VIEW AFTER DELEGATION
  proposal0 = await ballotContract.proposals(0);
  name = ethers.utils.parseBytes32String(proposal0.name);
  console.log("PROPOSAL 0", 0, name, proposal0);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
