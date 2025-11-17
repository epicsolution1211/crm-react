import { useState, useEffect, useMemo } from "react";
import * as yup from "yup";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomModal from "src/components/customize/custom-modal";
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { ChipSet } from "src/components/customize/chipset";
import { Iconify } from 'src/components/iconify';
import { MultiSelect } from "src/components/multi-select";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { TableModal } from "src/components/table-settings-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";
import { useTimezone } from "src/hooks/use-timezone";
import { validationRuleApi } from "src/api/payment_audit/validation_rule";

const enableOption = [
  {
    label: "Active",
    value: "true",
  },
  {
    label: "Inactive",
    value: "false",
  },
];

const validationSchema = yup.object({
  name: yup.string().required("Validation rule name is a required field"),
});

export const ValidationTable = () => {
  const { company, user } = useAuth();
  const { toLocalTime } = useTimezone();
  const localTableSetting = localStorage.getItem("tableSetting");
  const tableSetting = JSON.parse(localTableSetting);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const [text, setText] = useState("");
  const [validationTasks, setValidationTasks] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);

  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const query = useDebounce(text);
  const [enabled, setEnabled] = useState([]);

  const [rule, setRule] = useState([]);
  const [tableModal, setTableModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const currentChip = useMemo(() => {
    const newChips = enabled?.map((item) => ({
      displayValue: item === "true" ? "Active" : "Inactive",
      value: item,
      label: "Enable",
    }));
    return newChips;
  }, [enabled]);

  const handleRemoveChip = (value) => {
    const newStatus = [...enabled].filter((item) => item !== value);
    setEnabled(newStatus);
  };

  const getValidationTasks = async () => {
    setIsLoading(true);
    let request = {
      page: currentPage + 1,
      per_page: perPage,
      q: query?.length > 0 ? query : null,
    };
    if (enabled[0] === "true" && enabled?.length === 1) {
      request.active = "true";
    }
    if (enabled[0] === "false" && enabled?.length === 1) {
      request.active = "false";
    }
    try {
      const res = await validationRuleApi.getValidationTasks(request);
      setValidationTasks(res?.tasks);
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
        validationTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(updateSetting));
    } else {
      const tableSettings = {
        validationTable: rule,
      };
      localStorage.setItem("tableSetting", JSON.stringify(tableSettings));
    }
  };

  useEffect(() => {
    getValidationTasks();
  }, [currentPage, perPage, query, enabled]);

  useEffect(() => {
    setRule(tableSetting?.validationTable ?? []);
  }, []);

  const onSubmit = async (data) => {
    try {
      setDisabledButton(true);
      await validationRuleApi.createValidationTask(data);
      setTimeout(() => {
        getValidationTasks();
      }, 1000);
      setDisabledButton(false);
    } catch (error) {
      setDisabledButton(false);
      toast(error?.response?.data?.message ?? error?.message);
      console.warn("error: ", error);
    }
    setModalOpen(false);
  };

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
          href={`${paths.dashboard.paymentAudit.validationRules.index}/${row?.id}`}
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
          href={`${paths.dashboard.paymentAudit.validationRules.index}/${row?.id}`}
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
      id: "active",
      label: "Enabled",
      enabled: true,
      width: 100,
      headerRender: () => (
        <MultiSelect
          noPadding
          label="ENABLE"
          width={150}
          options={enableOption}
          onChange={setEnabled}
          value={enabled}
        />
      ),
      render: (row) => (
        <SeverityPill color={row?.active ? "success" : "error"}>
          {row?.active ? "Active" : "InActive"}
        </SeverityPill>
      ),
    },
    {
      id: "note",
      label: "Description",
      enabled: true,
      width: 500,
    },
    {
      id: "created_at",
      width: 50,
      label: "Created At",
      enabled: true,
      render: (row) => (
        <Typography variant="body2">
          {toLocalTime(row?.created_at)}
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
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4">Validation Tasks</Typography>
          {user?.acc?.acc_e_audit_tasks === undefined ||
          user?.acc?.acc_e_audit_tasks ? (
            <Button
              disabled={company?.list_filtering}
              startIcon={<Iconify icon="lucide:plus" width={24} />}
              onClick={() => setModalOpen(true)}
              variant="contained"
            >
              Add
            </Button>
          ) : null}
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
                    cellCount={5}
                  />
                ) : (
                  validationTasks?.map((brand) => (
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
          {validationTasks?.length === 0 && !isLoading && <TableNoData />}

          <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
            <PageNumberSelect 
              currentPage={currentPage} 
              totalPage={totalCount? Math.ceil(totalCount/perPage) : 0}
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
      </PayWallLayout>

      <TableModal
        open={tableModal}
        onClose={() => setTableModal(false)}
        tableColumn={tableColumn}
        defaultColumn={defaultColumn}
        updateRule={updateRule}
      />
      <CustomModal
        onClose={() => {
          setModalOpen(false);
          reset();
        }}
        open={modalOpen}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: "bold", mt: 1 }}
            >
              Create Validation Rule
            </Typography>
            <Stack sx={{ py: 2 }} direction="row" justifyContent="center">
              <TextField
                fullWidth
                autoFocus
                error={!!errors?.name?.message}
                helperText={errors?.name?.message}
                label="name"
                name="name"
                type="text"
                {...register("name")}
              />
            </Stack>
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <Button
                disabled={disabledButton}
                variant="contained"
                type="submit"
              >
                Create
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>
    </>
  );
};
