import { useState, useEffect } from "react";

function Todo({ user }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // Load tasks from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`tasks_${user}`)) || [];
    setTasks(saved);
  }, [user]);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(`tasks_${user}`, JSON.stringify(tasks));
  }, [tasks, user]);

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { text: input, id: Date.now() }]);
      setInput("");
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = (id) => {
    const newText = prompt("Update task:");
    if (newText) {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, text: newText } : task
        )
      );
    }
  };

  return (
    <div className="todo-container">
      <h2>{user}'s ToDo List</h2>
      <div className="todo-input">
        <input
          type="text"
          placeholder="Enter a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul className="todo-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.text}</span>
            <div>
              <button onClick={() => updateTask(task.id)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
