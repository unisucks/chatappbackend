const router = require("express").Router();
const controller = require("../controllers/user");
const protectRoute = require("../middleware/protectRoute");
router.get("/", protectRoute, controller.getUser);

module.exports = router;
