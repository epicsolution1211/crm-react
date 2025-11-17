import { useMemo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";

import { RecordStep } from "./record-step";
import { paths } from "src/paths";
import { useRouter } from "src/hooks/use-router";
import { recordApi } from "src/api/payment_audit/record";
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

export const RecordCreate = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const createRecord = async (data) => {
    setIsPending(true);
    try {
      await recordApi.createRecord(data);
      toast("Record successfully created!");
      setTimeout(() => router.push(paths.dashboard.paymentAudit.record.index), 1000)
    } catch (error) {
      toast(error?.response?.data?.message ?? error?.message)
    } finally {
      setIsPending(false)
    }
  };

  const handleHeaderStep = (data) => {
    createRecord(data);
  }

  const steps = useMemo(() => {
    return [
      {
        label: "Record",
        content: (
          <RecordStep
            isPending={isPending}
            onNext={handleHeaderStep}
          />
        ),
      },
    ];
  }, [
    handleHeaderStep,
  ]);

  return (
    <Stepper
      activeStep={0}
      orientation="vertical"
      sx={{
        "& .MuiStepConnector-line": {
          borderLeftColor: "divider",
          borderLeftWidth: 2,
          ml: 1,
        },
      }}
    >
      {steps.map((step) => {
        const isCurrentStep = true;
        return (
          <Step key={step.label}>
            <StepLabel StepIconComponent={StepIcon}>
              <Typography sx={{ ml: 2 }}
                variant="overline">
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
