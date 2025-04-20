const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
});

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  netAmount: {
    type: Number,
    default: 0,
  },
  transactions: {
    type: [transactionSchema],
    default: [],
  },
});
const expenseSchema = mongoose.Schema({
  // email: { type: String, required: true, unique: true },
  id: { type: String, required: true },
  members: {
    type: [memberSchema],
    default: [],
  },
});

module.exports = {
  TransactionSchema: transactionSchema,
  MemberSchema: memberSchema,
  ExpenseSchema: expenseSchema,
  Expense: mongoose.model("Expense", expenseSchema),
};
