import { useState } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { useAuth } from "src/hooks/use-auth";
import { Scrollbar } from "src/components/scrollbar";
import { HtmlContentModal } from "./html-content-modal";

export const AutomatdedEmails = ({ brandId, brand, onGetBrand }) => {
  const { company } = useAuth();

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(undefined);

  const tableRowList = [
    {
      id: "email_temp_signup",
      label: "Sign Up",
    },
    {
      id: "email_temp_deposit",
      label: "Deposit",
    },
    {
      id: "email_temp_pass_rec",
      label: "Password Recovery",
    },
    {
      id: "email_temp_bonus",
      label: "Bonus",
    },
    {
      id: "email_temp_wd",
      label: "Withdrawal",
    },
    {
      id: "email_temp_kyc",
      label: "KYC",
    },
  ];

  return (
    <Stack sx={{ px: 2, mb: -2, pb: 1, minHeight:"calc(100vh - 360px)"}}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5">Automated Emails</Typography>
        </Stack>
      </Stack>
      <Stack sx={{ mt: 8 }}>
        <Stack>
          <Scrollbar sx={{ minHeight: 315 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      No
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Type
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRowList?.map((row, index)=> (
                  <TableRow hover>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {row?.label}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Stack direction="row" alignItems="center">
                        <Tooltip title="Edit">
                          <IconButton onClick={() => {
                            setEditTarget(row.id);
                            setOpenEditModal(true);
                          }}>
                            <Iconify icon="mage:edit" color="primary.main" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </Stack>
      </Stack>

      <HtmlContentModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        brandId={brandId}
        onGetBrand={onGetBrand}
        companyId={company?.id}
        emailTarget={editTarget}
        brand={brand}
      />
    </Stack>
  );
};
