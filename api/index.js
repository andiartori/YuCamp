const app = require("../app");
const serverless = require("@vercel/node");

module.exports = serverless(app);
