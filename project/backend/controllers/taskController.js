const Task = require("../models/Task");
const { redisClient } = require("../config/redis");

const CACHE_KEY = "tasks:all";
const CACHE_TTL = 60; // seconds

/**
 * Remove cached task list
 */
const invalidateCache = async () => {
  try {
    if (redisClient?.isOpen) {
      await redisClient.del(CACHE_KEY);
    }
  } catch (error) {
    console.error("Redis cache invalidation failed:", error.message);
  }
};

/**
 * Get all tasks
 * Uses Redis caching to reduce database load
 */
exports.getTasks = async (req, res) => {
  try {
    // Check cache first
    if (redisClient?.isOpen) {
      const cachedTasks = await redisClient.get(CACHE_KEY);

      if (cachedTasks) {
        return res.status(200).json({
          success: true,
          source: "cache",
          data: JSON.parse(cachedTasks),
        });
      }
    }

    // Fetch from database
    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .lean();

    // Store in cache
    if (redisClient?.isOpen) {
      await redisClient.setEx(
        CACHE_KEY,
        CACHE_TTL,
        JSON.stringify(tasks)
      );
    }

    return res.status(200).json({
      success: true,
      source: "database",
      data: tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

/**
 * Create new task
 */
exports.createTask = async (req, res) => {
  try {
    const title = req.body?.title?.trim();

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const task = await Task.create({ title });

    // Clear outdated cache
    await invalidateCache();

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

/**
 * Update task
 */
exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Clear outdated cache
    await invalidateCache();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

/**
 * Delete task
 */
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Clear outdated cache
    await invalidateCache();

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: {
        id: req.params.id,
      },
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};
