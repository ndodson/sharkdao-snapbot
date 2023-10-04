import express from 'express';
import * as nerman from 'nerman';
import { createSnapshotProposal } from './utils/index.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.port;
const Nouns = new nerman.Nouns(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`);
app.get('/', async (req, res) => {
    res.send('sharkdao-snapbot (:');
});
Nouns.on("ProposalCreated", async (data) => {
    const { id, description } = data;
    await createSnapshotProposal(id, description);
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
