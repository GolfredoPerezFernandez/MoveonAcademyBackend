/* eslint-disable etc/no-commented-out-code */
import { ethers } from "ethers";

export function decodeWithEthers(abi, data, topics) {
  try {
      const iface = new ethers.utils.Interface(abi);
      const { args } = iface.parseLog({ data, topics});
      const event = iface.getEvent(topics[0]);
      const decoded = {};
      event.inputs.forEach((input, index) => {   
          if (input.type === "uint256") {
          /*decoded[`${input.name}_decimal`] = {
              __type: "NumberDecimal",
              value: parseInt(ethers.BigNumber.from(args[index]._hex).toString())
          };*/
          decoded[input.name] = ethers.BigNumber.from(args[index]._hex).toString();
          return;
          }
          if(input.type === "bytes") {
          decoded[input.name] = args[index].hash                        
          return;
          }
          if(input.type === "address") {
          decoded[input.name] = args[index].toLowerCase()
          return;
          }
          decoded[input.name] = args[index];
      });
      return decoded;
  } catch (error) {
      return {};
  }
}