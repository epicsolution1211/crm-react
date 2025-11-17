
import { useEffect, useMemo, useState } from "react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import Select from "@mui/material/Select";

import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { Iconify } from 'src/components/iconify';

export const WalletReceiveModal = ({ wallets, open, onClose, walletList }) => {

  const [selectedWallet, setSelectedWallet] = useState(walletList[0]?.key);

  const currentWallet = useMemo(() => {
    if (wallets) {
      const current = wallets[selectedWallet];
      return current;
    }
  }, [wallets, selectedWallet]);

  const steps = [
    {
      label: 'Coin',
      render: () => {
        return (
          <Stack
            direction='column'
            gap={2} >
            <Typography>
              Choose a wallets
            </Typography>
            <Select
              sx={{ width: "100%" }}
              value={selectedWallet}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 220,
                    width: 1,
                  },
                }
              }}
              onChange={(event) => {
                return setSelectedWallet(event?.target?.value);
              }}
            >
              {walletList?.map((item) => (
                <MenuItem key={item?.key} value={item?.key}>
                  <Stack
                    direction='row'
                    alignItems='center'
                    gap={1}
                  >
                    <Box
                      component="img"
                      src={item?.logo}
                      sx={{
                        height: 20,
                        width: 20
                      }}
                    />
                    <Typography>
                      {item?.label}
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
            <Stack
              direction='row'
              gap={2}
              alignItems={'start'}>
              <Typography>
                Available balance:
              </Typography>
              <Stack direction='column'
                gap={1}>
                <Typography>
                  {currentWallet?.current_value ?? 0.0} {walletList?.find((item) => item?.key === selectedWallet)?.unit}
                </Typography><Typography>
                  $ {currentWallet?.usd_balance ?? 0.0}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        )
      }
    },
    {
      label: 'Address',
      render: () => {
        return (
          <Stack
            direction="row"
            gap={1}
            mb={5}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography sx={{ wordBreak: 'break-all' }}>
              {currentWallet?.address}
            </Typography>
            <IconButton
              edge="end"
              onClick={() => copyToClipboard(currentWallet?.address)
              }
              sx={{ '&:hover': { color: 'primary.main' }}}
            >
              <Iconify icon="material-symbols:content-copy-outline" />
            </IconButton>
          </Stack>
        )
      }
    },

  ];


  useEffect(() => {
  }, [open])

  return (
    <Dialog open={open}
      onClose={onClose}
      fullWidth>
      <Container
        sx={{
          p: 3,
        }}
      >
        <Stack
          direction="column"
          spacing={3}>
          <Stack
            py={2}
            direction="row"
            gap={1}
            alignItems={'center'}
            justifyContent="center">
            <Iconify icon="material-symbols:download-sharp"/>
            <Typography variant="h5">Receive</Typography>
          </Stack>
        </Stack>
        <Stack>
          <Stepper
            orientation="vertical">
            {steps.map((step, index) => (
              <Step
                active
                key={step.label}>
                <StepLabel
                  optional={
                    index === 2 ? (
                      <Typography variant="caption">Last step</Typography>
                    ) : null
                  }
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  {step.render()}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Stack>
      </Container>
    </Dialog>
  );
};
