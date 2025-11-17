// React imports
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

// MUI core imports
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// MUI lab imports
import LoadingButton from '@mui/lab/LoadingButton';

// Third party imports
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";

// API imports
import { affiliateApi } from "src/api/lead-management/affiliate";
import { brandsApi } from "src/api/lead-management/brand";
import { customersApi } from "src/api/customers";
import { settingsApi } from "src/api/settings";
import { statusApi } from "src/api/lead-management/status";

// Component imports
import { BrandStatusEditDialog } from "./status-create/brand-status-edit-dialog";
import { ChipSet } from "src/components/customize/chipset";
import CountryInput from "src/components/customize/country-input";
import LanguageInput from "src/components/customize/language-input";
import { LabelsDialog } from "src/components/labels-dialog";
import MuiDatePicker from "src/components/customize/date-picker";
import MultiSelectMenu from "src/components/customize/multi-select-menu";
import PhoneInput from "src/components/customize/phone-input";
import { SelectMenu } from "src/components/customize/select-menu";
import { StatusCustomFields } from "./status-custom-fields";

// Util imports
import { countries, phoneRegExp } from "src/utils/constant";
import { paths } from "src/paths";
import { useRouter } from "src/hooks/use-router";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Email must be a valid email.")
    .required("Email is a required field"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone must be a valid phone number.")
    .required("Phone number is a required field"),
  first_name: yup.string().required("First name is a required field"),
  last_name: yup.string().required("Last name is a required field"),
  country_name: yup.string().required("Country name is a required field"),
  brand_id: yup.string(),
  brand_status: yup.string().required("Brand status is a required field"),
  account_id: yup.string().required("Affiliate is a required field"),
  label_ids: yup
    .array()
    .min(1, "Labels field must have at least 1 items")
    .of(yup.string()),
});

