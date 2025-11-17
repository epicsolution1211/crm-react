import { useMemo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";

import { FileHeadersStep } from "./file-headers-step";
import { FileStep } from "./file-step";
import { dataEntryApi } from "src/api/payment_audit/data-entry";
import { paths } from "src/paths";
import { useRouter } from "src/hooks/use-router";
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

export const DataEntryCreate = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [headerList, setHeaderList] = useState([]);

  const [uploadFile, setUploadFile] = useState({});
  const [headerValue, setHeaderValue] = useState({});

  const [isPending, setIsPending] = useState(false);

  const createInjection = async (data) => {
    setIsPending(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile?.file);
      const request = { ...data }
      Object.keys(request)?.forEach((item) => { formData.append(item, request[item]) })
      await dataEntryApi.createDataEntry(formData);
      toast("Data Entry successfully created!");
      setTimeout(() => router.push(paths.dashboard.paymentAudit.dataEntry.index), 1000)
    } catch (error) {
      console.error('error: ', error);
    } finally {
      setIsPending(false)
    }
  };

  const handleBack = () => {
    setActiveStep((prevState) => prevState - 1);
  };

  const handleFileStep = (data) => {
    setHeaderList(data?.headers);
    setActiveStep((prevState) => prevState + 1);
  };

  const handleHeaderStep = (data) => {
    setHeaderValue(data);
    createInjection(data);
  }

  const steps = useMemo(() => {
    return [
      {
        label: "Detail",
        content: (
          <FileStep
            onBack={handleBack}
            onNext={handleFileStep}
            headerList={headerList}
            setFile={(val) => setUploadFile({ file: val })}
          />
        ),
      },
      {
        label: "File Headers",
        content: (
          <FileHeadersStep
            onBack={(data) => {
              setHeaderValue(data);
              handleBack();
            }}
            onNext={handleHeaderStep}
            headerList={headerList}
            headerValue={headerValue}
            isPending={isPending}
          />
        ),
      },
    ];
  }, [
    handleFileStep,
    handleHeaderStep,
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
