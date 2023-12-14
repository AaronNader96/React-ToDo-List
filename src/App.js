// src/App.js

import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");
  const [editIndex, setEditIndex] = useState(null);
  const [editedText, setEditedText] = useState("");

  // Load todos from local storage on component mount
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(storedTodos);
  }, []);

  // Save todos to local storage whenever todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([
        ...todos,
        {
          text: newTodo,
          completed: false,
          dueDate: null,
          timestamp: new Date().toLocaleString(),
        },
      ]);
      setNewTodo("");
    }
  };

  const removeTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);
  };

  const toggleComplete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  const editTodo = (index) => {
    setEditIndex(index);
    setEditedText(todos[index].text);
  };

  const saveEdit = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].text = editedText;
    setTodos(updatedTodos);
    setEditIndex(null);
  };

  const isOverdue = (dueDate) => {
    if (dueDate) {
      const dueTime = new Date(dueDate).getTime();
      const currentTime = new Date().getTime();
      return dueTime < currentTime;
    }
    return false;
  };

  const filterTodos = () => {
    switch (filter) {
      case "completed":
        return todos.filter((todo) => todo.completed);
      case "uncompleted":
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  };

  return (
    <div className="App">
      <h1>ToDo List</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new ToDo"
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <div>
        <label>Filter:</label>
        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="uncompleted">Uncompleted</option>
        </select>
      </div>
      <ul>
        {filterTodos().map((todo, index) => (
          <li key={index} className={todo.completed ? "completed" : ""}>
            <div>
              {editIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                  <button onClick={() => saveEdit(index)}>Save</button>
                </>
              ) : (
                <>
                  <span>{todo.text}</span>
                  {todo.dueDate && (
                    <small className={isOverdue(todo.dueDate) ? "overdue" : ""}>
                      Due: {todo.dueDate}
                    </small>
                  )}
                  <small>Created: {todo.timestamp}</small>
                </>
              )}
            </div>
            <div>
              <button onClick={() => toggleComplete(index)}>
                {todo.completed ? "Mark as Uncompleted" : "Mark as Completed"}
              </button>
              {editIndex !== index && (
                <>
                  <button onClick={() => editTodo(index)}>Edit</button>
                  <button onClick={() => removeTodo(index)}>Remove</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="footer">
        <p>Created by Aaron Nader &copy; {new Date().getFullYear()}</p>
        <p>
          GitHub: <a href="https://github.com/AaronNader96">AaronNader96</a>
        </p>
        <p>
          LinkedIn:{" "}
          <a href="https://www.linkedin.com/in/AaronNader96/">AaronNader96</a>
        </p>
      </div>
    </div>
  );
}

export default App;
