const express = require('express');
const router = express.Router();

const userRoutes = require("./userController")
router.use("/api/user",userRoutes)

const clientRoutes = require("./clientController")
router.use("/api/clients",clientRoutes)

const serviceRoutes = require("./serviceController")
router.use("/api/service",serviceRoutes)


module.exports = router;