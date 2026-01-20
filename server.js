require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const todoRoutes = require("./routes/todo.routes");

const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
