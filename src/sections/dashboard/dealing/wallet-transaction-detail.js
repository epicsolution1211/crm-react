import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { format } from 'date-fns';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Grid from "@mui/system/Unstable_Grid/Grid";
import { Scrollbar } from "src/components/scrollbar";

export const WalletTransactionModal = ({ open, onClose, transactionInfo = {} }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm" sx={{ p: 3 }}>
        <Stack direction="column" spacing={3}>
          <Stack py={2} direction="row" justifyContent="center">
            <Typography variant="h5">Transaction Info</Typography>
          </Stack>
          <Scrollbar sx={{ height: 550, px: 1 }}>
            <Grid container spacing={2} px={1}>
              <Grid xs={3}>
                <Typography variant="subtitle1">txID:</Typography>
              </Grid>
              <Grid xs={9}>
                <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>{transactionInfo?.txID}</Typography>
              </Grid>
              <Grid xs={3}>
                <Typography variant="subtitle1">Signature: </Typography>
              </Grid>
              <Grid xs={9}>
                <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>{transactionInfo?.signature?.length > 0 ? transactionInfo?.signature[0] : ""}</Typography>
              </Grid>
              <Grid xs={3}>
                <Typography variant="subtitle1">Amount: </Typography>
              </Grid>
              <Grid xs={9}>
                <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>{transactionInfo?.amount}</Typography>
              </Grid>
              <Grid xs={3}>
                <Typography variant="subtitle1">Owner Adress:</Typography>
              </Grid>
              <Grid xs={9}>
                <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>{transactionInfo?.raw_data?.contract?.length > 0 ? transactionInfo?.raw_data?.contract[0]?.parameter?.value?.owner_address : "0"}</Typography>
              </Grid>
              <Grid xs={3}>
                <Typography variant="subtitle1">To Address:</Typography>
              </Grid>
              <Grid xs={9}>
                <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>{transactionInfo?.raw_data?.contract?.length > 0 ? transactionInfo?.raw_data?.contract[0]?.parameter?.value?.to_address : "0"}</Typography>
              </Grid>
              <Grid xs={3}>
                <Typography variant="subtitle1">Contract Type:</Typography>
              </Grid>
              <Grid xs={9}>
                <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>{transactionInfo?.raw_data?.contract?.length > 0 ? transactionInfo?.raw_data?.contract[0]?.type : "0"}</Typography>
              </Grid>
              <Grid xs={3}>
                <Typography variant="subtitle1">Raw Data Hex:</Typography>
              </Grid>
              <Grid xs={9}>
                <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>{transactionInfo?.raw_data_hex}</Typography>
              </Grid>
              <Grid xs={3}>
                <Typography variant="subtitle1">Ref Block Bytes:
                </Typography>
              </Grid>
              <Grid xs={9}>
                <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>{transactionInfo?.raw_data?.ref_block_bytes}</Typography>
              </Grid>
              <Grid xs={3}>
                <Typography variant="subtitle1">Ref Block Hash:
                </Typography>
              </Grid>
              <Grid xs={9}>
                <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>{transactionInfo?.raw_data?.ref_block_hash}</Typography>
              </Grid>
              <Grid xs={3}>
                <Typography variant="subtitle1">Timestamp:
                </Typography>
              </Grid>
              <Grid xs={9}>
                <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>{transactionInfo?.raw_data?.timestamp ? format(new Date(transactionInfo?.raw_data?.timestamp), 'yyyy-MM-dd') : ""}</Typography>
              </Grid>
              <Grid xs={3}>
                <Typography variant="subtitle1">Expiration:
                </Typography>
              </Grid>
              <Grid xs={9}>
                <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>{transactionInfo?.raw_data?.expiration ? format(new Date(transactionInfo?.raw_data?.expiration), 'yyyy-MM-dd') : ""}</Typography>
              </Grid>
            </Grid>
          </Scrollbar>
          <Stack>
            <Stack spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 2,
                  px: 3,
                }}
                gap={3}
              >
                <Button
                  variant="contained"
                  type="submit"
                  onClick={() => onClose()}
                >
                  Close
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Dialog>
  );
};
