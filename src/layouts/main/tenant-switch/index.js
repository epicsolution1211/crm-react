import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSettings } from "src/hooks/use-settings";

export const TenantSwitch = ({ isTop, ...props }) => {

  const settings = useSettings();

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
        {...props}>
        <Box
          sx={{
            display: {
              xs: (settings?.layout === "horizontal" && isTop) ? 'none' : 'block',
              md: 'block'
            }
          }}
          gap={1}
        >
          <Typography
            color="inherit"
            sx={{
              py: 0,
            }}>
            CRM
          </Typography>
        </Box>
      </Stack>
    </>
  );
};
