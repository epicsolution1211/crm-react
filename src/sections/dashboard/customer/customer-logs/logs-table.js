import { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Input from "@mui/material/Input";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import SvgIcon from "@mui/material/SvgIcon";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TablePagination from "@mui/material/TablePagination";

import { Iconify } from "src/components/iconify";
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { userApi } from "src/api/user";
import { Scrollbar } from "src/components/scrollbar";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { TableModal } from "src/components/table-settings-modal";
import { FilterInput } from "src/components/customize/filter-input";
import { FieldFilter } from "src/sections/dashboard/logs/field-filter";
import { AccountFilter } from "src/sections/dashboard/logs/account-filter";
import { FilterDateTime } from "src/components/customize/filter-date-time";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { useTimezone } from "src/hooks/use-timezone";

export const LogsTable = ({
  logs,
  currentPage,
  perPage,
  count,
  setCurrentPage,
  setPerPage,
  isLoading,
  text,
  createdAtStart,
  createdAtEnd,
  accountId,
  onSetAccountId = () => {},
  onSetCreatedAtStart = () => {},
  onSetCreatedAtEnd = () => {},
  setText = () => {},
  setAfter = () => {},
  setBefore = () => {},
  setId = () => {},
  agentList = [],
  onSetField = () => {},
  field,
  fieldList = [],
  // Table Setting
  rule = [],
  setRule = () => {},
  tableSetting = {},
  setTableSetting = () => {},
}) => {
  const { toLocalTime } = useTimezone();
  const userId = localStorage.getItem("account_id");
  const [isShowAll, setIsShowAll] = useState(true);
  const [tableModal, setTableModal] = useState(false);

  const defaultColumn = [
    {
      id: "id",
      label: "ID",
      width: 100,
      enabled: false,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="ID"
          type="number"
          placeholder="Id..."
          filter={""}
          setFilter={(val) => {
            setId(val);
            setCurrentPage(0);
          }}
        />
      ),
      render: (row) => row?.id,
    },
    {
      id: "account_name",
      label: "Account",
      width: 100,
      enabled: true,
      headerRender: () => (
        <AccountFilter
          updateFilters={onSetAccountId}
          account={accountId}
          agentList={agentList}
        />
      ),
      render: (row) => row?.account_name,
    },
    {
      id: "updated_at",
      label: "Updated At",
      width: 150,
      enabled: true,
      headerRender: () => (
        <FilterDateTime
          labelFontSize={14}
          label="UPDATED AT"
          isRange
          subLabel1="Updated At Start"
          subLabel2="Updated At End"
          filter={createdAtStart}
          setFilter={(val) => {
            if (val) { onSetCreatedAtStart(val);}
          }}
          filter2={createdAtEnd}
          setFilter2={(val) => {
            if (val) { onSetCreatedAtEnd(val);}
          }}
        />
      ),
      render: (row) => toLocalTime(row?.updated_at),
    },
    {
      id: "field",
      label: "Field",
      width: 100,
      enabled: true,
      headerRender: () => (
        <FieldFilter 
          field={field} 
          updateFilters={onSetField} 
          fieldList={fieldList?.map(field => ({
            value: field,
            label: field,
          }))} 
        />
      ),
      render: (row) => (
        <Typography
          variant="subtitle2"
          sx={{
            maxHeight: isShowAll ? "auto" : 70,
            overflow: "hidden",
            display: isShowAll ? "block" : "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical"
          }}
        >
          {row?.field}
        </Typography>
      ),
    },
    {
      id: "before",
      label: "Before",
      width: 300,
      enabled: false,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="BEFORE"
          placeholder="Before..."
          filter={""}
          setFilter={(val) => {
            setBefore(val);
            setCurrentPage(0);
          }}
        />
      ),
      render: (row) => (
        <Typography
          variant="subtitle2"
          sx={{
            maxHeight: isShowAll ? "auto" : 70,
            overflow: "hidden",
            display: isShowAll ? "block" : "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical"
          }}
        >
          {row?.before}
        </Typography>
      ),
    },
    {
      id: "after",
      label: "After",
      width: 300,
      enabled: false,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="AFTER"
          placeholder="After..."
          filter={""}
          setFilter={(val) => {
            setAfter(val);
            setCurrentPage(0);
          }}
        />
      ),
      render: (row) => (
        <Typography
          variant="subtitle2"
          sx={{
            maxHeight: isShowAll ? "auto" : 70,
            overflow: "hidden",
            display: isShowAll ? "block" : "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical"
          }}
        >
          {row?.after}
        </Typography>
      ),
    },
    {
      id: "description",
      label: "Description",
      width: 400,
      enabled: true,
      headerRender: () => (
        <Typography fontSize={14} fontWeight={600}>Description</Typography>
      ),
      render: (row) => (
        <Typography
          variant="subtitle2"
          sx={{
            maxHeight: isShowAll ? "auto" : 70,
            overflow: "hidden",
            display: isShowAll ? "block" : "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical"
          }}
        >
          {row?.description}
        </Typography>
      ),
    },
  ];

  const tableColumn = useMemo(() => {
    if (rule?.length) {
      const updateColumn = defaultColumn
        ?.map((item) => ({
          ...item,
          enabled: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.enabled,
          order: rule?.find((ruleItem) => item?.id === ruleItem?.id)?.order,
        }))
        ?.sort((a, b) => a.order - b.order);
      return updateColumn;
    } else {
      return defaultColumn?.map((item, index) => ({ ...item, order: index }));
    }
  }, [
    rule,
    isShowAll,
    accountId,
    agentList,
    field,
    fieldList,
  ]);

  const updateRule = async (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        customerLogsTable: rule,
      };
      await userApi.updateUser(userId, { column_setting: JSON.stringify(updateSetting) });
      setTableSetting(updateSetting);
    } else {
      const updateSetting = {
        customerLogsTable: rule,
      };
      await userApi.updateUser(userId, { column_setting: JSON.stringify(updateSetting) });
      setTableSetting(updateSetting);
    }
  };

  const isDefaultSetting =
    JSON.stringify(
      defaultColumn?.map((item, index) => ({
        id: item?.id,
        enabled: item?.enabled,
        order: index,
      }))
    ) === 
    JSON.stringify(rule?.map((item, index) => ({
      id: item?.id,
      enabled: item?.enabled,
      order: index,
    }))) || 
    rule?.length === 0;

  return (
    <>
      <Card>
        <Stack alignItems="center" direction="row" spacing={2} sx={{ px: 2, py: 1 }}>
          <Iconify icon="lucide:search" color="text.secondary" width={24} />
          <Box sx={{ flexGrow: 1 }}>
            <Input
              disableUnderline
              fullWidth
              value={text ?? ""}
              onChange={(event) => {
                setText(event?.target?.value);
                setCurrentPage(0);
              }}
              placeholder="Enter a keyword"
            />
          </Box>
          <Stack direction="row" alignItems='center' gap={1}>
            {isShowAll ? (
              <Tooltip title="Collapse">
                <IconButton
                  onClick={() => setIsShowAll(false)}
                  sx={{ '&:hover': { color: 'primary.main' }, color: 'primary.main' }}
                >
                  <Iconify icon="mdi:unfold-more-horizontal" width={30} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Expand">
                <IconButton
                  onClick={() => setIsShowAll(true)}
                  sx={{ '&:hover': { color: 'primary.main' }}}
                >
                  <Iconify icon="ic:outline-unfold-less" width={30} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Table Setting">
              <IconButton onClick={() => setTableModal(true)} sx={{ '&:hover': { color: 'primary.main' }}}>
                {isDefaultSetting ? (
                  <SvgIcon>
                    <SettingIcon />
                  </SvgIcon>
                ) : (
                  <Badge variant="dot" color="error">
                    <SvgIcon>
                      <SettingIcon />
                    </SvgIcon>
                  </Badge>
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
        <Scrollbar sx={{ maxHeight: 585 }}>
          <Table sx={{ minWidth: 585, position: "relative" }}>
            <TableHead sx={{ position: "sticky", top: 0 }}>
              <TableRow>
                {tableColumn?.filter((item) => item.enabled)?.map((column, index) => (
                  <TableCell key={index} sx={{ width: column.width || 200 }}>
                    {column.headerRender ? column.headerRender() : (
                      <Typography fontSize={14} fontWeight={600}>
                        {column.label}
                      </Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rowCount={perPage > 15 ? 15 : 10} cellCount={tableColumn?.filter((item) => item.enabled)?.length} />
              ) : (
                logs?.map((log) => (
                  <TableRow key={log?.id}>
                    {tableColumn?.filter((item) => item.enabled)?.map((column, index) => (
                      <TableCell key={`${log.id}-${index}`}>
                        {column.render ? column.render(log) : log[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Scrollbar>
        {logs?.length === 0 && !isLoading && <TableNoData />}
        <Divider sx={{ marginTop: 0 }} />
        <Stack sx={{ flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
          <PageNumberSelect 
            currentPage={currentPage} 
            totalPage={count ? Math.ceil(count/perPage) : 0}
            onUpdate={setCurrentPage}
          />
          <TablePagination
            component="div"
            labelRowsPerPage="Per page"
            count={count}
            onPageChange={(event, index) => {
              setCurrentPage(index);
            }}
            onRowsPerPageChange={(event) => setPerPage(event?.target?.value)}
            page={currentPage ?? 0}
            rowsPerPage={perPage ?? 10}
            rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
          />
        </Stack>
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
