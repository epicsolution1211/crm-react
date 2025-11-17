import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useAuth } from "src/hooks/use-auth";

export const PayWallLayout = (props) => {
  const { company } = useAuth();

  if (company?.list_filtering) {
    return (
      <>
        <Box sx={{ filter: "blur(5px)" }}>{props?.children}</Box>
        <Stack
          alignItems="center"
          spacing={3}
          sx={{ position: "fixed", top: "50%", left: "40%" }}
        >
          <Typography variant="h6">This feature is part of Pro plan</Typography>
          <Typography variant="h7">
            Book a demo with us to show you full power of this feature
          </Typography>
          <Button variant="contained" onClick={() => window.open("https://octolit.link/contact")}>Book a demo</Button>
        </Stack>
      </>
    );
  } else {
    return props?.children;
  }
};
