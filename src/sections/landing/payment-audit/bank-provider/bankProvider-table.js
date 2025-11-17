import { useState } from "react";
import { format } from "date-fns";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { bankMockedList } from "src/utils/constant/mock-data";
import { Iconify } from 'src/components/iconify';

export const LandingBankProviderTable = () => {
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);


  const defaultColumn = [
    {
      id: "id",
      label: "Id",
      enabled: true,
      width: 50,

    },
    {
      id: "name",
      label: "Name",
      enabled: true,
      width: 150,
    },
    {
      id: "active",
      label: "Enabled",
      enabled: true,
      width: 500,
      render: (row) => (
        <SeverityPill color={row?.active ? "success" : "error"}>
          {row?.active ? "Active" : "InActive"}
        </SeverityPill>
      ),
    },
    {
      id: "created_at",
      width: 50,
      label: "Created At",
      enabled: true,
      render: (row) => (
        <Typography variant="body2">
          {format(new Date(row?.created_at), "yyyy-MM-dd HH:mm:ss")}
        </Typography>
      ),
    },
  ];

  return (
    <>
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4">Bank Provider</Typography>
          <Button
            startIcon={<Iconify icon="lucide:plus" width={24} />}
            variant="contained"
          >
            Add
          </Button>
        </Stack>
      </Stack>
      <PayWallLayout>
        <Card>
          <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2 }}>
            <Iconify icon="lucide:search" color="text.secondary" width={24} />
            <Box sx={{ flexGrow: 1 }}>
              <Input
                disableUnderline
                fullWidth
                placeholder="Enter a keyword"
              />
            </Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Tooltip title="Table Setting">
                <IconButton>
                  <SvgIcon>
                    <SettingIcon />
                  </SvgIcon>
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
          <Scrollbar>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow sx={{ whiteSpace: "nowrap" }}>
                  {defaultColumn
                    ?.map((item) => (
                      <TableCell key={item.id} sx={{ width: item.width }}>
                        <Typography sx={{ fontSize: 14, fontWeight: "600" }}>
                          {item.label}
                        </Typography>
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(
                  bankMockedList?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((brand) => (
                    <TableRow key={brand?.id} sx={{ whiteSpace: "nowrap" }}>
                      {defaultColumn
                        ?.map((column, index) => (
                          <TableCell key={brand.id + index}>
                            {column?.render
                              ? column?.render(brand)
                              : brand[column?.id]}
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Scrollbar>
          <TablePagination
            component="div"
            labelRowsPerPage="Per page"
            count={bankMockedList?.length ?? 0}
            onPageChange={(event, index) => setCurrentPage(index)}
            onRowsPerPageChange={(event) => setPerPage(event?.target?.value)}
            page={currentPage}
            rowsPerPage={perPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
          />
        </Card>
      </PayWallLayout>
    </>
  );
};
