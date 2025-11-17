import { useState, useEffect, useMemo } from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Settings } from "@mui/icons-material";
import { format } from 'date-fns';

import { ChipSet } from 'src/components/customize/chipset';
import { Scrollbar } from 'src/components/scrollbar';
import { TableModal } from 'src/components/table-settings-modal';
import { TableNoData } from 'src/components/table-empty';
import { TableSkeleton } from 'src/components/table-skeleton';
import { useDebounce } from 'src/hooks/use-debounce';
import { recordApi } from 'src/api/payment_audit/record';
import { Iconify } from 'src/components/iconify';

export const RecordHistoryTable = ({ recordId }) => {
  const localTableSetting = localStorage.getItem('tableSetting');
  const tableSetting = JSON.parse(localTableSetting);

  const [text, setText] = useState("");
  const [histories, setHistories] = useState([]);

  const [totalCount, setTotalCount] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const query = useDebounce(text);
  const [enabled, setEnabled] = useState([]);

  const [rule, setRule] = useState([]);
  const [tableModal, setTableModal] = useState(false);

  const currentChip = useMemo(() => {
    const newChips = enabled?.map((item) => ({
      displayValue: item === "true" ? "Active" : "Inactive",
      value: item,
      label: "Enable"
    }));
    return newChips;
  }, [enabled]);


  const handleRemoveChip = (value) => {
    const newStatus = [...enabled].filter((item) => (item !== value));
    setEnabled(newStatus);
  };

  const getLogs = async () => {
    setIsLoading(true);
    let request = {
      page: currentPage + 1,
      per_page: perPage,
      q: query?.length > 0 ? query : null,
      audit_record_id: recordId
    }
    try {
      const res = await recordApi.getLogs(request);
      setHistories(res?.record_logs)
      setTotalCount(res?.total_count)
    } catch (error) {
      console.error('error: ', error);
    }
    setIsLoading(false);
  }

  const updateRule = (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        historyTable: rule,
      }
      localStorage.setItem('tableSetting', JSON.stringify(updateSetting));
    } else {
      const tableSettings = {
        historyTable: rule,
      }
      localStorage.setItem('tableSetting', JSON.stringify(tableSettings));
    }
  };

  useEffect(() => {
    getLogs();
  }, [currentPage, perPage, query]);

  useEffect(() => {
    setRule(tableSetting?.historyTable ?? []);
  }, []);

  const defaultColumn = [
    {
      id: 'id',
      label: 'Id',
      enabled: true,
      width: 50,
    },
    {
      id: 'agent',
      label: 'Agent',
      enabled: true,
      width: 150,
      render: (row) => {
        return (
          <Stack
            direction='row'
            gap={2}
            alignItems='center'>
            <Avatar
              src={row?.account_avatar}
              sx={{ width: 30, height: 30 }} />
            <Typography variant='subtitle2'>
              {row?.account_name}
            </Typography>
          </Stack>
        )
      }
    },
    {
      id: 'description',
      label: 'Change Description',
      enabled: true,
      width: 500,
    },
    {
      id: 'before',
      label: 'Before Edit',
      enabled: true,
      width: 100,
    },
    {
      id: 'after',
      label: 'After Edit',
      enabled: true,
      width: 100,
    },
    {
      id: 'updated_at',
      width: 50,
      label: 'Updated At',
      enabled: true,
      render: (row) => (
        <Typography variant="body2" >
          {format(new Date(row?.updated_at), "yyyy-MM-dd HH:mm:ss")}
        </Typography>
      )
    },
  ];

  const tableColumn = useMemo(() => {
    if (rule?.length) {
      const updateColumn = defaultColumn?.map((item) =>
      ({
        ...item,
        enabled: rule?.find((ruleItem) => (item?.id === ruleItem?.id))?.enabled,
        order: rule?.find((ruleItem) => (item?.id === ruleItem?.id))?.order,
      }))?.sort((a, b) => (a.order - b.order));
      return updateColumn;
    } else {
      return defaultColumn?.map((item, index) => ({ ...item, order: index }));
    }
  }, [rule, enabled]);

  const isDefaultSetting = JSON.stringify(defaultColumn?.map((item, index) => ({
    id: item?.id,
    enabled: item?.enabled,
    order: index,
  }))) === JSON.stringify(rule) || rule?.length === 0;

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
              value={text ?? ""}
              onChange={(event) => {
                setText(event?.target?.value);
                setCurrentPage(0)
              }}
              placeholder="Enter a keyword"
            />
          </Box>
          <Tooltip
            title='Table Setting'
          >
            <IconButton
              onClick={() => setTableModal(true)}>
              {isDefaultSetting ?
                <Settings />
                : <Badge
                  variant='dot'
                  color='error' >
                  <Settings />
                </Badge>}
            </IconButton>
          </Tooltip>
        </Stack>
        {enabled?.length ?
          <>
            <Divider />
            <Stack
              alignItems="center"
              direction="row"
              flexWrap="wrap"
              gap={1}
              sx={{ p: 2, px: 3 }}
            >
              <ChipSet chips={currentChip}
                handleRemoveChip={(value) => handleRemoveChip(value)} />
            </Stack>
          </>
          : null}
        <Scrollbar>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ whiteSpace: 'nowrap' }}>
                {tableColumn?.filter((item) => item.enabled)?.map((item) => (
                  <TableCell key={item.id}
                    sx={{ width: item.width }}>
                    {item.headerRender ? item.headerRender() :
                      <Typography
                        sx={{ fontSize: 14, fontWeight: '600' }}
                      >{item.label}</Typography>}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ?
                <TableSkeleton
                  rowCount={perPage > 15 ? 15 : 10}
                  cellCount={6} />
                :
                (histories?.map((brand) => (
                  <TableRow key={brand?.id}
                    sx={{ whiteSpace: 'nowrap' }}>
                    {tableColumn?.filter((item) => item.enabled)?.map((column, index) => (
                      <TableCell key={brand.id + index}>
                        {column?.render ? column?.render(brand) : brand[column?.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                )))}
            </TableBody>
          </Table>
        </Scrollbar>
        {(histories?.length === 0 && !isLoading) && <TableNoData />}
        <TablePagination
          component="div"
          labelRowsPerPage="Per page"
          count={totalCount ?? 0}
          onPageChange={(event, index) => setCurrentPage(index)}
          onRowsPerPageChange={(event) => setPerPage(event?.target?.value)}
          page={currentPage}
          rowsPerPage={perPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
        />
      </Card>
      <TableModal
        open={tableModal}
        onClose={() => setTableModal(false)}
        tableColumn={tableColumn}
        defaultColumn={defaultColumn}
        updateRule={updateRule}
      />
    </>
  );
};
