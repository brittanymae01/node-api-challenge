const express = require("express");

const actionRouter = require("./data/routes/actionModel-router");
const projectRouter = require("./data/routes/porjectModel-router");

const server = express();

server.use(express.json());

server.use("/api/projects", projectRouter);
server.use("/api/actions", actionRouter);

module.exports = server;
