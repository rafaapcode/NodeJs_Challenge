const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");


const users = [];

// ROUTES
app.post("/users", (req, res) => {
    const { name, username } = req.body;

    
    const userExists = users.find(user => user.username == username);
    
    if(userExists){
        return res.status(400).json({error: 'User already exists'});
    }


    const user = {
        id: uuidv4(),
        name: 'Danilo Vieira',
        username: 'danilo',
        todos: []
    }

    users.push(user);

    return res.status(201).json(user);

})