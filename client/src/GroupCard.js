import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const GroupCard = ({ group, currUser }) => {
  const navigate = useNavigate();

  const handleSettlePayments = () => {
    navigate(`/group/${group.groupName}`, { state: { group, currUser } });
  };

  return (
    <Card
      sx={{
        borderRadius: "20px !important",
        width: "15vw !important",
        margin: "1rem auto !important",
        background: "linear-gradient(135deg, #fdfbfb, #ebedee) !important",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15) !important",
        transition: "all 0.3s ease-in-out !important",
        "&:hover": {
          transform: "scale(1.03) !important",
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.25) !important",
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            color: "#5c6bc0 !important",
            fontWeight: "bold !important",
            fontSize: "1.4rem !important",
            textAlign: "center !important",
            marginBottom: "0.5rem !important",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1) !important",
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
            marginBottom: "0.3rem !important",
            textAlign: "center !important",
          }}
        >
          <strong>Members:</strong>
        </Typography>

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
            <li key={idx} style={{ marginBottom: "4px", fontSize: "0.95rem" }}>
              {member.name}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardActions
        sx={{
          display: "flex !important",
          justifyContent: "center !important",
          paddingBottom: "1rem !important",
        }}
      >
        <Button
          size="small"
          color="secondary"
          onClick={handleSettlePayments}
          sx={{
            borderRadius: "30px !important",
            textTransform: "capitalize !important",
            padding: "8px 16px !important",
            backgroundColor: "#7e57c2 !important",
            color: "#fff !important",
            boxShadow: "0 4px 10px rgba(126, 87, 194, 0.3) !important",
            "&:hover": {
              backgroundColor: "#5e35b1 !important",
              boxShadow: "0 6px 14px rgba(94, 53, 177, 0.4) !important",
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
