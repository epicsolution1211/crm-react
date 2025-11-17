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

import { Iconify } from 'src/components/iconify';
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { Scrollbar } from "src/components/scrollbar";
import { TableModal } from "src/components/table-settings-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { paths } from "src/paths";
import { useRouter } from "src/hooks/use-router";
import { useAuth } from "src/hooks/use-auth";
import { useTimezone } from "src/hooks/use-timezone";

export const ValidationRule = ({
  validationRules,
  isLoading,
  totalCount,
  currentPage,
  perPage,
  setCurrentPage,
  setPerPage,
  text,
  setText,
  taskId,
}) => {
  const { user } = useAuth();
  const { toLocalTime } = useTimezone();
  
  const localTableSetting = localStorage.getItem("tableSetting");
  const tableSetting = JSON.parse(localTableSetting);
  const router = useRouter();

  const [rule, setRule] = useState([]);
  const [tableModal, setTableModal] = useState(false);

  const defaultColumn = [
    {
      id: "id",
      label: "ID",
      enabled: true,
      width: 50,
    },
    {
      id: "name",
      label: "Name",
      enabled: true,
      width: 100,
    },
    {
      id: "summary",
      label: "Summary",
      enabled: true,
      width: 600,
    },
    {
      id: "effected_from",
      label: "Effected From",
      enabled: true,
      width: 100,
      render: (row) => toLocalTime(row?.start_date),
    },
    {
      id: "effected_to",
      label: "Effected To",
      enabled: true,
      width: 100,
      render: (row) => toLocalTime(row?.end_date),
    },
    {
      id: "effected case",
      label: "Effected Case",
      enabled: true,
      width: 100,
    },
    {
      id: "action",
      label: "Actions",
      enabled: true,
      width: 50,
      render: (row) => {
        if (user?.acc?.acc_e_audit_tasks) return null;
        return (
          <Tooltip title="Edit">
            <IconButton
              sx={{ '&:hover': { color: 'primary.main' }}}
              onClick={() =>
                router.push(
                  `${paths.dashboard.paymentAudit.validationRules.index}/${taskId}/edit/${row.id}`
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
        validationRuleTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(updateSetting));
    } else {
      const tableSettings = {
        validationRuleTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(tableSettings));
    }
  };

  useEffect(() => {
    setRule(tableSetting?.validationRuleTable ?? []);
  }, []);

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
                    <TableCell key={item.id} sx={{ width: item.width }}>
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
                <TableSkeleton rowCount={perPage > 15 ? 15 : 10} cellCount={7} />
              ) : (
                validationRules?.map((position) => (
                  <TableRow key={position.id}>
                    {tableColumn
                      ?.filter((item) => item.enabled)
                      ?.map((header, index) => (
                        <TableCell
                          sx={{ whiteSpace: "nowrap" }}
                          key={position.id + index}
                        >
                          {header?.render
                            ? header?.render(position)
                            : position[header.id]}
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Scrollbar>
        {!isLoading && validationRules?.length === 0 && <TableNoData isSmall />}
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
