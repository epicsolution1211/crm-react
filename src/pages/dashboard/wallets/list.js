import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { Balance } from "src/sections/dashboard/wallets/balance";
import { Seo } from "src/components/seo";
import { WalletsList } from "src/sections/dashboard/wallets/wallets-list";
import { walletApi } from "src/api/wallet";

const Page = () => {
  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalBalance, setTotalBalance] = useState(undefined);

  const handleGetWalletList = async () => {
    setIsLoading(true);
    try {
      const res = await walletApi.getWalletList();
      setWallets(res?.wallets);
      setTotalBalance(res?.total_balance);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetWalletList();
  }, []);

  return (
    <>
      <Seo title={`Dashboard: Wallets `} />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="lg">
          <Stack spacing={3} sx={{ mb: 3 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4">Wallet</Typography>
            </Stack>
          </Stack>
          <Balance
            handleGetWalletList={handleGetWalletList}
            wallets={wallets}
            totalBalance={totalBalance}
            isLoading={isLoading}
          />
          <WalletsList wallets={wallets} />
        </Container>
      </Box>
    </>
  );
};

export default Page;
