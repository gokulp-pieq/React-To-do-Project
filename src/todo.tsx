import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

type Task = {
  id: string;
  title: string;
  description: string;
  checked: boolean;
};

type TodoProps = {
  user: string;
  onLogout: () => void;
};

function Todo({ user, onLogout }: TodoProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`tasks_${user}`) || "[]") as Task[];
    setTasks(saved);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`tasks_${user}`, JSON.stringify(tasks));
  }, [tasks, user]);

  const openAddModal = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, title, description } : t));
    } else {
      setTasks([...tasks, { id: uuidv4(), title, description, checked: false }]);
    }

    setIsModalOpen(false);
    setTitle("");
    setDescription("");
    setEditingTask(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
    setEditingTask(null);
  };

  const confirmDeleteTask = (id: string) => {
    setDeleteTaskId(id);
  };

  const handleDelete = () => {
    if (deleteTaskId) {
      setTasks(tasks.filter(t => t.id !== deleteTaskId));
      setDeleteTaskId(null);
    }
  };

  const cancelDelete = () => setDeleteTaskId(null);

  const toggleCheck = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const pendingTasks = tasks.filter(t => !t.checked);
  const completedTasks = tasks.filter(t => t.checked);

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>My ToDo List</h2>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      <button className="primary-btn" onClick={openAddModal}>Add New Task</button>

      {/* Pending Tasks */}
      <h3>Pending Tasks</h3>
      <ul className="todo-list">
        {pendingTasks.map(task => (
          <li key={task.id}>
            <input type="checkbox" className="custom-checkbox" checked={task.checked} onChange={() => toggleCheck(task.id)} />
            <div className="task-info">
              <strong>{task.title}</strong>
              <p>{task.description}</p>
            </div>
            <div className="task-actions">
              <button onClick={() => openEditModal(task)}>Edit</button>
              <button className="danger-btn" onClick={() => confirmDeleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <>
          <h3>Completed Tasks</h3>
          <ul className="todo-list">
            {completedTasks.map(task => (
              <li key={task.id} className="checked">
                <input type="checkbox" className="custom-checkbox" checked={task.checked} onChange={() => toggleCheck(task.id)} />
                <div className="task-info">
                  <strong>{task.title}</strong>
                  <p>{task.description}</p>
                </div>
                <div className="task-actions">
                  <button onClick={() => openEditModal(task)}>Edit</button>
                  <button className="danger-btn" onClick={() => confirmDeleteTask(task.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingTask ? "Update Task" : "Add New Task"}</h3>
            <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Task Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="modal-buttons">
              <button className="primary-btn" onClick={handleSubmit}>{editingTask ? "Update" : "Add"}</button>
              <button className="secondary-btn" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTaskId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this task?</p>
            <div className="modal-buttons">
              <button className="danger-btn" onClick={handleDelete}>Delete</button>
              <button className="secondary-btn" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Todo;
