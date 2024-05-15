const express = require("express");
const router = new express.Router();
const controllers = require("../controllers/userControllers");


// User registration and user data
router.get("/user/register", controllers.getRegisteredUsers)
router.post("/user/register",controllers.userregister);
router.get("/user/register/:id",controllers.getUserByID)
router.put("/user/update/:id",controllers.updateUser)
router.delete("/user/register/:id",controllers.deleteUser)

// User login management routes
router.post("/user/sendotp",controllers.userOtpSend);
router.post("/user/login",controllers.userLogin);

// rides management routes
router.get("/user/ride",controllers.newRideCreation)
router.post("/user/ride",controllers.newRide)
router.get("/user/ride/:id",controllers.getRideByID)
router.put("/user/rideUpdate/:id",controllers.editRide)
router.delete("/user/ride/:id",controllers.deleteRide)

router.post("/user/requestRide", controllers.requestRide)
router.post("/user/confirmRide", controllers.confirmRide)
router.post("/user/rejectRide", controllers.rejectRide)

module.exports = router;