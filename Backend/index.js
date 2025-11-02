const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/dbConnect");

dotenv.config();

const PORT = process.env.PORT;
const app = express();

// Database Connection
connectDb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
