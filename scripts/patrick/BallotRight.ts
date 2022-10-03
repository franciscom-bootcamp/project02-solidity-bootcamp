import { getContract } from "./BallotDeploy";

async function giveRightToVote(contract: any) {
  console.log("Giving right to vote");
  const giveRightTOVoteTx = await contract.giveRightToVote(
    process.env.RIGHT_TO_VOTE_ADDRESS
  );
  const giveRightToVoteTxReceipt = await giveRightTOVoteTx.wait();

  const voterStructForAccount1 = await contract.voters(
    process.env.RIGHT_TO_VOTE_ADDRESS
  );
  console.log({ giveRightToVoteTxReceipt });
  console.log({ voterStructForAccount1 });
}

async function main() {
  const contract = await getContract();
  await giveRightToVote(contract);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
