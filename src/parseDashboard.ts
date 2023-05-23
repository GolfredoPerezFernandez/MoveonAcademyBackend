//@ts-nocheck
import ParseDashboard from "parse-dashboard";
import config from "./config";

export const parseDashboard = new ParseDashboard(
  {
    apps: [
      {
        appName: "Moralis Server",
        serverURL: config.SERVER_URL,
        appId: config.APPLICATION_ID,
        masterKey: config.MASTER_KEY,
      },
    ],
    users: [
      {
        user: "ninfa",
        pass: "123456",
      },
      {
        user: "zuccadev",
        pass: "Dazu.0429",
      },
      {
        user: "TheDario",
        pass: "Fran190299",
      }
    ],
  },
  { allowInsecureHTTP: true }
);