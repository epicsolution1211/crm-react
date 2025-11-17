import { useCallback, useEffect, useMemo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";

import { paths } from "src/paths";
import { useRouter } from "src/hooks/use-router";
import { StatusDetailsStep } from "./status-details-step";
import { StatusAssigneeStep } from "./status-assignee-step";
import { StatusDescriptionStep } from "./status-description-step";
import { statusApi } from "src/api/lead-management/status";
import { StatusCustomFieldStep } from "./status-custom-field-step";
import { settingsApi } from "src/api/settings";
import { customersApi } from "src/api/customers";
import { affiliateApi } from "src/api/lead-management/affiliate";
import { brandsApi } from "src/api/lead-management/brand";
import { Iconify } from "src/components/iconify";

const StepIcon = (props) => {
  const { active, completed, icon } = props;

  const highlight = active || completed;
  return (
    <Avatar
      sx={{
        height: 40,
        width: 40,
        ...(highlight && {
          backgroundColor: "primary.main",
          color: "primary.contrastText",
        }),
      }}
      variant="rounded"
    >
      {completed ? (
        <Iconify icon="mingcute:check-line" width={24} />
      ) : (
        icon
      )}
    </Avatar>
  );
};

export const StatusCreate = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [details, setDetails] = useState({});
  const [assignee, setAssignee] = useState({});
  const [note, setNote] = useState("");
  const [customFields, setCustomFields] = useState(null);
  const [createProcessStarted, setCreateProcessStarted] = useState(false);

  const [brandsList, setBrandsList] = useState([]);
  // const [brandStatusesList, setBrandStatusesList] = useState([]);
  const [affiliateList, setAffiliateList] = useState([]);
  const [labelList, setLabelList] = useState([]);
  const [labels, setLabels] = useState([]);
  const [teams, setTeams] = useState([]);
  const [agentList, setAgentList] = useState([]);

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

  // const getBrandStatuses = async () => {
  //   try {
  //     const res = await brandsApi.getBrandStatuses();
  //     const brandStatusInfo = res?.status?.map((item) => ({
  //       label: item?.name,
  //       value: item?.id,
  //     }));
  //     setBrandStatusesList(brandStatusInfo);
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message);
  //   }
  // };

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
          value: account?.id?.toString(),
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

  const handleCreateStatus = async () => {
    try {
      setCreateProcessStarted(true);
      const request = { ...details, ...assignee, ...note, custom_fields: customFields };
      await statusApi.createStatus(request);
      toast.success("Leads successfully created!");
      setTimeout(() => {
        setCreateProcessStarted(false);
        router.push(paths.dashboard.lead.status.index);
      }, 1500);
    } catch (error) {
      setCreateProcessStarted(false);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleDetailsFinish = (data) => {
    setDetails(data);
    setActiveStep((prevState) => prevState + 1);
  };

  const handleAssigneeFinish = useCallback((data) => {
    setAssignee(data);
    setActiveStep((prevState) => prevState + 1);
  }, []);

  const handleCustomFieldsFinish = (data) => {
    setCustomFields(data);
    setActiveStep((prevState) => prevState + 1);
  }

  const handleNoteFinish = (data) => {
    setNote(data);
    handleCreateStatus();
  };

  const handleBack = useCallback(() => {
    setActiveStep((prevState) => prevState - 1);
  }, []);

  const steps = useMemo(() => {
    return [
      {
        label: "Custom Fields",
        content: (
          <StatusCustomFieldStep
            onBack={handleBack}
            onNext={handleCustomFieldsFinish}
          />
        )
      },
      {
        label: "Details",
        content: (
          <StatusDetailsStep data={details} onNext={handleDetailsFinish}
            onBack={(data) => {
              setDetails(data);
              handleBack();
            }}
          />
        ),
      },
      {
        label: "Assignee",
        content: (
          <StatusAssigneeStep
            affiliateList={affiliateList}
            agentList={agentList}
            teams={teams}
            labels={labels}
            labelList={labelList}
            brandsList={brandsList}
            onBack={handleBack}
            onNext={handleAssigneeFinish}
            data={assignee}
          />
        ),
      },
      {
        label: "Description",
        content: (
          <StatusDescriptionStep
            onBack={handleBack}
            onNext={handleNoteFinish}
            createProcessStarted={createProcessStarted}
          />
        ),
      },
    ];
  }, [handleBack, handleNoteFinish, handleDetailsFinish, handleAssigneeFinish]);

  useEffect(() => {
    getBrands();
    // getBrandStatuses();
    getAffiliate();
    getTeamsInfo();
    getLabels();
    getAgents();
  }, [])

  return (
    <Stepper
      activeStep={activeStep}
      orientation="vertical"
      sx={{
        "& .MuiStepConnector-line": {
          borderLeftColor: "divider",
          borderLeftWidth: 2,
          ml: 1,
        },
      }}
    >
      {steps.map((step, index) => {
        const isCurrentStep = activeStep === index;

        return (
          <Step key={step.label}>
            <StepLabel StepIconComponent={StepIcon}>
              <Typography sx={{ ml: 2 }} variant="overline">
                {step.label}
              </Typography>
            </StepLabel>
            <StepContent
              sx={{
                borderLeftColor: "divider",
                borderLeftWidth: 2,
                ml: "20px",
                ...(isCurrentStep && {
                  py: 4,
                }),
              }}
            >
              {step.content}
            </StepContent>
          </Step>
        );
      })}
    </Stepper>
  );
};
