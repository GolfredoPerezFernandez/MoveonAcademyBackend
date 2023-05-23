/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Moralis from 'moralis';
import express from 'express';
import cors from 'cors';
import config from './config';
import { parseServer } from './parseServer';
// @ts-ignore
import ParseServer from 'parse-server';
import http from 'http';
import { streamsSync } from '@moralisweb3/parse-server';
// @ts-ignore
import { Types } from '@moralisweb3/streams';

import { parseDashboard } from "./parseDashboard";
// @ts-ignore
import { BigNumber } from '@moralisweb3/core';
// @ts-ignore
import { EvmChain } from "@moralisweb3/evm-utils";
import { marketAbi } from './abi';
// @ts-ignore
import { verifySignatures } from './utils/verifySignature'
// @ts-ignore
import { contracts, chainID } from './config/moralis-connect'
import { json } from 'envalid';
const Web3 = require('web3');
const secretKey = "all3RzGKuVBfOjmsNNW1w4NEmSALcqdKeYG4K6SXlGQZPp4nPpsenLEVdahKBrZQ";
export const app = express();
let url = '';
const address = contracts.auction;
const port = config.PORT;

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

const verifySignature = (req: any, secret: string) => {

  const providedSignature = req.headers["x-signature"]
  if(!providedSignature) {throw new Error("Signature not provided")}
  const generatedSignature= Web3.utils.sha3(JSON.stringify(req.body)+secret)
  if(generatedSignature !== providedSignature) {throw new Error("Invalid Signature")}

}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(
  streamsSync(parseServer, {
    apiKey: config.MORALIS_API_KEY,
    webhookUrl: config.STREAMS_WEBHOOK_URL
    }
  ),
);

app.use(`/server`, parseServer.app);
app.use(`/dashboard`, parseDashboard);


app.post(`/streams`, async (req: any, res: any) => {

  verifySignature(req, secretKey)
  
  console.log('reqBody', req.body )
  return res.status(200).json();


})


const httpServer = http.createServer(app);
httpServer.listen(port, async () => {
  if (config.USE_STREAMS) {
    // eslint-disable-next-line no-console
    console.log(
      `Moralis Server is running on port ${port} and stream webhook url ${config.STREAMS_WEBHOOK_URL}`,
    );
  } else {
    // eslint-disable-next-line no-console
    console.log(`Moralis Server is running on port ${port}.`);
  }
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);