import React, { useEffect, useState, useRef } from "react";
import { Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("To Do");

  const tableRef = useRef(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) => {
        const formattedTasks = data.slice(0, 10).map((task) => ({
          userId: task.userId,
          taskId: task.id,
          title: task.title,
          status: task.completed ? "Done" : "To Do",
        }));
        setTasks(formattedTasks);
      });
  }, []);

  useEffect(() => {
    if (tasks.length > 0 && tableRef.current) {
      new Tabulator(tableRef.current, {
        data: tasks,
        layout: "fitColumns",
        responsiveLayout: "hide",
        columns: [
          { title: "User ID", field: "userId", width: 150 },
          { title: "Task ID", field: "taskId", width: 150 },
          {
            title: "Title",
            field: "title",
            editorPlaceholder: "Enter Task Title",
            width: 300,
          },
          {
            title: "Status",
            field: "status",
            editorParams: {
              values: ["To Do", "In Progress", "Done"],
            },
            width: 150,
          },
          {
            title: "Actions",
            field: "actions",
            formatter: "buttonCross",
            width: 150,
          },
        ],
        initialSort: [{ column: "taskId", dir: "asc" }],
      });
    }
  }, [tasks]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (title.trim() === "") {
      alert("Please enter a task title!");
      return;
    }

    const newTask = {
      userId: 1,
      taskId: tasks.length + 1,
      title: title,
      status: status,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTitle("");
    setStatus("To Do");
  };

  return (
    <div className="App">
      <h1>Task List Manager</h1>
      <div className="task-form">
        <h2>Add a New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <button type="submit" className="submit-button">
            Add Task
          </button>
        </form>
      </div>

      <div className="filter">
        <label htmlFor="status-filter">Filter by Status:</label>
        <select id="status-filter" value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div ref={tableRef} id="task-table"></div>
    </div>
  );
};

export default App;
