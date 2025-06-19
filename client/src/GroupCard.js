import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  AvatarGroup,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const GroupCard = ({ group, currUser }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleSettlePayments = () => {
    navigate(`/group/${group.groupName}`, { state: { group, currUser } });
  };

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        borderRadius: { xs: '14px', sm: '18px', md: '20px' },
        width: { xs: '90vw', sm: '50vw', md: '22vw', lg: '16vw', xl: '12vw' },
        minWidth: { xs: '220px', sm: '260px', md: '280px' },
        maxWidth: { xs: '96vw', sm: '340px', md: '360px' },
        margin: { xs: '1rem auto', md: '1.5rem auto' },
        background: "linear-gradient(135deg, #fdfbfb, #ebedee) !important",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15) !important",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important",
        position: "relative !important",
        overflow: "hidden !important",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02) !important",
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.25) !important",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",
          background: "linear-gradient(90deg, #7e57c2, #5c6bc0)",
          transform: isHovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.3s ease-in-out",
        },
      }}
    >
      <CardContent sx={{ padding: { xs: '1rem', sm: '1.5rem' } }}>
        <Typography
          variant="h6"
          sx={{
            color: "#5c6bc0 !important",
            fontWeight: "bold !important",
            fontSize: { xs: "1.1rem !important", sm: "1.3rem !important", md: "1.4rem !important" },
            textAlign: "center !important",
            marginBottom: { xs: "0.7rem !important", sm: "1rem !important" },
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1) !important",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: { xs: "28px", sm: "40px" },
              height: "3px",
              background: "linear-gradient(90deg, #7e57c2, #5c6bc0)",
              borderRadius: "2px",
            },
          }}
          gutterBottom
        >
          {group.groupName}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "0.95rem !important", sm: "1rem !important" },
            fontWeight: "600 !important",
            color: "#333 !important",
            marginBottom: { xs: "0.7rem !important", sm: "1rem !important" },
            textAlign: "center !important",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <PeopleAltIcon sx={{ color: "#7e57c2", fontSize: { xs: 20, sm: 24 } }} />
          <strong>Members</strong>
        </Typography>

        <AvatarGroup
          max={4}
          sx={{
            justifyContent: "center",
            marginBottom: { xs: "0.7rem", sm: "1rem" },
            "& .MuiAvatar-root": {
              border: "2px solid #fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              fontSize: { xs: 16, sm: 20 },
            },
          }}
        >
          {group.members.map((member, idx) => (
            <Tooltip key={idx} title={member.name} arrow>
              <Avatar
                sx={{
                  bgcolor: `hsl(${(idx * 137.5) % 360}, 70%, 50%)`,
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                {member.name.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          ))}
        </AvatarGroup>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            textAlign: "center",
            color: "#555",
            fontWeight: 500,
            maxHeight: '120px',
            overflowY: group.members.length > 5 ? 'auto' : 'visible',
            marginBottom: '0.5rem',
          }}
        >
          {group.members.map((member, idx) => (
            <li
              key={idx}
              style={{
                marginBottom: "4px",
                fontSize: "0.95rem",
                transition: "all 0.2s ease",
                opacity: isHovered ? 1 : 0.85,
                padding: '2px 0',
              }}
            >
              {member.name}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardActions
        sx={{
          display: "flex !important",
          justifyContent: "center !important",
          padding: { xs: "0.7rem !important", sm: "1rem !important" },
          background: "linear-gradient(to top, rgba(126, 87, 194, 0.05), transparent)",
        }}
      >
        <Button
          size="small"
          color="secondary"
          onClick={handleSettlePayments}
          endIcon={<ArrowForwardIcon />}
          sx={{
            borderRadius: "30px !important",
            textTransform: "capitalize !important",
            padding: { xs: "8px 18px !important", sm: "10px 24px !important" },
            backgroundColor: "#7e57c2 !important",
            color: "#fff !important",
            fontSize: { xs: '0.95rem', sm: '1rem' },
            boxShadow: "0 4px 10px rgba(126, 87, 194, 0.3) !important",
            transition: "all 0.3s ease !important",
            "&:hover": {
              backgroundColor: "#5e35b1 !important",
              boxShadow: "0 6px 14px rgba(94, 53, 177, 0.4) !important",
              transform: "translateX(4px) scale(1.04)",
            },
          }}
        >
          Settle Payments
        </Button>
      </CardActions>
    </Card>
  );
};

export default GroupCard;
