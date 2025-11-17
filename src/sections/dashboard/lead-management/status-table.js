import { useState, useMemo, useEffect, useCallback } from "react";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
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
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import isEqual from "lodash.isequal";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import OutlinedInput from "@mui/material/OutlinedInput";

import { Iconify } from "src/components/iconify";
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import FilterIcon from "src/icons/untitled-ui/duocolor/filter";
import { BulkActionModal } from "./status-create/bulk_action_modal";
import { ChipSet } from "src/components/customize/chipset";
import { CircularProgressWithLabel } from "src/components/loader-with-percentage";
import { CustomFilterBoolean } from "src/components/customize/custom-filter-boolean";
import { CustomFilterMultiRadio } from "src/components/customize/custom-filter-multi-radio";
import { CustomFilterNumber } from "src/components/customize/custom-filter-number";
import { CustomFilterText } from "src/components/customize/custom-filter-text";
import { DeleteModal } from "src/components/customize/delete-modal";
import { FilterDateTime } from "src/components/customize/filter-date-time";
import { FilterInput } from "src/components/customize/filter-input";
import { FilterModal } from "src/components/filter-settings-modal";
import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { FilterSelect } from "src/components/customize/filter-select";
import { LabelsDialog } from "src/components/labels-dialog";
import { MultiSelect } from "src/components/multi-select";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { TableModal } from "src/components/table-settings-modal";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from "src/components/table-skeleton";
import { affiliateApi } from "src/api/lead-management/affiliate";
import { authApi } from "src/api/auth";
import { brandsApi } from "src/api/lead-management/brand";
import { countries, languages } from "src/utils/constants";
import { customersApi } from "src/api/customers";
import { exportToExcel } from "src/utils/export-excel";
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { statusApi } from "src/api/lead-management/status";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";
import { useMounted } from "src/hooks/use-mounted";
import { useSelection } from "src/hooks/use-selection";
import { userApi } from "src/api/user";
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { useTimezone } from "src/hooks/use-timezone";

const useCustomersLabels = (handleCustomersGet) => {
  const isMounted = useMounted();
  const [selectedLabels, setSelectedLabels] = useState([]);

  const handleSelectedLabelsGet = useCallback(
    async (selectedIds, selectAll) => {
      const requestData = {};

      if (selectAll) {
        requestData["select_all"] = true;
      }

      if (selectedIds && selectedIds.length > 0) {
        requestData["lead_ids"] = selectedIds;
      }

      const { labels } = await customersApi.getCustomersLabels(requestData);

      if (isMounted()) {
        setSelectedLabels(
          labels
            ?.filter((label) => label.check_status)
            .map((label) => label?.label?.id + "")
        );
      }
    },
    [isMounted]
  );

  const handleSelectedLabelsChange = useCallback(
    async (labels, filters = {}, leadSelection = {}) => {
      setSelectedLabels(labels);

      const addedLabels = labels.filter((l) => !selectedLabels.includes(l));
      const removedLabels = selectedLabels.filter((l) => !labels.includes(l));

      const requestData = {
        ...filters,
      };

      if (leadSelection?.selectAll) {
        requestData["select_all"] = true;
        if (leadSelection?.perPage && leadSelection?.perPage > 0) {
          requestData["per_page"] = leadSelection.perPage;
        }
      } else {
        requestData["lead_ids"] = leadSelection?.selected;
      }

      if (addedLabels?.length) {
        requestData["add_label_ids"] = addedLabels;
      }

      if (removedLabels?.length) {
        requestData["remove_label_ids"] = removedLabels;
      }

      await statusApi.assignLeadLabels(requestData);
      handleCustomersGet();
      toast("Labels successfully updated!");
    },
    [selectedLabels]
  );

  return {
    handleSelectedLabelsGet,
    handleSelectedLabelsChange,
    selectedLabels,
    setSelectedLabels,
  };
};

