import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
/* eslint-disable no-unused-vars */
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

import { FileStep } from "./add-bulk-users/file-step";
import { FileHeadersStep } from "./add-bulk-users/file-headers-step";
import { TeamStep } from "./add-bulk-users/team-step";
import { generateRandomPassword } from "src/utils/generate-password";
import { ResultStep } from "./add-bulk-users/result-step";
import { settingsApi } from "src/api/settings";
import { defaultTemplate } from "./constants";
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

export const SettingsBulkMembers = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadFile, setUploadFile] = useState({});
  const [headerList, setHeaderList] = useState([]);
  const [headerValue, setHeaderValue] = useState({});
  const [importData, setImportData] = useState([]);
  const [roleTemplates, setRoleTemplates] = useState([]);

  const handleClose = () => {
    onClose();
    setImportData([]);
    setHeaderList([]);
    setHeaderValue({});
    setUploadFile({});
    setActiveStep(0);
  }

  const handleBack = () => {
    setActiveStep((prevState) => prevState - 1);
  };

  const handleFileStep = (data) => {
    setImportData(data?.values);
    setHeaderList(data?.headers);
    setActiveStep((prevState) => prevState + 1);
  };

  const handleHeaderStep = (data) => {
    setHeaderValue({
      email: data?.email?.trim(),
      first_name: data?.first_name?.trim(),
      last_name: data?.last_name?.trim(),
      password: data?.password?.trim(),
    });
    setActiveStep((prevState) => prevState + 1);
  };

  const getRoleTemplates = async () => {
    try {
      const { temp_rolls: templates } = await settingsApi.getRoles();
      setRoleTemplates(templates);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleTeamStep = async (teamData = {}) => {
    const normalizeData = importData?.map((item) => {
      return {
        email: item[headerValue?.email],
        first_name: item[headerValue?.first_name],
        last_name: item[headerValue?.last_name],
        password: item[headerValue?.password]
        ? item[headerValue?.password]
        : generateRandomPassword(),
        status: "pending",
      };
    });
    setImportData(normalizeData);
    setActiveStep((prev) => prev + 1);

    for (let item of normalizeData) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
      await inviteUser(item, teamData);
    }
  };

  const inviteUser = async (item, teamData) => {
    try {
      const template = roleTemplates?.find((t) => t?.id === teamData?.role);

      const { account } = await settingsApi.inviteMember({
        email: item?.email,
        password: item?.password,
        first_name: item?.first_name,
        last_name: item?.last_name,
      });

      if (template) {
        setTimeout(async () => {
          await settingsApi.updateMember(account?.id, {
            role_temp_id: teamData?.role,
            acc: template?.acc,
            account_id: account?.id,
          });
        }, 1000);
      } else {
        setTimeout(async () => {
          await settingsApi.updateMember(account?.id, {
            acc: defaultTemplate,
            account_id: account?.id,
          });
        }, 2000);
      }

      if (teamData?.data?.desk_ids) {
        setTimeout(async () => {
          await settingsApi.updateMember(account?.id, {
            desk_ids: teamData?.data?.desk_ids,
            account_id: account?.id,
          });
        }, 3000);
      }

      if (teamData?.data?.team_ids) {
        teamData?.data?.team_ids?.forEach(async (teamId) => {
          await settingsApi.updateSkillTeam({
            id: teamId,
            account_ids: [account?.id],
          });
        });
      }

      setImportData((prev) =>
        prev?.map((i) => ({
          ...i,
          status: i?.email === item?.email ? "done" : i?.status,
        }))
      );

    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
      // Change status to error
      setImportData((prev) =>
        prev?.map((i) => ({
          ...i,
          status: i?.email === item?.email ? "error" : i?.status,
          error: error?.response?.data?.message,
        }))
      );
    }
  };

  const steps = useMemo(() => {
    return [
      {
        label: "Import file",
        content: (
          <FileStep
            onBack={handleBack}
            onNext={handleFileStep}
            headerList={headerList}
            isCompleted={headerList?.length}
            setFile={(val) => setUploadFile({ file: val })}
          />
        ),
      },
      {
        label: "File Headers",
        content: (
          <FileHeadersStep
            onBack={handleBack}
            onNext={handleHeaderStep}
            headerList={headerList}
            headerValue={headerValue}
          />
        ),
      },
      {
        label: "Team, Role and Desk",
        content: <TeamStep onBack={handleBack} onNext={handleTeamStep} />,
      },
      {
        label: "Result",
        content: <ResultStep importData={importData} onClose={handleClose} onBack={handleBack}  />,
      },
    ];
  }, [
    handleFileStep,
    handleHeaderStep,
    handleBack,
    handleTeamStep,
    importData,
  ]);

  useEffect(() => {
    getRoleTemplates();
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: 750,
        },
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={5} px={8} py={5}>
          <Typography variant="h5">Add Bulk Users</Typography>

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
                    }}
                  >
                    {step.content}
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>
        </Stack>
      </Container>
    </Dialog>
  );
};
