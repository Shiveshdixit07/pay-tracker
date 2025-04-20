const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
  email: { type: String, required: true },
  groupName: { type: String, required: true },
  members: [
    {
      name: { type: String, required: true },
      contact: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Group", groupSchema);
