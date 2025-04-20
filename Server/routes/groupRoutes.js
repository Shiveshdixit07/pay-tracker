const express = require("express");
const { getGroups, addGroup } = require("../controllers/groupController");

const router = express.Router();

router.route("/:user/api/groups").get(getGroups).post(addGroup);

module.exports = router;
