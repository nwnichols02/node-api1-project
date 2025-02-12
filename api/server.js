const express = require("express");
const User = require("./users/model");
const server = express();
server.use(express.json());

server.get("/api/users", (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) =>
      res.status(500).json({
        message: "The users information could not be retrieved",
        err: err.message,
        stack: err.stack,
      })
    );
});

server.get(`/api/users/:id`, (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
      } else {
        res.json(user);
      }
    })
    .catch((err) =>
      res.status(500).json({
        message: "The users information could not be retrieved",
        err: err.message,
        stack: err.stack,
      })
    );
});

server.post(`/api/users`, (req, res) => {
  console.log(req);
  let user = req.body;
  if (!user.name || !user.bio) {
    res.status(400).json({
      message: "Please provide name and bio for the user"
    });
  } else {
    User.insert(user)
      .then((user) => {
        res.status(201).json(user);
        return user;
      })
      .catch((err) =>
        res.status(500).json({
          message: "error creating user",
          err: err.message,
          stack: err.stack,
        })
      );
  }
});

server.delete(`/api/users/:id`, (req, res) => {
  User.remove(req.params.id)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
      } else {
        res.status(202).json(user);
      }
    })
    .catch((err) =>
      res.status(500).json({
        message: "The user could not be removed",
        err: err.message,
        stack: err.stack,
      })
    );
});

server.put(`/api/users/:id`, (req, res) => {
  let id = req.params.id;
  let changes = req.body;
  User.update(id, changes)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
      } else if (!user.name || !user.bio) {
        res
          .status(400)
          .json({ message: "Please provide name and bio for the user" });
      } else {
        res.status(200).json(user);
      }
    })
    .catch((err) =>
      res.status(500).json({
        message: "The user information could not be modified",
        err: err.message,
        stack: err.stack,
      })
    );
});

server.get("/", (req, res) => {
  res.end("working");
});

module.exports = server;
