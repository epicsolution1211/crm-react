import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

import { EditWalletModal } from "./customer-wallet-edit-dialog";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { customersApi } from "src/api/customers";
import { toast } from "react-hot-toast";
import { useAuth } from "src/hooks/use-auth";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { ContentCopy } from "@mui/icons-material";

const tableRows = ["Crypto", "ID", "Address", "Balance", "Enabled"];

const noEditTableRows = ["Crypto", "Address", "Enabled"];

const tokenToImg = {
  Tron: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png',
  Tether: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
  Ethereum: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  Bitcoin: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
};

export const CustomerWallets = (props) => {
  const { customerId, ...other } = props;
  const { company, user } = useAuth();

  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editWallet, setEditWallet] = useState(null);

  const getWallets = async () => {
    setIsLoading(true);
    try {
      const res = await customersApi.getCustomerWallets({
        client_id: customerId,
      });
      setWallets(res.wallets ?? []);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  // const handleOpenEditModal = useCallback((wallet) => {
  //   setEditWallet(wallet);
  //   setOpenEditModal(true);
  // }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditWallet(null);
    setOpenEditModal(false);
  }, []);

  const handleUpdateWallet = useCallback(async (id, data) => {
    try {
      await customersApi.updateCustomerWallet(id, data);
      toast.success("Wallet address successfully updated!");
      handleCloseEditModal();

      setTimeout(() => getWallets(), 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  useEffect(() => {
    getWallets();
  }, []);

  return (
    <Card {...other} sx={{ pb: 2 }}>
      <CardHeader title="Wallets" />
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow sx={{ whiteSpace: "nowrap" }}>
              {company?.wallet_edit || user?.acc?.acc_e_client_walletl
                ? tableRows?.map((item) => (
                    <TableCell key={item}>{item}</TableCell>
                  ))
                : noEditTableRows?.map((item) => (
                    <TableCell key={item}>{item}</TableCell>
                  ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton cellCount={5} rowCount={5} />
            ) : (
              Object.values(wallets)
                ?.flat()
                ?.filter((wallet) => {
                  if (wallet.enabled) {
                    return (
                      user?.acc?.acc_v_active_wallets === undefined ||
                      user?.acc?.acc_v_active_wallets
                    );
                  } else {
                    return (
                      user?.acc?.acc_v_inactive_wallets === undefined ||
                      user?.acc?.acc_v_inactive_wallets
                    );
                  }
                })
                ?.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <>
                        <Stack direction="row" alignItems="center">
                          <Box>
                            <img
                              src={tokenToImg[item?.name]}
                              alt="Wallet"
                              style={{
                                height: 50,
                                width: 70,
                                objectFit: "fill",
                              }}
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
                        <IconButton
                          edge="end"
                          onClick={() => copyToClipboard(item?.address)}
                        >
                          <ContentCopy color="success" fontSize="small" />
                        </IconButton>
                        {item?.edited && (
                          <SeverityPill color={"info"}>Edited</SeverityPill>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>{item?.balance}</TableCell>
                    <TableCell>
                      {item?.enabled}
                      <SeverityPill color={item?.enabled ? "success" : "error"}>
                        {item?.enabled ? "Active" : "InActive"}
                      </SeverityPill>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        {wallets?.length === 0 && !isLoading && <TableNoData />}
      </Scrollbar>

      {editWallet ? (
        <EditWalletModal
          open={openEditModal}
          onClose={handleCloseEditModal}
          wallet={editWallet}
          handleUpdateWallet={handleUpdateWallet}
        />
      ) : null}
    </Card>
  );
};

CustomerWallets.propTypes = {
  customerId: PropTypes.string,
};
