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

import { Iconify } from 'src/components/iconify';
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { ChipSet } from "src/components/customize/chipset";
import { FilterInput } from "src/components/customize/filter-input";
import { MultiSelect } from "src/components/multi-select";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { TableModal } from "src/components/table-settings-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { brandsApi } from "src/api/lead-management/brand";
import { paths } from "src/paths";
import { useDebounce } from "src/hooks/use-debounce";
import { authApi } from "src/api/auth";
import { userApi } from "src/api/user";
import { PageNumberSelect } from "src/components/pagination/page-selector";

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

export const BrandsTable = () => {
  const accountId = localStorage.getItem("account_id");

  const [text, setText] = useState("");
  const [brands, setBrands] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [tableSetting, setTableSetting] = useState({});

  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const query = useDebounce(text, 500);
  const [enabled, setEnabled] = useState([]);
  const [totalValidLeads, setTotalValidLeads] = useState();
  const [totalFTD, setTotalFTD] = useState();
  const [totalLeads, setTotalLeads] = useState();
  const [maxTotalValidLeads, setMaxTotalValidLeads] = useState();
  const [maxTotalFTD, setMaxTotalFTD] = useState();
  const [maxTotalLeads, setMaxTotalLeads] = useState();

  const [rule, setRule] = useState([]);
  const [tableModal, setTableModal] = useState(false);

  const currentChip = useMemo(() => {
    const newChips = enabled?.map((item) => ({
      displayValue: item === "true" ? "Active" : "Inactive",
      value: item,
      label: "Enable",
    }));
    return newChips;
  }, [enabled]);

  const totalValidLeadsChip = useMemo(() => {
    const newChips = totalValidLeads
      ? [
          {
            displayValue: totalValidLeads,
            value: totalValidLeads,
            label: "Min Total Valid Leads",
          },
        ]
      : [];
    return newChips;
  }, [totalValidLeads]);

  const maxTotalValidLeadsChip = useMemo(() => {
    const newChips = maxTotalValidLeads
      ? [
          {
            displayValue: maxTotalValidLeads,
            value: maxTotalValidLeads,
            label: "Max Total Valid Leads",
          },
        ]
      : [];
    return newChips;
  }, [maxTotalValidLeads]);

  const FTDChip = useMemo(() => {
    const newChips = totalFTD
      ? [{ displayValue: totalFTD, value: totalFTD, label: "Min Total FTD" }]
      : [];
    return newChips;
  }, [totalFTD]);

  const maxFTDChip = useMemo(() => {
    const newChips = maxTotalFTD
      ? [
          {
            displayValue: maxTotalFTD,
            value: maxTotalFTD,
            label: "Max Total FTD",
          },
        ]
      : [];
    return newChips;
  }, [maxTotalFTD]);

  const leadsChip = useMemo(() => {
    const newChips = totalLeads
      ? [
          {
            displayValue: totalLeads,
            value: totalLeads,
            label: "Min Total Leads",
          },
        ]
      : [];
    return newChips;
  }, [totalLeads]);

  const maxLeadsChip = useMemo(() => {
    const newChips = maxTotalLeads
      ? [
          {
            displayValue: maxTotalLeads,
            value: maxTotalLeads,
            label: "Max Total Leads",
          },
        ]
      : [];
    return newChips;
  }, [maxTotalLeads]);

  const handleRemoveChip = (value) => {
    const newStatus = [...enabled].filter((item) => item !== value);
    setEnabled(newStatus);
  };

  const getTableSetting = async () => {
    setIsLoading(true);
    try {
      const localTableSetting = localStorage.getItem("tableSetting");
      const { account } = await authApi.me({ accountId });
      if (account?.column_setting) {
        setTableSetting(JSON.parse(account?.column_setting));
        setRule(JSON.parse(account?.column_setting)?.brandTable ?? []);
      } else if (localTableSetting) {
        const { account: _account } = await userApi.updateUser(accountId, {
          column_setting: localTableSetting,
        });
        setTableSetting(JSON.parse(_account?.column_setting));
        setRule(JSON.parse(_account?.column_setting)?.brandTable ?? []);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
  }

  const getBrandInfo = async () => {
    setIsLoading(true);
    let request = {
      page: currentPage + 1,
      per_page: perPage,
      q: query?.length > 0 ? query : null,
      total_valid_leads: totalValidLeads,
      total_ftd: totalFTD,
      total_leads: totalLeads,
      lte_total_valid_leads: maxTotalValidLeads,
      lte_total_ftd: maxTotalFTD,
      lte_total_leads: maxTotalLeads,
    };
    if (enabled[0] === "true" && enabled?.length === 1) {
      request.active = "true";
    }
    if (enabled[0] === "false" && enabled?.length === 1) {
      request.active = "false";
    }
    try {
      const res = await brandsApi.getBrands(request);
      setBrands(res.brands);
      setTotalCount(res?.total_count);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const updateRule = async (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        brandTable: rule,
      };
      await userApi.updateUser(accountId, { column_setting: JSON.stringify(updateSetting) });
      setTableSetting(updateSetting);
    } else {
      const updateSetting = {
        brandTable: rule,
      };
      await userApi.updateUser(accountId, { column_setting: JSON.stringify(updateSetting) });
      setTableSetting(updateSetting);
    }
  };

  useEffect(() => {
    getBrandInfo();
  }, [
    currentPage,
    perPage,
    query,
    enabled,
    totalValidLeads,
    totalFTD,
    totalLeads,
    maxTotalLeads,
    maxTotalValidLeads,
    maxTotalFTD,
  ]);

  useEffect(() => {
    getTableSetting();
  }, []);

  const defaultColumn = [
    {
      id: "id",
      label: "Id",
      enabled: true,
      render: (row) => (
        <Link
          color="text.primary"
          component={RouterLink}
          href={`${paths.dashboard.lead.brands.index}/${row?.id}`}
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
        <Link
          color="text.primary"
          component={RouterLink}
          href={`${paths.dashboard.lead.brands.index}/${row?.id}`}
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
      id: "total_valid_leads",
      label: "Total Valid Leads",
      enabled: true,
      headerRender: () => (
        <FilterInput
          labelFont={12}
          type="number"
          label="TOTAL VALID LEADS"
          placeholder="Min total valid leads..."
          filter={totalValidLeads}
          setFilter={(val) => {
            setTotalValidLeads(val);
            setCurrentPage(0);
          }}
          isRange
          placeholder2="Max total valid leads..."
          filter2={maxTotalValidLeads}
          setFilter2={(val) => {
            setMaxTotalValidLeads(val);
            setCurrentPage(0);
          }}
        />
      ),
    },
    {
      id: "total_ftd",
      label: "Total FTD",
      enabled: true,
      headerRender: () => (
        <FilterInput
          labelFont={12}
          type="number"
          label="TOTAL FTD"
          placeholder="Min total ftd..."
          filter={totalFTD}
          setFilter={(val) => {
            setTotalFTD(val);
            setCurrentPage(0);
          }}
          isRange
          placeholder2="Max total ftd..."
          filter2={maxTotalFTD}
          setFilter2={(val) => {
            setMaxTotalFTD(val);
            setCurrentPage(0);
          }}
        />
      ),
    },
    {
      id: "total_leads",
      label: "Total LEADS",
      enabled: true,
      headerRender: () => (
        <FilterInput
          labelFont={12}
          type="number"
          label="TOTAL LEADS"
          placeholder="Min total leads..."
          filter={totalLeads}
          setFilter={(val) => {
            setTotalLeads(val);
            setCurrentPage(0);
          }}
          isRange
          placeholder2="Max total leads..."
          filter2={maxTotalLeads}
          setFilter2={(val) => {
            setMaxTotalLeads(val);
            setCurrentPage(0);
          }}
        />
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
  }, [rule, enabled, totalValidLeads, totalFTD, totalLeads]);

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
          <Stack direction='row' alignItems='center' gap={1}>
            {isLoading && (
              <Iconify
                icon='svg-spinners:8-dots-rotate'
                width={24}
                sx={{ color: 'white' }}
              />
            )}
            <Tooltip title="Reload Table">
              <IconButton
                onClick={() => getBrandInfo()}
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
        {enabled?.length ||
        totalValidLeads?.length ||
        totalFTD?.length ||
        totalLeads?.length ||
        maxTotalValidLeads?.length ||
        maxTotalFTD?.length ||
        maxTotalLeads?.length ? (
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
                handleRemoveChip={() => setTotalValidLeads("")}
              />
              <ChipSet
                chips={FTDChip}
                handleRemoveChip={() => setTotalFTD("")}
              />
              <ChipSet
                chips={leadsChip}
                handleRemoveChip={() => setTotalLeads("")}
              />
              <ChipSet
                chips={maxTotalValidLeadsChip}
                handleRemoveChip={() => setMaxTotalValidLeads("")}
              />
              <ChipSet
                chips={maxLeadsChip}
                handleRemoveChip={() => setMaxTotalLeads("")}
              />
              <ChipSet
                chips={maxFTDChip}
                handleRemoveChip={() => setMaxTotalFTD("")}
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
              {isLoading ? (
                <TableSkeleton
                  rowCount={perPage > 15 ? 15 : 10}
                  cellCount={6}
                />
              ) : (
                brands.map((brand) => (
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
        {brands?.length === 0 && !isLoading && <TableNoData />}
        {isLoading && <Divider />}
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
