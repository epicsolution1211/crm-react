import { useMemo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast"

import { BrandDescriptionStep } from "./brands-description-step";
import { BrandsDetailsStep } from "./brands-details-step";
import { Iconify } from "src/components/iconify";
import { brandsApi } from "src/api/lead-management/brand";
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

export const BrandsCreate = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [brandInfo, setBrandInfo] = useState({});

  const createBrand = async (data) => {
    try {
      await brandsApi.createBrand(data);
      toast("Brand successfully created!");
      setTimeout(() => router.push(paths.dashboard.lead.brands.index), 1000)
    } catch (error) {
      console.error('error: ', error);
    }
  }

  const handleBack = () => {
    setActiveStep((prevState) => prevState - 1);
  };

  const handleDetailsFinish = (data) => {
    setBrandInfo((prev) => ({ ...prev, ...data }))
    setActiveStep((prevState) => prevState + 1);
  };

  const handleDescriptionFinish = (data) => {
    createBrand({ ...brandInfo, ...data })
  };

  const steps = useMemo(() => {
    return [
      {
        label: "Details",
        content: (
          <BrandsDetailsStep
            onBack={handleBack}
            onNext={handleDetailsFinish}
          />
        ),
      },
      {
        label: "Description",
        content: (
          <BrandDescriptionStep onBack={handleBack}
            onNext={handleDescriptionFinish} />
        ),
      }
    ];
  }, [
    handleBack,
    handleDetailsFinish,
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
