import { getContract } from "./BallotDeploy";

async function delegate(contract: any) {
  console.log("Giving right to vote");
  const giveRightTOVoteTx = await contract.giveRightToVote(
    process.env.DELEGATE_ADDRESS
  );
  const giveRightToVoteTxReceipt = await giveRightTOVoteTx.wait();

  const voterStructForAccount1 = await contract.voters(
    process.env.DELEGATE_ADDRESS
  );
  console.log({ giveRightToVoteTxReceipt });
  console.log({ voterStructForAccount1 });
}

async function main() {
  const contract = await getContract();
  await delegate(contract);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
