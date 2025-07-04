import React, { useState } from "react";
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
  Avatar,
  Divider,
  Fade,
  Slide,
  Paper,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Close,
  Group,
  Person,
  Phone,
  Delete,
  Check,
  GroupAdd,
} from "@mui/icons-material";
import axios from "axios";
import { useTheme, useMediaQuery } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const validateForm = () => {
    const newErrors = {};
    
    if (!newGroupName.trim()) {
      newErrors.groupName = "Group name is required";
    }
    
    if (people.length === 0) {
      newErrors.members = "At least one member is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddGroup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const groupData = {
      groupName: newGroupName,
      members: people,
    };

    try {
      const response = await axios.post(
        `https://pay-tracker-backend.onrender.com/${currUser}/api/groups`,
        groupData
      );

      if (response.status === 201) {
        const id = response.data._id;

        handleGetGroup([...groups, response.data]);

        setNewGroupName("");
        setPeople([{ name: `Me`, contact: currUserPhoneNumber }]);
        setOpenDialog(false);
        setErrors({});

        try {
          await axios.post(`https://pay-tracker-backend.onrender.com/${id}/api/expenses`, people);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePerson = (indexToRemove) => {
    if (people[indexToRemove].name === "Me") return; 
    setPeople(people.filter((_, index) => index !== indexToRemove));
  };

  const handleClose = () => {
    setOpenDialog(false);
    setErrors({});
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth={isMobile ? "xs" : "md"}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 2 : 3,
          boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.20)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          overflow: 'hidden',
          minHeight: isMobile ? 'auto' : '600px',
          margin: isMobile ? 0.5 : 2,
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'transparent',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: isMobile ? 1 : 2,
          pt: isMobile ? 2 : 3,
          px: isMobile ? 1.5 : 3,
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 2, flex: 1 }}>
          <Avatar
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              width: isMobile ? 36 : 48,
              height: isMobile ? 36 : 48,
            }}
          >
            <GroupAdd sx={{ fontSize: isMobile ? 18 : 24 }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 600, fontSize: isMobile ? '1.1rem' : '1.5rem' }}>
              Create New Group
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
              Set up expense sharing with friends
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: 'white',
            bgcolor: 'rgba(255,255,255,0.1)',
            width: isMobile ? 32 : 40,
            height: isMobile ? 32 : 40,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.2)',
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          background: 'white',
          color: 'black',
          mx: 0,
          mb: 0,
          borderRadius: isMobile ? '12px 12px 0 0' : '16px 16px 0 0',
          p: 0,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: isMobile ? 200 : 400,
        }}
      >
        <Box sx={{ p: isMobile ? 1.5 : 3, flex: 1 }}>
          <Box sx={{ mb: isMobile ? 2 : 4 }}>
            <TextField
              label="Group Name"
              fullWidth
              value={newGroupName}
              onChange={(e) => {
                setNewGroupName(e.target.value);
                if (errors.groupName) setErrors({...errors, groupName: ''});
              }}
              error={!!errors.groupName}
              helperText={errors.groupName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Group color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  height: isMobile ? 44 : 56,
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
              }}
            />
          </Box>

          <Divider sx={{ my: isMobile ? 2 : 3 }} />

          <Box sx={{ mb: isMobile ? 2 : 3 }}>
            <Typography
              variant="h6"
              sx={{
                mb: isMobile ? 2 : 3,
                color: '#333',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: isMobile ? '1rem' : undefined,
              }}
            >
              <Person color="primary" />
              Add Members
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: isMobile ? 1.5 : 3,
                bgcolor: '#f8f9fa',
                borderRadius: 2,
                border: '1px solid #e9ecef',
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                gap: isMobile ? 1 : 2, 
                mb: 2,
                flexDirection: isMobile ? 'column' : { xs: 'column', sm: 'row' },
                alignItems: 'stretch'
              }}>
                <TextField
                  label="Name"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'white',
                      height: isMobile ? 44 : 56,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Phone Number"
                  value={personContact}
                  onChange={(e) => setPersonContact(e.target.value)}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'white',
                      height: isMobile ? 44 : 56,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleAddPerson}
                  disabled={!personName.trim() || !personContact.trim()}
                  sx={{
                    bgcolor: '#667eea',
                    color: 'white',
                    width: isMobile ? 44 : 56,
                    height: isMobile ? 44 : 56,
                    flexShrink: 0,
                    alignSelf: isMobile ? 'flex-end' : 'center',
                    '&:hover': {
                      bgcolor: '#5a6fd8',
                    },
                    '&:disabled': {
                      bgcolor: 'grey.300',
                    },
                  }}
                >
                  <Add />
                </IconButton>
              </Box>

              {errors.members && (
                <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                  {errors.members}
                </Typography>
              )}
            </Paper>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                mb: isMobile ? 1.5 : 2,
                color: '#333',
                fontWeight: 600,
                fontSize: isMobile ? '1rem' : undefined,
              }}
            >
              Group Members ({people.length})
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: isMobile ? 1 : 2,
              minHeight: 100,
              alignItems: 'flex-start',
              flexDirection: isMobile ? 'column' : 'row',
            }}>
              {people.map((person, index) => (
                <Fade in key={index} timeout={300}>
                  <Paper
                    elevation={1}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: isMobile ? 1 : 2,
                      p: isMobile ? 1.5 : 2,
                      borderRadius: 2,
                      border: person.name === "Me" ? '2px solid #4caf50' : '1px solid #e0e0e0',
                      bgcolor: person.name === "Me" ? '#f1f8e9' : 'white',
                      minWidth: isMobile ? 'unset' : 200,
                      width: isMobile ? '100%' : 'auto',
                      position: 'relative',
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: getAvatarColor(person.name),
                        color: 'white',
                        fontSize: isMobile ? '0.8rem' : '0.9rem',
                        fontWeight: 600,
                        width: isMobile ? 32 : 40,
                        height: isMobile ? 32 : 40,
                      }}
                    >
                      {getInitials(person.name)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, fontSize: isMobile ? '0.9rem' : '0.95rem' }}>
                        {person.name}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7, fontSize: isMobile ? '0.75rem' : '0.8rem' }}>
                        {person.contact}
                      </Typography>
                    </Box>
                    {person.name === "Me" ? (
                      <Check sx={{ color: 'green', fontSize: isMobile ? 16 : 20 }} />
                    ) : (
                      <IconButton
                        size="small"
                        onClick={() => handleRemovePerson(index)}
                        sx={{
                          color: 'grey.500',
                          '&:hover': {
                            color: 'red',
                            bgcolor: 'rgba(255,0,0,0.1)',
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Paper>
                </Fade>
              ))}
            </Box>

            {people.length === 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: isMobile ? 2 : 4,
                  textAlign: 'center',
                  bgcolor: '#f5f5f5',
                  borderRadius: 2,
                  border: '2px dashed #ccc',
                }}
              >
                <Group sx={{ fontSize: isMobile ? 32 : 48, color: '#ccc', mb: 2 }} />
                <Typography color="text.secondary" variant="body1" sx={{ fontSize: isMobile ? '0.95rem' : undefined }}>
                  No members added yet. Add some friends to get started!
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          background: 'white',
          px: isMobile ? 1.5 : 3,
          pb: isMobile ? 1.5 : 3,
          pt: isMobile ? 1 : 2,
          gap: isMobile ? 1 : 2,
          borderTop: '1px solid #f0f0f0',
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: isMobile ? 2 : 4,
            py: isMobile ? 1 : 1.5,
            borderColor: '#ccc',
            color: '#666',
            height: isMobile ? 40 : 48,
            minWidth: isMobile ? '100%' : 120,
            width: isMobile ? '100%' : 'auto',
            '&:hover': {
              borderColor: '#999',
              color: 'black',
              bgcolor: 'rgba(0,0,0,0.04) !important',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAddGroup}
          variant="contained"
          disabled={isLoading}
          sx={{
            borderRadius: 2,
            px: isMobile ? 2 : 4,
            py: isMobile ? 1 : 1.5,
            height: isMobile ? 40 : 48,
            minWidth: isMobile ? '100%' : 160,
            width: isMobile ? '100%' : 'auto',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.6)',
            },
            '&:disabled': {
              background: 'grey.300',
              boxShadow: 'none',
            },
          }}
          startIcon={isLoading ? null : <GroupAdd />}
        >
          {isLoading ? 'Creating...' : 'Create Group'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGroupDialog;