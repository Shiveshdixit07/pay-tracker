import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  Divider,
  Checkbox,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import styles from "./CSS/transaction.module.css";

const TransactionDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { group, currentUser } = location.state || {};
  const [members, setMembers] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [payer, setPayer] = useState(null);

  const handlePayerSelection = (name) => {
    setPayer(name);
  };
  useEffect(() => {
    if (group?._id) {
      const handleGetExpenses = async () => {
        try {
          const url = `http://localhost:5000/${group._id}/api/expenses`;
          const response = await axios.get(url);
          if (response.status === 200) {
            setMembers(response.data[0].members || []);
          }
        } catch (error) {
          console.error("Error getting expenses:", error);
          alert("An error occurred while getting the expenses.");
        }
      };
      handleGetExpenses();
    }
  }, [group]);

  const handleAddExpense = async () => {
    const eA = Number(expenseAmount);
    if (eA <= 0 || selectedMembers.length === 0 || !payer) return;
    const perMemberShare = eA / selectedMembers.length;
    const updatedMembers = members.map((member) => {
      if (selectedMembers.includes(member.name)) {
        if (member.name === payer) {
          return {
            ...member,
            transactions: [
              ...(member.transactions || []),
              { amount: eA - perMemberShare },
            ],
            netAmount: (member.netAmount || 0) + eA - perMemberShare,
          };
        }
        return {
          ...member,
          transactions: [
            ...(member.transactions || []),
            { amount: perMemberShare },
          ],
          netAmount: (member.netAmount || 0) - perMemberShare,
        };
      } else if (member.name === payer) {
        return {
          ...member,
          transactions: [...(member.transactions || []), { amount: eA }],
          netAmount: (member.netAmount || 0) + eA,
        };
      }
      return member;
    });

    setMembers(updatedMembers);

    try {
      const url = `http://localhost:5000/${group._id}/api/expenses`;
      const response = await axios.put(url, updatedMembers);

      if (response.status === 201) {
        console.log("Updated expenses:", response.data);
      }
    } catch (error) {
      console.error("Error updating expenses:", error);
      alert("An error occurred while updating the expenses.");
    }

    setDialogOpen(false);
    setExpenseAmount("");
    setSelectedMembers([]);
    setPayer(null);
  };

  const handleCheckboxChange = (name) => {
    setSelectedMembers((prev) =>
      prev.includes(name)
        ? prev.filter((member) => member !== name)
        : [...prev, name]
    );
  };

  if (!group) {
    return <Typography>Group not found.</Typography>;
  }

  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        {group.groupName} - Transactions
      </Typography>

      <Typography variant="h6" className={styles.subtitle}>
        Members Share
      </Typography>

      <List className={styles.list}>
        {members.length > 0 ? (
          members.map((member, idx) => (
            <React.Fragment key={idx}>
              <ListItem
                className={`${styles.listItem} ${
                  member.netAmount < 0 ? styles.owes : styles.owed
                }`}
              >
                <Typography>
                  {member.name === currentUser ? "Me" : member.name}
                </Typography>
                <Typography className={styles.netAmts}>
                  {member.netAmount < 0
                    ? `- ₹${Math.abs(member.netAmount).toFixed(2)}`
                    : `+ ₹${member.netAmount.toFixed(2)}`}
                </Typography>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <Typography>No members found.</Typography>
        )}
      </List>

      <Box className={styles.buttonContainer}>
        <Button
          className={styles.primaryButton}
          onClick={() => setDialogOpen(true)}
        >
          Add Expense
        </Button>
        <Button className={styles.secondaryButton} onClick={() => navigate(-1)}>
          Back to Dashboard
        </Button>
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle className={styles.dialogTitle}>Add Expense</DialogTitle>
        <DialogContent className={styles.dialogBox}>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            className={styles.textField}
          />
          <Typography variant="body1">Paid By:</Typography>
          {members.map((member) => (
            <Box key={member.name} className={styles.memberSelection}>
              <Typography>{member.name}</Typography>
              <Checkbox
                checked={payer === member.name}
                onChange={() => handlePayerSelection(member.name)}
                className={styles.checkbox}
              />
            </Box>
          ))}
          <Typography variant="body1">Select Members to Share:</Typography>
          {members.map((member) => (
            <Box key={member.name} className={styles.memberSelection}>
              <Typography>{member.name}</Typography>
              <Checkbox
                checked={selectedMembers.includes(member.name)}
                onChange={() => handleCheckboxChange(member.name)}
                className={styles.checkbox}
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button className={styles.primaryButton} onClick={handleAddExpense}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionDetails;
