import { useEffect, useState, useMemo } from "react";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";

import MultiSelectMenu from "src/components/customize/multi-select-menu";
import { BrandStatusEditDialog } from "./brand-status-edit-dialog";
import { ChipSet } from "src/components/customize/chipset";
import { LabelsDialog } from "src/components/labels-dialog";
import { SelectMenu } from "src/components/customize/select-menu";
import { brandsApi } from "src/api/lead-management/brand";
import { useAuth } from "src/hooks/use-auth";
import { useDesks } from "../../customer/customer-desk";
import { Iconify } from 'src/components/iconify';

const validationSchema = yup.object({
  brand_id: yup.string(),
  desk_id: yup.string(),
  brand_status: yup.string().required("Brand status is a required field"),
  account_id: yup.string().required("Affiliate is a required field"),
  label_ids: yup
    .array()
    .min(1, "Labels field must have at least 1 items")
    .of(yup.string()),
});

export const StatusAssigneeStep = ({ onBack, onNext, data, isBulk, brandsList, affiliateList, teams, agentList, labelList, labels }) => {
  const { user } = useAuth();
  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { desks, deskInfo } = useDesks();
  const [brandStatusesList, setBrandStatusesList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [openStatusModal, setOpenStatusModal] = useState(false);

  const [openLabelModal, setOpenLabelModal] = useState(false);

  const brand = useWatch({ control, name: "brand_id" });

  const getBrandStatuses = async () => {
    try {
      const res = await brandsApi.getBrandStatuses();
      const brandStatusInfo = res?.status?.map((item) => ({
        label: item?.name,
        value: item?.id,
      }));
      setBrandStatusesList(brandStatusInfo);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const selectedLabels = useWatch({ control, name: "label_ids" });

  useEffect(() => {
    getBrandStatuses();
  }, []);

  useEffect(() => {
    if (teams) {
      const teamInfo = teams?.map(({ team }) => ({
        label: team?.name,
        value: team?.id,
      }));
      setTeamList([...teamInfo]);
    }
  }, [teams]);

  useEffect(() => {
    if (data) {
      // reset(data);
      if (!!desks?.length && data.desk_id) {
        setValue("desk_id", Number(data.desk_id));
      }
      if (!!agentList?.length && data.agent_id) {
        setValue("agent_id", data.agent_id);
      }
      if (!!brandsList?.length && data.brand_status) {
        setValue("brand_status", Number(data.brand_status));
      }
      if (!!affiliateList?.length && data.account_id) {
        setValue("account_id", Number(data.account_id));
      }
      if (!!teamList?.length && data.team_id) {
        setValue("team_id", Number(data.team_id));
      }
      if (!!labelList?.length && data.label_ids) {
        setValue(
          "label_ids",
          data?.label_ids?.map((item) => Number(item))
        );
      }
    }
  }, [
    data,
    desks,
    affiliateList,
    brandsList,
    affiliateList,
    teamList,
    labelList,
  ]);

  const onSubmit = (data) => {
    onNext(data);
  };

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

  const defaultBrand = useMemo(() => {
    const defaultBrand = brandsList?.find((b) => b?.value == brand);

    return defaultBrand?.default;
  }, [brandsList, brand]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Stack direction="column" gap={2}>
            <Grid container spacing={2}>
              {user?.aff_acc_brands && (
                <Grid xs={6}>
                  <SelectMenu
                    control={control}
                    label="Brand"
                    name="brand_id"
                    list={brandsList}
                  />
                </Grid>
              )}
              {defaultBrand ? (
                <Grid xs={6}>
                  <SelectMenu
                    control={control}
                    label="Desk *"
                    name="desk_id"
                    list={deskInfo}
                  />
                </Grid>
              ) : null}
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
              </Grid>
              {true && (
                <Grid xs={6}>
                  <SelectMenu
                    control={control}
                    label="Team"
                    name="team_id"
                    list={teamList}
                  />
                </Grid>
              )}
              {true && (
                <Grid xs={6}>
                  <SelectMenu
                    control={control}
                    label="Agent"
                    name="agent_id"
                    list={agentList}
                  />
                </Grid>
              )}
            </Grid>
            {currentChip?.length > 0 && (
              <Stack
                alignItems="center"
                direction="row"
                flexWrap="wrap"
                gap={1}
                sx={{ px: 3 }}
              >
                <ChipSet
                  chips={currentChip}
                  handleRemoveChip={handleRemoveChip}
                />
              </Stack>
            )}
          </Stack>
          <Stack alignItems="center" direction="row" spacing={2}>
            <Button
              endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
              type="submit"
              variant="contained"
            >
              Continue
            </Button>
            {isBulk ? null : (
              <Button color="inherit" onClick={onBack}>
                Back
              </Button>
            )}
          </Stack>
        </Stack>
      </form>
      <LabelsDialog
        title="Edit Label"
        labels={labels}
        teams={teamList}
        open={openLabelModal}
        onClose={() => setOpenLabelModal(false)}
        // getLabelList={() => getLabels()}
      />
      <BrandStatusEditDialog
        title="Edit Brand Status"
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        getStatusList={() => getBrandStatuses()}
        onGetStatuses={() => getBrandStatuses()}
      />
    </>
  );
};
