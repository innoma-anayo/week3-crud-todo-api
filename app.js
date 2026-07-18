// Load environment variables
require("dotenv").config();

// Import Express
const express = require("express");
const logger = require("./middleware/logger");
const todoSchema = require("./validators/todoValidator");

// Create Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(logger);

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

app.post("/todos", (req, res, next) => {

    try {

        const { error } = todoSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const { task } = req.body;

        const newTodo = {
            id: todos.length + 1,
            task,
            completed: false
        };

        todos.push(newTodo);

        res.status(201).json(newTodo);

    } catch (err) {
        next(err);
    }

});

app.patch("/todos/:id", (req, res, next) => {

    try {

        const id = parseInt(req.params.id);

        const { error } = todoSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

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

    } catch (err) {
        next(err);
    }

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