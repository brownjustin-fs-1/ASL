const express = require("express");
const router = express.Router();

const contactsController = require("../controllers/contactsController");

router.get("/", contactsController.index);
router.post("/", contactsController.create);
router.get("/:id", contactsController.show);
router.put("/:id", contactsController.update);
router.delete("/:id", contactsController.destroy);

module.exports = router;
