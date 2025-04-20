const { Expense } = require("../models/Expense");
const getGroupExpenses = async (req, res) => {
  try {
    const { id } = req.params;
    const expenses = await Expense.find({ id: id });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGroupExpenses = async (req, res) => {
  const { id } = req.params;
  const members = req.body;

  try {
    const updated = await Expense.findOneAndUpdate(
      { id: id },
      { $set: { members: members } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Expense group not found." });
    }

    res.status(201).json(updated);
  } catch (error) {
    console.error("Error updating expenses:", error);
    res.status(400).json({ message: error.message });
  }
};
const createGroupExpenses = async (req, res) => {
  const { id } = req.params;
  const Members = req.body;
  try {
    const arr = Members.map((m) => ({
      name: m.name,
      netAmount: 0,
      transactions: [],
    }));

    const newExpense = await Expense.create({
      id: String(id),
      members: arr,
    });
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = { getGroupExpenses, updateGroupExpenses, createGroupExpenses };
