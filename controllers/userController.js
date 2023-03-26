const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { Client, Service, User } = require("../models");


// Find all Users
router.get("/", (req, res) => {
    User.findAll({
      include: [
        { model: Client }
      ]
    }).then((data) => {
      res.json(data);
    });
  });

// Find User by id
router.get("/:id", (req, res) => {
    User.findByPk(req.params.id, {
      include: [
        { model: Client }
      ]
    }).then((data) => {
      res.json(data);
    });
  });
  
// signup/create User
router.post("/", (req, res) => {
    User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      username: req.body.username,
      password: req.body.password,
      address: req.body.address
    })
      .then((newUser) => {
        const token = jwt.sign(
          {
            username: newUser.username,
            id: newUser.id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "6h",
          }
        );
        res.json({
          token,
          user: newUser,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ msg: "There has been a problem creating this User", err });
      });
  });

// login
router.post("/login", cors(), (req, res) => {
    User.findOne({
      where: {
        username: req.body.username,
      },
    })
      .then((foundUser) => {
        if (!foundUser) {
          return res.status(401).json({ msg: "invalid login credentials" });
        }
        //is password wrong
        if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
          return res.status(401).json({ msg: "invalid password credentials" });
        }
        const token = jwt.sign(
          {
            username: foundOwner.username,
            id: foundOwner.id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "6h",
          }
        );
        res.json({
          token,
          user: foundUser,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ msg: "There was a problem logging in", err });
      });
  });

// Update Owner PROTECTED
router.put("/:id", (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ msg: "You must be logged in" });
    }
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    User.findByPk(req.params.id).then((foundUser) => {
      if (!foundUser) {
        return res.status(404).json({ msg: "No such User exists" });
      }
      if (foundUser.id !== tokenData.id) {
        return res.status(403).json({ msg: "Unauthorized access" });
      }
      User.update(
        {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          username: req.body.username,
          password: req.body.password,
          address: req.body.address
        },
        {
          where: {
            id: req.params.id,
          },
        }
      )
        .then((data) => {
          res.json({ msg: "User has been updated", data });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            msg: "Error editting User",
            err,
          });
        });
    });
  });
  
  // Delete User PROTECTED
  router.delete("/:id", (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ msg: "You must be logged in" });
    }
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    User.findByPk(req.params.id).then((foundUser) => {
      if (!foundUser) {
        return res.status(404).json({ msg: "No such User exists" });
      }
      if (foundUser.id !== tokenData.id) {
        return res.status(403).json({ msg: "Unauthorized access" });
      }
      User.destroy({
        where: {
          id: req.params.id,
        },
      })
        .then((data) => {
          res.json({ msg: "User has been deleted", data });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            msg: "Error editting owner",
            err,
          });
        });
    });
  });
  
  router.get("/isValidToken", (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(403)
        .json({ isValid: false, msg: "you must be logged in!" });
    }
    try {
      const tokenData = jwt.verify(token,process.env.JWT_SECRET);
      res.json({
        isValid: true,
        user: tokenData,
      });
    } catch (err) {
      res.status(403).json({
        isValid: false,
        msg: "invalid token",
      });
    }
  });
   
module.exports = router;