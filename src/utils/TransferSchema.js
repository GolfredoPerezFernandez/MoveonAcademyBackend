/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
const mongoose = require("mongoose")

const transferSchema = new mongoose.Schema(
  {
    fromAddress: {
      type: String
    },
    toAddress: {
      type: String
    },
    value: {
      type: String
    },
    valueWithDecimals: {
      type: String
    }
  },
  { timestamps: true }
);

const Transfers = mongoose.models.transfers || mongoose.model("transfers", transferSchema);

module.exports = { Transfers }