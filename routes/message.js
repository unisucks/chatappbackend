const router = require("express").Router();
const controller = require("../controllers/message");
const protectRoute = require("../middleware/protectRoute");

router.get("/:id", protectRoute, controller.getMessages);
router.post("/send/:id", protectRoute, controller.sendMessage);

module.exports = router;
