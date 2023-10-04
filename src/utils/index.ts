import { ethers } from 'ethers'
import * as nerman from 'nerman';
import snapshot from '@snapshot-labs/snapshot.js';
import dotenv from 'dotenv'
dotenv.config();
const provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY)
const hub = 'https://hub.snapshot.org';
const client = new snapshot.Client712(hub);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);


export const addMissingSchemes = (descriptionText: string | undefined) => {
  const regex = /\[(.*?)\]\(((?!https?:\/\/|#)[^)]+)\)/g;
  const replacement = '[$1](https://$2)';

  return descriptionText?.replace(regex, replacement);
};

export const replaceInvalidDropboxImageLinks = (descriptionText: string | undefined) => {
  const regex = /(https:\/\/www.dropbox.com\/([^?]+))\?dl=1/g;
  const replacement = '$1?raw=1';

  return descriptionText?.replace(regex, replacement);
};

const hashRegex = /^\s*#{1,6}\s+([^\n]+)/;
const equalTitleRegex = /^\s*([^\n]+)\n(={3,25}|-{3,25})/;

/**
 * Extract a markdown title from a proposal body that uses the `# Title` format
 * Returns null if no title found.
 */
const extractHashTitle = (body: string) => body.match(hashRegex);
/**
 * Extract a markdown title from a proposal body that uses the `Title\n===` format.
 * Returns null if no title found.
 */
const extractEqualTitle = (body: string) => body.match(equalTitleRegex);

/**
 * Extract title from a proposal's body/description. Returns null if no title found in the first line.
 * @param body proposal body
 */
export const extractTitle = (body: string | undefined): string | null => {
  if (!body) return null;
  const hashResult = extractHashTitle(body);
  const equalResult = extractEqualTitle(body);
  return hashResult ? hashResult[1] : equalResult ? equalResult[1] : null;
};

const removeBold = (text: string | null): string | null =>
  text ? text.replace(/\*\*/g, '') : text;

const removeItalics = (text: string | null): string | null =>
  text ? text.replace(/__/g, '') : text;



export const createSnapshotProposal = async (id: number, description: string) => {
  try {
    const snapshot = (await provider.getBlock('finalized')).number
    const start = Math.floor(new Date().getTime() / 1000)
    const end = start + 4 * 24 * 60 * 60
    const title = removeBold(removeItalics(extractTitle(description))) || 'Untitled'
    await client.proposal(wallet, wallet.address, {
      space: 'sharkdao.eth',
      type: 'single-choice',
      title: `NounsDAO Prop ${id} - ${title}`,
      body: `https://nouns.wtf/vote/${id}`,
      choices: ['FOR', 'AGAINST', 'ABSTAIN', 'DON\'T VOTE', 'ABSTAIN from SharkDAO vote'],
      start,
      end,
      snapshot,
      discussion: 'https://discord.gg/TT6CYXd2yK',
      plugins: JSON.stringify({}),
      app: 'sharkdao-snapbot'

    });
  } catch (e) {
    console.log(e)
  }
}
