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
import ngrok from 'ngrok';
import { streamsSync } from '@moralisweb3/parse-server';
import { parseDashboard } from "./parseDashboard";
// @ts-ignore
import { EvmChain } from "@moralisweb3/evm-utils";
import { marketAbi } from './abi';
// @ts-ignore
import { verifySignature } from './utils/verifySignature'
// @ts-ignore
import { parseUpdate } from './utils/parseUpdate'
import { contracts, chainID } from './config/moralis-connect'

let Transfer = require("./utils/TransferSchema").Transfers;
const connectDB  = require("./utils/ConectToDB").ConectToDB;

export const app = express();
let url = '';
const address = contracts.auction;

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(
  streamsSync(parseServer, {
    apiKey: config.MORALIS_API_KEY,
    webhookUrl: config.STREAMS_WEBHOOK_URL
}),
);

app.use(`/server`, parseServer.app);
app.use(`/dashboard`, parseDashboard);


app.post("/streams-webhook", async (req, res) => {

  const { headers, body, tag  }: any = req;
  const webhook: any = req.body;

  console.log("body", body)
  console.log("headers", headers)
  console.log("tag", tag)
  console.log("req", req)
  console.log("res", res)

  if (body.confirmed) {
    return res.status(200).json();
  }

  await connectDB();

  let newTranfers = []; 

  for (Transfer of body.erc20Transfers){
     newTranfers.push({
      fromAddress: Transfer.from,
      toAddress: Transfer.to,
      value: Transfer.value,
      valueWithDecimals: Transfer.valueWithDecimals,
     })
  }

  if(newTranfers.length > 0 ){
    await Transfer.insertMany(newTranfers)
    console.log("added New Transfers To DB")
  }
  interface MyEvent {
    nftContractAddress: string;
    tokenId: number;
    nftSeller: string;
  }

  console.log('MyEvent', req.body);


  res.send('ok');
  

  return res.status(400).json({ error: "No body provided" });
  
})

app.get("/AuctionCreated", async (req: any, res: any) => {

  try {
    console.log("STREAMS_WEBHOOK_URL", `${url}${config.STREAMS_WEBHOOK_URL}`);
    const webHookUrl = `${url}${config.STREAMS_WEBHOOK_URL}`;
    const chaindIdFinal = chainID.testNet;

    const stream = await Moralis.Streams.add({
      chains: [EvmChain.MUMBAI],
      description: 'AuctionsCreated721',
      tag: 'AuctionsCreated',
      abi: marketAbi,
      includeContractLogs: true,
      topic0: [
        'AuctionCreated(address,uint256,uint8,uint256,uint256,uint256,address)'
      ],
      webhookUrl: webHookUrl,
      });

    const { id } = stream.toJSON();

    await Moralis.Streams.addAddress({
      address,
      id
    });

  } catch (e) {
    console.log("Not Moralis", e);
  }
  return res.send('ok');

})

const httpServer = http.createServer(app);
httpServer.listen(config.PORT, async () => {
  if (config.USE_STREAMS) {
     url = await ngrok.connect(config.PORT);
    // eslint-disable-next-line no-console
    console.log(
      `Moralis Server is running on port ${config.PORT} and stream webhook url ${url}${config.STREAMS_WEBHOOK_URL}`,
    );
  } else {
    // eslint-disable-next-line no-console
    console.log(`Moralis Server is running on port ${config.PORT}.`);
  }
});
// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
