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
  Fade,
  Slide,
  CircularProgress,
  Skeleton,
  Snackbar,
  Alert,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { 
  Add, 
  TrendingUp, 
  TrendingDown, 
  AccountBalanceWallet,
  Group,
  Logout,
  Refresh
} from "@mui/icons-material";
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
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";
import styles from "./CSS/Dashboard.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const getAllGroups = async () => {
      setLoading(true);
      try {
        const url = `https://pay-tracker-backend.onrender.com/${UserEmail}/api/balance`;
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
        showSnackbar("Error fetching balance data", "error");
      }
      
      try {
        if (UserEmail) {
          const url = `https://pay-tracker-backend.onrender.com/${UserEmail}/api/groups`;
          const response = await axios.get(url);
          if (response.status === 200) {
            setGroups(response.data);
          }
        }
      } catch (error) {
        console.error("Error getting groups:", error);
        showSnackbar("Error loading groups", "error");
      } finally {
        setLoading(false);
      }
    };

    getAllGroups();
    setPeople([{ name: `Me`, contact: userPhoneNumber }]);
  }, [UserEmail, userPhoneNumber]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const url = `https://pay-tracker-backend.onrender.com/${UserEmail}/api/groups`;
      const response = await axios.get(url);
      if (response.status === 200) {
        setGroups(response.data);
        showSnackbar("Data refreshed successfully", "success");
      }
    } catch (error) {
      showSnackbar("Error refreshing data", "error");
    } finally {
      setRefreshing(false);
    }
  };

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
        const url = `https://pay-tracker-backend.onrender.com/${UserEmail}/api/balance`;
        localStorage.setItem(`savings:${UserEmail}`, d);
        const balance = d;

        await axios.post(url, {
          balance,
          expenseHistory: updatedExpenseHistory,
        });

        setExpense(0);
        showSnackbar(`Expense of ₹${expense} added successfully`, "success");
      } else {
        showSnackbar("Insufficient balance to make this expense", "error");
      }
    } else {
      showSnackbar("Please enter a valid expense amount", "warning");
    }
  };

  const handleAddSavings = async () => {
    if (creditAmt > 0) {
      const d = Number(creditAmt) + Number(savings);
      setSavings(d);
      const url = `https://pay-tracker-backend.onrender.com/${UserEmail}/api/balance`;
      localStorage.setItem(`savings:${UserEmail}`, d);
      const balance = d;

      await axios.post(url, {
        balance,
        expenseHistory: expenseHistory,
      });
      setCreditAmt(0);
      showSnackbar(`₹${creditAmt} added to savings successfully`, "success");
    } else {
      showSnackbar("Please enter a valid credit amount", "warning");
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
      showSnackbar("Please enter both name and contact number", "warning");
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#667eea',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return '₹' + value;
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }
    },
    elements: {
      point: {
        radius: 6,
        hoverRadius: 8,
      },
      line: {
        tension: 0.4,
      }
    }
  };

  const chartData = {
    labels: expenseHistory.map((entry) => entry.date),
    datasets: [
      {
        label: "Expenses Over Time",
        data: expenseHistory.map((entry) => entry.amount),
        borderColor: "#667eea",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        fill: true,
        pointBackgroundColor: "#667eea",
        pointBorderColor: "white",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "#764ba2",
        pointHoverBorderColor: "white",
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const totalExpenses = expenseHistory.reduce((sum, entry) => sum + Number(entry.amount), 0);
  const avgExpense = expenseHistory.length > 0 ? totalExpenses / expenseHistory.length : 0;

  if (loading) {
    return (
      <Container className={styles.container}>
        <Box className={styles.header}>
          <Skeleton variant="text" width={300} height={60} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Skeleton variant="text" width={200} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Skeleton variant="rectangular" width={250} height={60} sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '20px', margin: '0 auto' }} />
        </Box>
        <Grid2 container spacing={4}>
          <Grid2 item xs={12} md={6}>
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap" mb={3}>
              <Skeleton variant="rectangular" width={280} height={150} sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '16px' }} />
              <Skeleton variant="rectangular" width={280} height={150} sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '16px' }} />
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    );
  }

  return (
    <Container className={styles.container}>
      <Fade in timeout={1000}>
        <Box className={styles.header}>
          <Typography variant="h3" className={styles.headerTitle}>
            PayTracker Dashboard
          </Typography>
          <Slide direction="down" in timeout={1200}>
            <Typography variant="h4">
              <strong>Welcome {userName}! 👋</strong>
            </Typography>
          </Slide>

          <Slide direction="up" in timeout={1400}>
            <Box display="inline-block" position="relative">
              <Typography variant="h5" className={styles.savings}>
                <AccountBalanceWallet sx={{ ml:1,mr: 1, verticalAlign: 'middle' }} />
                <strong>Current Savings: ₹{savings?.toLocaleString()}</strong>
              </Typography>
              {expenseHistory.length > 0 && (
                <Box mt={1} display="flex" gap={1} justifyContent="center" flexWrap="wrap">
                  <Chip 
                    icon={<TrendingDown />} 
                    label={`Total Spent: ₹${totalExpenses.toLocaleString()}`}
                    size="small"
                    sx={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      backdropFilter: 'blur(10px)'
                    }} 
                  />
                  <Chip 
                    icon={<TrendingUp />} 
                    label={`Avg Expense: ₹${Math.round(avgExpense).toLocaleString()}`}
                    size="small"
                    sx={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      backdropFilter: 'blur(10px)'
                    }} 
                  />
                </Box>
              )}
            </Box>
          </Slide>
        </Box>
      </Fade>

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
          <Slide direction="right" in timeout={800}>
            <div className={styles.transactions}>
              <Box className={styles.savingsTransaction}>
                <TextField
                  label="💰 Credit amount"
                  type="number"
                  value={creditAmt}
                  onChange={(e) => setCreditAmt(e.target.value)}
                  className={styles.transactionAmount}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>,
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddSavings}
                  className={styles.transactionButton}
                  startIcon={<TrendingUp />}
                  disabled={!creditAmt || creditAmt <= 0}
                >
                  Add Savings
                </Button>
              </Box>
              <Box className={styles.savingsTransaction}>
                <TextField
                  label="💸 Expense amount"
                  type="number"
                  value={expense}
                  onChange={(e) => setExpense(e.target.value)}
                  className={styles.transactionAmount}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>,
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddExpense}
                  className={styles.transactionButton}
                  startIcon={<TrendingDown />}
                  disabled={!expense || expense <= 0}
                >
                  Add Expense
                </Button>
              </Box>
            </div>
          </Slide>

          <Fade in timeout={1600}>
            <Box>
              <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
                <Typography variant="h6" className={styles.groupsTitle}>
                  <Group sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Expense Sharing Groups ({groups.length})
                </Typography>
                <Tooltip title="Refresh groups">
                  <IconButton 
                    onClick={handleRefresh} 
                    disabled={refreshing}
                    sx={{ color: 'white' }}
                  >
                    {refreshing ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Grid2 container spacing={3} justifyContent="center">
                {groups.length > 0 ? (
                  groups.map((group, index) => (
                    <Slide direction="up" in timeout={1000 + index * 200} key={index}>
                      <Grid2
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        className={styles.GroupCard}
                      >
                        <GroupCard
                          group={group}
                          currUser={UserEmail}
                          currUserName={userName}
                        />
                      </Grid2>
                    </Slide>
                  ))
                ) : (
                  <Fade in timeout={2000}>
                    <Box textAlign="center" py={4}>
                      <Group sx={{ fontSize: 48, color: 'rgba(255,255,255,0.5)', mb: 2 }} />
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        No groups created yet. Start by creating your first group!
                      </Typography>
                    </Box>
                  </Fade>
                )}
              </Grid2>
              
              <Slide direction="up" in timeout={1800}>
                <Box className={styles.createGroupButton}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setOpenDialog(true)}
                    size="large"
                  >
                    Create New Group
                  </Button>
                </Box>
              </Slide>

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
            </Box>
          </Fade>
        </Grid2>

        {expenseHistory.length > 0 && (
          <Slide direction="left" in timeout={1200}>
            <Grid2 item xs={12} md={6}>
              <Box className={styles.chartContainer}>
                <Typography variant="h6" className={styles.chartTitle}>
                  📊 Expense Analytics
                </Typography>
                <Box height={300}>
                  <Line data={chartData} options={chartOptions} className={styles.Chart} />
                </Box>
                <Box mt={2} display="flex" justifyContent="space-around" flexWrap="wrap">
                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                      Total Transactions
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {expenseHistory.length}
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                      Highest Expense
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      ₹{Math.max(...expenseHistory.map(e => e.amount)).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                      Recent Activity
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {expenseHistory.length > 0 ? expenseHistory[expenseHistory.length - 1].date : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid2>
          </Slide>
        )}
      </Grid2>
      
      <Tooltip title="Logout">
        <div className={styles.logoutButton}>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleLogout}
            startIcon={<Logout />}
          >
            Logout
          </Button>
        </div>
      </Tooltip>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;