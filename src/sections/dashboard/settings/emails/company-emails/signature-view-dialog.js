import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CustomModal from "src/components/customize/custom-modal";

export const SignatureViewDialog = ({ open, onClose, email }) => (
    <CustomModal
      open={open}  
      onClose={onClose}
      width={550}
    >
      <Stack direction="column" gap={3} sx={{ py: 1 }}>
        <Stack direction="row" justifyContent="center">
          <Typography variant="h5">Email Signature</Typography>
        </Stack>
        <Stack>
          <Stack
            sx={{
              p: 2,
              mt: 2,
              backgroundColor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              maxWidth: "100%",
              "& p": {
                my: "2px",
                fontSize: 15,
              },
            }}
            dangerouslySetInnerHTML={{
              __html: email?.email_signature,
            }} />
          <Stack
            gap={2}
            sx={{
              width: { md: 1, xs: 1 },
              px: { md: 0, xs: 12 },
              pt: 3,
              flexDirection: "row",
              justifyContent: { md: "flex-end", xs: "center" },
            }}
          >
            <Button
              variant="outlined"
              sx={{ width: 100 }}
              onClick={() => onClose()}
            >
              Close
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </CustomModal>
);
