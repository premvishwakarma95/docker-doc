const Task = require("../models/Task");
const { redisClient } = require("../config/redis");

const CACHE_KEY = "tasks:all";
const CACHE_TTL = 60;

const invalidateCache = async () => {
  try {
    if (redisClient.isOpen) {
      await redisClient.del(CACHE_KEY);
    }
  } catch (err) {
    console.error("Cache invalidation error:", err.message);
  }
};

exports.getTasks = async (req, res) => {
  try {
    if (redisClient.isOpen) {
      const cached = await redisClient.get(CACHE_KEY);
      if (cached) {
        return res.json({ source: "cache", data: JSON.parse(cached) });
      }
    }

    const tasks = await Task.find().sort({ createdAt: -1 });

    if (redisClient.isOpen) {
      await redisClient.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(tasks));
    }

    res.json({ source: "db", data: tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    const task = await Task.create({ title: title.trim() });
    await invalidateCache();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ error: "Task not found" });
    await invalidateCache();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    await invalidateCache();
    res.json({ message: "Task deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
