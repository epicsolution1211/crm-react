import { useEffect, useState, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import MultiSelectMenu from "src/components/customize/multi-select-menu";
import { customersApi } from "src/api/customers";
import { ChipSet } from "src/components/customize/chipset";
import { LabelsDialog } from "src/components/labels-dialog";
import { settingsApi } from "src/api/settings";
import { Iconify } from 'src/components/iconify';

export const LabelStep = ({ onBack, onNext, labels }) => {
  const { handleSubmit, control, setValue } = useForm();


  const selectedLabels = useWatch({ control, name: "label_ids" });
  const [openLabelModal, setOpenLabelModal] = useState(false);

  const [labelList, setLabelList] = useState([]);
  const [teamList, setTeamList] = useState([]);

  const handleRemoveChip = (value) => {
    const newStatus = [...selectedLabels].filter((item) => item !== value);
    setValue("label_ids", newStatus);
  };

  const onSubmit = (data) => {
    onNext(data);
  };

  const getLabels = async () => {
    try {
      const res = await customersApi.getCustomerLabels();
      const labelInfo = res?.labels?.map(({ label }) => ({
        label: label?.name,
        value: label?.id,
      }));
      setLabelList(labelInfo);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getTeamsInfo = async () => {
    try {
      const res = await settingsApi.getSkillTeams("*");
      const teamInfo = res?.map(({ team }) => ({
        label: team?.name,
        value: team?.id,
      }));
      setTeamList([...teamInfo]);
    } catch (error) {
      console.error("error: ", error);
    }
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

  useEffect(() => {
    getLabels();
    getTeamsInfo();
  }, []);

  useEffect(() => {
    if (labels && !!labelList.length) {
      setValue(
        "label_ids",
        labels?.label_ids?.map((item) => Number(item))
      );
    }
  }, [labels, labelList]);

  return (
    <>
      <Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <MultiSelectMenu
              isLabel
              openModal={() => setOpenLabelModal(true)}
              control={control}
              label="Labels"
              name="label_ids"
              list={labelList}
            />
          </Stack>
          {currentChip?.length > 0 && (
            <Stack
              alignItems="center"
              direction="row"
              flexWrap="wrap"
              gap={2}
              sx={{ px: 3, mt: 2 }}
            >
              <ChipSet
                chips={currentChip}
                handleRemoveChip={(val) => handleRemoveChip(val)}
              />
            </Stack>
          )}
          <Stack alignItems="center" direction="row" sx={{ mt: 3 }} spacing={2}>
            <Button
              endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
              type="submit"
              variant="contained"
            >
              Continue
            </Button>
            <Button
              color="inherit"
              onClick={onBack}>
              Back
            </Button>
          </Stack>
        </form>
      </Stack>
      <LabelsDialog
        title="Edit Label"
        teams={teamList}
        open={openLabelModal}
        onClose={() => setOpenLabelModal(false)}
        getLabelList={() => getLabels()}
        onGetLabels={getLabels}
      />
    </>
  );
};
