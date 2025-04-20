const Group = require("../models/Group");

const getGroups = async (req, res) => {
  const { user } = req.params;
  try {
    const groups = await Group.find({ email: user });
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addGroup = async (req, res) => {
  const { user } = req.params;
  const { groupName, members } = req.body;

  try {
    const newGroup = await Group.create({ email: user, groupName, members });
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getGroups, addGroup };
