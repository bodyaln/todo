const WebSocket = require('ws');
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

// Utility functions
const readTodos = () => JSON.parse(fs.readFileSync('todos.json', 'utf-8'));
const writeTodos = (todos) => fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2));

// WebSocket broadcast
const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// WebSocket connection
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
});

// REST API
app.get('/todos', (req, res) => {
    const todos = readTodos();
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const todos = readTodos();
    const newTodo = {
        id: todos.length ? todos[todos.length - 1].id + 1 : 1,
        title: req.body.title,
        completed: req.body.completed || false,
    };
    todos.push(newTodo);
    writeTodos(todos);
    broadcast({ type: 'TASK_ADDED', data: newTodo }); // Notify WebSocket clients
    res.status(201).json(newTodo);
});

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
    broadcast({ type: 'TASK_UPDATED', data: todos[todoIndex] }); // Notify WebSocket clients
    res.json(todos[todoIndex]);
});

app.delete('/todos/:id', (req, res) => {
    const todos = readTodos();
    const updatedTodos = todos.filter((t) => t.id !== parseInt(req.params.id));
    if (todos.length === updatedTodos.length) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    writeTodos(updatedTodos);
    broadcast({ type: 'TASK_DELETED', data: { id: parseInt(req.params.id) } }); // Notify WebSocket clients
    res.status(204).send();
});
