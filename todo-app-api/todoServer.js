/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
const express = require("express");
const app = express();
const port = 4000;

const fs = require("fs");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

/**
 * Get all todos
 */
app.get("/todos", (req, res) => {
  fs.readFile("./files/todoDB.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.json(JSON.parse(data).todos);
  });
});

/**
 * Get todo by id
 */
app.get("/todos/:id", (req, res) => {
  const reqId = Number(req.params.id);

  fs.readFile("./files/todoDB.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    const todos = JSON.parse(data).todos;
    const result = todos.find((todo) => todo.id === reqId);

    return result ? res.json(result) : res.status(404).send("Todo not found!");
  });
});

/**
 * Create a todo
 */
app.post("/todos", (req, res) => {
  fs.readFile("./files/todoDB.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }

    let { id, todos } = JSON.parse(data);

    let newTodo = {
      id: id++,
      title: req.body.title,
      description: req.body.description,
    };

    todos.push(newTodo);

    fs.writeFile(
      "./files/todoDB.json",
      JSON.stringify({ id, todos }),
      (err) => {
        if (err) {
          return res.status(500).send(err);
        }

        res.status(201).json(todos);
      }
    );
  });
});

/**
 * Update todo by id
 */
app.put("/todos/:id", (req, res) => {
  const todoId = Number(req.params.id);
  const todoUpdate = req.body;

  fs.readFile("./files/todoDB.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    const { id, todos } = JSON.parse(data);

    const todoIndex = todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex === -1) return res.status(404).send("Todo not found!");

    let todo = todos[todoIndex];
    todo = { ...todo, ...todoUpdate };

    todos[todoIndex] = todo;

    fs.writeFile(
      "./files/todoDB.json",
      JSON.stringify({ id, todos }),
      (err) => {
        if (err) {
          return res.status(500).send(err);
        }

        return res.json(todo);
      }
    );
  });
});

/**
 * Delete todo by id
 */
app.delete("/todos/:id", (req, res) => {
  const todoId = Number(req.params.id);

  fs.readFile("./files/todoDB.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }

    const { id, todos } = JSON.parse(data);

    const todoIndex = todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex === -1) return res.status(404).send("Todo not found!");

    todos.splice(todoIndex, 1);

    fs.writeFile(
      "./files/todoDB.json",
      JSON.stringify({ id, todos }),
      (err) => {
        if (err) {
          return res.status(500).send(err);
        }

        return res.json(todos);
      }
    );
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
