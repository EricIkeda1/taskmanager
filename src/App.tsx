import React, { useState, useRef } from "react";
import "./index.css";

type Task = {
  id: string;
  content: string;
  status: string;
};

const initialTasks: Task[] = [
  { id: "1", content: "Tarefa 1", status: "todo" },
  { id: "2", content: "Tarefa 2", status: "todo" },
  { id: "3", content: "Tarefa 3", status: "in-progress" },
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<string>("");  
  const [taskToEdit, setTaskToEdit] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text", id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text");
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObj: Task = {
        id: (tasks.length + 1).toString(),
        content: newTask,
        status: "todo",
      };
      setTasks(prevTasks => [...prevTasks, newTaskObj]);
      setNewTask("");
    }
  };

  const handleMenuClick = (id: string) => {
    setShowMenu(showMenu === id ? null : id);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    setShowMenu(null);
  };

  const handleEditTask = (id: string) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setTaskToEdit(taskToEdit.id);
      setEditedTask(taskToEdit.content);
      setShowMenu(null);
    }
  };

  const handleSaveEdit = () => {
    if (taskToEdit && editedTask) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskToEdit ? { ...task, content: editedTask } : task
        )
      );
      setTaskToEdit(null);
      setEditedTask("");  // Limpar o campo após salvar
    }
  };

  const renderTasks = (status: string) => {
    return tasks
      .filter(task => task.status === status)
      .map(task => (
        <div
          key={task.id}
          className="task"
          draggable
          onDragStart={e => handleDragStart(e, task.id)}
        >
          {task.content}
          <div className="menu" onClick={() => handleMenuClick(task.id)}>
            &#8230;
          </div>
          {showMenu === task.id && (
            <div className="menu-options">
              <button onClick={() => handleEditTask(task.id)}>Editar</button>
              <button onClick={() => handleDeleteTask(task.id)}>Remover</button>
            </div>
          )}
        </div>
      ));
  };

  return (
    <div>
      <h1>Gerenciador de Tarefas</h1>
      <div className="add-task-form">
        <input
          type="text"
          className="add-task-input"
          placeholder="Nova tarefa..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />
        <button className="add-task-btn" onClick={addTask}>
          Adicionar Tarefa
        </button>
      </div>
      {taskToEdit && (
        <div className="add-task-form">
          <input
            type="text"
            className="add-task-input"
            placeholder="Editar tarefa..."
            value={editedTask} 
            onChange={e => setEditedTask(e.target.value)}
          />
          <button className="add-task-btn" onClick={handleSaveEdit}>
            Salvar
          </button>
        </div>
      )}
      <div className="board">
        <div
          className="column"
          onDragOver={handleDragOver}
          onDrop={e => handleDrop(e, "todo")}
        >
          <h2>A Fazer</h2>
          <div className="tasks">{renderTasks("todo")}</div>
        </div>
        <div
          className="column"
          onDragOver={handleDragOver}
          onDrop={e => handleDrop(e, "in-progress")}
        >
          <h2>Em Progresso</h2>
          <div className="tasks">{renderTasks("in-progress")}</div>
        </div>
        <div
          className="column"
          onDragOver={handleDragOver}
          onDrop={e => handleDrop(e, "done")}
        >
          <h2>Concluído</h2>
          <div className="tasks">{renderTasks("done")}</div>
        </div>
      </div>
    </div>
  );
};

export default App;