export const StatusEdit = ({ leadId, lead = {} }) => {
  const {
    setValue,
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });
  const router = useRouter();

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [defaultPhone, setDefaultPhone] = useState(null);
  const [brandsList, setBrandsList] = useState([]);
  const [brandStatusesList, setBrandStatusesList] = useState([]);
  const [affiliateList, setAffiliateList] = useState([]);
  const [labelList, setLabelList] = useState([]);
  const [labels, setLabels] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openLabelModal, setOpenLabelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isByPassLoading, setIsByPassLoading] = useState(false);

  const country = useWatch({ control, name: "country_name" });
  const selectedLabels = useWatch({ control, name: "label_ids" });

  const leadInfo = watch();

  const setLeadInfo = async () => {
    try {
      if (lead) {
        setValue("email", lead?.email);
        setDefaultPhone(lead?.phone);
        setValue("phone", lead?.phone);
        setValue("first_name", lead?.first_name);
        setValue("last_name", lead?.last_name);
        setValue("country_name", lead?.country);
        setValue("language", lead?.language);
        setValue("ip_message", lead?.ip_address);
        setValue("deposit", lead?.deposit);
        setValue("ftd_amount", lead?.ftd_amount);
        setValue("brand_name", lead?.brand_name);
        setValue(
          "ftd_date",
          lead?.ftd_date ? format(new Date(lead?.ftd_date), "yyyy-MM-dd") : ""
        );
        setValue(
          "registration_date",
          lead?.registration_date
            ? format(new Date(lead?.registration_date), "yyyy-MM-dd")
            : ""
        );
        setValue("campaign", lead?.campaign);
        setValue("description", lead?.description);
        setValue("note", lead?.note);
        setValue("brand_status", lead?.brand_status ? lead?.brand_status : "");
        setValue("brand_id", lead?.brand_id ? Number(lead?.brand_id) : "");
        setValue(
          "account_id",
          lead?.account_id ? Number(lead?.account_id) : ""
        );
        setValue("team_id", lead?.team_id ? Number(lead?.team_id) : "");
        setValue("agent_id", lead?.agent_id ? Number(lead?.agent_id) : "");
        if (lead?.labels?.length) {
          setValue(
            "label_ids",
            lead?.labels?.map((l) => l?.id)
          );
        }
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getBrands = async () => {
    try {
      const res = await brandsApi.getBrands();
      const brandsInfo = res?.brands?.map((item) => ({
        label: item?.name,
        value: item?.id,
        default: item?.default,
      }));
      setBrandsList(brandsInfo);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getBrandStatuses = async () => {
    try {
      const res = await brandsApi.getBrandStatuses();
      const brandStatusInfo = res?.status?.map((item) => ({
        label: item?.name,
        value: item?.id,
      }));
      setBrandStatusesList(brandStatusInfo);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const getAffiliate = async () => {
    try {
      const res = await affiliateApi.getAffiliates();
      const affiliateInfo = res?.affiliates?.map((item) => ({
        label: item?.full_name,
        value: item?.id,
      }));
      setAffiliateList(affiliateInfo);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getTeamsInfo = async () => {
    try {
      const res = await settingsApi.getSkillTeams("*");
      setTeams(res);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getLabels = async () => {
    try {
      const res = await customersApi.getCustomerLabels();
      setLabels(res?.labels);
      const labelInfo = res?.labels?.map(({ label }) => ({
        label: label?.name,
        value: label?.id,
      }));
      setLabelList(labelInfo);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getAgents = async () => {
    try {
      const res = await settingsApi.getMembers();
      const agentList = res?.accounts
        ?.filter(account => !account?.admin_hide)
        ?.map((account) => ({
          label: account?.first_name
            ? `${account?.first_name} ${account?.last_name}`
            : account?.email,
          value: account?.id,
          avatar: account?.avatar,
        }))
        ?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.label === item?.label)
        );
      setAgentList(agentList);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      await statusApi.updateLead(leadId, data);
      setIsLoading(false);
      toast.success("Lead successfully updated!");
      setTimeout(() => {
        router.push(paths.dashboard.lead.status.index);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
  };

  const handleBypass = async () => {
    setIsByPassLoading(true);
    try {
      await statusApi.updateLead(leadId, {
        bypass_verification: true,
        ...leadInfo,
      });
      toast.success("Bypass request successfully sent!");
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message);
      console.error("error: ", error);
    }
    setIsByPassLoading(false);
  };

  const handleCountrySelect = (_country) => {
    if (country) return;
    setSelectedCountry(_country);
    setValue("country_name", _country.toUpperCase());
  };

  const defaultCountry = useMemo(() => {
    if (selectedCountry) {
      return countries?.find((c) => c.code === selectedCountry?.toUpperCase());
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (teams) {
      const teamInfo = teams?.map(({ team }) => ({
        label: team?.name,
        value: team?.id,
      }));
      setTeamList([...teamInfo]);
    }
  }, [teams]);

  const currentChip = useMemo(() => {
    const newChips = selectedLabels?.map((selected) => {
      const chip = labelList?.find((item) => selected === item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Label",
      };
    });
    if (!selectedLabels) {
      setValue("label_ids", []);
    }
    return newChips;
  }, [selectedLabels, labelList]);

  const handleRemoveChip = (value) => {
    const newStatus = [...selectedLabels].filter((item) => item !== value);
    setValue("label_ids", newStatus);
  };

  useEffect(() => {
    setLeadInfo();
  }, [lead]);

  useEffect(() => {
    getAgents();
    getBrands();
    getAffiliate();
    getTeamsInfo();
    getLabels();
    getBrandStatuses();
  }, []);

  return (
    <Stack spacing={4}>
      <Card>
        <CardHeader title="Lead Detail" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <Stack spacing={2}>
                    <Typography>Email</Typography>
                    <TextField
                      fullWidth
                      label="Email*"
                      name="email"
                      {...register("email")}
                      error={!!errors?.email?.message}
                      helperText={errors?.email?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack spacing={2}>
                    <Typography>Phone number</Typography>
                    <PhoneInput
                      label="Phone*"
                      name="phone"
                      control={control}
                      defaultValue={defaultPhone ? defaultPhone : ""}
                      onSelectCountry={(val) => handleCountrySelect(val)}
                    />
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack spacing={2}>
                    <Typography>First Name</Typography>
                    <TextField
                      fullWidth
                      label="First Name*"
                      {...register("first_name")}
                      error={!!errors?.first_name?.message}
                      helperText={errors?.first_name?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack spacing={2}>
                    <Typography>Last Name</Typography>
                    <TextField
                      fullWidth
                      label="Last Name*"
                      {...register("last_name")}
                      error={!!errors?.last_name?.message}
                      helperText={errors?.last_name?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack spacing={2}>
                    <Typography>Country</Typography>
                    <CountryInput
                      control={control}
                      label="Country*"
                      name="country_name"
                      defaultCountry={defaultCountry}
                    />
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack spacing={2}>
                    <Typography>Language</Typography>
                    <LanguageInput
                      control={control}
                      label="Language"
                      name="language"
                    />
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack spacing={2}>
                    <Typography>IP Address</Typography>
                    <TextField
                      fullWidth
                      label="IP Address"
                      InputLabelProps={{ shrink: true }}
                      {...register("ip_message")}
                    />
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack spacing={2}>
                    <Typography>Deposit</Typography>
                    <TextField
                      fullWidth
                      label="Deposit"
                      {...register("deposit")}
                      error={!!errors?.deposit?.message}
                      helperText={errors?.deposit?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack spacing={2}>
                    <Typography>FTD Amount</Typography>
                    <TextField
                      fullWidth
                      label="FTD Amount"
                      {...register("ftd_amount")}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack spacing={2}>
                    <Typography>Source Brand</Typography>
                    <TextField
                      fullWidth
                      label="Source Brand"
                      {...register("brand_name")}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack spacing={2}>
                    <Typography>FTD Date</Typography>
                    <MuiDatePicker
                      control={control}
                      setValue={setValue}
                      name="ftd_date"
                      label="FTD Date"
                    />
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack spacing={2}>
                    <Typography>Registration Date</Typography>
                    <MuiDatePicker
                      control={control}
                      setValue={setValue}
                      name="registration_date"
                      label="Registration Date"
                    />
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack spacing={2}>
                    <Typography>Campaign</Typography>
                    <TextField
                      fullWidth
                      label="Campaign"
                      {...register("campaign")}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack spacing={2}>
                    <Typography>Description</Typography>
                    <TextField
                      fullWidth
                      label="Description"
                      {...register("description")}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack spacing={2}>
                    <Typography>Note</Typography>
                    <TextField
                      fullWidth
                      label="Note"
                      {...register("note")}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <SelectMenu
                    control={control}
                    label="Brand"
                    name="brand_id"
                    list={brandsList}
                  />
                </Grid>
                <Grid xs={6}>
                  <SelectMenu
                    control={control}
                    label="Brand Status *"
                    name="brand_status"
                    isLabel
                    list={brandStatusesList}
                    openModal={() => setOpenStatusModal(true)}
                  />
                </Grid>
                <Grid xs={6}>
                  <SelectMenu
                    control={control}
                    label="Affiliate *"
                    name="account_id"
                    list={affiliateList}
                  />
                </Grid>
                <Grid xs={6}>
                  <MultiSelectMenu
                    control={control}
                    label="Labels *"
                    name="label_ids"
                    isLabel
                    openModal={() => setOpenLabelModal(true)}
                    list={labelList}
                  />
                  {currentChip?.length > 0 && (
                    <Stack
                      alignItems="center"
                      direction="row"
                      flexWrap="wrap"
                      gap={1}
                      sx={{ px: 3, pt: 2 }}
                    >
                      <ChipSet
                        chips={currentChip}
                        handleRemoveChip={handleRemoveChip}
                      />
                    </Stack>
                  )}
                </Grid>
                <Grid xs={6}>
                  <SelectMenu
                    control={control}
                    label="Team"
                    name="team_id"
                    list={teamList}
                  />
                </Grid>
                <Grid xs={6}>
                  <SelectMenu
                    control={control}
                    label="Agent"
                    name="agent_id"
                    list={agentList}
                  />
                </Grid>
              </Grid>
            </Stack>

            <CardActions sx={{ justifyContent: "flex-end", mt: 2 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isLoading}
                disabled={isLoading}
              >
                Update
              </LoadingButton>
              <LoadingButton
                onClick={() => handleBypass()}
                variant="contained"
                loading={isByPassLoading}
                disabled={isByPassLoading}
                sx={{ width: 170, whiteSpace: "nowrap" }}
              >
                Bypass Verification
              </LoadingButton>
            </CardActions>
          </CardContent>
        </form>

        <LabelsDialog
          title="Edit Label"
          labels={labels}
          teams={teamList}
          open={openLabelModal}
          onClose={() => setOpenLabelModal(false)}
          getLabelList={() => getLabels()}
        />
        <BrandStatusEditDialog
          title="Edit Brand Status"
          open={openStatusModal}
          onClose={() => setOpenStatusModal(false)}
          getStatusList={() => getBrandStatuses()}
          onGetStatuses={() => getBrandStatuses()}
        />
      </Card>

      <StatusCustomFields leadId={leadId} />
    </Stack>
  );
};
