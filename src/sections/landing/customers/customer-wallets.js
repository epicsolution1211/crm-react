import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { Iconify } from 'src/components/iconify';

const tableRows = ["Crypto", "ID", "Address", "Balance", "Enabled", "Edit"];

const tokenToImg = {
  Tron: "https://cryptologos.cc/logos/tron-trx-logo.svg?v=024",
  Tether: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=024",
  Ethereum: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026",
  Bitcoin: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=029",
};

export const LandingCustomerWallets = () => {

  const walletMockedList = [
    {
      id: 11,
      name: "Tron",
      contract: "trx",
      address: "TKLgJ1czHJMe4Xh44nZAPfxe2pyTQQahG3",
      balance: 255,
      enabled: true,
    },
    {
      id: 11,
      name: "Tether",
      contract: "trc20",
      address: "TKLgJ1czHJMe4Xh44nZAPfxe2pyTQQahG3",
      balance: 255,
      enabled: true,
    },
    {
      id: 115,
      name: "Ethereum",
      contract: "eth",
      address: "0x60Ab4951ED00893561DC49C0A4B4eAfABBd9d225",
      balance: 255,
      enabled: true,
    },
    {
      id: 115,
      name: "Tether",
      contract: "erc20",
      address: "0x60Ab4951ED00893561DC49C0A4B4eAfABBd9d225",
      balance: 255,
      enabled: true,
    },
    {
      id: 204,
      name: "Bitcoin",
      contract: "btc",
      address: "18WH6zLpKEHu1zJCYsWPue9ABGsrgMFX6T",
      balance: 255,
      enabled: true,
    },
  ]

  return (
    <Card sx={{ pb: 2 }}>
      <CardHeader title="Wallets" />
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow sx={{ whiteSpace: "nowrap" }}>
              {tableRows?.map((item) => (
                <TableCell key={item}>{item}</TableCell>
              ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {(walletMockedList
              ?.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <>
                      <Stack direction="row" alignItems="center">
                        <Box>
                          <img
                            src={tokenToImg[item?.name]}
                            alt="Wallet"
                            style={{ height: 50, width: 70, objectFit: "fill" }}
                          />
                        </Box>
                        <Stack>
                          <Typography variant="h6">{item?.name}</Typography>
                          <Typography sx={{ fontSize: 12 }}>
                            {item?.contract}
                          </Typography>
                        </Stack>
                      </Stack>
                    </>
                  </TableCell>
                  <TableCell>{item?.id}</TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="h7">{item?.address}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{item?.balance}</TableCell>
                  <TableCell>
                    <SeverityPill color={item?.enabled ? "success" : "error"}>
                      {item?.enabled ? "Active" : "InActive"}
                    </SeverityPill>
                  </TableCell>
                  <TableCell>
                    <IconButton sx={{ p: 0 }}>
                      <Iconify icon="mage:edit" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
};
