import { useState, useMemo, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/system/Unstable_Grid/Grid";
import MenuItem from "@mui/material/MenuItem";
import LoadingButton from '@mui/lab/LoadingButton';
import Select from "@mui/material/Select";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";

import { v4 as uuid4 } from "uuid";
import { validate } from "wallet-validator-js";

import { Iconify } from 'src/components/iconify';
import { walletApi } from "src/api/wallet";

export const WalletSendModal = ({
  open,
  onClose,
  wallets,
  walletList,
  handleGetWalletList,
}) => {
  const [selectedWallet, setSelectedWallet] = useState(walletList[0]?.key);

  const [coinAmount, setCoinAmount] = useState();
  const [usdAmount, setUsdAmount] = useState();

  const currentWallet = useMemo(() => {
    if (wallets) {
      const current = wallets[selectedWallet];
      return current;
    }
  }, [wallets, selectedWallet]);

  useEffect(() => {
    setCoinAmount("");
    setUsdAmount("");
    setSelectedWallet(walletList[0]?.key);
  }, [open, walletList]);

  const [receiverValue, setReceiverValue] = useState("");
  const [destination, setDestination] = useState("");

  const [receiverOption, setReceiverOption] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleGetUserWallets = async () => {
    try {
      const contract = currentWallet?.contract;
      const params = {
        contract,
        wallet_id: currentWallet?.id,
        active: true,
      };
      const res = await walletApi.getUsersAddressByContract(params);
      const filterOption = res?.accounts?.map((item) => ({
        id: item?.id,
        label: `${item?.first_name} ${item?.last_name}`,
        address: item?.wallet_address,
      }));
      setReceiverOption(filterOption);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const handleCreateTransaction = async () => {
    setIsLoading(true);
    try {
      const request = {
        destination,
        contract: currentWallet?.contract,
        wallet_id: currentWallet?.id,
        amount: parseFloat(coinAmount),
      };
      await walletApi.handleCryptoSend(request);
      handleGetWalletList();
      toast.success("Transaction is done successfully!");
    } catch (error) {
      if (
        error?.response?.data?.message?.includes(
          'Error {"message":"insufficient funds for intrinsic transaction cost'
        )
      ) {
        toast.error("You don't have enough money!");
      } else if (
        error?.response?.data?.message?.includes(
          'Error {"error":"Contract validate error'
        ) ||
        error?.response?.data?.message?.includes(
          'Error {"message":"Contract failed!","result":{"code":"CONTRACT_VALIDATE_ERROR'
        )
      ) {
        toast.error("This wallet is not active yet");
      } else {
        toast.error(
          error?.response?.data?.message?.match(/"([^"]+)"/)[1] ??
            error?.message
        );
      }
    }
    setIsLoading(false);
    onClose();
  };

  const handleValidateAddress = () => {
    const currencyInfo = {
      tron: "trx",
      trc20: "trx",
      ethereum: "eth",
      erc20: "eth",
      binance_smart_chain: "bnb",
      bsc20: "bnb",
      usdc_eth: "usdc",
      usdc_bsc: "usdc",
      solana: "sol",
    };
    const isValid = validate(
      receiverValue,
      currencyInfo[selectedWallet],
      "prod"
    );

    if (isValid) {
      const newOption = {
        id: uuid4(),
        label: receiverValue,
        address: receiverValue,
      };
      const existOption = [...receiverOption];
      if (!existOption?.some((item) => item?.address === receiverValue)) {
        setReceiverOption((prev) => [...prev, newOption]);
      }
    }
  };

  useEffect(() => {
    handleValidateAddress();
  }, [receiverValue]);

  useEffect(() => {
    handleGetUserWallets();
  }, [selectedWallet]);

  const steps = [
    {
      label: "Coin",
      render: () => (
        <Stack direction="column" gap={2}>
          <Typography>Choose a wallets</Typography>
          <Select
            sx={{ width: "100%" }}
            value={selectedWallet}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 220,
                  width: 1,
                },
              },
            }}
            onChange={(event) => setSelectedWallet(event?.target?.value)}
          >
            {walletList?.map((item) => (
              <MenuItem key={item?.key} value={item?.key}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Box
                    component="img"
                    src={item?.logo}
                    sx={{
                      height: 20,
                      width: 20,
                    }}
                  />
                  <Typography>{item?.label}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
          <Stack direction="row" gap={2} alignItems={"start"}>
            <Typography>Available balance:</Typography>
            <Stack direction="column" gap={1}>
              <Typography>
                {currentWallet?.balance ?? 0.0}{" "}
                {walletList?.find((item) => item?.key === selectedWallet)?.unit}
              </Typography>
              <Typography>$ {currentWallet?.usd_balance ?? 0.0}</Typography>
            </Stack>
          </Stack>
        </Stack>
      ),
    },
    {
      label: "Receiver",
      render: () => (
        <Stack direction="column" gap={1}>
          <Typography>Type a name or wallet address of the receiver</Typography>
          <Autocomplete
            ListboxProps={{ sx: { maxHeight: 200 } }}
            options={receiverOption}
            onChange={(event, newValue) => {
              if (newValue) {
                setReceiverValue(newValue.id);
                setDestination(newValue?.address);
              }
            }}
            sx={{ width: 1, height: 50 }}
            renderInput={(params) => (
              <TextField
                {...params}
                value={receiverValue}
                onChange={(event) => {
                  setReceiverValue(event?.target?.value);
                  setDestination("");
                }}
                hiddenLabel
              />
            )}
          />
        </Stack>
      ),
    },
    {
      label: "Amount",
      render: () => (
        <Stack direction="column" gap={1}>
          <Typography>Type amount to send</Typography>
          <Stack direction="row" gap={1} alignItems="center">
            <Stack gap={1} alignItems="center" direction="row">
              <TextField
                value={coinAmount}
                onChange={(event) => {
                  setCoinAmount(event?.target?.value);
                  setUsdAmount(
                    event?.target?.value
                      ? (
                          currentWallet.current_value * event?.target?.value
                        ).toFixed(5)
                      : ""
                  );
                }}
                type="number"
                hiddenLabel
                fullWidth
              />
              <Typography>
                {walletList?.find((item) => item?.key === selectedWallet)?.unit}
              </Typography>
            </Stack>
            <Typography>=</Typography>
            <Stack gap={1} alignItems="center" direction="row">
              <TextField
                type="number"
                value={usdAmount}
                onChange={(event) => {
                  setUsdAmount(event?.target?.value);
                  setCoinAmount(
                    event?.target?.value
                      ? (
                          currentWallet.current_value / event?.target?.value
                        ).toFixed(5)
                      : ""
                  );
                }}
                hiddenLabel
                fullWidth
              />
              <Typography>USD</Typography>
            </Stack>
          </Stack>
        </Stack>
      ),
    },
    {
      label: "Verify & Send",
      render: () => (
        <Stack direction="column" gap={1}>
          <Typography>
            Please write verification code from Authenticator app
          </Typography>
          <Grid container>
            <Grid xs={6}>
              <Stack sx={{ pr: 2 }}>
                <TextField hiddenLabel fullWidth />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Stack
                direction="row"
                sx={{ height: 1 }}
                justifyContent="center"
                alignItems="center"
              >
                <LoadingButton
                  sx={{ width: 180 }}
                  onClick={() => handleCreateTransaction()}
                  disabled={!coinAmount || !destination || isLoading}
                  loading={isLoading}
                  variant="contained"
                >
                  <Typography variant="subtitle2" py={"1px"}>
                    Send
                  </Typography>
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      ),
    },
  ];

  useEffect(() => {}, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="md" sx={{ p: 3 }}>
        <Stack direction="column" spacing={3}>
          <Stack
            py={2}
            direction="row"
            gap={1}
            alignItems={"center"}
            justifyContent="center"
          >
            <Iconify icon="material-symbols:upload-sharp"/>
            <Typography variant="h5">Send</Typography>
          </Stack>
        </Stack>
        <Stack>
          <Stepper orientation="vertical">
            {steps.map((step, index) => (
              <Step active key={step.label}>
                <StepLabel
                  optional={
                    index === 2 ? (
                      <Typography variant="caption">Last step</Typography>
                    ) : null
                  }
                >
                  {step.label}
                </StepLabel>
                <StepContent>{step.render()}</StepContent>
              </Step>
            ))}
          </Stepper>
        </Stack>
      </Container>
    </Dialog>
  );
};
