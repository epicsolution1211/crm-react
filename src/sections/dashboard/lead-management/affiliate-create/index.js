import { useCallback, useMemo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast"

import { AffiliateAccessStep } from "./affiliate-access-step";
import { AffiliateDescriptionStep } from "./affiliate-description-step";
import { AffiliateDetailsStep } from "./affiliate-details-step";
import { Iconify } from "src/components/iconify";
import { affiliateApi } from "src/api/lead-management/affiliate";
import { paths } from "src/paths";
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

export const AffiliateCreate = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [affiliateInfo, setAffiliatesInfo] = useState({});

  const handleCreateAffiliate = async (data) => {
    try {
      await affiliateApi.createAffiliate(data);
      toast("Affiliate successfully created!");
      setTimeout(() => router.push(paths.dashboard.lead.affiliate.index), 1000)
    } catch (error) {
      console.error('error: ', error);
    }
  }

  const handleDetailsFinish = (data) => {
    setAffiliatesInfo(data);
    setActiveStep((prevState) => prevState + 1);
  };

  const handleAccessFinish = (data) => {
    setAffiliatesInfo({ ...affiliateInfo, ...data });
    setActiveStep((prevState) => prevState + 1);
  };

  const handleDescriptionFinish = (data) => {
    handleCreateAffiliate({ ...affiliateInfo, ...data });
  };

  const handleBack = useCallback(() => {
    setActiveStep((prevState) => prevState - 1);
  }, []);

  const steps = useMemo(() => {
    return [
      {
        label: "Details",
        content: (
          <AffiliateDetailsStep
            onBack={handleBack}
            onNext={handleDetailsFinish}
          />
        ),
      },
      {
        label: "Access",
        content: (
          <AffiliateAccessStep
            onBack={handleBack}
            onNext={handleAccessFinish} />
        ),
      },
      {
        label: "Description",
        content: (
          <AffiliateDescriptionStep onBack={handleBack}
            onNext={handleDescriptionFinish} />
        ),
      }
    ];
  }, [
    handleBack,
    handleDetailsFinish,
    handleAccessFinish,
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
