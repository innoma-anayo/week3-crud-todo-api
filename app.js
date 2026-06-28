// Load environment variables
require("dotenv").config();

// Import Express
const express = require("express");

// Create Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Temporary database (Array)
let todos = [
    {
        id: 1,
        task: "Learn Node.js",
        completed: false
    }
];

// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to Week 3 CRUD API");
});

// GET all todos
app.get("/todos", (req, res) => {
    res.status(200).json(todos);
});

// GET a single todo by ID
app.get("/todos/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const todo = todos.find(todo => todo.id === id);

    if (!todo) {
        return res.status(404).json({
            message: "Todo not found"
        });
    }

    res.status(200).json(todo);
});

// POST a new todo
app.post("/todos", (req, res) => {

    const { task } = req.body;

    // Validation
    if (!task) {
        return res.status(400).json({
            message: "Task field is required"
        });
    }

    const newTodo = {
        id: todos.length + 1,
        task,
        completed: false
    };

    todos.push(newTodo);

    res.status(201).json(newTodo);

});

// UPDATE a todo
app.patch("/todos/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const todo = todos.find(todo => todo.id === id);

    if (!todo) {
        return res.status(404).json({
            message: "Todo not found"
        });
    }

    if (req.body.task !== undefined) {
        todo.task = req.body.task;
    }

    if (req.body.completed !== undefined) {
        todo.completed = req.body.completed;
    }

    res.status(200).json(todo);

});

// DELETE a todo
app.delete("/todos/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const initialLength = todos.length;

    todos = todos.filter(todo => todo.id !== id);

    if (todos.length === initialLength) {
        return res.status(404).json({
            message: "Todo not found"
        });
    }

    res.status(204).send();

});

// BONUS: Get active todos
app.get("/todos/active", (req, res) => {

    const activeTodos = todos.filter(todo => !todo.completed);

    res.status(200).json(activeTodos);

});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});