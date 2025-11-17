import { useCallback, useMemo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";

import { StatusAssigneeStep } from "./status-assignee-step";
import { StatusDescriptionStep } from "./status-description-step";
import { Iconify } from "src/components/iconify";
import { statusApi } from "src/api/lead-management/status";

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

export const LeadBulkStep = ({
  selectedLeads,
  selectAll,
  onClose,
  getStatusInfo,
  onDeSelectAll,
  agentList = [],
  teamList = [],
  brandsList = [],
  affiliateList = [],
  labelList = [],
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [assignee, setAssignee] = useState({});
  const [note, setNote] = useState("");

  const handleCreateStatus = async () => {
    try {
      const request = { ...assignee, ...note };
      if (!selectAll && selectedLeads?.length > 0) {
        request.lead_ids = selectedLeads;
      }
      if (selectAll) {
        request.select_all = selectAll;
      }
      await statusApi.createLeadsWithBulk(request);
      setTimeout(() => getStatusInfo(), 1000);
      onDeSelectAll();
      onClose();
      toast("Leads successfully created!");
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const handleAssigneeFinish = useCallback((data) => {
    setAssignee(data);
    setActiveStep((prevState) => prevState + 1);
  }, []);

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
        label: "Assignee",
        content: (
          <StatusAssigneeStep
            isBulk
            onBack={handleBack}
            onNext={handleAssigneeFinish}
            data={assignee}
            agentList={agentList}
            teams={teamList}
            brandsList={brandsList}
            affiliateList={affiliateList}
            labelList={labelList}
          />
        ),
      },
      {
        label: "Description",
        content: (
          <StatusDescriptionStep
            onBack={handleBack}
            onNext={handleNoteFinish}
          />
        ),
      },
    ];
  }, [handleBack, handleNoteFinish, handleAssigneeFinish]);

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
                  py: 1,
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
