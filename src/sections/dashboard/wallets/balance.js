import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { PuffLoader } from "react-spinners";

import { Iconify } from 'src/components/iconify';
import { BalancePieChat } from "./balance-chart";
import { WalletReceiveModal } from "src/sections/dashboard/wallets/wallet-receive-modal";
import { WalletSendModal } from "src/sections/dashboard/wallets/wallet-send-modal";
import { walletList } from "./wallets-list";
import { blue, green, indigo } from "src/theme/colors";

export const Balance = ({
  wallets,
  totalBalance,
  isLoading,
  handleGetWalletList,
}) => {
  const theme = useTheme();
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  const colorInfo = {
    tron: theme.palette.error.main,
    trc20: "#FF6969",
    ethereum: green.main,
    erc20: "#00DFA2",
    binance_smart_chain: theme.palette.warning.main,
    bsc20: "#F4D160",
    usdc_eth: blue.main,
    usdc_bsc: theme.palette.info.main,
    solana: indigo.main,
  };

  const walletChartInfo = useMemo(() => {
    if (wallets) {
      const balance = walletList?.map((item) => ({
        id: wallets[item.key]?.id,
        name: item.label,
        value: wallets[item.key]?.balance
          ? parseFloat(wallets[item.key]?.balance)
          : 0,
        unit: item.unit,
        color: colorInfo[item.key],
      }));
      return balance;
    }
  }, [wallets]);

  return (
    <Card>
      <CardHeader
        title={
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Stack spacing={0.5}>
              <Typography variant={"h6"} fontSize={12}>
                Current Balance
              </Typography>
              <Typography sx={{ opacity: ".5" }}>
                Balance across all your accounts
              </Typography>
            </Stack>

            <Stack direction={"row"} alignItems={"center"} spacing={3}>
              <Tooltip title="Reload Table">
                <IconButton
                  onClick={() => handleGetWalletList()}
                  sx={{ '&:hover': { color: 'primary.main', transform: 'rotate(180deg)', }, transition: 'transform 0.3s' }}
                >
                  <Iconify icon="ion:reload-sharp"/>
                </IconButton>
              </Tooltip>
              <Button
                onClick={() => setReceiveOpen(true)}
                sx={{ width: 130 }}
                variant={"contained"}
                startIcon={<Iconify icon="material-symbols:download-sharp"/>}
              >
                Receive
              </Button>
              <Button
                onClick={() => setSendOpen(true)}
                sx={{ width: 130 }}
                variant={"contained"}
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
          </Stack>
        }
      />
      <CardContent sx={{ p: 0, "&:last-child": { pb: "8px" } }}>
        {isLoading ? (
          <Stack
            sx={{ width: 1, height: 495, pb: 6 }}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <PuffLoader color={theme.palette.primary.main} size={90} />
          </Stack>
        ) : (
          <Stack
            direction={"row"}
            justifyContent="center"
            alignItems={"center"}
            sx={{
              mt: 3,
              width: "100%",
              p: "25px",
              px: totalBalance && totalBalance > 0 ? 4 : 10,
              gap: 4,
              pb: 5,
            }}
          >
            {totalBalance && totalBalance > 0 ? (
              <BalancePieChat
                walletChartInfo={walletChartInfo}
                isLoading={false}
              />
            ) : null}
            <Stack alignItems={"flex-start"} spacing={2} sx={{ width: "100%" }}>
              <Typography fontWeight={600} fontSize={13} sx={{ opacity: ".6" }}>
                TOTAL BALANCE
              </Typography>
              <Typography variant="h4">
                $ {isLoading ? 0 : totalBalance ?? 0}
              </Typography>
              <Typography fontWeight={600} fontSize={13} sx={{ opacity: ".6" }}>
                AVAILABLE CURRENCY
              </Typography>

              <Stack spacing={1} sx={{ width: "100%" }}>
                {walletChartInfo?.map((item, index) => (
                  <Stack
                    key={`${item.id}-${index}`}
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                      <Box
                        sx={{
                          backgroundColor: item.color,
                          width: 15,
                          height: 15,
                          borderRadius: "3px",
                        }}
                      />
                      <Typography fontWeight={600}>{item?.name}</Typography>
                    </Stack>

                    <Typography sx={{ opacity: ".6" }}>
                      {item?.value} {item?.unit ?? 0}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>
        )}
      </CardContent>

      <WalletReceiveModal
        walletList={walletList}
        wallets={wallets}
        open={receiveOpen}
        onClose={() => setReceiveOpen(false)}
      />

      <WalletSendModal
        walletList={walletList}
        wallets={wallets}
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        handleGetWalletList={handleGetWalletList}
      />
    </Card>
  );
};
