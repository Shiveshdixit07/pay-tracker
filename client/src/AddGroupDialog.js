import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import axios from "axios";

const AddGroupDialog = ({
  openDialog,
  setOpenDialog,
  newGroupName,
  setNewGroupName,
  personName,
  setPersonName,
  personContact,
  setPersonContact,
  people,
  setPeople,
  handleAddPerson,
  handleGetGroup,
  groups,
  currUser,
  currUserName,
  currUserPhoneNumber,
}) => {
  const handleAddGroup = async () => {
    if (!newGroupName || people.length === 0) {
      alert("Please provide a group name and add at least one member.");
      return;
    }

    const groupData = {
      groupName: newGroupName,
      members: people,
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/${currUser}/api/groups`,
        groupData
      );

      if (response.status === 201) {
        const id = response.data._id;

        handleGetGroup([...groups, response.data]);

        setNewGroupName("");
        console.log("phno: ", currUserPhoneNumber);
        setPeople([{ name: `Me`, contact: currUserPhoneNumber }]);
        setOpenDialog(false);

        try {
          await axios.post(`http://localhost:5000/${id}/api/expenses`, people);
        } catch (error) {
          console.error("Error adding Transaction group:", error);
          alert("An error occurred while adding the Transaction group.");
        }
      } else {
        alert("Failed to add the group. Please try again.");
      }
    } catch (error) {
      console.error("Error adding group:", error);
      alert("An error occurred while adding the group.");
    }
  };
  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      sx={{ padding: "20px" }}
    >
      <DialogTitle sx={{ backgroundColor: "#3f51b5", color: "white" }}>
        Create Expense Sharing Group
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Group Name"
          fullWidth
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          sx={{
            marginBottom: "15px",
            marginTop: "20px",
            backgroundColor: "#f4f6f8",
            borderRadius: "10px",
            padding: "10px",
          }}
        />
        <Typography variant="subtitle1" sx={{ marginBottom: "10px" }}>
          Add Members
        </Typography>
        <Box sx={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <TextField
            label="Name"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            sx={{
              backgroundColor: "#f4f6f8",
              borderRadius: "10px",
            }}
          />
          <TextField
            label="Contact Number"
            value={personContact}
            onChange={(e) => setPersonContact(e.target.value)}
            sx={{
              backgroundColor: "#f4f6f8",
              borderRadius: "10px",
            }}
          />
          <IconButton
            color="primary"
            onClick={handleAddPerson}
            sx={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              padding: "10px",
              backgroundColor: "#f4f6f8",
              "&:hover": {
                backgroundColor: "#e0e0e0",
                color: "blue",
              },
            }}
          >
            <Add />
          </IconButton>
        </Box>
        <ul>
          {people.map((person, index) => (
            <li key={index}>{person.name}</li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions sx={{ paddingBottom: "20px" }}>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button onClick={handleAddGroup} color="primary">
          Create Group
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGroupDialog;
