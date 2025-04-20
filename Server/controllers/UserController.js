const User = require("../models/User");

const getBalance = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      balance: user.balance ?? undefined,
      expenseHistory: user.expenses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const setBalance = async (req, res) => {
  try {
    const { email } = req.params;
    const { balance, expenseHistory } = req.body;

    if (balance === undefined || isNaN(balance)) {
      return res.status(400).json({ message: "Invalid balance value" });
    }
    if (!Array.isArray(expenseHistory)) {
      return res
        .status(400)
        .json({ message: "Invalid expense history format" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: { balance, expenses: expenseHistory },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Balance and expenses updated successfully",
      balance: user.balance,
      expenses: user.expenses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getBalance, setBalance };
