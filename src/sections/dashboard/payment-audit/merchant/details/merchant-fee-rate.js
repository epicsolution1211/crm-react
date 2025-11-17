import { useState, useMemo, useEffect } from "react";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
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
import { useParams } from "react-router";

import { Iconify } from 'src/components/iconify';
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { TableModal } from "src/components/table-settings-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { merchantApi } from "src/api/payment_audit/merchant_api";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";
import { useRouter } from "src/hooks/use-router";
import { useTimezone } from "src/hooks/use-timezone";

export const MerchantFeeRate = () => {
  const { user } = useAuth();
  const params = useParams();
  const localTableSetting = localStorage.getItem("tableSetting");
  const tableSetting = JSON.parse(localTableSetting);
  const router = useRouter();
  const { toLocalTime } = useTimezone();
  
  const [rule, setRule] = useState([]);
  const [tableModal, setTableModal] = useState(false);
  const [text, setText] = useState("");
  const query = useDebounce(text, 500);

  const [rates, setRates] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  const getMerchantFeeRates = async () => {
    setIsLoading(true);
    let request = {
      page: currentPage + 1,
      per_page: perPage,
      q: query?.length > 0 ? query : null,
      audit_merchant_id: params?.merchantId,
    };
    try {
      const res = await merchantApi.getRates(request);
      setRates(res?.rates);
      setTotalCount(res?.total_count);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getMerchantFeeRates();
  }, [currentPage, perPage, query]);

  const defaultColumn = [
    {
      id: "id",
      label: "ID",
      enabled: true,
    },
    {
      id: "audit_payment_type",
      label: "Payment Type",
      enabled: true,
    },
    {
      id: "Type",
      label: "Type",
      enabled: true,
      render: (row) => {
        const typeColor = row?.fee_type === "INCOMING" ? "#10B981" : "#F04438";
        return (
          <Typography variant="subtitle2" sx={{ color: typeColor }}>
            {row?.fee_type}
          </Typography>
        );
      },
    },
    {
      id: "currency",
      label: "Currency",
      enabled: true,
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          {row?.audit_currencies?.map((item, index) => (
            <SeverityPill key={index} color="success">
              {item}
            </SeverityPill>
          ))}
        </Stack>
      ),
    },
    {
      id: "rate",
      label: "Fee Rate",
      enabled: true,
    },
    {
      id: "flat_fee",
      label: "Flat Fee",
      enabled: true,
    },
    {
      id: "min_charge",
      label: "Min Charge",
      enabled: true,
    },
    {
      id: "started_at",
      label: "Started At",
      enabled: true,
      render: (row) => toLocalTime(row?.start_date),
    },
    {
      id: "ended_at",
      label: "Ended At",
      enabled: true,
      render: (row) => toLocalTime(row?.end_date),
    },
    {
      id: "action",
      label: "Actions",
      enabled: true,
      render: (row) => {
        if (!user?.acc?.acc_e_audit_merchant) return null;
        return (
          <Tooltip title="Edit">
            <IconButton
              sx={{ '&:hover': { color: 'primary.main' }}}
              onClick={() =>
                router.push(
                  `${paths.dashboard.paymentAudit.merchant.index}/${params?.merchantId}/edit/${row.id}`
                )
              }
            >
              <Iconify icon="mage:edit" width={20}/>
            </IconButton>
          </Tooltip>
        );
      },
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
  }, [rule]);

  const updateRule = (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        positionTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(updateSetting));
    } else {
      const tableSettings = {
        positionTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(tableSettings));
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
        <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2 }}>
          <Iconify icon="lucide:search" color="text.secondary" width={24} />
          <Box sx={{ flexGrow: 1 }}>
            <Input
              disableUnderline
              fullWidth
              value={text}
              onChange={(event) => {
                setText(event?.target?.value);
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
        <Divider />
        <Scrollbar>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ whiteSpace: "nowrap" }}>
                {tableColumn
                  ?.filter((item) => item.enabled)
                  ?.map((item) => (
                    <TableCell key={item.id}>
                      {
                        <Typography sx={{ fontSize: 14, fontWeight: "600" }}>
                          {item.label}
                        </Typography>
                      }
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rowCount={perPage > 15 ? 15 : 10} cellCount={tableColumn?.filter((item) => item.enabled)?.length} />
              ) : (
                rates.map((rate) => (
                  <TableRow key={rate.id}>
                    {tableColumn
                      ?.filter((item) => item.enabled)
                      ?.map((header, index) => (
                        <TableCell
                          sx={{ whiteSpace: "nowrap" }}
                          key={rate.id + index}
                        >
                          {header?.render
                            ? header?.render(rate)
                            : rate[header.id]}
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Scrollbar>
        {!isLoading && rates?.length === 0 && <TableNoData isSmall />}
        <Divider />
        <TablePagination
          component="div"
          labelRowsPerPage="Per page"
          count={totalCount}
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
