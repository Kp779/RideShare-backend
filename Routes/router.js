const express = require("express");
const router = new express.Router();
const controllers = require("../controllers/userControllers");


// User registration and user data
router.get("/user/register", controllers.getRegisteredUsers)
router.post("/user/register",controllers.userregister);
router.delete("/user/register/:id",controllers.deleteUser)

// User login management routes
router.post("/user/sendotp",controllers.userOtpSend);
router.post("/user/login",controllers.userLogin);

// rides management routes
router.get("/user/ride",controllers.newRideCreation)
router.post("/user/ride",controllers.newRide)
router.put("/user/ride/:id",controllers.editRide)
router.delete("/user/ride/:id",controllers.deleteRide)

module.exports = router;