import { useState, useEffect } from "react";

type Task = {
  id: string;
  title: string;
  description: string;
  status: boolean;
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

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://localhost:8085/tasks/employee/${user}`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      alert("Could not load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

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

  const handleSubmit = async () => {
    if (!title.trim()) return;

    try {
      if (editingTask) {
        // Update task
        const res = await fetch(`http://localhost:8085/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, status: editingTask.status }),
        });
        if (!res.ok) throw new Error("Failed to update task");
      } else {
        // Create task
        const res = await fetch(`http://localhost:8085/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emp_id:user, title, description, status: false }),
        });
        if (!res.ok) throw new Error("Failed to create task");
      }

      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setEditingTask(null);
      fetchTasks(); // Refresh tasks from backend
    } catch (err) {
      console.error(err);
      alert("Error saving task");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
    setEditingTask(null);
  };

  const confirmDeleteTask = (id: string) => setDeleteTaskId(id);

  const handleDelete = async () => {
    if (!deleteTaskId) return;

    try {
      const res = await fetch(`http://localhost:8085/tasks/${deleteTaskId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete task");
      setDeleteTaskId(null);
      fetchTasks(); // Refresh tasks
    } catch (err) {
      console.error(err);
      alert("Error deleting task");
    }
  };

  const cancelDelete = () => setDeleteTaskId(null);

  const toggleCheck = async (task: Task) => {
    try {
      const res = await fetch(`http://localhost:8085/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: task.title, description: task.description, status: !task.status }),
      });
      if (!res.ok) throw new Error("Failed to update task status");
      fetchTasks(); // Refresh tasks
    } catch (err) {
      console.error(err);
      alert("Error updating task status");
    }
  };

  const pendingTasks = tasks.filter(t => !t.status);
  const completedTasks = tasks.filter(t => t.status);

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>My ToDo List</h2>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      <button className="primary-btn" onClick={openAddModal}>Add New Task</button>

      <h3>Pending Tasks</h3>
      <ul className="todo-list">
        {pendingTasks.map(task => (
          <li key={task.id}>
            <input type="checkbox" checked={task.status} onChange={() => toggleCheck(task)} />
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

      {completedTasks.length > 0 && (
        <>
          <h3>Completed Tasks</h3>
          <ul className="todo-list">
            {completedTasks.map(task => (
              <li key={task.id} className="checked">
                <input type="checkbox" checked={task.status} onChange={() => toggleCheck(task)} />
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
