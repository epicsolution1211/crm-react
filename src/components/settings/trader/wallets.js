import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CustomModal from "src/components/customize/custom-modal";
import { settingsApi } from "src/api/settings";
import { TableNoData } from "../../table-empty";
import { getAssetPath } from "src/utils/asset-path";

const tokenToImg = {
  Tron: getAssetPath("/assets/logos/tron-logo.svg"),
  Tether: getAssetPath("/assets/logos/tether-logo.svg"),
  Ethereum: getAssetPath("/assets/logos/ethereum-logo.svg"),
  Bitcoin: getAssetPath("/assets/logos/bitcoin-logo.svg"),
};

const validationSchema = Yup.object({
  address: Yup.string().required("Account address is required"),
  amount: Yup.string().required("Wallet amount is required"),
});

export const Wallets = ({ brandId }) => {
  const companyId = localStorage.getItem("company_id");

  const { register, handleSubmit, reset, formState : { errors, isSubmitting } } = useForm({resolver: yupResolver(validationSchema)});

  const [modalOpen, setModalOpen] = useState(false);
  const [walletsData, setWalletsData] = useState([]);

  const [selectedChain, setSelectedChain] = useState();

  const onSubmit = async (data) => {
    try {
      await settingsApi.withdrawWallet({
        ...data,
        wallet_chain: selectedChain?.name?.toLowerCase(),
      });
      toast(`Withdraw successfully created!`);
    } catch (error) {
      toast(error?.response?.data?.message);
    } finally {
      setModalOpen(false);
    }
  };

  const handleChangeChecked = (index, enabled) => {
    const newTableData = [...walletsData];
    newTableData[index].enabled = enabled;
    setWalletsData(newTableData ?? []);
  };

  const getWalletData = async () => {
    try {
      const res = await settingsApi.getCompanyWallet({ company_id: companyId, internal_brand_id: brandId });
      setWalletsData(res.wallets ?? []);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const updateWallets = async (id, enabled) => {
    try {
      await settingsApi.updateCompanyWallet(id, {
        id,
        enabled: enabled,
        internal_brand_id: brandId,
      });
      toast(`Wallet successfully updated!`);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    getWalletData();
  }, [brandId, companyId]);

  return (
    <>
      <Stack
        sx={{
          height: "100%",
          px: 1,
        }}
      >
        <Stack sx={{ gap: 1, pb: 3 }}>
          <Typography variant="h6" sx={{ color: "text.primary" }}>
            Wallets
          </Typography>
        </Stack>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Crypto</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Balance</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {walletsData?.map((item, index) => {
              return (
                <TableRow key={item.id} hover>
                  <TableCell align="center">
                    <>
                      <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Box>
                          <img
                            src={tokenToImg[item?.name]}
                            alt="Wallet"
                            style={{ height: 50, width: 70, objectFit: "fill" }} />
                        </Box>
                        <Stack>
                          <Typography variant="h6">{item?.name}</Typography>
                          <Typography sx={{ fontSize: 12 }}>
                            {item?.contract}
                          </Typography>
                        </Stack>
                      </Stack>
                    </>
                    {(item?.contract === "erc20" || item?.contract === "trc20")  && (
                      <Typography variant="caption" noWrap>
                        {`Note: Pending balance requires ${item?.contract === "erc20"?"Ethereum":"Tron"}`}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">{item?.address}</TableCell>
                  <TableCell align="center">{item?.balance}</TableCell>
                  <TableCell align="center">
                    <Stack
                      direction="row"
                      sx={{ gap: 2 }}
                      justifyContent="center"
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={!item?.enabled}
                        onClick={() => {
                          setModalOpen(true);
                          setSelectedChain({
                            name: item?.name,
                            contract: item?.contract,
                          });
                          reset();
                        } }
                      >
                        Withdraw
                      </Button>
                      <Switch
                        checked={item?.enabled}
                        onChange={(event) => {
                          updateWallets(item?.id, event?.target?.checked);
                          handleChangeChecked(index, event?.target?.checked);
                        } } />
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {walletsData?.length === 0 && <TableNoData />}
      </Stack>
      <CustomModal onClose={() => setModalOpen(false)} open={modalOpen}>
        <Stack sx={{ textAlign: "center", gap: 2 }}>
          <Typography
            id="modal-modal-title"
            sx={{ fontSize: 22, fontWeight: "bold" }}
          >
            Withdraw
          </Typography>
          <Typography id="modal-modal-title" sx={{ fontSize: 18 }}>
            {`Chain: ${selectedChain?.contract}`}
          </Typography>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} paddingBottom={3} paddingTop={3}>
            <TextField
              error={!!(errors?.address?.message)}
              fullWidth
              helperText={errors?.address?.message}
              label="Wallet address"
              {...register('address')}
            />
            <TextField
              error={!!(errors?.amount?.message)}
              fullWidth
              helperText={errors?.amount?.message}
              label="Wallet amount"
              type="number"
              {...register('amount')}
            />
          </Stack>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            sx={{ px: 1 }}
          >
            <Grid item xs={6} md={6}>
              <Button
                style={{ width: "90%" }}
                variant="contained"
                disabled={isSubmitting}
                type="onSubmit"
              >
                Withdraw
              </Button>
            </Grid>
            <Grid
              item
              xs={6}
              md={6}
              sx={{ display: "flex", justifyContent: "end" }}
            >
              <Button
                style={{ width: "90%" }}
                variant="outlined"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </CustomModal>
    </>
  );
};
