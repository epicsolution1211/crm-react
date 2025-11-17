import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { useState } from "react";
import toast from "react-hot-toast";
import { conversationApi } from "src/api/conversation";
import SaveIcon from "@mui/icons-material/Save";

export const ChatName = ({
  conversationId,
  name: initName,
  access,
  getConversationList = () => {},
}) => {
  const [name, setName] = useState(initName);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || name === initName) return;
    
    setIsLoading(true);
    try {
      await conversationApi.updateConversation(conversationId, {
        name: name.trim(),
      });
      toast.success("Conversation name successfully updated!");
      getConversationList();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update conversation name");
      console.error("error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSave();
    }
  };

  if (!access) {
    return (
      <Typography variant="h5">{name}</Typography>
    )
  }

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
      <TextField
        fullWidth
        autoFocus
        InputLabelProps={{ shrink: true }}
        label="Name"
        name="name"
        type="text"
        value={name}
        onChange={(e) => setName(e?.target?.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <Button
        variant="contained"
        onClick={handleSave}
        disabled={!name.trim() || name === initName || isLoading}
        startIcon={isLoading ? null : <SaveIcon />}
        sx={{
          minWidth: "auto",
          px: 2,
          py: 1.5,
          height: "56px",
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </Box>
  );
};
