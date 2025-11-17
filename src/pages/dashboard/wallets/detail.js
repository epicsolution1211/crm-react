import { useState, useEffect, useMemo } from "react";
import { subDays, subHours, subMinutes } from "date-fns";
import { useLocation, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import { WalletTransactions } from "src/sections/dashboard/wallets/wallet-transactions";
import { Iconify } from 'src/components/iconify';
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { WalletItem } from "src/sections/dashboard/wallets/wallet-item";
import { WalletReceiveModal } from "src/sections/dashboard/wallets/wallet-receive-modal";
import { WalletSendModal } from "src/sections/dashboard/wallets/wallet-send-modal";
import { paths } from "src/paths";
import { walletApi } from "src/api/wallet";
import { walletList } from "src/sections/dashboard/wallets/wallets-list";

const Page = () => {
  const { walletId } = useParams();
  const now = new Date();
  const { state } = useLocation();

  const [wallets, setWallets] = useState([]);

  const handleGetWalletList = async () => {
    try {
      const res = await walletApi.getWalletList();
      setWallets(res?.wallets);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const currentWallet = useMemo(() => {
    if (wallets) {
      const currentWallet = wallets[state?.wallet?.key];
      return currentWallet;
    }
  }, [wallets, state]);

  useEffect(() => {
    handleGetWalletList();
  }, []);

  const [openSendModal, setOpenSendModal] = useState(false);
  const [openReceiveModal, setOpenReceiveModal] = useState(false);

  return (
    <>
      <Seo title={`Dashboard: Wallets Transaction`} />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xl">
          <Stack sx={{ mb: 3 }}>
            <Box>
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.dashboard.wallets.index}
                sx={{
                  alignItems: "center",
                  display: "inline-flex",
                }}
                underline="hover"
              >
                <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Wallet</Typography>
              </Link>
            </Box>
            <Stack
              alignItems="end"
              direction={{
                xs: "column",
                md: "row",
              }}
              sx={{ mt: 2 }}
              justifyContent="space-between"
            >
              <Stack spacing={1}>
                <Typography variant="h4">Wallet Detail</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography variant="subtitle2">wallet_id</Typography>
                  <Chip label={walletId} size="small" />
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Container
            direction="column"
            maxWidth="lg"
            gap={3}
            sx={{ justifyContent: "center" }}
          >
            <Stack direction={"row"} justifyContent={"center"}>
              <Box sx={{ width: 550 }}>
                <WalletItem item={state?.wallet} info={currentWallet} />
              </Box>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              spacing={3}
              my={3}
            >
              <Button
                sx={{ width: 130 }}
                variant={"contained"}
                startIcon={<Iconify icon="material-symbols:download-sharp"/>}
                onClick={() => setOpenReceiveModal(true)}
              >
                Receive
              </Button>
              <Button
                sx={{ width: 130 }}
                variant={"contained"}
                onClick={() => setOpenSendModal(true)}
                startIcon={<Iconify icon="material-symbols:upload-sharp"/>}
              >
                Send
              </Button>
              <Button
                sx={{ width: 130 }}
                variant={"contained"}
                startIcon={<Iconify icon="uil:exchange"/>}
              >
                Swap
              </Button>
            </Stack>
            <WalletTransactions
              transactions={[
                {
                  id: "3cc450e88286fdd4e220c719",
                  amount: 0.1337,
                  balance: 4805,
                  coin: "BTC",
                  createdAt: subDays(
                    subHours(subMinutes(now, 43), 5),
                    3
                  ).getTime(),
                  operation: "add",
                  title: "Buy BTC",
                },
                {
                  id: "6442793e96a90d4e584a19f7",
                  amount: 0.2105,
                  balance: 2344,
                  coin: "BTC",
                  createdAt: subDays(
                    subHours(subMinutes(now, 32), 54),
                    6
                  ).getTime(),
                  operation: "sub",
                  title: "Sell BTC",
                },
              ]}
            />
          </Container>
        </Container>
      </Box>
      <WalletSendModal
        handleGetWalletList={handleGetWalletList}
        open={openSendModal}
        onClose={() => setOpenSendModal(false)}
        walletList={walletList?.filter(
          (item) => item?.key === state?.wallet?.key
        )}
        wallets={wallets}
      />
      <WalletReceiveModal
        open={openReceiveModal}
        onClose={() => setOpenReceiveModal(false)}
        walletList={walletList?.filter(
          (item) => item?.key === state?.wallet?.key
        )}
        wallets={wallets}
      />
    </>
  );
};

export default Page;
