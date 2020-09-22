require("dotenv").config();

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const auth = require("./middleware/auth");

const mongoose = require("mongoose");
mongoose.Promise = Promise;
const database = mongoose.connection;
let apiRoutes = require("./routes/api/v1/");

const {hashDigest, hashSaltDigest} = require("./utilities/hashing");

app.use(express.json());

// setting for local server connection from other port
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

app.use("/api/v1", apiRoutes);
const port = process.env.PORT;
server.listen(port, () => console.log(`listening on port ${port}`));

database.on("error", () => console.error("database connection error"));

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

module.exports = {server}
