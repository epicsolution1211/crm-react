import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/system/colorManipulator";

import { Iconify } from "src/components/iconify";

export const Offers = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 280px)",
        px: 3,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          maxWidth: 400,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              bgcolor: alpha("#00bbff", 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px dashed ${alpha("#00bbff", 0.3)}`,
            }}
          >
            <Iconify
              icon="mdi:gift-outline"
              sx={{
                width: 60,
                height: 60,
                color: "#00bbff",
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            mb: 1.5,
          }}
        >
          Coming Soon
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            lineHeight: 1.6,
          }}
        >
          We're working on bringing you exciting offers from payment providers.
          Stay tuned for updates!
        </Typography>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            gap: 1,
          }}
        >
          {[1, 2, 3].map((dot) => (
            <Box
              key={dot}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: alpha("#00bbff", 0.3),
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${(dot - 1) * 0.2}s`,
                "@keyframes pulse": {
                  "0%, 100%": {
                    opacity: 0.3,
                    transform: "scale(1)",
                  },
                  "50%": {
                    opacity: 1,
                    transform: "scale(1.2)",
                  },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

