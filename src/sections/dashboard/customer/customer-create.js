import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Avatar from "@mui/material/Avatar";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { CustomerDescriptionStep } from "./customer-description-step";
import { CustomerDetailsStep } from "./customer-details-step";
import { CustomerLabelStep } from "./customer-label-step";
import { CustomerTeamStep } from "./customer-team-step";
import { customersApi } from "src/api/customers";
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";

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

export const CustomerCreate = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [details, setDetails] = useState({});
  const [labels, setLabels] = useState([]);
  const [description, setDescription] = useState("");
  const [tempDetail, setTempDetail] = useState({});
  const [team, setTeam] = useState({});
  const { user } = useAuth();

  const [isPending, setIsPending] = useState(false);

  const [teamList, setTeamList] = useState([]);
  const [labelList, setLabelList] = useState([]);
  const [deskList, setDeskList] = useState([]);

  const getLabels = useCallback (async () => {
    try {
      const res = await customersApi.getCustomerLabels();
      const labelInfo = res?.labels?.map(({ label }) => (
        { label: label?.name, value: label?.id }
      ))
      setLabelList(labelInfo);
    } catch (error) {
      console.error('error: ', error);
    }
  }, []);

  const getTeams = useCallback(async () => {
    try {
      const res = await settingsApi.getSkillTeams("*");
      const teamInfo = res?.map(({ team }) => (
        { label: team?.name, value: team?.id }
      ));
      setTeamList([...teamInfo]);

    } catch (error) {
      console.error('error: ', error);
    }
  }, []);

  const getDesks = useCallback(async () => {
    try {
      const res = await settingsApi.getDesk();
      setDeskList(
        res?.desks?.map((desk) => ({
          label: desk?.name,
          value: desk?.id,
          isHidden: user?.acc?.acc_e_client_desk
            ? false
            : user?.acc?.acc_e_client_self_desk &&
              user?.desk_ids?.includes(desk?.id)
            ? false
            : true,
        }))
      );
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  useEffect(() => {
    getDesks();
    getTeams();
    getLabels();
  }, [])

  const handleDetailsFinish = useCallback((data, tempData) => {
    setDetails(data);
    setTempDetail(tempData);
    setActiveStep((prevState) => prevState + 1);
  }, []);

  const handleLabelsFinish = useCallback((data) => {
    setLabels(data);
    setActiveStep((prevState) => prevState + 1);
  }, []);

  const handleTeamMembersFinish = (data) => {
    setTeam(data);
    setActiveStep((prevState) => prevState + 1);
  }

  const handleDescriptionFinish = useCallback(
    async (data) => {
      setIsPending(true);
      const request = {
        assign_team_ids: [parseInt(team?.team_id)],
      };
      if (team?.desk_id) {
        request["desk_id"] = team?.desk_id;
        request["assign_agent_ids"] = [team?.agent_id];
      } else {
        request["desk_id"] = user?.desk_ids?.[0];
        request["assign_agent_ids"] = [user?.id];
      }
      const requestData = {
        emails: details.emails,
        phone_numbers: details.phoneNumbers,
        labels: labels?.label_ids?.map((item) => item?.toString()),
        note: data,
        ...request
      };
      if (details?.first_name) {
        requestData["first_name"] = details.first_name;
      }
      if (details?.last_name) {
        requestData["last_name"] = details.last_name;
      }
      try {
        await customersApi.createCustomer(requestData);
        router.push(paths.dashboard.customers.index);
        toast.success("Customer successfully created!");
      } catch (error) {
        toast.error(error?.response?.data?.message ?? error?.response?.data?.errors?.join(', ') ?? error?.message);

        console.error(error);
      }
      setIsPending(false);
    },
    [details, team, description, labels, router]
  );

  const handleBack = useCallback(() => {
    setActiveStep((prevState) => prevState - 1);
  }, []);

  const steps = useMemo(() => {
    return [
      {
        label: "Details",
        content: (
          <CustomerDetailsStep
            onBack={handleBack}
            onNext={handleDetailsFinish}
            tempDetail={tempDetail}
          />
        ),
      },
      {
        label: "Labels",
        content: (
          <CustomerLabelStep
            labels={labels}
            teamList={teamList}
            labelList={labelList}
            onGetLabels={getLabels}
            onBack={(data) => {
              setLabels(data);
              handleBack();
            }
            }
            onNext={handleLabelsFinish}
          />
        ),
      },
      {
        label: "Assignee",
        content: (
          <CustomerTeamStep
            onBack={(data) => {
              setTeam(data);
              handleBack(data);
            }}
            deskList={deskList}
            teamList={teamList}
            isPending={isPending}
            onNext={handleTeamMembersFinish}
            data={team}
          />
        ),
      },
      {
        label: "Description",
        content: (
          <CustomerDescriptionStep
            onBack={(data) => {
              setDescription(data);
              handleBack()
            }}
            onNext={handleDescriptionFinish}
            description={description}
            isPending={isPending}
          />
        ),
      },

    ];
  }, [
    handleBack,
    handleDescriptionFinish,
    handleDetailsFinish,
    handleLabelsFinish,
    handleTeamMembersFinish,
  ]);

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
