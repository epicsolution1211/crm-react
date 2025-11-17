import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
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
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { FilterSelect } from "src/components/customize/filter-select";
import { LabelsDialog } from "src/components/labels-dialog";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { Seo } from "src/components/seo";
import { SeverityPill } from "src/components/severity-pill";
import { TableModal } from "src/components/table-settings-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { affiliateApi } from "src/api/lead-management/affiliate";
import { authApi } from "src/api/auth";
import { brandsApi } from "src/api/lead-management/brand";
import { countries } from "src/utils/constant";
import { customersApi } from "src/api/customers";
import { format } from "date-fns";
import { injectionApi } from "src/api/lead-management/list-injection";
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";
import { useRouter } from "src/hooks/use-router";
import { useSelection } from "src/hooks/use-selection";
import { userApi } from "src/api/user";

const Page = () => {
  const { user } = useAuth();
  const accountId = localStorage.getItem("account_id");

  const [isLoading, setIsLoading] = useState(true);
  const [injections, setInjections] = useState([]);
  const [tableSetting, setTableSetting] = useState({});

  const [text, setText] = useState("");
  const [count, setCount] = useState(0);
  const [brandList, setBrandList] = useState([]);
  const [affiliateList, setAffiliateList] = useState([]);
  const [teamList, setTeamList] = useState();
  const [agentList, setAgentList] = useState();
  const [labelList, setLabelList] = useState();

  const [labelsInfo, setLabelsInfo] = useState([]);

  const [tableModal, setTableModal] = useState(false);
  const [labelModal, setLabelModal] = useState(false);

  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const query = useDebounce(text, 500);
  const [brand, setBrand] = useState([]);
  const [affiliate, setAffiliate] = useState([]);
  const [team, setTeam] = useState([]);
  const [agent, setAgent] = useState([]);
  const [labels, setLabels] = useState([]);
  const [nonLabels, setNonLabels] = useState([]);
  const [country, setCountry] = useState("");

  const [totalCount, setTotalCount] = useState("");
  const [validatedCount, setValidatedCount] = useState("");
  const [invalidCount, setInvalidCount] = useState("");
  const [duplicatedEmail, setDuplicatedEmail] = useState("");
  const [duplicatedPhone, setDuplicatedPhone] = useState("");
  const [enabled, setEnabled] = useState([]);

  const [rule, setRule] = useState([]);
  const [listIds, setListIds] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const injectionsPerPage = localStorage.getItem("injectionsPerPage");

    if (injectionsPerPage) {
      setPerPage(injectionsPerPage);
    }
  }, []);

  useEffect(() => {
    if (user?.acc?.acc_v_lm_list === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  const tableIds = useMemo(
    () => injections?.map((item) => item?.id),
    [injections]
  );
  const leadSelection = useSelection(listIds ?? [], (message) => {
    toast.error(message);
  });

  const enableBulkActions = leadSelection.selected?.length > 0;
  const selectedPage = tableIds?.every((item) =>
    leadSelection.selected?.includes(item)
  );
  const selectedSome =
    tableIds?.some((item) => leadSelection.selected?.includes(item)) &&
    !tableIds?.every((item) => leadSelection.selected?.includes(item));

  const getInjections = async () => {
    try {
      const params = {
        account_ids: affiliate,
        agent_ids: agent,
        brand_ids: brand,
        country: country,
        duplicate_emails: duplicatedEmail,
        duplicate_phones: duplicatedPhone,
        invalid_count: invalidCount,
        label_ids: labels,
        non_label_ids: nonLabels,
        page: currentPage + 1,
        per_page: perPage,
        q: query?.length > 0 ? query : null,
        team_ids: team,
        total_count: totalCount,
        validated_count: validatedCount,
      };
      if (enabled[0] === "true" && enabled?.length === 1) {
        params.dripping = "true";
      }
      if (enabled[0] === "false" && enabled?.length === 1) {
        params.dripping = "false";
      }
      const res = await injectionApi.getInjections(params);
      setInjections(res?.injections);
      setListIds([
        ...new Set([...listIds, ...res?.injections?.map((item) => item?.id)]),
      ]);
      setCount(res?.total_count);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getInjectionTableInfo = async () => {
    setIsLoading(true);
    try {
      getInjections();
    } catch (error) {
      console.error('error: ', error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (!isLoading) {
      const intervalId = setInterval(() => {
        getInjections();
      }, 2000);
      return () => clearInterval(intervalId);
    }
  }, [
    isLoading,
    perPage,
    currentPage,
    query,
    brand,
    affiliate,
    team,
    agent,
    labels,
    nonLabels,
    country,
    totalCount,
    validatedCount,
    invalidCount,
    duplicatedEmail,
    duplicatedPhone,
    enabled
  ]);

  const getTableSetting = async () => {
    setIsLoading(true);
    try {
      const localTableSetting = localStorage.getItem("tableSetting");
      const { account } = await authApi.me({ accountId });
      if (account?.column_setting) {
        setTableSetting(JSON.parse(account?.column_setting));
        setRule(JSON.parse(account?.column_setting)?.listTable ?? []);
      } else if (localTableSetting) {
        const { account: _account } = await userApi.updateUser(accountId, {
          column_setting: localTableSetting,
        });
        setTableSetting(JSON.parse(_account?.column_setting));
        setRule(JSON.parse(_account?.column_setting)?.listTable ?? []);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
  }

  const getBrands = async () => {
    try {
      const res = await brandsApi?.getBrands();
      const brandList = res?.brands
        ?.map((item) => ({
          label: item?.name,
          value: item?.id?.toString(),
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      setBrandList(brandList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getAffiliate = async () => {
    try {
      const res = await affiliateApi?.getAffiliates();
      const affiliateList = res?.affiliates
        ?.map((item) => ({
          label: item?.full_name,
          value: item?.id?.toString(),
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      setAffiliateList(affiliateList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getTeam = async () => {
    try {
      const res = await settingsApi.getSkillTeams("*");
      const teamList = res
        ?.map(({ team }) => ({
          label: team?.name,
          value: team?.id?.toString(),
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      setTeamList([...teamList]);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getAgent = async () => {
    try {
      const res = await settingsApi.getMembers();
      const agentList = res?.accounts
        ?.filter(account => !account?.admin_hide)
        ?.map((item) => ({
          label: `${item?.first_name} ${item?.last_name}`,
          value: item?.id?.toString(),
        }));
      setAgentList(agentList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getLabels = async () => {
    try {
      const res = await customersApi.getCustomerLabels();
      const labelList = res?.labels
        ?.map(({ label }) => ({
          label: label?.name,
          value: label?.id?.toString(),
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      setLabelsInfo(res?.labels);
      setLabelList(labelList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const countryList = useMemo(() => {
    if (countries) {
      const countryArray = countries?.map((item) => ({
        label: item?.label,
        value: item?.code,
      }));
      return countryArray;
    }
  }, [countries]);

  const brandIdChip = useMemo(
    () =>
      brand?.map((value) => ({
        displayValue: brandList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Brand",
      })),
    [brand, brandList]
  );

  const affiliateChip = useMemo(
    () =>
      affiliate?.map((value) => ({
        displayValue: affiliateList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Affiliate",
      })),
    [affiliate, affiliateList]
  );

  const teamChip = useMemo(
    () =>
      team?.map((value) => ({
        displayValue: teamList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Team",
      })),
    [team, teamList]
  );

  const agentChip = useMemo(
    () =>
      agent?.map((value) => ({
        displayValue: agentList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Agent",
      })),
    [agent, agentList]
  );

  const labelChip = useMemo(
    () =>
      labels?.map((value) => ({
        displayValue: labelList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Label",
      })),
    [labels, labelList]
  );

  const nonLabelChip = useMemo(
    () =>
      nonLabels?.map((value) => ({
        displayValue: labelList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Label",
      })),
    [nonLabels, labelList]
  );

  const countryChip = useMemo(() => {
    const newChips =
      country && country !== "_empty"
        ? [
          {
            displayValue: countries?.find((item) => item?.code === country)
              ?.label,
            value: country,
            label: "Country",
          },
        ]
        : [];
    return newChips;
  }, [country]);

  const totalCountChip = useMemo(() => {
    const newChips = totalCount
      ? [{ displayValue: totalCount, value: totalCount, label: "Total Count" }]
      : [];
    return newChips;
  }, [totalCount]);

  const validatedCountChip = useMemo(() => {
    const newChips = validatedCount
      ? [
        {
          displayValue: validatedCount,
          value: validatedCount,
          label: "Validated Count",
        },
      ]
      : [];
    return newChips;
  }, [validatedCount]);

  const invalidCountCountChip = useMemo(() => {
    const newChips = invalidCount
      ? [
        {
          displayValue: invalidCount,
          value: invalidCount,
          label: "Invalid Count",
        },
      ]
      : [];
    return newChips;
  }, [invalidCount]);

  const duplicateEmailCountChip = useMemo(() => {
    const newChips = duplicatedEmail
      ? [
        {
          displayValue: duplicatedEmail,
          value: duplicatedEmail,
          label: "Duplicate Email",
        },
      ]
      : [];
    return newChips;
  }, [duplicatedEmail]);

  const duplicatePhoneCountChip = useMemo(() => {
    const newChips = duplicatedPhone
      ? [
        {
          displayValue: duplicatedPhone,
          value: duplicatedPhone,
          label: "Duplicate Email",
        },
      ]
      : [];
    return newChips;
  }, [duplicatedPhone]);

  const currentChip = useMemo(() => {
    const newChips = enabled?.map((item) => ({
      displayValue: item === "true" ? "Active" : "Inactive",
      value: item,
      label: "Dripping",
    }));
    return newChips;
  }, [enabled]);

  const handleRemoveChip = (value, target) => {
    if (target === "brand") {
      const newLabels = [...brand].filter((item) => item !== value);
      setBrand(newLabels);
    }
    if (target === "label") {
      const newLabels = [...labels].filter((item) => item !== value);
      setLabels(newLabels);
    }
    if (target === "non_label") {
      const newLabels = [...nonLabels].filter((item) => item !== value);
      setNonLabels(newLabels);
    }
    if (target === "agent") {
      const newLabels = [...agent].filter((item) => item !== value);
      setAgent(newLabels);
    }
    if (target === "team") {
      const newLabels = [...team].filter((item) => item !== value);
      setTeam(newLabels);
    }
    if (target === "affiliate") {
      const newLabels = [...affiliate].filter((item) => item !== value);
      setAffiliate(newLabels);
    }
    if (target === "dripping") {
      const newLabels = [...enabled].filter((item) => item !== value);
      setEnabled(newLabels);
    }
  };

  useEffect(() => {
    getInjectionTableInfo();
  }, [
    perPage,
    currentPage,
    query,
    brand,
    affiliate,
    team,
    agent,
    labels,
    nonLabels,
    country,
    totalCount,
    validatedCount,
    invalidCount,
    duplicatedEmail,
    duplicatedPhone,
    enabled,
  ]);

  useEffect(() => {
    getTableSetting();
    getBrands();
    getAffiliate();
    getTeam();
    getLabels();
    getAgent();
  }, []);

  const defaultColumn = [
    {
      id: "id",
      label: "ID",
      enabled: true,
      render: (row) => (
        <Link
          color="text.primary"
          component={RouterLink}
          href={`${paths.dashboard.lead.injection.index}/${row?.id}`}
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
      render: (row) => row?.name?.includes("[Status]") ? (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Link
            color="text.primary"
            component={RouterLink}
            href={`${paths.dashboard.lead.injection.index}/${row?.id}`}
            sx={{
              alignItems: "center",
              display: "inline-flex",
            }}
            underline="hover"
          >
            {row?.name?.split(" [")[0]?.trim()}
          </Link>
          <SeverityPill>
            {row?.name?.split("] ")[1]?.trim()}
          </SeverityPill>
        </Stack>

      ) : (
        <Link
          color="text.primary"
          component={RouterLink}
          href={`${paths.dashboard.lead.injection.index}/${row?.id}`}
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
      id: "brand_name",
      label: "Brand",
      enabled: true,
      headerRender: () => (
        <FilterMultiSelect
          label="BRAND"
          withSearch
          placeholder="Brand..."
          options={brandList ?? []}
          onChange={(val) => {
            setBrand(val);
            setCurrentPage(0);
          }}
          value={brand}
        />
      ),
    },
    {
      id: "account_name",
      label: "Affiliate",
      enabled: true,
      headerRender: () => (
        <FilterMultiSelect
          label="AFFILIATE"
          withSearch
          placeholder="Affiliate..."
          options={affiliateList ?? []}
          onChange={(val) => {
            setAffiliate(val);
            setCurrentPage(0);
          }}
          value={affiliate}
        />
      ),
    },
    {
      id: "team_name",
      label: "TEAM",
      enabled: true,
      headerRender: () => (
        <FilterMultiSelect
          label="TEAM"
          withSearch
          placeholder="Team..."
          options={teamList ?? []}
          onChange={(val) => {
            setTeam(val);
            setCurrentPage(0);
          }}
          value={team}
        />
      ),
    },
    {
      id: "agent_name",
      label: "Agent",
      enabled: true,
      headerRender: () => (
        <FilterMultiSelect
          label="AGENT"
          withSearch
          placeholder="Agent..."
          options={agentList ?? []}
          onChange={(val) => {
            setAgent(val);
            setCurrentPage(0);
          }}
          value={agent}
        />
      ),
    },
    {
      id: "desk",
      label: "Desk",
      enabled: true,
    },
    {
      id: "labels",
      label: "Labels",
      enabled: true,
      headerRender: () => (
        <FilterMultiSelect
          label="LABELS"
          withSearch
          isLabel
          placeholder="Label..."
          options={labelList ?? []}
          onChange={(val) => {
            setLabels(val);
            setCurrentPage(0);
          }}
          handleModalOpen={() => setLabelModal(true)}
          value={labels}
          onChangeNon={(val) => {
            setNonLabels(val);
            setCurrentPage(0);
          }}
          valueNon={nonLabels}
        />
      ),
      render: (row) =>
        row?.labels?.map((item) => (
          <Chip
            key={item.name}
            label={item.name}
            size="small"
            color="primary"
            sx={{
              backgroundColor:
                labelsInfo?.find(({ label }) => item.name === label?.name)
                  ?.label?.color ?? "",
              mr: 1,
            }}
          />
        )),
    },
    {
      id: "country",
      label: "Country",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          withSearch
          label="COUNTRY"
          placeholder="Country..."
          options={countryList ?? []}
          setValue={(val) => {
            setCountry(val);
            setCurrentPage(0);
          }}
          value={country}
        />
      ),
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Iconify icon={`circle-flags:${row?.country?.toLowerCase()}`} width={24} />
          <Typography variant="subtitle2">{row?.country}</Typography>
        </Stack>
      ),
    },
    {
      id: "internal_id",
      label: "Internal ID",
      enabled: true,
    },
    {
      id: "total_count",
      label: "TOTAL COUNT",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="TOTAL COUNT"
          placeholder="Min total Count..."
          filter={totalCount}
          setFilter={(val) => {
            setTotalCount(val);
            setCurrentPage(0);
          }}
        />
      ),
    },
    {
      id: "validated_count",
      label: "VALIDATED COUNT",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="VALIDATED COUNT"
          placeholder="Min validated Count..."
          filter={validatedCount}
          setFilter={(val) => {
            setValidatedCount(val);
            setCurrentPage(0);
          }}
        />
      ),
    },
    {
      id: "invalid_count",
      label: "INVALID COUNT",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="INVALIDATED COUNT"
          placeholder="Min Invalidated Count..."
          filter={validatedCount}
          setFilter={(val) => {
            setValidatedCount(val);
            setCurrentPage(0);
          }}
        />
      ),
      render: (row) => row?.total_count - row?.validated_count,
    },
    {
      id: "duplicate_emails",
      label: "DUPLICATE EMAILS",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="DUPLICATE EMAILS"
          placeholder="Min duplicate emails..."
          filter={duplicatedEmail}
          setFilter={(val) => {
            setDuplicatedEmail(val);
            setCurrentPage(0);
          }}
        />
      ),
    },
    {
      id: "duplicate_phones",
      label: "DUPLICATE PHONES",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="DUPLICATE PHONES"
          placeholder="Min duplicate phones..."
          filter={duplicatedEmail}
          setFilter={(val) => {
            setDuplicatedPhone(val);
            setCurrentPage(0);
          }}
        />
      ),
    },
    {
      id: "created_at",
      label: "CREATED AT",
      enabled: true,
      render: (row) => (
        <Typography variant="subtitle2">{format(new Date(row?.created_at), "yyyy-MM-dd")}</Typography>
      )
    }
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
    brandList,
    agentList,
    teamList,
    labelList,
    brand,
    affiliate,
    team,
    agent,
    labels,
    nonLabels,
    country,
    totalCount,
    validatedCount,
    invalidCount,
    duplicatedEmail,
    duplicatedPhone,
    enabled,
    labelsInfo,
  ]);

  const updateRule = async (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        listTable: rule,
      };
      await userApi.updateUser(accountId, { column_setting: JSON.stringify(updateSetting) });
      setTableSetting(updateSetting);
    } else {
      const updateSetting = {
        listTable: rule,
      };
      await userApi.updateUser(accountId, { column_setting: JSON.stringify(updateSetting) });
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
      <Seo title={`Dashboard: List Injection`} />
      <Box component="main" sx={{ flexGrow: 1, pt: 7, pb: 2 }}>
        <Container maxWidth="xxl">
          <Stack spacing={3} sx={{ mb: 4 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4">List Injection</Typography>
              {user?.acc?.acc_e_lm_list === undefined ||
                user?.acc?.acc_e_lm_list ? (
                <Button
                  component={RouterLink}
                  href={paths.dashboard.lead.injection.create}
                  startIcon={<Iconify icon="lucide:plus" width={24} />}
                  variant="contained"
                >
                  Add
                </Button>
              ) : null}
            </Stack>
          </Stack>
          <Card>
            <Stack
              alignItems="center"
              direction="row"
              spacing={1}
              sx={{ p: 2 }}
            >
              <Iconify icon="lucide:search" color="text.secondary" width={24} />
              <Box sx={{ flexGrow: 1 }}>
                <Input
                  value={text}
                  onChange={(event) => setText(event?.target?.value)}
                  disableUnderline
                  fullWidth
                  placeholder="Enter a keyword"
                />
              </Box>
              <Tooltip title="Reload Table">
                <IconButton 
                  onClick={() => getInjections()} 
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
            {brand?.length ||
              affiliate?.length ||
              team?.length ||
              agent?.length ||
              labels?.length ||
              nonLabelChip?.length ||
              countryChip?.length ||
              totalCount?.length ||
              validatedCount?.length ||
              invalidCount?.length ||
              duplicatedEmail?.length ||
              duplicatedPhone?.length ||
              enabled?.length ? (
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
                    chips={brandIdChip}
                    handleRemoveChip={(value) => {
                      const target = "brand";
                      return handleRemoveChip(value, target);
                    }}
                  />
                  <ChipSet
                    chips={affiliateChip}
                    handleRemoveChip={(value) => {
                      const target = "affiliate";
                      return handleRemoveChip(value, target);
                    }}
                  />
                  <ChipSet
                    chips={teamChip}
                    handleRemoveChip={(value) => {
                      const target = "team";
                      return handleRemoveChip(value, target);
                    }}
                  />
                  <ChipSet
                    chips={agentChip}
                    handleRemoveChip={(value) => {
                      const target = "agent";
                      return handleRemoveChip(value, target);
                    }}
                  />
                  <ChipSet
                    chips={labelChip}
                    handleRemoveChip={(value) => {
                      const target = "label";
                      return handleRemoveChip(value, target);
                    }}
                  />
                  <ChipSet
                    chips={nonLabelChip}
                    handleRemoveChip={(value) => {
                      const target = "non_label";
                      return handleRemoveChip(value, target);
                    }}
                  />
                  <ChipSet
                    chips={countryChip}
                    handleRemoveChip={() => setCountry("")}
                  />
                  <ChipSet
                    chips={currentChip}
                    handleRemoveChip={(value) => {
                      const target = "dripping";
                      return handleRemoveChip(value, target);
                    }}
                  />
                  <ChipSet
                    chips={totalCountChip}
                    handleRemoveChip={() => setTotalCount("")}
                  />
                  <ChipSet
                    chips={validatedCountChip}
                    handleRemoveChip={() => setValidatedCount("")}
                  />
                  <ChipSet
                    chips={invalidCountCountChip}
                    handleRemoveChip={() => setInvalidCount("")}
                  />
                  <ChipSet
                    chips={duplicateEmailCountChip}
                    handleRemoveChip={() => setDuplicatedEmail("")}
                  />
                  <ChipSet
                    chips={duplicatePhoneCountChip}
                    handleRemoveChip={() => setDuplicatedPhone("")}
                  />
                </Stack>
              </>
            ) : null}
            <Box sx={{ position: "relative" }}>
              {enableBulkActions ? (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "neutral.800"
                        : "neutral.50",
                    display: enableBulkActions ? "flex" : "none",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    px: 2,
                    py: 0.5,
                    zIndex: 50,
                  }}
                >
                  <Checkbox
                    sx={{ p: 0 }}
                    checked={selectedPage}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        if (selectedSome) {
                          leadSelection.handleDeSelectPage(tableIds);
                        } else {
                          leadSelection.handleSelectPage(tableIds);
                        }
                      } else {
                        leadSelection.handleDeSelectPage(tableIds);
                      }
                    }}
                  />
                  {leadSelection.selectAll ? (
                    <Typography>
                      Selected all <strong>{count}</strong> items
                    </Typography>
                  ) : (
                    <Typography>
                      Selected <strong>{leadSelection.selected?.length}</strong>{" "}
                      of <strong>{count}</strong>
                    </Typography>
                  )}
                  {!leadSelection.selectAll && (
                    <Button onClick={() => leadSelection.handleSelectAll()}>
                      <Typography>Selected All</Typography>
                    </Button>
                  )}
                  <Button onClick={() => leadSelection.handleDeselectAll()}>
                    <Typography>Clear Selection</Typography>
                  </Button>
                </Stack>
              ) : null}
              <Scrollbar>
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow sx={{ whiteSpace: "nowrap" }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          sx={{ p: 0 }}
                          checked={false}
                          indeterminate={selectedSome}
                          onChange={(event) => {
                            if (event.target.checked) {
                              leadSelection.handleSelectPage(tableIds);
                            } else {
                              leadSelection.handleSelectPage(tableIds);
                            }
                          }}
                        />
                      </TableCell>
                      {tableColumn
                        ?.filter((item) => item.enabled)
                        ?.map((item) => (
                          <TableCell key={item.id}>
                            {item.headerRender ? (
                              item.headerRender()
                            ) : (
                              <Typography
                                sx={{ fontSize: 14, fontWeight: "600" }}
                              >
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
                        cellCount={16}
                      />
                    ) : (
                      injections?.map((injection) => {
                        const isSelected = leadSelection.selected.includes(
                          injection?.id
                        );
                        return (
                          <TableRow
                            key={injection?.id}
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                sx={{ p: 0 }}
                                checked={isSelected}
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    leadSelection.handleSelectOne?.(
                                      injection?.id
                                    );
                                  } else {
                                    leadSelection.handleDeselectOne?.(
                                      injection?.id
                                    );
                                  }
                                }}
                                value={isSelected}
                              />
                            </TableCell>
                            {tableColumn
                              ?.filter((item) => item.enabled)
                              ?.map((header, index) => (
                                <TableCell key={injection.id + index}>
                                  {header?.render
                                    ? header?.render(injection)
                                    : injection[header.id]}
                                </TableCell>
                              ))}
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
              {injections?.length === 0 && !isLoading && <TableNoData />}
              {isLoading && <Divider />}
              <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
                <PageNumberSelect 
                  currentPage={currentPage} 
                  totalPage={count? Math.ceil(count/perPage) : 0}
                  onUpdate={setCurrentPage}
                />
                <TablePagination
                  component="div"
                  labelRowsPerPage="Per page"
                  count={count}
                  onPageChange={(event, index) => setCurrentPage(index)}
                  onRowsPerPageChange={(event) => {
                    setPerPage(event?.target?.value);
                    localStorage.setItem("injectionsPerPage", event?.target?.value);
                  }}
                  page={currentPage}
                  rowsPerPage={perPage}
                  rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
                />
              </Stack>
            </Box>
          </Card>
        </Container>
      </Box>
      <TableModal
        open={tableModal}
        onClose={() => setTableModal(false)}
        tableColumn={tableColumn}
        defaultColumn={defaultColumn}
        updateRule={updateRule}
      />
      <LabelsDialog
        title="Edit Label"
        teams={teamList}
        open={labelModal}
        onClose={() => setLabelModal(false)}
        getLabelList={(val) => {
          setLabelsInfo(val);
        }}
      />
    </>
  );
};

export default Page;
