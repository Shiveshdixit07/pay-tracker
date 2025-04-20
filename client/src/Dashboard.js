import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Grid2,
  Container,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import GroupCard from "./GroupCard";
import AddGroupDialog from "./AddGroupDialog";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./CSS/Dashboard.module.css";
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ UserEmail, userName, userPhoneNumber }) => {
  const navigate = useNavigate();
  const [savings, setSavings] = useState(null);
  const [groups, setGroups] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [people, setPeople] = useState([]);
  const [personName, setPersonName] = useState("");
  const [personContact, setPersonContact] = useState("");
  const [expense, setExpense] = useState(0);
  const [expenseHistory, setExpenseHistory] = useState([]);
  const [creditAmt, setCreditAmt] = useState(0);
  useEffect(() => {
    const getAllGroups = async () => {
      try {
        const url = `http://localhost:5000/${UserEmail}/api/balance`;
        const response = await axios.get(url);
        if (response.data.balance !== undefined) {
          setSavings(response.data.balance);
          setExpenseHistory(response.data.expenseHistory);
          localStorage.setItem(`savings:${UserEmail}`, response.data.balance);
        } else if (!localStorage.getItem(`savings:${UserEmail}`)) {
          const initialBalance = prompt(
            "Please enter your current available balance: ₹"
          );
          const balance = initialBalance ? parseInt(initialBalance, 10) : 10000;
          setSavings(balance);
          localStorage.setItem(`savings:${UserEmail}`, balance);
          await axios.post(url, {
            balance,
            expenseHistory,
          });
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
      try {
        if (UserEmail) {
          const url = `http://localhost:5000/${UserEmail}/api/groups`;
          const response = await axios.get(url);
          if (response.status === 200) {
            setGroups(response.data);
          }
        }
      } catch (error) {
        console.error("Error getting groups:", error);
        alert("An error occurred while getting the groups.");
      }
    };

    getAllGroups();
    setPeople([{ name: `Me`, contact: userPhoneNumber }]);
  }, [UserEmail, userPhoneNumber]);

  const handleAddExpense = async () => {
    if (expense > 0) {
      if (savings >= expense) {
        const d = Number(savings) - Number(expense);
        setSavings(d);
        const updatedExpenseHistory = [
          ...expenseHistory,
          { date: new Date().toLocaleDateString(), amount: expense },
        ];
        setExpenseHistory(updatedExpenseHistory);
        const url = `http://localhost:5000/${UserEmail}/api/balance`;
        localStorage.setItem(`savings:${UserEmail}`, d);
        const balance = d;

        await axios.post(url, {
          balance,
          expenseHistory: updatedExpenseHistory,
        });

        setExpense(0);
      } else {
        alert("Insufficient balance to make this expense.");
      }
    } else {
      alert("Please enter a valid expense amount.");
    }
  };
  const handleAddSavings = async () => {
    if (creditAmt > 0) {
      const d = Number(creditAmt) + Number(savings);
      setSavings(d);
      const url = `http://localhost:5000/${UserEmail}/api/balance`;
      localStorage.setItem(`savings:${UserEmail}`, d);
      const balance = d;

      await axios.post(url, {
        balance,
        expenseHistory: expenseHistory,
      });
      setCreditAmt(0);
    } else {
      alert("Please enter a valid credit amount.");
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleAddPerson = () => {
    if (personName && personContact) {
      setPeople([...people, { name: personName, contact: personContact }]);
      setPersonName("");
      setPersonContact("");
    } else {
      alert("Please enter both name and contact number.");
    }
  };

  const chartData = {
    labels: expenseHistory.map((entry) => entry.date),
    datasets: [
      {
        label: "Expenses Over Time",
        data: expenseHistory.map((entry) => entry.amount),
        borderColor: "#3f51b5",
        backgroundColor: "#3f51b5",
        fill: false,
      },
    ],
  };

  return (
    <Container className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h3" className={styles.headerTitle}>
          PayTracker Dashboard
        </Typography>
        <Typography variant="h4">
          <strong>Welcome {userName}!!</strong>
        </Typography>

        <Typography variant="h5" className={styles.savings}>
          <strong>Current Savings: ₹{savings}</strong>
        </Typography>
      </Box>

      <Grid2
        container
        spacing={4}
        sx={{
          flexDirection: expenseHistory.length > 0 ? "row" : "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid2
          item
          xs={12}
          md={6}
          sx={{ textAlign: expenseHistory.length > 0 ? "left" : "center" }}
        >
          <div className={styles.transactions}>
            <Box className={styles.savingsTransaction}>
              <TextField
                label="Credit amount"
                type="number"
                value={creditAmt}
                onChange={(e) => setCreditAmt(e.target.value)}
                className={styles.transactionAmount}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddSavings}
                className={styles.transactionButton}
              >
                Add Savings
              </Button>
            </Box>
            <Box className={styles.savingsTransaction}>
              <TextField
                label="Expense amount"
                type="number"
                value={expense}
                onChange={(e) => setExpense(e.target.value)}
                className={styles.transactionAmount}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddExpense}
                className={styles.transactionButton}
              >
                Add Expense
              </Button>
            </Box>
          </div>

          <Typography variant="h6" className={styles.groupsTitle}>
            Expense Sharing Groups
          </Typography>
          <Grid2 container spacing={3} justifyContent="center">
            {groups.length > 0 ? (
              groups.map((group, index) => (
                <Grid2
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={index}
                  className={styles.GroupCard}
                >
                  <GroupCard
                    group={group}
                    currUser={UserEmail}
                    currUserName={userName}
                  />
                </Grid2>
              ))
            ) : (
              <Typography variant="body1">No groups created yet.</Typography>
            )}
          </Grid2>
          <Box className={styles.createGroupButton}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              Create Group
            </Button>
          </Box>

          <AddGroupDialog
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            newGroupName={newGroupName}
            setNewGroupName={setNewGroupName}
            personName={personName}
            setPersonName={setPersonName}
            personContact={personContact}
            setPersonContact={setPersonContact}
            people={people}
            setPeople={setPeople}
            handleAddPerson={handleAddPerson}
            handleGetGroup={setGroups}
            groups={groups}
            currUser={UserEmail}
            currUserName={userName}
            currUserPhoneNumber={userPhoneNumber}
          />
        </Grid2>

        {expenseHistory.length > 0 && (
          <Grid2 item xs={12} md={6}>
            <Box className={styles.chartContainer}>
              <Typography variant="h6" className={styles.chartTitle}>
                Expense Graph
              </Typography>
              <Line data={chartData} className={styles.Chart} />
            </Box>
          </Grid2>
        )}
      </Grid2>
      <div className={styles.logoutButton}>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </Container>
  );
};

export default Dashboard;
