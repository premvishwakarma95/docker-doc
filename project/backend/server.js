require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const taskRoutes = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/tasks", taskRoutes);

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

const start = async () => {
  await connectDB();
  console.log('DB connected successfully');
  try {
    await connectRedis();
    console.log('Redis connected successfully');
  } catch (err) {
    console.error("Redis failed to connect at startup:", err.message);
  }
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
