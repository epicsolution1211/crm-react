import { useMemo } from "react";
import numeral from 'numeral';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import { Iconify } from 'src/components/iconify';
import { BalancePieChat } from "./balance-chart";
import { blue, green, indigo } from "src/theme/colors";
import { walletList } from "src/utils/constant/mock-data";

export const WalletBalance = () => {
  const theme = useTheme();

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
    const balance = walletList?.map((item) => ({
      name: item.label,
      value: item.tempValue,
      unit: '$',
      color: colorInfo[item.key],
    }));
    return balance;
  }, []);

  const totalAmount = walletList.reduce((acc, asset) => acc += asset.tempValue, 0);
  const formattedTotalAmount = numeral(totalAmount).format('$0,0.00');

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
              <Button
                sx={{ width: 130 }}
                variant={"contained"}
                startIcon={<Iconify icon="material-symbols:download-sharp"/>}
              >
                Receive
              </Button>
              <Button
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

        <Stack
          direction={"row"}
          justifyContent="center"
          alignItems={"center"}
          sx={{
            mt: 3,
            width: "100%",
            p: "25px",
            px: 4,
            gap: 4,
            pb: 5,
          }}
        >
          <BalancePieChat
            walletChartInfo={walletChartInfo}
            isLoading={false}
          />
          <Stack alignItems={"flex-start"} spacing={2} sx={{ width: "100%" }}>
            <Typography fontWeight={600} fontSize={13} sx={{ opacity: ".6" }}>
              TOTAL BALANCE
            </Typography>
            <Typography variant="h4">
              {formattedTotalAmount}
            </Typography>
            <Typography fontWeight={600} fontSize={13} sx={{ opacity: ".6" }}>
              AVAILABLE CURRENCY
            </Typography>

            <Stack spacing={1} sx={{ width: "100%" }}>
              {walletChartInfo?.map((item, index) => (
                <Stack
                  key={index}
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
                    {numeral(item.value).format('$0,0.00')}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>

    </Card>
  );
};
