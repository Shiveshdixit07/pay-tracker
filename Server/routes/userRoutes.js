const express = require("express");
const { getBalance, setBalance } = require("../controllers/UserController");

const router = express.Router();

router.route("/:email/api/balance").get(getBalance).post(setBalance);

module.exports = router;
