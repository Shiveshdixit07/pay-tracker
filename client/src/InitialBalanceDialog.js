import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Fade } from "@mui/material";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

const InitialBalanceDialog = ({ open, onClose, onSubmit }) => {
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const value = parseInt(balance, 10);
    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }
    setError("");
    onSubmit(value);
  };

  const handleChange = (e) => {
    setBalance(e.target.value);
    setError("");
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth 
      slots={{ transition: Fade }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            boxShadow: 6,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
            p: 0,
          }
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 3, pb: 1 }}>
        <EmojiEmotionsIcon sx={{ fontSize: 48, color: '#6366f1', mb: 1 }} />
        <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom sx={{textAlign: 'center'}}>
          Welcome to PayTracker!
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 4, pb: 2, pt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.7)', borderRadius: 2 }}>
        <Typography gutterBottom sx={{ mb: 2, color: 'text.secondary', fontSize: 16, textAlign: 'center' }}>
          Please enter your current available balance to get started:
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Current Balance (₹)"
          type="number"
          fullWidth
          value={balance}
          onChange={handleChange}
          error={!!error}
          helperText={error}
          slotProps={{ input: { min: 1, style: { textAlign: 'center', fontSize: 18, fontWeight: 500 } } }}
          sx={{
            background: '#f1f5f9',
            borderRadius: 2,
            mb: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#a5b4fc',
              },
              '&:hover fieldset': {
                borderColor: '#6366f1',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#6366f1',
              },
            },
            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
            '& input[type=number]': {
              MozAppearance: 'textfield',
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, pt: 1 }}>
        <Button onClick={onClose} color="primary" variant="contained" sx={{ borderRadius: 2, px: 3, fontWeight: 600, boxShadow: 2, background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)' }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" sx={{ borderRadius: 2, px: 3, fontWeight: 600, boxShadow: 2, background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)' }}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InitialBalanceDialog; 