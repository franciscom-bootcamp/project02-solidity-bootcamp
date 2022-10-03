import { getContract } from "./BallotDeploy";

async function castVote(contract: any) {
  console.log("Casting a vote for proposal 0");
  const castVoteTx = await contract
    .connect(process.env.ACCOUNT_ADDRESS ?? "")
    .vote(0);
  const castVoteTxReceipt = await castVoteTx.wait();
  console.log({ castVoteTxReceipt });
}

async function main() {
  const contract = await getContract();
  await castVote(contract);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
