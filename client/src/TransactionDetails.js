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
  CircularProgress,
  Tooltip,
  Alert,
  Paper,
  IconButton,
  InputAdornment,
  Grow,
  Collapse,
  Fade,
  Zoom,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentIcon from '@mui/icons-material/Payment';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");

  const handlePayerSelection = (name) => {
    setPayer(name);
  };

  useEffect(() => {
    if (group?._id) {
      const handleGetExpenses = async () => {
        try {
          setLoading(true);
          const url = `https://pay-tracker-backend.onrender.com/${group._id}/api/expenses`;
          const response = await axios.get(url);
          if (response.status === 200) {
            setMembers(response.data[0].members || []);
            setError(null);
          }
        } catch (error) {
          console.error("Error getting expenses:", error);
          setError("Failed to load expenses. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      handleGetExpenses();
    }
  }, [group]);

  const validateExpense = () => {
    if (!expenseAmount || Number(expenseAmount) <= 0) {
      setValidationError("Please enter a valid amount");
      return false;
    }
    if (!payer) {
      setValidationError("Please select who paid");
      return false;
    }
    if (selectedMembers.length === 0) {
      setValidationError("Please select at least one member to share with");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleAddExpense = async () => {
    if (!validateExpense()) return;
    
    const eA = Number(expenseAmount);
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
      const url = `https://pay-tracker-backend.onrender.com/${group._id}/api/expenses`;
      const response = await axios.put(url, updatedMembers);

      if (response.status === 201) {
        console.log("Updated expenses:", response.data);
      }
    } catch (error) {
      console.error("Error updating expenses:", error);
      setError("Failed to update expenses. Please try again.");
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

  const handleDialogClose = () => {
    setDialogOpen(false);
    setExpenseAmount("");
    setSelectedMembers([]);
    setPayer(null);
    setValidationError("");
  };

  if (!group) {
    return (
      <Box className={styles.container}>
        <Fade in timeout={500}>
          <Alert severity="error">Group not found.</Alert>
        </Fade>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Grow in timeout={800}>
        <Box className={styles.header}>
          <IconButton onClick={() => navigate(-1)} className={styles.backButton}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" className={styles.title}>
            {group.groupName}
          </Typography>
        </Box>
      </Grow>

      {error && (
        <Collapse in timeout={500}>
          <Alert severity="error" className={styles.alert}>
            {error}
          </Alert>
        </Collapse>
      )}

      <Grow in timeout={1000}>
        <Paper elevation={3} className={styles.summaryCard}>
          <Typography variant="h6" className={styles.subtitle}>
            <AccountBalanceWalletIcon className={styles.icon} />
            Balance Summary
          </Typography>

          {loading ? (
            <Box className={styles.loadingContainer}>
              <CircularProgress size={50} thickness={4} />
            </Box>
          ) : (
            <List className={styles.list}>
              {members.length > 0 ? (
                members.map((member, idx) => (
                  <Zoom 
                    in 
                    timeout={600} 
                    key={idx} 
                    style={{ transitionDelay: `${idx * 150}ms` }}
                  >
                    <div>
                      <ListItem
                        className={`${styles.listItem} ${
                          member.netAmount < 0 ? styles.owes : styles.owed
                        }`}
                      >
                        <Box display="flex" alignItems="center">
                          <PersonIcon className={styles.memberIcon} />
                          <Typography variant="body1" className={styles.memberName}>
                            {member.name === currentUser ? "Me" : member.name}
                          </Typography>
                        </Box>
                        <Typography
                          className={`${styles.netAmts} ${
                            member.netAmount < 0 ? styles.negative : styles.positive
                          }`}
                        >
                          {member.netAmount < 0
                            ? `- ₹${Math.abs(member.netAmount).toFixed(2)}`
                            : `+ ₹${member.netAmount.toFixed(2)}`}
                        </Typography>
                      </ListItem>
                      {idx < members.length - 1 && <Divider />}
                    </div>
                  </Zoom>
                ))
              ) : (
                <Fade in timeout={800}>
                  <Typography className={styles.noMembers}>
                    No members found.
                  </Typography>
                </Fade>
              )}
            </List>
          )}
        </Paper>
      </Grow>

      <Zoom in timeout={1200} style={{ transitionDelay: '200ms' }}>
        <Box className={styles.buttonContainer}>
          <Tooltip title="Add new expense" placement="top" arrow>
            <Button
              variant="contained"
              className={styles.primaryButton}
              onClick={() => setDialogOpen(true)}
              startIcon={<AddIcon />}
            >
              Add Expense
            </Button>
          </Tooltip>
        </Box>
      </Zoom>

      <Dialog 
        open={isDialogOpen} 
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Grow}
        transitionDuration={400}
      >
        <DialogTitle className={styles.dialogTitle}>
          <PaymentIcon />
          Add New Expense
        </DialogTitle>
        <DialogContent className={styles.dialogBox}>
          {validationError && (
            <Collapse in timeout={300}>
              <Alert severity="error" className={styles.alert}>
                {validationError}
              </Alert>
            </Collapse>
          )}
          
          <TextField
            label="Expense Amount"
            type="number"
            fullWidth
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            className={styles.textField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PaymentIcon />
                </InputAdornment>
              ),
            }}
            error={!!validationError && !expenseAmount}
            helperText="Enter the total expense amount in ₹"
            autoFocus
          />

          <Typography variant="subtitle1" className={styles.sectionTitle}>
            <PersonIcon />
            Who Paid?
          </Typography>
          <Box className={styles.memberGrid}>
            {members.map((member) => (
              <Box 
                key={member.name} 
                className={styles.memberSelection}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePayerSelection(member.name);
                }}
              >
                <Typography>
                  {member.name === currentUser ? "Me" : member.name}
                </Typography>
                <Checkbox
                  checked={payer === member.name}
                  onChange={(e) => {
                    e.stopPropagation();
                    handlePayerSelection(member.name);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={styles.checkbox}
                />
              </Box>
            ))}
          </Box>

          <Typography variant="subtitle1" className={styles.sectionTitle}>
            <GroupIcon />
            Split Between
          </Typography>
          <Box className={styles.memberGrid}>
            {members.map((member) => (
              <Box 
                key={member.name} 
                className={styles.memberSelection}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckboxChange(member.name);
                }}
              >
                <Typography>
                  {member.name === currentUser ? "Me" : member.name}
                </Typography>
                <Checkbox
                  checked={selectedMembers.includes(member.name)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCheckboxChange(member.name);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={styles.checkbox}
                />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button 
            onClick={handleDialogClose}
            variant="outlined"
            className={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            className={styles.primaryButton} 
            onClick={handleAddExpense}
            disabled={!expenseAmount || !payer || selectedMembers.length === 0}
          >
            Add Expense
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionDetails;