import { useState } from "react";
import Box from "@mui/material/Box";
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

import FilterIcon from "src/icons/untitled-ui/duocolor/filter";
import { Iconify } from 'src/components/iconify';
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { affiliateMockedList } from "src/utils/constant/mock-data";

export const LandingAffiliate = () => {
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const defaultColumn = [
    {
      id: "id",
      label: "Id",
      enabled: true,
    },
    {
      id: "full_name",
      label: "Name",
      enabled: true,
    },
    {
      id: "active",
      label: "Enabled",
      enabled: true,
      render: (row) => (
        <SeverityPill color={row?.active ? "success" : "error"}>
          {row?.active ? "Active" : "InActive"}
        </SeverityPill>
      ),
    },
    {
      id: "total_valid_leads",
      label: "Total Valid Leads",
      enabled: true,
    },
    {
      id: "total_duplicates",
      label: "Total Duplicates",
      enabled: true,
    },
    {
      id: "total_ftd",
      label: "Total FTD",
      enabled: true,
    },
    {
      id: "total_leads",
      label: "Total LEADS",
      enabled: true,
    },
  ];

  return (
    <>
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
          <Stack direction='row' gap={0.5}>
            <Tooltip title="Reload Table">
              <IconButton>
                <Iconify icon="ion:reload-sharp" width={24}/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Search Setting">
              <IconButton>
                <SvgIcon>
                  <FilterIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip>
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
                    <TableCell key={item.id}>
                      <Typography sx={{ fontSize: 14, fontWeight: "600" }}>
                        {item.label}
                      </Typography>
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {affiliateMockedList?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((row) => (
                <TableRow key={row?.id} hover sx={{ whiteSpace: "nowrap" }}>
                  {defaultColumn
                    ?.map((column, index) => (
                      <TableCell key={row.id + index}>
                        {column?.render
                          ? column?.render(row)
                          : row[column?.id]}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
        <TablePagination
          component="div"
          labelRowsPerPage="Per page"
          count={affiliateMockedList?.length ?? 0}
          page={currentPage ?? 0}
          rowsPerPage={perPage ?? 10}
          onPageChange={(event, index) => setCurrentPage(index)}
          onRowsPerPageChange={(event) =>
            setPerPage(event?.target?.value)
          }
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </>
  );
};