export const StatusTable = ({ leadFileId }) => {
  const { user } = useAuth();
  const { toLocalTime } = useTimezone();

  const accountId = localStorage.getItem("account_id");
  const [exportLoading, setExportLoading] = useState(false);
  const [progress, setProgress] = useState(10);
  const [leads, setLeads] = useState([]);
  const [leadIds, setLeadIds] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDoneCustomFields, setIsDoneCustomFields] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [customerFields, setCustomerFields] = useState([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tableModal, setTableModal] = useState(false);
  const [openLabelModal, setOpenLabelModal] = useState(false);
  const [emailList, setEmailList] = useState([]);

  const leadSelection = useSelection(leadIds ?? [], (message) => {
    toast.error(message);
  });
  const tableIds = useMemo(() => leads?.map((item) => item?.id), [leads]) ?? [];

  const enableBulkActions = leadSelection.selected?.length > 0;
  const selectedPage = useMemo(
    () => tableIds?.every((item) => leadSelection.selected?.includes(item)),
    [tableIds, leadSelection.selected]
  );
  const selectedSome = useMemo(
    () =>
      tableIds?.some((item) => leadSelection.selected?.includes(item)) &&
      !tableIds?.every((item) => leadSelection.selected?.includes(item)),
    [tableIds, tableIds, leadSelection.selected]
  );

  const [perPage, setPerPage] = useState(leadFileId ? 5 : 10);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState({});
  const [text, setText] = useState("");
  const query = useDebounce(text);

  const [affiliateList, setAffiliateList] = useState([]);
  const [agentList, setAgentList] = useState();
  const [brandList, setBrandList] = useState([]);
  const [labelList, setLabelList] = useState();
  const [labelInfo, setLabelInfo] = useState([]);
  const [teamList, setTeamList] = useState();
  const [teamInfo, setTeamInfo] = useState();
  const [tableSetting, setTableSetting] = useState({});

  const [filterModal, setFilterModal] = useState(false);
  const [selectedFilterValue, setSelectedFilterValue] = useState("none");

  const [searchSetting, setSearchSetting] = useState([]);

  const [rule, setRule] = useState([]);

  useEffect(() => {
    const leadsPerPage = localStorage.getItem("leadsPerPage");

    if (leadsPerPage) {
      setPerPage(leadsPerPage);
    }
  }, []);

  const dateChipVal = (val, label) => {
    if (val) {
      const newChips = val
        ? [
            {
              displayValue: val ? toLocalTime(val) : "",
              value: val,
              label: label,
            },
          ]
        : [];
      return newChips;
    } else return [];
  };

  const getStatusInfo = async () => {
    setIsLoading(true);
    try {
      const params = {
        per_page: perPage,
        page: currentPage + 1,
        q: query?.length > 0 ? query : null,
        lead_file_id: leadFileId,
        ...filter,
      };

      const customFiltersData = customerFields
        ?.filter((filter) => filter?.filter)
        ?.map((filter) => filter?.filter);
      params["custom_field"] = customFiltersData;

      const res = await statusApi.getStatuses(params);
      if (currentPage === 0) {
        setLeadIds([...new Set([...res?.leads?.map((item) => item?.id)])]);
      } else {
        setLeadIds([
          ...new Set([...leadIds, ...res?.leads?.map((item) => item?.id)]),
        ]);
      }
      setLeads(res?.leads);
      setCount(res?.total_count);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const getTableSetting = async () => {
    try {
      const localTableSetting = localStorage.getItem("tableSetting");
      const { account } = await authApi.me({ accountId });
      if (account?.column_setting) {
        setTableSetting(JSON.parse(account?.column_setting));
        setRule(JSON.parse(account?.column_setting)?.leadTable ?? []);
      } else if (localTableSetting) {
        const { account: _account } = await userApi.updateUser(accountId, {
          column_setting: localTableSetting,
        });
        setTableSetting(JSON.parse(_account?.column_setting));
        setRule(JSON.parse(_account?.column_setting)?.leadTable ?? []);
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const {
    selectedLabels,
    handleSelectedLabelsChange,
    handleSelectedLabelsGet,
    setSelectedLabels,
  } = useCustomersLabels(getStatusInfo);

  useEffect(() => {
    const fetchLabels = async () => {
      if (leadSelection.selectAll) {
        await handleSelectedLabelsGet(
          [],
          leadSelection.selectAll,
        );
      } else {
        setSelectedLabels([]);
      }
    };

    fetchLabels();
  }, [
    leadSelection.selectAll,
    leadSelection.deselected,
    handleSelectedLabelsGet,
  ]);

  useEffect(() => {
    const fetchLabels = async () => {
      if (!leadSelection.selectAll && leadSelection.selected.length > 0) {
        await handleSelectedLabelsGet(
          leadSelection.selected,
          leadSelection.selectAll,
        );
      }
    };

    fetchLabels();
  }, [leadSelection.selected, handleSelectedLabelsGet]);

  const handleGetEmails = async (q = "") => {
    try {
      const data = {
        per_page: 100,
      };
      if (q) data["email"] = q;
      const res1 = await statusApi.getStatuses(data);
      setEmailList(
        res1?.leads?.map((item) => ({ value: item?.email, label: item?.email }))
      );
    } catch (error) {
      console.error("error: ", error);
    }
  };

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
      setTeamInfo(res);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getAgent = async () => {
    try {
      const res = await settingsApi.getMembers();
      const agentList = res?.accounts
        ?.filter((account) => !account?.admin_hide)
        ?.map((item) => ({
          label: `${item?.first_name ? item?.first_name : item?.email} ${
            item?.last_name
          }`,
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
      setLabelList(labelList);
      setLabelInfo(res?.labels);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const handleBulkLeadsDelete = async () => {
    try {
      const request = {};
      const selectAll = leadSelection?.selectAll;
      const selectedLeads = leadSelection?.selected;

      if (!selectAll && selectedLeads?.length > 0) {
        request.lead_ids = selectedLeads;
      }
      if (selectAll) {
        request.select_all = selectAll;
      }
      await statusApi.deleteLeadsWithBulk(request);
      setTimeout(() => getStatusInfo(), 1000);
      leadSelection.handleDeselectAll();
      setDeleteModalOpen(false);
      toast("Leads successfully deleted!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
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

  const languageList = useMemo(() => {
    if (languages) {
      const languageArray = languages?.map((item) => ({
        label: item?.name?.split(" - ")[0],
        value: item?.code,
      }));
      return languageArray;
    }
  }, [languages]);

  const statusList = useMemo(
    () => [
      { label: "Verified", value: "true" },
      { label: "Not Verified", value: "false" },
    ],
    []
  );

  const statusChip = useMemo(() => {
    const newChips =
      filter?.verified !== undefined && filter?.verified !== "_empty"
        ? [
            {
              displayValue: filter?.verified === "true" ? "Yes" : "No",
              value: filter?.verified,
              label: "Verified",
            },
          ]
        : [];
    return newChips;
  }, [filter?.verified]);

  const phoneChip = useMemo(() => {
    const newChips = filter?.phone
      ? [{ displayValue: filter?.phone, value: filter?.phone, label: "Phone" }]
      : [];
    return newChips;
  }, [filter?.phone]);

  const customFilterChip = useMemo(
    () =>
      customerFields
        ?.filter((value) => value?.filter)
        ?.map((value) => {
          const data = {
            label: value?.label + " ",
          };
          if (
            value?.filter?.field_type === "multi_choice" ||
            value?.filter?.field_type === "multi_choice_radio"
          ) {
            data.value = value?.filter?.query?.join(", ");
            data.displayValue = value?.filter?.query
              ?.join(", ")
              ?.replace("_empty", "Empty");
          }

          if (value?.filter?.field_type === "text") {
            data.value = value?.filter?.query;
            data.displayValue =
              value?.filter?.query === "_empty"
                ? "Empty"
                : value?.filter?.query;
          }

          if (value?.filter?.field_type === "number") {
            data.displayValue = `${value?.filter?.query?.gt}-${value?.filter?.query?.lt}`;
            data.value = `${value?.filter?.query?.gt}-${value?.filter?.query?.lt}`;
          }

          if (value?.filter?.field_type === "boolean") {
            data.value = value?.filter?.query;
            data.displayValue = JSON.stringify(value?.filter?.query);
          }

          return data;
        })
        ?.filter((item) => !!item.value),
    [customerFields]
  );

  const nonCustomFilterChip = useMemo(
    () =>
      customerFields
        ?.filter((value) => value?.filter)
        ?.map(function (value) {
          const data = {
            label: "Exclude" + " " + value?.label + " ",
          };
          if (
            value?.filter?.field_type === "multi_choice" ||
            value?.filter?.field_type === "multi_choice_radio"
          ) {
            data.value = value?.filter?.non_query?.join(", ");
            data.displayValue = value?.filter?.non_query
              ?.join(", ")
              ?.replace("_empty", "Empty");
          }
          return data;
        })
        ?.filter((item) => !!item.value),
    [customerFields]
  );

  const countryChip = useMemo(() => {
    const newChips =
      filter?.countries && filter?.countries?.length > 0
        ? filter.countries.map(country => ({
            displayValue: countries?.find(
              (item) => item?.code === country
            )?.label,
            value: country,
            label: "Countries",
          }))
        : [];
    return newChips;
  }, [filter?.countries]);

  const nonCountryChip = useMemo(() => {
    const newChips =
      filter?.non_countries && filter?.non_countries?.length > 0
        ? filter.non_countries.map(country => ({
            displayValue: countries?.find(
              (item) => item?.code === country
            )?.label,
            value: country,
            label: "Exclude Countries",
          }))
        : [];
    return newChips;
  }, [filter?.non_countries]);

  const languageChip = useMemo(() => {
    const newChips =
      filter?.language && filter?.language !== "_empty"
        ? [
            {
              displayValue: languages
                ?.find((item) => item?.code === filter?.language)
                ?.name?.split(" - ")[0],
              value: filter?.language,
              label: "Language",
            },
          ]
        : [];
    return newChips;
  }, [filter?.language]);

  const nonLanguageChip = useMemo(() => {
    const newChips =
      filter?.non_language && filter?.non_language !== "_empty"
        ? [
            {
              displayValue: languages
                ?.find((item) => item?.code === filter?.non_language)
                ?.name?.split(" - ")[0],
              value: filter?.non_language,
              label: "Exclude Language",
            },
          ]
        : [];
    return newChips;
  }, [filter?.non_language]);

  const depositChip = useMemo(() => {
    const newChips = filter?.deposit
      ? [
          {
            displayValue: filter?.deposit,
            value: filter?.deposit,
            label: "Min Deposit",
          },
        ]
      : [];
    return newChips;
  }, [filter?.deposit]);

  const maxDepositChip = useMemo(() => {
    const newChips = filter?.lte_deposit
      ? [
          {
            displayValue: filter?.lte_deposit,
            value: filter?.lte_deposit,
            label: "Max Deposit",
          },
        ]
      : [];
    return newChips;
  }, [filter?.lte_deposit]);

  const ftdAmountChip = useMemo(() => {
    const newChips = filter?.ftd_amount
      ? [
          {
            displayValue: filter?.ftd_amount,
            value: filter?.ftd_amount,
            label: "Min FTD Amount",
          },
        ]
      : [];
    return newChips;
  }, [filter?.ftd_amount]);

  const maxFtdAmountChip = useMemo(() => {
    const newChips = filter?.lte_ftd_amount
      ? [
          {
            displayValue: filter?.lte_ftd_amount,
            value: filter?.lte_ftd_amount,
            label: "Max FTD Amount",
          },
        ]
      : [];
    return newChips;
  }, [filter?.lte_ftd_amount]);

  const ftdDateChip = useMemo(() => {
    const newChips = filter?.ftd_date
      ? dateChipVal(filter?.ftd_date, "ftd_date")
      : [];
    return newChips;
  }, [filter?.ftd_date]);

  const sourceBrandChip = useMemo(() => {
    const newChips = filter?.source_brand
      ? [
          {
            displayValue: filter?.source_brand,
            value: filter?.source_brand,
            label: "Source Brand",
          },
        ]
      : [];
    return newChips;
  }, [filter?.source_brand]);

  const registrationDateChip = useMemo(() => {
    const newChips = filter?.registration_date
      ? dateChipVal(filter?.registration_date, "registration_date")
      : [];
    return newChips;
  }, [filter?.registration_date]);

  const clientIdChip = useMemo(
    () =>
      filter?.client_ids?.map((value) => ({
        displayValue: value,
        value: value,
        label: "Client Id",
      })),
    [filter?.client_ids]
  );

  const idChip = useMemo(
    () =>
      filter?.ids?.map((value) => ({
        displayValue: value,
        value: value,
        label: "Lead Id",
      })),
    [filter?.ids]
  );

  const brandChip = useMemo(
    () =>
      filter?.brand_ids?.map((value) => ({
        displayValue: brandList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Brand",
      })),
    [filter?.brand_ids, brandList]
  );

  const nonBrandChip = useMemo(
    () =>
      filter?.non_brand_ids?.map((value) => ({
        displayValue: brandList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Brand",
      })),
    [filter?.non_brand_ids, brandList]
  );

  const brandStatusChip = useMemo(() => {
    const newChips =
      filter?.brand_status && filter?.brand_status !== "_empty"
        ? [
            {
              displayValue: filter?.brand_status,
              value: filter?.brand_status,
              label: "Brand Status",
            },
          ]
        : [];
    return newChips;
  }, [filter?.brand_status]);

  const nonBrandStatusChip = useMemo(() => {
    const newChips =
      filter?.non_brand_status && filter?.non_brand_status !== "_empty"
        ? [
            {
              displayValue: filter?.non_brand_status,
              value: filter?.non_brand_status,
              label: "Exclude Brand Status",
            },
          ]
        : [];
    return newChips;
  }, [filter?.non_brand_status]);

  const affiliateChip = useMemo(
    () =>
      filter?.account_ids?.map((value) => ({
        displayValue: affiliateList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Affiliate",
      })),
    [filter?.account_ids, affiliateList]
  );

  const nonAffiliateChip = useMemo(
    () =>
      filter?.non_account_ids?.map((value) => ({
        displayValue: affiliateList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Affiliate",
      })),
    [filter?.non_account_ids, affiliateList]
  );

  const emailChip = useMemo(() => {
    const newChips = filter?.email
      ? [
          {
            displayValue: emailList?.find(
              (item) => item?.value === filter?.email
            )?.label,
            value: filter?.email,
            label: "Email",
          },
        ]
      : [];
    return newChips;
  }, [filter?.email]);

  const teamChip = useMemo(
    () =>
      filter?.team_ids?.map((value) => ({
        displayValue: teamList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Team",
      })),
    [filter?.team_ids, teamList]
  );

  const nonTeamChip = useMemo(
    () =>
      filter?.non_team_ids?.map((value) => ({
        displayValue: teamList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Team",
      })),
    [filter?.non_team_ids, teamList]
  );

  const agentChip = useMemo(
    () =>
      filter?.agent_ids?.map((value) => ({
        displayValue: agentList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Agent",
      })),
    [filter?.agent_ids, agentList]
  );

  const nonAgentChip = useMemo(
    () =>
      filter?.non_agent_ids?.map((value) => ({
        displayValue: agentList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Agent",
      })),
    [filter?.non_agent_ids, agentList]
  );

  const labelChip = useMemo(
    () =>
      filter?.label_ids?.map((value) => ({
        displayValue: labelList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Label",
      })),
    [filter?.label_ids, labelList]
  );

  const nonLabelChip = useMemo(
    () =>
      filter?.non_label_ids?.map((value) => ({
        displayValue: labelList?.find(
          (item) => value === item?.value?.toString()
        )?.label,
        value: value,
        label: "Exclude Label",
      })),
    [filter?.non_label_ids, labelList]
  );

  const duplicateChip = useMemo(() => {
    const newChips = filter?.duplicate
      ? [
          {
            displayValue: filter?.duplicate === "true" ? "Yes" : "No",
            value: filter?.duplicate,
            label: "Duplicate",
          },
        ]
      : [];
    return newChips;
  }, [filter?.duplicate]);

  const handleRemoveChip = (value, target) => {
    if (target === "label") {
      const newArrays = [...filter?.label_ids].filter((item) => item !== value);
      setFilter((prev) => ({
        ...prev,
        label_ids: newArrays,
      }));
    }
    if (target === "non_label") {
      const newArrays = [...filter?.non_label_ids].filter(
        (item) => item !== value
      );
      setFilter((prev) => ({
        ...prev,
        non_label_ids: newArrays,
      }));
    }
    if (target === "agent") {
      const newArrays = [...filter?.agent_ids].filter((item) => item !== value);
      setFilter((prev) => ({
        ...prev,
        agent_ids: newArrays,
      }));
    }
    if (target === "non_agent") {
      const newArrays = [...filter?.non_agent_ids].filter(
        (item) => item !== value
      );
      setFilter((prev) => ({
        ...prev,
        non_agent_ids: newArrays,
      }));
    }
    if (target === "team") {
      const newArrays = [...filter?.team_ids].filter((item) => item !== value);
      setFilter((prev) => ({
        ...prev,
        team_ids: newArrays,
      }));
    }
    if (target === "non_team") {
      const newArrays = [...filter?.non_team_ids].filter(
        (item) => item !== value
      );
      setFilter((prev) => ({
        ...prev,
        non_team_ids: newArrays,
      }));
    }
    if (target === "affiliate") {
      const newArrays = [...filter?.account_ids].filter(
        (item) => item !== value
      );
      setFilter((prev) => ({
        ...prev,
        account_ids: newArrays,
      }));
    }
    if (target === "non_affiliate") {
      const newArrays = [...filter?.non_account_ids].filter(
        (item) => item !== value
      );
      setFilter((prev) => ({
        ...prev,
        non_account_ids: newArrays,
      }));
    }
    if (target === "client_id") {
      const newArrays = [...filter?.client_ids].filter(
        (item) => item !== value
      );
      setFilter((prev) => ({
        ...prev,
        client_ids: newArrays,
      }));
    }
    if (target === "id") {
      const newArrays = [...filter?.ids].filter((item) => item !== value);
      setFilter((prev) => ({
        ...prev,
        ids: newArrays,
      }));
    }
    if (target === "brand") {
      const newArrays = [...filter?.brand_ids].filter((item) => item !== value);
      setFilter((prev) => ({
        ...prev,
        brand_ids: newArrays,
      }));
    }
    if (target === "non_brand") {
      const newArrays = [...filter?.non_brand_ids].filter(
        (item) => item !== value
      );
      setFilter((prev) => ({
        ...prev,
        non_brand_ids: newArrays,
      }));
    }
    if (target === "countries") {
      const newArrays = [...filter?.countries].filter((item) => item !== value);
      setFilter((prev) => ({
        ...prev,
        countries: newArrays,
      }));
    }
    if (target === "non_countries") {
      const newArrays = [...filter?.non_countries].filter((item) => item !== value);
      setFilter((prev) => ({
        ...prev,
        non_countries: newArrays,
      }));
    }
    if (target === "custom") {
      const newCustomFields = customerFields?.map((field) => {
        if (
          field?.filter &&
          field?.filter?.field_type === "number" &&
          `${field?.filter?.query?.gt}-${field?.filter?.query?.lt}` === value
        ) {
          return {
            ...field,
            filter: null,
          };
        } else if (field?.filter && field?.filter?.query === value) {
          return {
            ...field,
            filter: null,
          };
        } else if (
          field?.filter &&
          (field?.filter?.field_type === "multi_choice" ||
            field?.filter?.field_type === "multi_choice_radio") &&
          field?.filter?.query?.join(", ") === value
        ) {
          const data = {
            ...field,
            id: field?.filter?.field_id,
            field_type: field?.filter?.field_type,
            friendly_name: field?.label,
            setting: field?.setting,
            filter: {
              ...field?.filter,
              query: [],
            },
          };
          return {
            ...field,
            field_type: field?.filter?.field_type,
            filter: {
              ...field?.filter,
              query: [],
            },
            headerRender: () => {
              return (
                <CustomFilterMultiRadio
                  label={field?.label}
                  setting={field?.setting}
                  field={data}
                  onSetField={(val) => {
                    setCustomerFields(val);
                  }}
                />
              );
            },
          };
        } else {
          return field;
        }
      });
      setCurrentPage(0);
      setCustomerFields(newCustomFields);
    }

    if (target === "non_custom") {
      const newCustomFields = customerFields?.map((field) => {
        if (
          field?.filter &&
          (field?.filter?.field_type === "multi_choice" ||
            field?.filter?.field_type === "multi_choice_radio") &&
          field?.filter?.non_query?.join(", ") === value
        ) {
          const data = {
            ...field,
            id: field?.filter?.field_id,
            field_type: field?.filter?.field_type,
            friendly_name: field?.label,
            setting: field?.setting,
            filter: {
              ...field?.filter,
              non_query: [],
            },
          };
          return {
            ...field,
            field_type: field?.filter?.field_type,
            filter: {
              ...field?.filter,
              non_query: [],
            },
            headerRender: () => {
              return (
                <CustomFilterMultiRadio
                  label={field?.label}
                  setting={field?.setting}
                  field={data}
                  onSetField={(val) => {
                    setCustomerFields(val);
                  }}
                />
              );
            },
          };
        } else {
          return field;
        }
      });
      setCurrentPage(0);
      setCustomerFields(newCustomFields);
    }
  };

  useEffect(() => {
    getTableSetting();
    getAffiliate();
    getTeam();
    getBrands();
    getLabels();
    getAgent();
    handleGetEmails();
  }, []);

  useEffect(() => {
    if (!tableSetting?.leadTable && customerFields?.length) {
      const localTableSetting = localStorage.getItem("tableSetting");

      let baseTableSetting = {};

      if (localTableSetting) {
        const localSetting = JSON.parse(localTableSetting);
        baseTableSetting = {
          ...localSetting,
          ...tableSetting,
        };
      }

      const updateSetting = {
        ...baseTableSetting,
        leadTable: [...DEFAULT_COLUMN, ...customerFields],
      };
      setRule(updateSetting?.leadTable);
      localStorage.setItem("tableSetting", JSON.stringify(updateSetting));
    }
  }, [customerFields, tableSetting, user]);

  useEffect(() => {
    if (isDoneCustomFields) {
      getStatusInfo();
    }
  }, [query, currentPage, perPage, filter, customerFields, isDoneCustomFields]);

  const chipSetList = [
    {
      chipValue: statusChip,
      removeChip: () => {
        setFilter((prev) => ({
          ...prev,
          verified: undefined,
        }));
        setCurrentPage(0);
      },
    },
    {
      chipValue: phoneChip,
      removeChip: () => {
        setFilter((prev) => ({
          ...prev,
          phone: undefined,
        }));
        setCurrentPage(0);
      },
    },
    {
      chipValue: countryChip,
      removeChip: (value) => {
        handleRemoveChip(value, "countries");
        setCurrentPage(0);
      },
    },
    {
      chipValue: nonCountryChip,
      removeChip: (value) => {
        handleRemoveChip(value, "non_countries");
        setCurrentPage(0);
      },
    },
    {
      chipValue: languageChip,
      removeChip: () => {
        setFilter((prev) => ({
          ...prev,
          language: undefined,
        }));
        setCurrentPage(0);
      },
    },
    {
      chipValue: nonLanguageChip,
      removeChip: () => {
        setFilter((prev) => ({
          ...prev,
          non_language: undefined,
        }));
        setCurrentPage(0);
      },
    },
    {
      chipValue: depositChip,
      removeChip: () => {
        setFilter((prev) => ({
          ...prev,
          deposit: undefined,
        }));
        setCurrentPage(0);
      },
    },
    {
      chipValue: maxDepositChip,
      removeChip: () => {
        setFilter((prev) => ({
          ...prev,
          lte_deposit: undefined,
        }));
        setCurrentPage(0);
      },
    },
    {
      chipValue: sourceBrandChip,
      removeChip: () => {
        setFilter((prev) => ({
          ...prev,
          source_brand: undefined,
        }));
        setCurrentPage(0);
      },
    },
    {
      chipValue: ftdAmountChip,
      removeChip: () => {
        setFilter((prev) => ({
          ...prev,
          ftd_amount: undefined,
        }));
        setCurrentPage(0);
      },
    },
    {
      chipValue: maxFtdAmountChip,
      removeChip: () => {
        setFilter((prev) => ({
          ...prev,
          lte_ftd_amount: undefined,
        }));
        setCurrentPage(0);
      },
    },
    {
      chipValue: ftdDateChip,
      removeChip: () => {
        setFilter((prev) => ({
          ...prev,
          ftd_date: undefined,
        }));
        setCurrentPage(0);
      },
    },
    {
      chipValue: registrationDateChip,
      removeChip: () => {
        setFilter((prev) => ({
          ...prev,
          registration_date: undefined,
        }));
        setCurrentPage(0);
      },
    },
    {
      chipValue: brandChip,
      removeChip: (value) => {
        handleRemoveChip(value, "brand");
        setCurrentPage(0);
      },
    },
    {
      chipValue: clientIdChip,
      removeChip: (value) => {
        handleRemoveChip(value, "client_id");
        setCurrentPage(0);
      },
    },
    {
      chipValue: idChip,
      removeChip: (value) => {
        handleRemoveChip(value, "id");
        setCurrentPage(0);
      },
    },
    {
      chipValue: nonBrandChip,
      removeChip: (value) => {
        handleRemoveChip(value, "non_brand");
        setCurrentPage(0);
      },
    },
    {
      chipValue: brandStatusChip,
      removeChip: () => {
        setFilter((prev) => ({
          ...prev,
          brand_status: undefined,
        }));
        setCurrentPage(0);
      },
    },
    {
      chipValue: nonBrandStatusChip,
      removeChip: () => {
        setFilter((prev) => ({
          ...prev,
          non_brand_status: undefined,
        }));
        setCurrentPage(0);
      },
    },
    {
      chipValue: affiliateChip,
      removeChip: (value) => {
        handleRemoveChip(value, "affiliate");
        setCurrentPage(0);
      },
    },
    {
      chipValue: nonAffiliateChip,
      removeChip: (value) => {
        handleRemoveChip(value, "non_affiliate");
        setCurrentPage(0);
      },
    },
    {
      chipValue: emailChip,
      removeChip: () => {
        setFilter((prev) => ({
          ...prev,
          email: undefined,
        }));
        setCurrentPage(0);
      },
    },
    {
      chipValue: teamChip,
      removeChip: (value) => {
        handleRemoveChip(value, "team");
        setCurrentPage(0);
      },
    },
    {
      chipValue: nonTeamChip,
      removeChip: (value) => {
        handleRemoveChip(value, "non_team");
        setCurrentPage(0);
      },
    },
    {
      chipValue: agentChip,
      removeChip: (value) => {
        handleRemoveChip(value, "agent");
        setCurrentPage(0);
      },
    },
    {
      chipValue: nonAgentChip,
      removeChip: (value) => {
        handleRemoveChip(value, "non_agent");
        setCurrentPage(0);
      },
    },
    {
      chipValue: labelChip,
      removeChip: (value) => {
        handleRemoveChip(value, "label");
        setCurrentPage(0);
      },
    },
    {
      chipValue: nonLabelChip,
      removeChip: (value) => {
        handleRemoveChip(value, "non_label");
        setCurrentPage(0);
      },
    },
    {
      chipValue: duplicateChip,
      removeChip: () => {
        setFilter((prev) => ({
          ...prev,
          duplicate: undefined,
        }));
        setCurrentPage(0);
      },
    },
    {
      chipValue: customFilterChip,
      removeChip: (value) => {
        handleRemoveChip(value, "custom");
        setCurrentPage(0);
      },
    },
    {
      chipValue: nonCustomFilterChip,
      removeChip: (value) => {
        handleRemoveChip(value, "non_custom");
        setCurrentPage(0);
      },
    },
  ];

  const DEFAULT_COLUMN = [
    {
      id: "id",
      label: "Id",
      enabled: true,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="ID"
          placeholder="Status Id..."
          filter={""}
          setFilter={(val) => {
            setFilter((prev) => ({
              ...prev,
              ids: filter?.ids ? [...filter?.ids, val] : [val],
            }));
            setCurrentPage(0);
          }}
        />
      ),
      render: (row) => {
        if (user?.affiliate || !user?.acc?.acc_e_lm_leads) {
          return row?.id;
        } else {
          return (
            <Link
              color="text.primary"
              component={RouterLink}
              href={paths.dashboard.lead.status.detail.replace(
                ":leadId",
                row?.id
              )}
              sx={{
                alignItems: "center",
                display: "inline-flex",
              }}
              underline="hover"
            >
              {row?.id}
            </Link>
          );
        }
      },
    },
    {
      id: "client_id",
      label: "Client Id",
      enabled: true,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="CLIENT"
          placeholder="Client Id..."
          filter={""}
          setFilter={(val) => {
            setFilter((prev) => ({
              ...prev,
              client_ids: filter?.client_ids
                ? [...filter?.client_ids, val]
                : [val],
            }));
            setCurrentPage(0);
          }}
        />
      ),
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          {user?.affiliate ? (
            <Typography>{row?.client_name === "No Name" ? row?.first_name + " " + row?.last_name : row?.client_name ?? ""}</Typography>
          ) : (
            <Link
              color="text.primary"
              component={RouterLink}
              href={`${paths.dashboard.customers.index}/${row?.client_id}`}
              sx={{
                alignItems: "center",
                display: "inline-flex",
              }}
              underline="hover"
              gap={1}
            >
              <Typography>{row?.client_name === "No Name" ? row?.first_name + " " + row?.last_name : row?.client_name ?? ""}</Typography>
            </Link>
          )}
        </Stack>
      ),
    },
    {
      id: "status",
      label: "Status",
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          {row?.status_error && (
            <Tooltip placement="top-start" title={row?.status_error}>
              <WarningAmberIcon fontSize="small" color="error" />
            </Tooltip>
          )}
          <SeverityPill
            color={
              row?.status === "On hold"
                ? "warning"
                : row?.status === "Sent"
                ? "success"
                : row?.status === "Error"
                ? "error"
                : "info"
            }
          >
            {row?.status ?? ""}
          </SeverityPill>
        </Stack>
      ),
    },
    {
      id: "duplicate",
      label: "Duplicate",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          label="DUPLICATE"
          placeholder="Duplicate..."
          options={[
            {
              label: "Yes",
              value: "true",
            },
            {
              label: "No",
              value: "false",
            },
          ]}
          setValue={(val) => {
            setFilter((prev) => ({
              ...prev,
              duplicate: val,
            }));
            setCurrentPage(0);
          }}
          value={filter?.duplicate}
        />
      ),
      render: (row) =>
        row?.duplicate ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                backgroundColor: (theme) => theme.palette.warning.main,
                maxWidth: 1,
                height: 1,
                padding: 1,
                borderRadius: 20,
              }}
            ></Box>
            <Typography>duplicate</Typography>
          </Stack>
        ) : null,
    },
    {
      id: "verified",
      label: "Verified",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          label="VERIFIED"
          placeholder="Verified..."
          options={statusList ?? []}
          setValue={(val) => {
            setFilter((prev) => ({
              ...prev,
              verified: val,
            }));
            setCurrentPage(0);
          }}
          value={filter?.verified}
        />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          {row?.verified || row?.verified === null ? (
            <CheckCircleOutlineIcon fontSize="small" color="success" />
          ) : (
            <Tooltip placement="top-start" title={row?.verified_error}>
              <WarningAmberIcon fontSize="small" color="error" />
            </Tooltip>
          )}
          {row?.verified || row?.verified === null
            ? "Verified"
            : "Not Verified"}
        </Stack>
      ),
    },
    {
      id: "first_name",
      label: "First Name",
      enabled: true,
    },
    {
      id: "last_name",
      label: "Last Name",
      enabled: true,
    },
    {
      id: "email",
      label: "Email",
      enabled: true,
      headerRender: () =>
        user?.acc?.acc_v_client_email && (
          <FilterInput
            labelFont={14}
            label="EMAIL"
            placeholder="Email..."
            filter={""}
            setFilter={(val) => {
              setFilter((prev) => ({
                ...prev,
                email: val,
              }));
              setCurrentPage(0);
            }}
          />
        ),
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          {row?.email_validated ? null : (
            <Tooltip placement="top-start" title={row?.email_error}>
              <WarningAmberIcon fontSize="small" color="error" />
            </Tooltip>
          )}
          <Typography variant="subtitle2">{row?.email}</Typography>
        </Stack>
      ),
    },
    {
      id: "phone",
      label: "Phone",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="PHONE"
          placeholder="Phone number..."
          filter={filter?.phone}
          setFilter={(val) => {
            setFilter((prev) => ({
              ...prev,
              phone: val,
            }));
            setCurrentPage(0);
          }}
        />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          {row?.phone_validated ? null : (
            <Tooltip placement="top-start" title={row?.phone_error}>
              <WarningAmberIcon fontSize="small" color="error" />
            </Tooltip>
          )}
          <Typography>{row?.phone}</Typography>
        </Stack>
      ),
    },
    {
      id: "country",
      label: "Country",
      enabled: true,
      headerRender: () => (
        <FilterMultiSelect
          label="COUNTRY"
          withSearch
          placeholder="Country..."
          options={countryList ?? []}
          onChange={(val) => {
            setFilter((prev) => ({
              ...prev,
              countries: val,
            }));
            setCurrentPage(0);
          }}
          value={filter?.countries}
          isExclude
          onChangeNon={(val) => {
            setFilter((prev) => ({
              ...prev,
              non_countries: val,
            }));
            setCurrentPage(0);
          }}
          valueNon={filter?.non_countries}
        />
      ),
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Iconify
            icon={`circle-flags:${row?.country?.toLowerCase()}`}
            width={24}
          />
          <Typography variant="subtitle2">
            {
              countries?.find((country) => country?.code === row?.country)
                ?.label
            }
          </Typography>
        </Stack>
      ),
    },
    {
      id: "language",
      label: "Language",
      enabled: true,
      headerRender: () => (
        <FilterSelect
          withSearch
          label="LANGUAGE"
          placeholder="Language..."
          options={languageList ?? []}
          setValue={(val) => {
            setFilter((prev) => ({
              ...prev,
              language: val,
            }));
            setCurrentPage(0);
          }}
          value={filter?.language}
          isExclude
          setNonValue={(val) => {
            setFilter((prev) => ({
              ...prev,
              non_language: val,
            }));
            setCurrentPage(0);
          }}
          nonValue={filter?.non_language}
        />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          {row?.language_validated ? null : (
            <Tooltip placement="top-start" title={row?.language_error}>
              <WarningAmberIcon fontSize="small" color="error" />
            </Tooltip>
          )}
          <Typography>
            {
              languages
                ?.find((lang) => lang?.code === row?.language)
                ?.name?.split(" - ")[0]
            }
          </Typography>
        </Stack>
      ),
    },
    {
      id: "campaign",
      label: "Campaign",
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          {row?.campaign_validated ? null : (
            <Tooltip placement="top-start" title={row?.campaign_error}>
              <WarningAmberIcon fontSize="small" color="error" />
            </Tooltip>
          )}
          <Typography variant="subtitle2">
            {row?.campaign && row?.campaign !== "undefined"
              ? row?.campaign
              : null}
          </Typography>
        </Stack>
      ),
    },
    {
      id: "description",
      label: "Description",
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          {row?.description_validated ? null : (
            <Tooltip placement="top-start" title={row?.description_error}>
              <WarningAmberIcon fontSize="small" color="error" />
            </Tooltip>
          )}
          <Typography variant="subtitle2">{row?.description}</Typography>
        </Stack>
      ),
    },
    {
      id: "deposit",
      label: "Deposit",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="DEPOSIT"
          placeholder="Min deposit..."
          filter={filter?.deposit}
          setFilter={(val) => {
            setFilter((prev) => ({
              ...prev,
              deposit: val,
            }));
            setCurrentPage(0);
          }}
          isRange
          placeholder2="Max deposit..."
          filter2={filter?.lte_deposit}
          setFilter2={(val) => {
            setFilter((prev) => ({
              ...prev,
              lte_deposit: val,
            }));
            setCurrentPage(0);
          }}
        />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          {row?.deposit_validated ? null : (
            <Tooltip placement="top-start" title={row?.deposit_error}>
              <WarningAmberIcon fontSize="small" color="error" />
            </Tooltip>
          )}
          <Typography>{row?.deposit}</Typography>
        </Stack>
      ),
    },
    {
      id: "ftd_amount",
      label: "FTD Amount",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="FTD AMOUNT"
          type="number"
          placeholder="Min FTD Amount..."
          filter={filter?.ftd_amount}
          setFilter={(val) => {
            setFilter((prev) => ({
              ...prev,
              ftd_amount: val,
            }));
            setCurrentPage(0);
          }}
          isRange
          placeholder2="Max FTD Amount..."
          filter2={filter?.lte_ftd_amount}
          setFilter2={(val) => {
            setFilter((prev) => ({
              ...prev,
              lte_ftd_amount: val,
            }));
            setCurrentPage(0);
          }}
        />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          {row?.ftd_amount_validated ? null : (
            <Tooltip placement="top-start" title={row?.ftd_amount_error}>
              <WarningAmberIcon fontSize="small" color="error" />
            </Tooltip>
          )}
          <Typography>{row?.ftd_amount}</Typography>
        </Stack>
      ),
    },
    {
      id: "ftd_date",
      label: "FTD Date",
      enabled: true,
      headerRender: () => (
        <FilterDateTime
          label="FTD DATE"
          placeholder="FTD Date..."
          filter={filter?.ftd_date}
          setFilter={(val) => {
            setFilter((prev) => ({
              ...prev,
              ftd_date: val,
            }));
          }}
        />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          {row?.ftd_date_validated ? null : (
            <Tooltip placement="top-start" title={row?.ftd_date_error}>
              <WarningAmberIcon fontSize="small" color="error" />
            </Tooltip>
          )}
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            {row?.ftd_date ? toLocalTime(row?.ftd_date) : ""}
          </Typography>
        </Stack>
      ),
    },
    {
      id: "source_brand",
      label: "Source Brand",
      enabled: true,
      headerRender: () => (
        <FilterInput
          label="SOURCE BRAND"
          placeholder="Source brand..."
          filter={filter?.source_brand}
          setFilter={(val) => {
            setFilter((prev) => ({
              ...prev,
              source_brand: val,
            }));
            setCurrentPage(0);
          }}
        />
      ),
    },
    {
      id: "registration_date",
      label: "Registration Date",
      enabled: true,
      headerRender: () => (
        <FilterDateTime
          label="REGISTRATION DATE"
          placeholder="Registration Date..."
          filter={filter?.registration_date}
          setFilter={(val) => {
            setFilter((prev) => ({
              ...prev,
              registration_date: val,
            }));
          }}
        />
      ),
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          {row?.registration_date_validated ? null : (
            <Tooltip placement="top-start" title={row?.registration_date_error}>
              <WarningAmberIcon fontSize="small" color="error" />
            </Tooltip>
          )}
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            {row?.registration_date ? toLocalTime(row?.registration_date) : ""}
          </Typography>
        </Stack>
      ),
    },
    {
      id: "note",
      label: "Note",
      enabled: true,
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
            setFilter((prev) => ({
              ...prev,
              brand_ids: val,
            }));
            setCurrentPage(0);
          }}
          value={filter?.brand_ids}
          isExclude
          onChangeNon={(val) => {
            setFilter((prev) => ({
              ...prev,
              non_brand_ids: val,
            }));
            setCurrentPage(0);
          }}
          valueNon={filter?.non_brand_ids}
        />
      ),
    },
    {
      id: "brand_status",
      label: "Brand Status",
      enabled: true,
      headerRender: () => (
        <FilterInput
          labelFont={14}
          label="BRAND STATUS"
          placeholder="Brand Status..."
          filter={filter?.brand_status}
          setFilter={(val) => {
            setFilter((prev) => ({
              ...prev,
              brand_status: val,
            }));
            setCurrentPage(0);
          }}
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
            setFilter((prev) => ({
              ...prev,
              account_ids: val,
            }));
            setCurrentPage(0);
          }}
          value={filter?.account_ids}
          isExclude
          onChangeNon={(val) => {
            setFilter((prev) => ({
              ...prev,
              non_account_ids: val,
            }));
            setCurrentPage(0);
          }}
          valueNon={filter?.non_account_ids}
        />
      ),
      render: (row) => {
        return (
          <Link
            color="text.primary"
            component={RouterLink}
            href={`${paths.dashboard.lead.affiliate.index}/${row?.account_id}`}
            sx={{
              alignItems: "center",
              display: "inline-flex",
            }}
            underline="hover"
          >
            {row?.account_name}
          </Link>
        );
      },
    },
    {
      id: "team_name",
      label: "Team",
      enabled: true,
      headerRender: () => (
        <FilterMultiSelect
          label="TEAM"
          withSearch
          placeholder="Team..."
          options={teamList ?? []}
          onChange={(val) => {
            setFilter((prev) => ({
              ...prev,
              team_ids: val,
            }));
            setCurrentPage(0);
          }}
          value={filter?.team_ids}
          isExclude
          onChangeNon={(val) => {
            setFilter((prev) => ({
              ...prev,
              non_team_ids: val,
            }));
            setCurrentPage(0);
          }}
          valueNon={filter?.non_team_ids}
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
            setFilter((prev) => ({
              ...prev,
              agent_ids: val,
            }));
            setCurrentPage(0);
          }}
          value={filter?.agent_ids}
          isExclude
          onChangeNon={(val) => {
            setFilter((prev) => ({
              ...prev,
              non_agent_ids: val,
            }));
            setCurrentPage(0);
          }}
          valueNon={filter?.non_agent_ids}
        />
      ),
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
          handleModalOpen={() => setOpenLabelModal(true)}
          placeholder="Label..."
          options={labelList ?? []}
          onChange={(val) => {
            setFilter((prev) => ({
              ...prev,
              label_ids: val,
            }));
            setCurrentPage(0);
          }}
          isExclude
          value={filter?.label_ids}
          onChangeNon={(val) => {
            setFilter((prev) => ({
              ...prev,
              non_label_ids: val,
            }));
            setCurrentPage(0);
          }}
          valueNon={filter?.non_label_ids}
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
                labelInfo?.find(({ label }) => item.name === label?.name)?.label
                  ?.color ?? "",
              mr: 1,
            }}
          />
        )),
    },
    {
      id: "source",
      label: "Source",
      enabled: true,
    },
    {
      id: "ip_address",
      label: "IP address",
      enabled: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" gap={1}>
          {row?.ip_address_validated ? null : (
            <Tooltip placement="top-start" title={row?.ip_address_error}>
              <WarningAmberIcon fontSize="small" color="error" />
            </Tooltip>
          )}
          <Typography>{row?.ip_address}</Typography>
        </Stack>
      ),
    },
    {
      id: "created_at",
      label: "Created At",
      enabled: true,
      render: (row) => {
        if (row?.created_at) {
          return format(new Date(row?.created_at), "yyyy-MM-dd HH:mm");
        }
      },
    },
    {
      id: "updated_at",
      label: "Updated At",
      enabled: true,
      render: (row) => {
        if (row?.updated_at) {
          return format(new Date(row?.updated_at), "yyyy-MM-dd HH:mm");
        }
      },
    },
  ];

  const [defaultColumn, setDefaultColumn] = useState(DEFAULT_COLUMN);

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
    affiliateList,
    agentList,
    brandList,
    defaultColumn,
    filter,
    labelInfo,
    labelList,
    teamList,
  ]);

  const updateRule = async (rule) => {
    setRule(rule);

    if (tableSetting) {
      const updateSetting = {
        ...tableSetting,
        leadTable: rule,
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updateSetting),
      });
      setTableSetting(updateSetting);
    } else {
      const updatedTableSettings = {
        leadTable: rule,
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updatedTableSettings),
      });
      setTableSetting(updatedTableSettings);
    }
  };

  const handleSelectedLabelsUpdate = useCallback(
    (labels) => {
      const selected = leadSelection.selectAll ? [] : leadSelection.selected;
      const selectionData = {
        ...leadSelection,
        selected: selected,
      };
      handleSelectedLabelsChange(labels, filter, selectionData);
    },
    [handleSelectedLabelsChange, filter, leadSelection]
  );

  const handleExport = useCallback(async () => {
    const dateNow = new Date();
    const exportDate = format(dateNow, "dd.mm.yyyy");
    const { excelData, params } = await handleMakeExcelData();
    const normalizedData = excelData
      ?.map((item) => ({
        ...item,
        verified:
          item?.verified || item?.verified === null
            ? "Verified"
            : "Not Verified",
        affiliate: item?.account_name,
        brand: item?.brand_name,
        team: item?.team_name,
        agent: item?.agent_name,
        labels: item?.labels?.map((l) => l?.name)?.join(", "),
      }))
      // eslint-disable-next-line no-unused-vars
      ?.map(({ _index, _type, _id, id, _score, sort, agent_id, team_id, lead_file_id, email_error, deposit_error, language_error, status_error, company_id, brand_id, account_id, lead_file_internal_id, verified_error, phone_error, deposit_f, ftd_amount_f, ftd_amount_error, ftd_date_error, description_error, campaign_error, registration_date_error, label_ids, ip_address_error, ...rest }) => rest);

    const customFieldsNames = customerFields?.map((field) => field?.id);

    if (rule?.length) {
      const filteredAndSortedFields = rule
        .filter((setting) => setting.enabled)
        .sort((a, b) => a.order - b.order)
        .map((setting) => setting.id);

      const modifiedArray = normalizedData?.map((obj) => {
        const modifiedObj = {};
        filteredAndSortedFields.forEach((field) => {
          if (field === "id") {
          } else if (
            customFieldsNames.includes(field) &&
            customerFields?.length &&
            obj?.lead_fields
          ) {
            const customFieldObj = customerFields?.find((f) => f?.id === field);
            modifiedObj[field] = obj?.lead_fields[customFieldObj?.custom_id];
          } else if (field === "country" && obj?.country) {
            modifiedObj["country"] = countries.find(
              (c) => c.code === obj?.country
            )?.label;
          } else {
            modifiedObj[field] = obj[field];
          }
        });
        return modifiedObj;
      });

      exportToExcel(modifiedArray, `leads-import-${exportDate}`);
      localStorage.setItem("last_beat_time", new Date().getTime());
      await settingsApi.updateMember(accountId, {
        last_beat: true,
        trigger: "export",
        export_filter_data: JSON.stringify(params),
        export_count: leadSelection?.selectAll
          ? excelData?.length + ""
          : leadSelection?.selected?.length
          ? leadSelection?.selected?.length + ""
          : 0,
        export_table: "Lead",
      });
    } else {
      if (normalizedData)
        exportToExcel(normalizedData, `leads-import-${exportDate}`);
    }
    localStorage.setItem("last_beat_time", new Date().getTime());
    await settingsApi.updateMember(accountId, {
      last_beat: true,
      trigger: "export",
      export_filter_data: JSON.stringify(params),
      export_count: leadSelection?.selectAll
        ? excelData?.length + ""
        : leadSelection?.selected?.length
        ? leadSelection?.selected?.length + ""
        : 0,
      export_table: "Lead",
    });
  }, [
    perPage,
    currentPage,
    query,
    leadFileId,
    filter,
    rule,
    leadSelection,
    customerFields,
  ]);

  const handleMakeExcelData = async () => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);

    try {
      setExportLoading(true);
      const data = [];

      const newParams = {
        per_page: 1000,
        page: currentPage + 1,
        q: query?.length > 0 ? query : null,
        lead_file_id: leadFileId,
        ...filter,
      };
      if (!leadSelection?.selectAll) {
        newParams["ids"] = leadSelection?.selected;
      }
      if (leadSelection.selectAll) {
        newParams["select_all"] = true;
      }
      const checkRes = await statusApi.getStatuses(newParams);

      const totalLeads = leadSelection?.perPage ? leadSelection?.perPage : checkRes?.total_count;

      let allData = [];

      if (leadSelection?.perPage && leadSelection?.perPage > 1000) {
        const numPages = Math.ceil(leadSelection?.perPage / 1000);
        
        for (let page = 1; page <= numPages; page++) {
          const newRes = await statusApi.getStatuses({
            ...newParams,
            page,
            per_page: 1000,
          });
          
          const dataIds = allData?.map(d => d?.id);
          allData.push(
            ...newRes?.leads?.filter((lead) => !dataIds?.includes(lead?.id))
          );
        }
        
        const totalFetched = allData.length;
        if (totalFetched > leadSelection?.perPage) {
          allData = allData.slice(0, leadSelection?.perPage);
        }
      } else {
        const perPage = totalLeads < 1000 ? totalLeads : 1000;
        const numPages = !leadSelection?.selectAll ? 1 : Math.ceil(totalLeads / perPage);

        for (let page = 1; page <= numPages; page++) {
          const newRes = await statusApi.getStatuses({
            ...newParams,
            page,
            per_page: perPage,
          });
          
          const dataIds = allData?.map(d => d?.id);
          allData.push(
            ...newRes?.leads?.filter((lead) => !dataIds?.includes(lead?.id))
          );
        }
      }

      data.push(...allData);

      setExportLoading(false);
      clearInterval(timer);

      return { excelData: data, params: newParams };
    } catch (error) {
      toast.error(error?.response?.data?.message);
      clearInterval(timer);
      setExportLoading(false);
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
      JSON.stringify(
        rule?.map((item, index) => ({
          id: item?.id,
          enabled: item?.enabled,
          order: index,
        }))
      ) || rule?.length === 0;

  const getCustomField = async () => {
    setIsDoneCustomFields(false);
    try {
      const res = await statusApi.getLeadCustomFields();
      if (res?.lead_fields?.length) {
        setCustomerFields(
          res?.lead_fields?.map((field) => ({
            id: field?.value,
            label: field?.friendly_name,
            enabled: true,
            custom: true,
            custom_id: field?.id,
            setting: field?.setting,
            render: (row) => {
              if (row?.lead_fields) {
                if (row?.lead_fields[field?.id]?.length > 15) {
                  return (
                    <Tooltip title={row?.lead_fields[field?.id]}>
                      <Typography>
                        {row?.lead_fields[field?.id]?.substring(0, 15) + ".."}
                      </Typography>
                    </Tooltip>
                  );
                } else {
                  return row?.lead_fields[field?.id];
                }
              }
            },
            headerRender: () => renderCustomFilter(field),
          }))
        );
      }
    } catch (error) {
      console.error("error: ", error);
    }
    setIsDoneCustomFields(true);
  };

  const renderCustomFilter = (field) => {
    switch (field?.field_type) {
      case "text":
        return (
          <CustomFilterText
            label={field?.friendly_name}
            placeholder={field?.friendly_name}
            field={field}
            onSetField={(val) => {
              setCurrentPage(0);
              setCustomerFields(val);
            }}
            fields={customerFields}
          />
        );
      case "number":
        return (
          <CustomFilterNumber
            label={field?.friendly_name}
            placeholder={field?.friendly_name}
            field={field}
            onSetField={(val) => {
              setCurrentPage(0);
              setCustomerFields(val);
            }}
          />
        );
      case "boolean":
        return (
          <CustomFilterBoolean
            label={field?.friendly_name}
            placeholder={field?.friendly_name}
            field={field}
            onSetField={(val) => {
              setCurrentPage(0);
              setCustomerFields(val);
            }}
          />
        );
      case "multi_choice_radio":
        return (
          <CustomFilterMultiRadio
            label={field?.friendly_name}
            placeholder={field?.friendly_name}
            setting={field?.setting}
            field={field}
            // onSetField={(val) => {
            //   setCurrentPage(0);
            //   setCustomerFields(val);
            // }}
          />
        );
      case "multi_choice":
        return (
          <CustomFilterMultiRadio
            label={field?.friendly_name}
            placeholder={field?.friendly_name}
            setting={field?.setting}
            field={field}
            // onSetField={(val) => {
            //   setCurrentPage(0);
            //   setCustomerFields(val);
            // }}
          />
        );
      default:
        return (
          <CustomFilterText
            label={field?.friendly_name}
            placeholder={field?.friendly_name}
            field={field}
            onSetField={(val) => {
              setCurrentPage(0);
              setCustomerFields(val);
            }}
          />
        );
    }
  };

  useEffect(() => {
    getCustomField();
  }, [tableModal]);

  useEffect(() => {
    if (customerFields?.length) {
      setDefaultColumn(() => [...DEFAULT_COLUMN, ...customerFields]);
    } else {
      setDefaultColumn([...DEFAULT_COLUMN]);
    }
  }, [
    customerFields,
    brandList,
    agentList,
    emailList,
    teamList,
    labelList,
    labelInfo,
    filter,
    user,
  ]);

  const isFilter =
    emailChip?.length ||
    phoneChip?.length ||
    countryChip?.length ||
    nonCountryChip?.length ||
    languageChip?.length ||
    nonLanguageChip?.length ||
    depositChip?.length ||
    maxDepositChip?.length ||
    ftdAmountChip?.length ||
    ftdDateChip?.length ||
    registrationDateChip?.length ||
    clientIdChip?.length ||
    brandChip?.length ||
    nonBrandChip?.length ||
    brandStatusChip?.length ||
    nonBrandStatusChip?.length ||
    affiliateChip?.length ||
    nonAffiliateChip?.length ||
    teamChip?.length ||
    nonTeamChip?.length ||
    agentChip?.length ||
    nonAgentChip?.length ||
    labelChip?.length ||
    nonLabelChip?.length ||
    statusChip?.length ||
    maxFtdAmountChip?.length ||
    customFilterChip?.length ||
    nonCustomFilterChip?.length ||
    idChip?.length ||
    sourceBrandChip?.length ||
    duplicateChip?.length;

  const getUserInfo = async () => {
    try {
      const { account } = await authApi.me({ accountId });
      setSearchSetting(account?.search_setting);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (!filterModal) {
      getUserInfo();
    }
  }, [filterModal]);

  const currentFilter = useMemo(() => {
    if (searchSetting?.lead?.length && selectedFilterValue !== "none") {
      const result = searchSetting?.lead?.find(
        (item) => item?.id === selectedFilterValue?.id
      )?.filter;
      const customFields = searchSetting?.lead?.find(
        (item) => item?.id === selectedFilterValue?.id
      )?.customFields;
      const name = selectedFilterValue.name;
      return { filter: result, fields: customFields, name };
    }
  }, [searchSetting, selectedFilterValue]);

  const currentSavedFilterName = useMemo(() => {
    if (currentFilter) {
      const currentFilters = currentFilter?.filter;
      const currentFields = currentFilter?.fields
        ? customerFields?.map((item) => {
            if (
              currentFilter?.fields?.find((field) => field?.id === item?.id)
            ) {
              return {
                ...item,
                filter: currentFilter?.fields?.find(
                  (field) => field?.id === item?.id
                )?.filter,
              };
            }
            return item;
          })
        : customerFields;
      if (
        isEqual(currentFilters, filter) &&
        isEqual(currentFields, customerFields)
      ) {
        return currentFilter?.name;
      } else {
        return undefined;
      }
    }
  }, [currentFilter, customerFields, filter]);

  useEffect(() => {
    if (currentFilter) {
      setFilter(currentFilter?.filter);
      if (currentFilter?.fields) {
        setCustomerFields(
          customerFields?.map((item) => {
            if (
              currentFilter?.fields?.find((field) => field?.id === item?.id)
            ) {
              return {
                ...item,
                filter: currentFilter?.fields?.find(
                  (field) => field?.id === item?.id
                )?.filter,
              };
            }
            return item;
          })
        );
      }
    }
  }, [currentFilter]);

  return (
    <>
      <Card>
        <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2 }}>
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
          <Stack direction="row" gap={1} alignItems="center">
            {isLoading && (
              <Iconify
                icon="svg-spinners:8-dots-rotate"
                width={24}
                sx={{ color: "white" }}
              />
            )}
            <Tooltip title="Reload Table">
              <IconButton
                onClick={() => getStatusInfo()}
                sx={{
                  "&:hover": {
                    color: "primary.main",
                    transform: "rotate(180deg)",
                  },
                  transition: "transform 0.3s",
                }}
              >
                <Iconify icon="ion:reload-sharp" width={24} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Search Setting">
              <IconButton
                onClick={() => setFilterModal(true)}
                sx={{ "&:hover": { color: "primary.main" } }}
              >
                {!isFilter ? (
                  <SvgIcon>
                    <FilterIcon />
                  </SvgIcon>
                ) : (
                  <Badge variant="dot" color="error">
                    <SvgIcon>
                      <FilterIcon />
                    </SvgIcon>
                  </Badge>
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Table Setting">
              <IconButton
                onClick={() => setTableModal(true)}
                sx={{ "&:hover": { color: "primary.main" } }}
              >
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
            {exportLoading ? (
              <CircularProgressWithLabel value={progress} />
            ) : enableBulkActions &&
              (user?.acc?.acc_e_lm_export_leads === undefined ||
                user?.acc?.acc_e_lm_export_leads) ? (
              <Tooltip title="Export selected">
                <IconButton
                  onClick={() => {
                    handleExport();
                  }}
                  sx={{ "&:hover": { color: "primary.main" } }}
                >
                  <Iconify icon="line-md:downloading-loop" width={24} />
                </IconButton>
              </Tooltip>
            ) : null}
          </Stack>
        </Stack>
        {isFilter ? (
          <>
            <Divider />
            <Stack
              alignItems="center"
              direction="row"
              flexWrap="wrap"
              gap={1}
              sx={{ p: 2, px: 3 }}
            >
              {currentSavedFilterName ? (
                <Typography>{currentSavedFilterName ?? ""}:</Typography>
              ) : null}

              {chipSetList?.map((item, index) => (
                <ChipSet
                  chips={item.chipValue}
                  handleRemoveChip={item.removeChip}
                  key={index}
                />
              ))}
            </Stack>
          </>
        ) : null}
        <Box sx={{ position: "relative" }}>
          {enableBulkActions ? (
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "neutral.800" : "neutral.50",
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
              <Stack direction="row" alignItems="center" spacing={1}>
                {user?.acc?.acc_e_lm_leads ? (
                  <MultiSelect
                    withSearch
                    withEdit
                    noPadding
                    withIcon
                    editLabel="Edit customer labels"
                    labelIcon={
                      <Tooltip title="Assign label">
                        <Iconify
                          icon="mynaui:label"
                          sx={{
                            color: "text.disabled",
                            "&:hover": { color: "primary.main" },
                          }}
                        />
                      </Tooltip>
                    }
                    options={labelList}
                    onChange={handleSelectedLabelsUpdate}
                    onEditClick={() => setOpenLabelModal(true)}
                    value={selectedLabels}
                  />
                ) : null}
                {!user?.aff_acc_brands ? null : (
                  <IconButton
                    onClick={() => setModalOpen(true)}
                    sx={{ "&:hover": { color: "primary.main" } }}
                  >
                    <Iconify icon="prime:send" width={30} />
                  </IconButton>
                )}
                {user?.acc?.acc_e_lm_delete_leads === undefined ||
                user?.acc?.acc_e_lm_delete_leads ? (
                  <IconButton
                    onClick={() => setDeleteModalOpen(true)}
                    sx={{ "&:hover": { color: "error.main" } }}
                  >
                    <Iconify icon="heroicons:trash" />
                  </IconButton>
                ) : null}
                {leadSelection.selectAll ? (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Select first:
                    </Typography>
                    <OutlinedInput
                      type="number"
                      placeholder="All"
                      value={leadSelection.perPage || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || value === "0") {
                          leadSelection.setPerPage(null);
                        } else {
                          const numValue = parseInt(value);
                          if (numValue > 5000) {
                            leadSelection.setPerPage(5000);
                          } else if (numValue > 0) {
                            leadSelection.setPerPage(numValue);
                          } else {
                            leadSelection.setPerPage(null);
                          }
                        }
                      }}
                      inputProps={{
                        min: 1,
                        max: Math.min(count, 5000),
                        style: { width: "60px", textAlign: "center" },
                      }}
                      sx={{
                        width: "80px",
                        height: "32px",
                        "& input": {
                          padding: "6px 8px",
                          fontSize: "14px",
                        },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      of {count} items
                    </Typography>
                  </Stack>
                ) : (
                  <Typography sx={{ whiteSpace: "nowrap" }}>
                    Selected <strong>{leadSelection.selected?.length}</strong>{" "}
                    of <strong>{count}</strong>
                  </Typography>
                )}
              </Stack>
              {leadSelection.selectAll ? (
                <Button onClick={() => leadSelection.handleDeselectAll()}>
                  <Typography sx={{ whiteSpace: "nowrap" }}>
                    Clear Selection
                  </Typography>
                </Button>
              ) : (
                <Button onClick={() => leadSelection.handleSelectAll()}>
                  <Typography sx={{ whiteSpace: "nowrap" }}>
                    Selected All
                  </Typography>
                </Button>
              )}
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
                          <Typography sx={{ fontSize: 14, fontWeight: "600" }}>
                            {item.label}
                          </Typography>
                        )}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading && leads?.length === 0 ? (
                  <TableSkeleton
                    rowCount={perPage > 15 ? 15 : 10}
                    cellCount={
                      tableColumn?.filter((item) => item.enabled)?.length + 1
                    }
                  />
                ) : (
                  leads?.map((lead) => {
                    const isSelected = leadSelection.selected.includes(
                      lead?.id
                    );
                    return (
                      <TableRow
                        selected={isSelected}
                        hover
                        key={lead?.id}
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            sx={{ p: 0 }}
                            checked={isSelected}
                            onChange={(event) => {
                              if (event.target.checked) {
                                leadSelection.handleSelectOne?.(lead?.id);
                              } else {
                                leadSelection.handleDeselectOne?.(lead?.id);
                              }
                            }}
                            value={isSelected}
                          />
                        </TableCell>
                        {tableColumn
                          ?.filter((item) => item.enabled)
                          ?.map((header, index) => (
                            <TableCell key={lead.id + index}>
                              {header?.render
                                ? header?.render(lead)
                                : lead[header.id]}
                            </TableCell>
                          ))}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Scrollbar>
          {leads?.length === 0 && !isLoading && <TableNoData />}
          {isLoading && leads?.length === 0 && <Divider />}
          <Stack
            sx={{
              flexDirection: { md: "row", xs: "column" },
              gap: 0,
              justifyContent: "flex-end",
              alignItems: { md: "center", xs: "start" },
            }}
          >
            <PageNumberSelect
              currentPage={currentPage}
              totalPage={count ? Math.ceil(count / perPage) : 0}
              onUpdate={setCurrentPage}
            />
            <TablePagination
              component="div"
              labelRowsPerPage="Per page"
              count={count}
              onPageChange={(event, index) => setCurrentPage(index)}
              onRowsPerPageChange={(event) => {
                setPerPage(event?.target?.value);
                localStorage.setItem("leadsPerPage", event?.target?.value);
              }}
              page={currentPage}
              rowsPerPage={perPage}
              rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
            />
          </Stack>
        </Box>
      </Card>
      <BulkActionModal
        selectedLeads={leadSelection.selected}
        getStatusInfo={getStatusInfo}
        selectAll={leadSelection.selectAll}
        onDeSelectAll={leadSelection.handleDeselectAll}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        agentList={agentList}
        teamList={teamInfo}
        affiliateList={affiliateList}
        brandsList={brandList}
        labelList={labelList}
      />
      <DeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={() => setDeleteModalOpen(false)}
        onDelete={() => handleBulkLeadsDelete()}
        title={"Delete Leads"}
        description={"Are you sure you want to delete these leads?"}
      />

      <FilterModal
        variant="lead"
        open={filterModal}
        isFilter={isFilter}
        currentValue={selectedFilterValue}
        onClose={() => setFilterModal(false)}
        filters={filter}
        customFields={customerFields}
        searchSetting={searchSetting}
        setSelectedValue={setSelectedFilterValue}
        accountId={accountId}
      />

      <TableModal
        variant="lead"
        open={tableModal}
        onClose={() => setTableModal(false)}
        tableColumn={tableColumn}
        defaultColumn={[...DEFAULT_COLUMN, ...customerFields]}
        updateRule={updateRule}
      />
      <LabelsDialog
        title="Edit Label"
        open={openLabelModal}
        onClose={() => setOpenLabelModal(false)}
        getLabelList={(val) => {
          setLabelInfo(val);
        }}
        onGetLabels={getLabels}
      />
    </>
  );
};
