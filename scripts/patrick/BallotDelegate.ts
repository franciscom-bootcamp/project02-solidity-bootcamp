import { getContract } from "./BallotDeploy";

async function delegate(contract: any) {
  console.log("Delegate vote");
  const delegateTx = await contract.delegate(process.env.DELEGATE_ADDRESS);
  const delegateTxReceipt = await delegateTx.wait();

  const delegatedVoter = await contract.voters(process.env.DELEGATE_ADDRESS);
  console.log({ delegateTxReceipt });
  console.log({ delegatedVoter });
}

async function main() {
  const contract = await getContract();
  await delegate(contract);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
