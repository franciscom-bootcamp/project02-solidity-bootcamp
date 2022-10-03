import { ethers } from "ethers";
import { getContract } from "./BallotDeploy";
import { getDefaultProposals } from "./_helper";

async function getProposals(contract: any) {
  for (let i = 0; i < getDefaultProposals().length; i++) {
    const proposal = await contract.proposals(i);
    const name = ethers.utils.parseBytes32String(proposal.name);
    console.log({ i, name, proposal });
  }
}

async function getChair(contract: any) {
  const chairperson = await contract.chairperson();
  console.log({ chairperson });
}

async function main() {
  const contract = await getContract();
  await getProposals(contract);
  await getChair(contract);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
