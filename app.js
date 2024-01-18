require("dotenv").config();
const cors = require("cors");

const express = require("express");
const app = express();
const { connectDb } = require("./utils/connectDb");

app.use(cors());
app.use(express.json());
app.use("/api/", require("./routes"));

const port = process.env.PORT || 3000;

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
});
