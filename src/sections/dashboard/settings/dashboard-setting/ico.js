import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { CreateIcoOffer } from "./create-ico-offer";
import { clientDashboardApi } from "src/api/client-dashboard";
import { Offers } from "./offers";

export const ICO = ({ brandId }) => {
  const [createOpen, setCreateOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getOffers = async () => {
    try {
      setIsLoading(true);
      const res = await clientDashboardApi.getIcoOffers();
      setOffers(res?.ico_offers);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getOffers();
  }, []);

  return (
    <Stack sx={{ height: 1, p: { xs: 2, md: 4 }, bgcolor: 'background.paper', flexDirection: 'column', gap: 1.5 }}>
      <Stack sx={{ width: 1, mt: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <Button variant="contained" onClick={() => setCreateOpen(true)}>
            + Add
          </Button>
        </Stack>
      </Stack>

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <CircularProgress
            size={70}
            sx={{ alignSelf: "center", justifySelf: "center" }}
          />
        </Box>
      ) : (
        <Offers offers={offers} onGetOffers={getOffers} />
      )}

      <CreateIcoOffer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        brandId={brandId}
        onGetOffers={getOffers}
      />
    </Stack>
  );
};
