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

  const signer1 = new ethers.Wallet(process.env.PRIVATE_KEY_1, provider);
  const signer2 = new ethers.Wallet(process.env.PRIVATE_KEY_2, provider);

  const ballotFactory = new Ballot__factory(signer1);

  const ballotContract = ballotFactory.attach("0x6ce21d213795fc2d416704ee5a7cf03ffdf830b3");
  
  console.log(`Attach Ballot deployed to ${ballotContract.address}`);

  console.log(`Chairman is giving voting rights to ${signer2.address}`)
  
  const giveRightToVoteTx = await ballotContract.giveRightToVote(signer2.address);
  const giveRightToVoteReceipt = await giveRightToVoteTx.wait();

  console.log({ giveRightToVoteTx });
  console.log({ giveRightToVoteReceipt });

  console.log(`Chairman is giving voting rights to 0x9e716621ce66605f2f82f3c6896ad44d8232444a`)
  
  const giveRightToVoteTx2 = await ballotContract.giveRightToVote("0x9e716621ce66605f2f82f3c6896ad44d8232444a");
  const giveRightToVoteReceipt2 = await giveRightToVoteTx2.wait();

  console.log({ giveRightToVoteTx2 });
  console.log({ giveRightToVoteReceipt2 });

  const checkVoter1 = await ballotContract.voters(signer2.address);
  
  console.log({checkVoter1});

  const checkVoter2 = await ballotContract.voters("0x9e716621ce66605f2f82f3c6896ad44d8232444a");
  
  console.log({checkVoter2});

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
