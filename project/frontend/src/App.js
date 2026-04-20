import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data.data || []);
      setSource(res.data.source || "");
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await axios.post(`${API_URL}/tasks`, { title });
      setTitle("");
      fetchTasks();
    } catch (err) {
      setError("Failed to add task");
    }
  };

  const toggleTask = async (task) => {
    try {
      await axios.put(`${API_URL}/tasks/${task._id}`, {
        completed: !task.completed,
      });
      fetchTasks();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <p className="source">
        {source && `Data source: ${source}`}
      </p>

      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a new task..."
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className={task.completed ? "done" : ""}>
            <span onClick={() => toggleTask(task)}>{task.title}</span>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
        {!loading && tasks.length === 0 && <p>No tasks yet.</p>}
      </ul>
    </div>
  );
}

export default App;
