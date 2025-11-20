import { Box, Card, Radio, Typography } from "@mui/material";

export function ThemeItem({themeId, url , title, subtitle , selected , onChange }) {
  return (
    <Card
      sx={{
        mt:1,
        width:"320px",
        bgcolor: "background.paper",
        borderRadius: "20px",
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box p={2.5}>
        <img
          src={url}
          alt="theme-item"
          width={"100%"}
        />
        <Typography variant="subtitle1" py={1}>
          {title}
        </Typography>
        <Typography variant="body2" textOverflow={"inherit"} color={"text.secondary"} sx={{whiteSpace: "normal", wordWrap: "break-word"}}>
          {subtitle}
        </Typography>
      </Box>
      <Box
        sx={{
          background:
            "linear-gradient(to right, #81459D 25%, #B168FF 25% 50%, #163C6D 50% 75%, #FFFFFF 75% 100%)",
          width: "100%",
          height: "3px",
          display: "grid",
        }}
      />
      <Box px={2.5} py={1} display={"flex"} justifyContent={"flex-end"} alignItems={"end"}>
        <Radio
          checked={themeId === selected}
          onChange={onChange}
          value={themeId}
          name="radio-buttons"
          inputProps={{ "aria-label": "A" }}
        />
      </Box>
    </Card>
  );
}
