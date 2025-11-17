import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
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
import Divider from "@mui/material/Divider";
import { useNavigate } from 'react-router-dom';

import { Iconify } from 'src/components/iconify';
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
import { affiliateApi } from "src/api/lead-management/affiliate";
import { authApi } from "src/api/auth";
import { paths } from "src/paths";
import { thunks } from "src/thunks/lead";
import { useDebounce } from "src/hooks/use-debounce";
import { userApi } from "src/api/user";

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

export const AffiliateTable = () => {
  const accountId = localStorage.getItem("account_id");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [affiliates, setAffiliates] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isTableSettingLoading, setTableSettingLoading] = useState(false);
  const [text, setText] = useState("");
  const [tableSetting, setTableSetting] = useState({});

  const filters = useSelector((state) => state.leads.affiliateFilters);
  const updateFilters = (data) => dispatch(thunks.setAffiliateFilters(data));

  const [tableModal, setTableModal] = useState(false);
  const [rule, setRule] = useState([]);

  const query = useDebounce(text, 500);

  useEffect(() => {
    const affiliatesPerPage = localStorage.getItem("affiliatesPerPage");

    if (affiliatesPerPage) {
      updateFilters({ perPage: affiliatesPerPage });
    }
  }, []);

  const currentChip = useMemo(() => {
    const newChips = filters?.enabled?.map((item) => ({
      displayValue: item === "true" ? "Active" : "Inactive",
      value: item,
      label: "Enable",
    }));
    return newChips;
  }, [filters?.enabled]);

  const totalValidLeadsChip = useMemo(() => {
    const newChips = filters?.total_valid_leads
      ? [
        {
          displayValue: filters?.total_valid_leads,
          value: filters?.total_valid_leads,
          label: "Min Total Valid Leads",
        },
      ]
      : [];
    return newChips;
  }, [filters?.total_valid_leads]);

  const totalDuplicatesChip = useMemo(() => {
    const newChips = filters?.total_duplicates
      ? [
        {
          displayValue: filters?.total_duplicates,
          value: filters?.total_duplicates,
          label: "Min Total Duplicates",
        },
      ]
      : [];
    return newChips;
  }, [filters?.total_duplicates]);

  const FTDChip = useMemo(() => {
    const newChips = filters?.total_ftd
      ? [{
        displayValue: filters?.total_ftd,
        value: filters?.total_ftd,
        label: "Min Total FTD"
      }]
      : [];
    return newChips;
  }, [filters?.total_ftd]);

  const leadsChip = useMemo(() => {
    const newChips = filters?.total_leads
      ? [
        {
          displayValue: filters?.total_leads,
          value: filters?.total_leads,
          label: "Min Total Leads",
        },
      ]
      : [];
    return newChips;
  }, [filters?.total_leads]);

  const maxTotalValidLeadsChip = useMemo(() => {
    const newChips = filters?.lte_total_valid_leads
      ? [
        {
          displayValue: filters?.lte_total_valid_leads,
          value: filters?.lte_total_valid_leads,
          label: "Max Total Valid Leads",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_total_valid_leads]);

  const maxFTDChip = useMemo(() => {
    const newChips = filters?.lte_total_ftd
      ? [
        {
          displayValue: filters?.lte_total_ftd,
          value: filters?.lte_total_ftd,
          label: "Max Total FTD",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_total_ftd]);

  const maxLeadsChip = useMemo(() => {
    const newChips = filters?.lte_total_leads
      ? [
        {
          displayValue: filters?.lte_total_leads,
          value: filters?.lte_total_leads,
          label: "Max Total Leads",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_total_leads]);

  const maxTotalDuplicatesChip = useMemo(() => {
    const newChips = filters?.lte_total_duplicates
      ? [
        {
          displayValue: filters?.lte_total_duplicates,
          value: filters?.lte_total_duplicates,
          label: "Max Total Duplicates",
        },
      ]
      : [];
    return newChips;
  }, [filters?.lte_total_duplicates]);

  const handleRemoveChip = (value) => {
    const newStatus = [...filters?.enabled].filter((item) => item !== value);
    updateFilters({ enabled: newStatus, currentPage: 0 });
  };

  const getTableSetting = async () => {
    setTableSettingLoading(true);
    try {
      const localTableSetting = localStorage.getItem("tableSetting");
      const { account } = await authApi.me({ accountId });
      if (account?.column_setting) {
        setTableSetting(JSON.parse(account?.column_setting));
        setRule(JSON.parse(account?.column_setting)?.affiliateTable ?? []);
      } else if (localTableSetting) {
        const { account: _account } = await userApi.updateUser(accountId, {
          column_setting: localTableSetting,
        });
        setTableSetting(JSON.parse(_account?.column_setting));
        setRule(JSON.parse(_account?.column_setting)?.affiliateTable ?? []);
      }
    } catch (error) {
      console.error("error: ", error);
    }
    setTableSettingLoading(false);
  }

  const getAffiliate = async () => {
    setIsLoading(true);
    try {
      let request = {
        page: (filters?.currentPage ?? 0) + 1,
        per_page: filters?.perPage ?? 10,
        q: query?.length > 0 ? query : null,
        ...filters,
      };

      delete request?.currentPage;

      if (filters?.enabled?.[0] === "true" && filters?.enabled?.length === 1) {
        request.active = "true";
      }
      if (filters?.enabled?.[0] === "false" && filters?.enabled?.length === 1) {
        request.active = "false";
      }
      const res = await affiliateApi.getAffiliates(request);
      setAffiliates(res?.affiliates);
      setTotalCount(res?.total_count);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getTableSetting();
  }, []);

  useEffect(() => {
    getAffiliate();
  }, [
    query,
    filters
  ]);

  useEffect(() => {
    updateFilters({ currentPage: 0 })
  }, [query])

  const totalPage = useMemo(()=> {
    if(totalCount) {
      const perPage = filters?.perPage ? parseInt(filters?.perPage) : 10 ;
      const totalPage =  Math.ceil(totalCount/perPage);
      return totalPage;
    }
    return 0;
  }, [totalCount, filters?.perPage]);

  const defaultColumn = [
    {
      id: "id",
      label: "Id",
      enabled: true,
      render: (row) => (
        <Link
          color="text.primary"
          component={RouterLink}
          href={`${paths.dashboard.lead.affiliate.index}/${row?.id}`}
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
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Link
            color="text.primary"
            component={RouterLink}
            href={`${paths.dashboard.lead.affiliate.index}/${row?.id}`}
            sx={{
              alignItems: "center",
              display: "inline-flex",
            }}
            underline="hover"
          >
            {row?.full_name}
          </Link>
          {row?.aff_admin && (
            <SeverityPill color="info" sx={{ ml: 2, fontSize: 10 }}>
              admin
            </SeverityPill>
          )}
        </Stack>
      ),
    },
    {
      id: "active",
      label: "Enabled",
      enabled: true,
      headerRender: () => (
        <MultiSelect
          noPadding
          label="ENABLE"
          width={150}
          options={enableOption}
          onChange={(val) => updateFilters({ enabled: val, currentPage: 0 })}
          value={filters?.enabled}
        />
      ),
      render: (row) => (
        <SeverityPill color={row?.active ? "success" : "error"}>
          {row?.active ? "Active" : "InActive"}
        </SeverityPill>
      ),
    },
    {
      id: "action",
      label: "Action",
      enabled: true,
      headerRender: () => (
        <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-end', mr: 5 }}>
          <Typography fontSize={13} fontWeight="600" sx={{ whiteSpace: 'nowrap' }}>
            Action
          </Typography>
        </Stack>
      ),
      render: (row) => (
        <Stack 
          direction="row" 
          alignItems="end" 
          justifyContent="flex-end"
          gap={0.5}
          sx={{
            ":hover": { 
              color: "primary.main", 
              cursor: "pointer",
              },
            mr: 5
          }}
          onClick={() => {
            navigate(paths.dashboard.reports.affiliatePerformance, { state: { affiliate: row, tab: 'affiliate' } });
          }}
          >
          <Iconify icon="mingcute:bug-line" width={20}/>
          <Typography
            variant="subtitle2"
            sx={{
              whiteSpace : "nowrap",
            }}
          >
            Report
          </Typography>
        </Stack>
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
  }, [rule, filters]);

  const updateRule = async (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        affiliateTable: rule,
      };
      await userApi.updateUser(accountId, { column_setting: JSON.stringify(updateSetting) });
      setTableSetting(updateSetting);
    } else {
      const updatedTableSettings = {
        affiliateTable: rule,
      };
      await userApi.updateUser(accountId, { column_setting: JSON.stringify(updatedTableSettings) });
      setTableSetting(updatedTableSettings);
    }
  };

  const isDefaultSetting =
    (JSON.stringify(
      defaultColumn?.map((item, index) => ({
        id: item?.id,
        enabled: item?.enabled,
        order: index,
      }))
    ) === 
    JSON.stringify(
      rule?.map((item, index) => ({
        id: item?.id,
        enabled: item?.enabled,
        order: index,
        })
      )
    )) || 
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
              placeholder="Enter a keyword"
              onChange={(event) => {
                setText(event?.target?.value);
              }}
            />
          </Box>
          <Stack direction='row' alignItems='center' gap={1}>
            {isLoading  && (
              <Iconify
                icon='svg-spinners:8-dots-rotate'
                width={24}
                sx={{ color: 'white' }}
              />
            )}
            <Tooltip title="Reload Table">
              <IconButton
                onClick={() => getAffiliate()}
                sx={{ '&:hover': { color: 'primary.main', transform: 'rotate(180deg)', }, transition: 'transform 0.3s' }}
              >
                <Iconify icon="ion:reload-sharp" width={24}/>
              </IconButton>
            </Tooltip>
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
        {!!currentChip?.length ||
          !!FTDChip?.length ||
          !!maxFTDChip?.length ||
          !!leadsChip?.length ||
          !!maxLeadsChip?.length ||
          !!totalValidLeadsChip?.length ||
          !!maxTotalValidLeadsChip?.length ||
          !!totalDuplicatesChip?.length ||
          !!maxTotalDuplicatesChip?.length ||
          !!maxLeadsChip?.length ? (
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
              <ChipSet
                chips={totalValidLeadsChip}
                handleRemoveChip={() => updateFilters({ total_valid_leads: "", currentPage: 0 })}
              />
              <ChipSet
                chips={maxTotalValidLeadsChip}
                handleRemoveChip={() => updateFilters({ lte_total_valid_leads: "", currentPage: 0 })}
              />
              <ChipSet
                chips={totalDuplicatesChip}
                handleRemoveChip={() => updateFilters({ total_duplicates: "", currentPage: 0 })}
              />
              <ChipSet
                chips={maxTotalDuplicatesChip}
                handleRemoveChip={() => updateFilters({ lte_total_duplicates: "", currentPage: 0 })}
              />
              <ChipSet
                chips={FTDChip}
                handleRemoveChip={() => updateFilters({ total_ftd: "", currentPage: 0 })}
              />
              <ChipSet
                chips={maxFTDChip}
                handleRemoveChip={() => updateFilters({ lte_total_ftd: "", currentPage: 0 })}
              />
              <ChipSet
                chips={leadsChip}
                handleRemoveChip={() => updateFilters({ total_leads: "", currentPage: 0 })}
              />
              <ChipSet
                chips={maxLeadsChip}
                handleRemoveChip={() => updateFilters({ lte_total_leads: "", currentPage: 0 })}
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
                    <TableCell key={item.id}>
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
              {(isLoading || isTableSettingLoading) ? (
                <TableSkeleton
                  rowCount={filters?.perPage > 15 ? 15 : 10}
                  cellCount={4}
                />
              ) : (
                affiliates?.map((row) => (
                  <TableRow key={row?.id} sx={{ whiteSpace: "nowrap" }}>
                    {tableColumn
                      ?.filter((item) => item.enabled)
                      ?.map((column, index) => (
                        <TableCell key={row.id + index}>
                          {column?.render
                            ? column?.render(row)
                            : row[column?.id]}
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Scrollbar>
        {affiliates?.length === 0 && !isLoading && <TableNoData />}
        {isLoading && <Divider/>}
        <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
          <PageNumberSelect 
            currentPage={filters?.currentPage ?? 0} 
            totalPage={totalPage}
            onUpdate={(pageNum)=> {
              updateFilters({ currentPage: pageNum })
            }}
          />
          <TablePagination
            component="div"
            labelRowsPerPage="Per page"
            count={totalCount ?? 0}
            page={filters?.currentPage ?? 0}
            rowsPerPage={filters?.perPage ?? 10}
            onPageChange={(event, index) => updateFilters({ currentPage: index })}
            onRowsPerPageChange={(event) => {
              updateFilters({ perPage: event?.target?.value, currentPage: 0 });
              localStorage.setItem("affiliatesPerPage", event?.target?.value);
            }}
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
