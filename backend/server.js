const express = require("express");
require("./database/db");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("StudentHelper API works!");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});