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
  IconButton,
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
        borderRadius: "20px !important",
        width: "15vw !important",
        margin: "1rem auto !important",
        background: "linear-gradient(135deg, #fdfbfb, #ebedee) !important",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15) !important",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important",
        position: "relative !important",
        overflow: "hidden !important",
        "&:hover": {
          transform: "translateY(-8px) !important",
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
      <CardContent sx={{ padding: "1.5rem !important" }}>
        <Typography
          variant="h6"
          sx={{
            color: "#5c6bc0 !important",
            fontWeight: "bold !important",
            fontSize: "1.4rem !important",
            textAlign: "center !important",
            marginBottom: "1rem !important",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1) !important",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "40px",
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
            fontSize: "1rem !important",
            fontWeight: "600 !important",
            color: "#333 !important",
            marginBottom: "1rem !important",
            textAlign: "center !important",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <PeopleAltIcon sx={{ color: "#7e57c2" }} />
          <strong>Members</strong>
        </Typography>

        <AvatarGroup
          max={4}
          sx={{
            justifyContent: "center",
            marginBottom: "1rem",
            "& .MuiAvatar-root": {
              border: "2px solid #fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            },
          }}
        >
          {group.members.map((member, idx) => (
            <Tooltip key={idx} title={member.name}>
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
            padding: "0",
            margin: "0",
            textAlign: "center",
            color: "#555",
            fontWeight: "500",
          }}
        >
          {group.members.map((member, idx) => (
            <li
              key={idx}
              style={{
                marginBottom: "4px",
                fontSize: "0.95rem",
                transition: "all 0.2s ease",
                opacity: isHovered ? 1 : 0.8,
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
          padding: "1rem !important",
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
            padding: "10px 24px !important",
            backgroundColor: "#7e57c2 !important",
            color: "#fff !important",
            boxShadow: "0 4px 10px rgba(126, 87, 194, 0.3) !important",
            transition: "all 0.3s ease !important",
            "&:hover": {
              backgroundColor: "#5e35b1 !important",
              boxShadow: "0 6px 14px rgba(94, 53, 177, 0.4) !important",
              transform: "translateX(4px)",
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
