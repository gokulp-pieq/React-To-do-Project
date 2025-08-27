import { useState, useEffect } from "react";

type Task = {
  id: number;
  text: string;
  checked: boolean;
};

type TodoProps = {
  user: string;
  onLogout: () => void;
};

function Todo({ user, onLogout }: TodoProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`tasks_${user}`) || "[]") as Task[];
    setTasks(saved);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`tasks_${user}`, JSON.stringify(tasks));
  }, [tasks, user]);

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { text: input, id: Date.now(), checked: false }]);
      setInput("");
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = (id: number) => {
    const newText = prompt("Update task:");
    if (newText) {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, text: newText } : task
        )
      );
    }
  };

  const toggleCheck = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task
      )
    );
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>{user}'s ToDo List</h2>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

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
          <li key={task.id} className={task.checked ? "checked" : ""}>
            <input
              type="checkbox"
              checked={task.checked}
              onChange={() => toggleCheck(task.id)}
            />
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
