// server/server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Імпорт CORS
const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

// Utility function to read todos from the file
const readTodos = () => {
    const data = fs.readFileSync('todos.json', 'utf-8'); // Зміни шлях до файлу
    return JSON.parse(data);
};

// Utility function to write todos to the file
const writeTodos = (todos) => {
    fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2)); // Зміни шлях до файлу
};

// Get all todo items
app.get('/todos', (req, res) => {
    const todos = readTodos();
    res.json(todos);
});

// Get a single todo item
app.get('/todos/:id', (req, res) => {
    const todos = readTodos();
    const todo = todos.find((t) => t.id === parseInt(req.params.id));
    if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
});

// Create a new todo item
app.post('/todos', (req, res) => {
    const todos = readTodos();
    const newTodo = {
        id: todos.length ? todos[todos.length - 1].id + 1 : 1,
        title: req.body.title,
        completed: req.body.completed || false,
    };
    todos.push(newTodo);
    writeTodos(todos);
    res.status(201).json(newTodo);
});

// Update a todo item
app.put('/todos/:id', (req, res) => {
    const todos = readTodos();
    const todoIndex = todos.findIndex((t) => t.id === parseInt(req.params.id));
    if (todoIndex === -1) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    todos[todoIndex] = {
        ...todos[todoIndex],
        title: req.body.title || todos[todoIndex].title,
        completed: req.body.completed !== undefined ? req.body.completed : todos[todoIndex].completed,
    };
    writeTodos(todos);
    res.json(todos[todoIndex]);
});

// Delete a todo item
app.delete('/todos/:id', (req, res) => {
    const todos = readTodos();
    const updatedTodos = todos.filter((t) => t.id !== parseInt(req.params.id));
    if (todos.length === updatedTodos.length) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    writeTodos(updatedTodos);
    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
