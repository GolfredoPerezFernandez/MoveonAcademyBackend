/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const Web3 = require('web3');
const web3 =  new Web3()

export const verifySignature = (req, secret) => {
  console.log('reqSignature', req)
  try{
    const ProvidedSignature = req.headers["x-signature"]
    if(!ProvidedSignature) { throw new Error("Signature not provided") }
      const GeneratedSignature= web3.utils.sha3(JSON.stringify(req.body)+secret)
    if(GeneratedSignature !== ProvidedSignature) { 
      throw new Error("Invalid Signature")
    }
  }catch(e){
    console.log(e);
  }
};