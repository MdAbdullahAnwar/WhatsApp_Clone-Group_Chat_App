const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/dbConnect");
const bodyParser = require("body-parser");
const authRoute = require("./routes/authRoute");
const chatRoute = require("./routes/chatRoute");

dotenv.config();

const PORT = process.env.PORT;
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
connectDb();

// Routes
app.use('/api/auth', authRoute);
app.use('/api/chat', chatRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
