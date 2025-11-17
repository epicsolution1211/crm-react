import { useState } from 'react';
import { format } from 'date-fns';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import FilterIcon from "src/icons/untitled-ui/duocolor/filter";
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';
import { dataEntryMockedList } from 'src/utils/constant/mock-data';

export const LandingDataEntryTable = () => {
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const defaultColumn = [
    {
      id: 'id',
      label: 'Id',
      enabled: true,
      width: 50,
    },
    {
      id: 'name',
      label: 'Name',
      enabled: true,
      width: 100,
    },
    {
      id: 'status',
      label: 'Status',
      enabled: true,
      width: 100,
      render: (row) => (
        <SeverityPill color={row?.status === true ? 'success' : 'error'}>
          {row?.status === true ? "Valid" : "Invalid"}
        </SeverityPill>
      )
    },
    {
      id: 'invalid_records',
      label: 'Invalid Records',
      enabled: true,
      width: 100,
    },
    {
      id: 'updated_count',
      label: 'Updated Records',
      enabled: true,
      width: 100,
    },
    {
      id: 'total_records',
      label: 'Total Records',
      enabled: true,
      width: 100,
    },
    {
      id: 'updated_at',
      label: 'Updated At',
      enabled: true,
      width: 150,
      render: (row) => (
        <Typography variant="body2" >
          {format(new Date(row?.updated_at), "yyyy-MM-dd HH:mm:ss")}
        </Typography>
      )
    },
  ];


  return (
    <>
      <Card>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
          sx={{ p: 2 }}
        >
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
              <TableRow sx={{ whiteSpace: 'nowrap' }}>
                {defaultColumn?.filter((item) => item.enabled)?.map((item) => (
                  <TableCell key={item.id}
                    sx={{ width: item.width }}
                  >
                    <Typography
                      sx={{ fontSize: 14, fontWeight: '600' }}
                    >{item.label}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(dataEntryMockedList?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((brand) => (
                <TableRow key={brand?.id}
                  sx={{ whiteSpace: 'nowrap' }}>
                  {defaultColumn?.filter((item) => item.enabled)?.map((column, index) => (
                    <TableCell key={brand.id + index}>
                      {column?.render ? column?.render(brand) : brand[column?.id]}
                    </TableCell>
                  ))}
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </Scrollbar>
        <TablePagination
          component="div"
          labelRowsPerPage="Per page"
          count={dataEntryMockedList.length ?? 0}
          onPageChange={(event, index) => setCurrentPage(index)}
          onRowsPerPageChange={(event) => setPerPage(event?.target?.value)}
          page={currentPage}
          rowsPerPage={perPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
        />
      </Card>
    </>
  );
};
