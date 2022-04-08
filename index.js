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
    const {user} = req;

    return res.json(user.todos);
})