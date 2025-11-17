import Grid from "@mui/material/Grid";
import { WalletItem } from "./wallet-item";
import { walletList } from "src/utils/constant/mock-data"

export const LandingWalletsList = () => {
  return (
    <Grid container spacing={4} sx={{ mt: 3 }}>
      {walletList.map((item, index) => (
        <Grid item xs={6} key={`${item.id}-${index}`}>
          <WalletItem item={item} />
        </Grid>
      ))}
    </Grid>
  );
};
