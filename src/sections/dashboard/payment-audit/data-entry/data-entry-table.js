import { useState, useEffect, useMemo } from "react";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Link from "@mui/material/Link";
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
import { ChipSet } from "src/components/customize/chipset";
import { MultiSelect } from "src/components/multi-select";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { TableModal } from "src/components/table-settings-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { dataEntryApi } from "src/api/payment_audit/data-entry";
import { paths } from "src/paths";
import { useDebounce } from "src/hooks/use-debounce";
import { useTimezone } from "src/hooks/use-timezone";
import { Iconify } from 'src/components/iconify';

const enableOption = [
  {
    label: "Valid",
    value: "Valid",
  },
  {
    label: "Invalid",
    value: "Invalid",
  },
];

export const DataEntryTable = () => {
  const { toLocalTime } = useTimezone();
  const localTableSetting = localStorage.getItem("tableSetting");
  const tableSetting = JSON.parse(localTableSetting);

  const [text, setText] = useState("");
  const [dataEntries, setDataEntries] = useState([]);
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
      displayValue: item === "Valid" ? "Valid" : "Invalid",
      value: item,
      label: "Status",
    }));
    return newChips;
  }, [enabled]);

  const handleRemoveChip = (value) => {
    const newStatus = [...enabled].filter((item) => item !== value);
    setEnabled(newStatus);
  };

  const getDataEntries = async () => {
    setIsLoading(true);
    let request = {
      page: currentPage + 1,
      per_page: perPage,
      q: query?.length > 0 ? query : null,
    };
    if (enabled[0] === "Valid" && enabled?.length === 1) {
      request.status = "Valid";
    }
    if (enabled[0] === "Invalid" && enabled?.length === 1) {
      request.status = "Invalid";
    }
    try {
      const res = await dataEntryApi.getDataEntries(request);
      setDataEntries(res?.files);
      setTotalCount(res?.total_count);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const updateRule = (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        dataEntryTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(updateSetting));
    } else {
      const tableSettings = {
        dataEntryTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(tableSettings));
    }
  };

  useEffect(() => {
    getDataEntries();
  }, [currentPage, perPage, query, enabled]);

  useEffect(() => {
    setRule(tableSetting?.dataEntryTable ?? []);
  }, []);

  const defaultColumn = [
    {
      id: "id",
      label: "Id",
      enabled: true,
      width: 50,
      render: (row) => (
        <Link
          color="text.primary"
          component={RouterLink}
          href={`${paths.dashboard.paymentAudit.dataEntry.index}/${row?.id}`}
          sx={{
            alignItems: "center",
            display: "inline-flex",
          }}
          underline="hover"
        >
          {row?.id}
        </Link>
      ),
    },
    {
      id: "name",
      label: "Name",
      enabled: true,
      width: 100,
      render: (row) => (
        <Link
          color="text.primary"
          component={RouterLink}
          href={`${paths.dashboard.paymentAudit.dataEntry.index}/${row?.id}`}
          sx={{
            alignItems: "center",
            display: "inline-flex",
          }}
          underline="hover"
        >
          {row?.name}
        </Link>
      ),
    },
    {
      id: "status",
      label: "Status",
      enabled: true,
      width: 100,
      headerRender: () => (
        <MultiSelect
          noPadding
          label="STATUS"
          width={150}
          options={enableOption}
          onChange={setEnabled}
          value={enabled}
        />
      ),
      render: (row) => (
        <SeverityPill color={row?.status === "Valid" ? "success" : "error"}>
          {row?.status}
        </SeverityPill>
      ),
    },
    {
      id: "invalid_records",
      label: "Invalid Records",
      enabled: true,
      width: 100,
    },
    {
      id: "total_records",
      label: "Total Records",
      enabled: true,
      width: 100,
    },
    {
      id: "updated_count",
      label: "Updated Records",
      enabled: true,
      width: 100,
    },
    {
      id: "updated_at",
      label: "Updated At",
      enabled: true,
      width: 150,
      render: (row) => (
        <Typography variant="body2">
          {toLocalTime(row?.updated_at)}
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
  }, [rule, enabled]);

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
        <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2 }}>
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
        {enabled?.length ? (
          <>
            <Divider />
            <Stack
              alignItems="center"
              direction="row"
              flexWrap="wrap"
              gap={1}
              sx={{ p: 2, px: 3 }}
            >
              <ChipSet
                chips={currentChip}
                handleRemoveChip={(value) => handleRemoveChip(value)}
              />
            </Stack>
          </>
        ) : null}
        <Scrollbar>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ whiteSpace: "nowrap" }}>
                {tableColumn
                  ?.filter((item) => item.enabled)
                  ?.map((item) => (
                    <TableCell key={item.id} sx={{ width: item.width }}>
                      {item.headerRender ? (
                        item.headerRender()
                      ) : (
                        <Typography sx={{ fontSize: 14, fontWeight: "600" }}>
                          {item.label}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableSkeleton
                  rowCount={perPage > 15 ? 15 : 10}
                  cellCount={7}
                />
              ) : (
                dataEntries?.map((brand) => (
                  <TableRow key={brand?.id} sx={{ whiteSpace: "nowrap" }}>
                    {tableColumn
                      ?.filter((item) => item.enabled)
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
        {dataEntries?.length === 0 && !isLoading && <TableNoData />}
        {isLoading && <Divider />}
        <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
          <PageNumberSelect 
            currentPage={currentPage} 
            totalPage={totalCount ? Math.ceil(totalCount/perPage) : 0}
            onUpdate={setCurrentPage}
          />
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
