const express = require("express");
const {
  getGroupExpenses,
  updateGroupExpenses,
  createGroupExpenses,
} = require("../controllers/expenseController");

const router = express.Router();

router
  .route("/:id/api/expenses")
  .get(getGroupExpenses)
  .put(updateGroupExpenses)
  .post(createGroupExpenses);

module.exports = router;
