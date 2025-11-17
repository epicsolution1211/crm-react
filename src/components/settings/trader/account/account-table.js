import { useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from "@mui/material/Typography";
import Chip from '@mui/material/Chip';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableSkeleton } from 'src/components/table-skeleton';
import { PageNumberSelect } from "src/components/pagination/page-selector";

const AccountTable = ({ editAccount, accountTypes, setDeleteModalOpen, setSelectedAccountType, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const DEFAULT_COLUMN = [
    {
      id: "name",
      label: "Plan Name",
      enabled: true,
      render: (row) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>{row.name}</Typography>
          {row.provider && (
            <Chip 
              label={row.provider}
              size="small"
              sx={{
                height: 24,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                '& .MuiChip-label': {
                  px: 1,
                }
              }}
            />
          )}
        </Stack>
      ),
    },
    {
      id: "friendly_name",
      label: "Friendly Name",
      enabled: true,
    },
    {
      id: "clients_count",
      label: "Number of Clients",
      enabled: true,
    },
    {
      id: "position_count",
      label: "Open Position",
      enabled: true,
    },
    {
      id: "enabled",
      label: "Enabled",
      enabled: true,
      render: (row) => (
        row.enabled ? (
          <Iconify icon="mdi:check-circle" sx={{ color: 'success.main' }} />
        ) : (
          <Iconify icon="mdi:close-circle" sx={{ color: 'error.main' }} />
        )
      ),
    },
    {
      id: "demo",
      label: "Demo",
      enabled: true,
      render: (row) => (
        row.demo ? (
          <Iconify icon="mdi:check-circle" sx={{ color: 'success.main' }} />
        ) : (
          <Iconify icon="mdi:close-circle" sx={{ color: 'error.main' }} />
        )
      ),
    },
    {
      id: "client_id",
      label: "Action",
      enabled: true,
      render: (row) => (
        <Stack sx={{ flexDirection : 'row', gap: 1}}>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => {
                editAccount(row);
                setSelectedAccountType(row);
              } }
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              <Iconify icon="mage:edit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                setDeleteModalOpen(true);
                setSelectedAccountType(row);
              } }
              sx={{ '&:hover': { color: 'error.main' } }}
            >
              <Iconify icon="heroicons:trash" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ position: 'relative' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              {DEFAULT_COLUMN
                ?.map((item) => (
                  <TableCell align='left' key={item.id}>
                    <Typography sx={{ fontSize: 14, fontWeight: "600" }}>
                      {item.label}
                    </Typography>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? <TableSkeleton rowCount={5} cellCount={7}
                padding={"1px"} />
              : <>
                {accountTypes?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((item, index) => (
                  <TableRow
                    hover
                    key={index}>
                    {DEFAULT_COLUMN
                    ?.map((header, index) => (
                      <TableCell key={item.id + index} align='left'>
                        {header?.render
                          ? header?.render(item)
                          : item[header?.id ?? ""]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>}
          </TableBody>
        </Table>
      </Scrollbar>
      <Divider />
      <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
        <PageNumberSelect 
          currentPage={currentPage} 
          totalPage={accountTypes?.length > 0  ? Math.ceil(accountTypes?.length/perPage) : 0}
          onUpdate={setCurrentPage}
        />
        <TablePagination
          component="div"
          labelRowsPerPage="Per page"
          count={accountTypes?.length ?? 0}
          page={currentPage ?? 0}
          rowsPerPage={perPage ?? 10}
          onPageChange={(event, index) => setCurrentPage(index)}
          onRowsPerPageChange={(event) =>
            setPerPage(event?.target?.value)
          }
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Stack>
    </Box>
  );
};

export default AccountTable;