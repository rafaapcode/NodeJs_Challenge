const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");


const users = [];

// Middleware
function checkExistsUserAccount(req, res, next) {

    const { username } = req.headers;

    const user = users.find(user => user.username === username);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;

    return next();

}



// ROUTES
app.post("/users", (req, res) => {
    const { name, username } = req.body;


    const userExists = users.find(user => user.username == username);

    if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
    }


    const user = {
        id: uuidv4(),
        name: 'Danilo Vieira',
        username: 'danilo',
        todos: []
    }

    users.push(user);

    return res.status(201).json(user);

});

app.get("/todos", checkExistsUserAccount, (req, res) => {
    const { user } = req;

    return res.json(user.todos);
});

app.post("/todos", checkExistsUserAccount, (req, res) => {
    const { user } = req;
    const { title, deadline } = req.body;

    const todo = {
        id: uuidv4(),
        title,
        done: false,
        deadline: new Date(deadline),
        created_at: new Date()
    }

    user.todos.push(todo);

    return res.status(201).json(todo);

});

app.put("/todos/:id", checkExistsUserAccount, (req, res) => {
    const { user } = req;
    const { title, deadline } = req.body;
    const { id } = req.params;

    const userExistsTodo = user.todos.find(user => user.id === id);

    if (!userExistsTodo) {
        return res.status(404).json({ error: 'Todo not exists' });
    }

    userExistsTodo.title = title;
    userExistsTodo.deadline = new Date(deadline);

    return res.json(userExistsTodo);

});

app.patch("/todos/:id/done", checkExistsUserAccount, (req, res) => {
    const { user } = req;

    const { id } = req.params;

    const userExistsTodo = user.todos.find(user => user.id === id);

    if (!userExistsTodo) {
        return res.status(404).json({ error: 'Todo not exists' });
    }

    userExistsTodo.done = true;

    return res.json(userExistsTodo);
});

app.delete("/todos/:id", (req, res) => {
    const { user } = req;

    const { id } = req.params;

    const todo = user.todos.findIndex(todo => todo.id === id);

    if(todo == -1){
        return res.status(404).json({ error: 'Todo not found' });
    }

    user.todos.splice(todo, 1);

    return res.status(204).send();
});