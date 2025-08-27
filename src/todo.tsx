import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

type Task = {
  id: string;
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
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`tasks_${user}`) || "[]") as Task[];
    setTasks(saved);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`tasks_${user}`, JSON.stringify(tasks));
  }, [tasks, user]);

  const addOrUpdateTask = () => {
    if (!input.trim()) return;

    if (editingId) {
      // Update mode
      setTasks(tasks.map((task) =>
        task.id === editingId ? { ...task, text: input } : task
      ));
      setEditingId(null);
    } else {
      // Add mode
      setTasks([...tasks, { text: input, id: uuidv4(), checked: false }]);
    }
    setInput("");
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setInput("");
    }
  };

  const startEditTask = (id: string, text: string) => {
    setEditingId(id);
    setInput(text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setInput("");
  };

  const toggleCheck = (id: string) => {
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
          placeholder={editingId ? "Update task..." : "Enter a task..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addOrUpdateTask}>
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button onClick={cancelEdit} style={{ backgroundColor: "#999" }}>
            Cancel
          </button>
        )}
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
              <button onClick={() => startEditTask(task.id, task.text)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
