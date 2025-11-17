import { useEffect, useMemo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";

import { AffiliateStep } from "./affiliate-step";
import { BrandStep } from "./brand-step";
import { DescriptionStep } from "./description-step";
import { FileHeadersStep } from "./file-headers-step";
import { FileStep } from "./file-step";
import { LabelStep } from "./label-step";
import { TeamAgentStep } from "./team-agent-step";
import { brandsApi } from "src/api/lead-management/brand";
import { injectionApi } from "src/api/lead-management/list-injection";
import { paths } from "src/paths";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { statusApi } from "src/api/lead-management/status";
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

export const InjectionCreate = () => {
  const router = useRouter();
  const { user, company } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [headerList, setHeaderList] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [customLeadFields, setCustomLeadFields] = useState([]);

  const [uploadFile, setUploadFile] = useState({});
  const [dripping, setDripping] = useState();
  const [headerValue, setHeaderValue] = useState({});
  const [customFieldValue, setCustomFieldValue] = useState({});
  const [brandInfo, setBrandInfo] = useState({});
  const [affiliateInfo, setAffiliateInfo] = useState({});
  const [labelsInfo, setLabelsInfo] = useState({});
  const [teamAgentInfo, setTeamAgentInfo] = useState({});
  const [descriptionInfo, setDescriptionInfo] = useState({});

  const [isPending, setIsPending] = useState(false);

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
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const getCustomLeadFields = async () => {
    try {
      const res = await statusApi.getLeadCustomFields();
      setCustomLeadFields(res?.lead_fields);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getBrands();
    getCustomLeadFields();
  }, []);

  const createInjection = async (data) => {
    setIsPending(true);
    try {
      const formData = new FormData();

      formData.append("file", uploadFile?.file);
      let request = {
        ...dripping,
        ...headerValue,
        ...brandInfo,
        ...affiliateInfo,
      };
      if(data?.description) {
        request = { ...request, ...data }
      }
      if (teamAgentInfo?.desk_id) {
        request["desk_id"] = teamAgentInfo.desk_id;
      }
      if (teamAgentInfo?.agent_id) {
        request["agent_id"] = teamAgentInfo.agent_id;
      }
      if (teamAgentInfo?.team_id) {
        request["team_id"] = teamAgentInfo.team_id;
      }
      Object.keys(request)?.forEach((item) => {
        formData.append(item, request[item]);
      });
      labelsInfo?.label_ids?.forEach((item) => {
        formData.append("label_ids[]", item);
      });
      Object.keys(customFieldValue)?.forEach((item) => {
        formData.append(`custom_headers[${item}]`, customFieldValue[item]);
      });
      await injectionApi.createInjection(formData);
      toast("Injection successfully created!");

      setTimeout(router.push(paths.dashboard.lead.injection.index), 500);

    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsPending(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevState) => prevState - 1);
  };

  const handleFileStep = (data) => {
    const dripping = {
      reject_email: data?.data?.reject_email,
      reject_phone: data?.data?.reject_phone,
      redo_custom_fields: data?.data?.redo_custom_fields,
      internal_brand_id: data?.data?.internal_brand_id,
      note: data?.data?.note,
    };
    if (data?.data?.country_name) {
      dripping["country_name"] = data?.data?.country_name;
    }

    setHeaderList(data?.headers);
    setDripping(dripping);
    setActiveStep((prevState) => prevState + 1);
  };

  function extractIDFromString(inputString) {
    // Split the input string by the underscore character "_"
    const parts = inputString.split("_");

    // Check if there are at least two parts (e.g., "1" and "custom_field")
    if (parts.length >= 2) {
      // Check if the second part (case-sensitive) is exactly "custom_field"
      if (parts[1].toLowerCase() === "customfield") {
        // Parse the first part as an integer and return it
        return parts[0];
      }
    }

    // Return a default value or handle the case where there's no valid ID
    return null; // You can choose an appropriate default value or error handling here
  }

  const handleHeaderStep = (data) => {
    const {
      campaign_header,
      deposit_header,
      description_header,
      email_header,
      first_name_header,
      ftd_amount_header,
      ftd_date_header,
      ip_address_header,
      last_name_header,
      phone_header,
      registration_date_header,
      brand_name_header,
      ...rest
    } = data;
    const customFields = {};
    setHeaderValue({
      campaign_header: campaign_header ? campaign_header.trim() : '',
      deposit_header: deposit_header ? deposit_header?.trim() : '',
      description_header: description_header ? description_header?.trim() : '',
      email_header: email_header?.trim(),
      first_name_header: first_name_header ? first_name_header?.trim() : '',
      ftd_amount_header: ftd_amount_header ? ftd_amount_header?.trim() : '',
      ftd_date_header: ftd_date_header ? ftd_date_header?.trim() : '',
      ip_address_header: ip_address_header ? ip_address_header?.trim() : '',
      last_name_header: last_name_header ? last_name_header?.trim() : '',
      phone_header: phone_header ? phone_header?.trim() : '',
      registration_date_header: registration_date_header ? registration_date_header?.trim() : '',
      brand_name_header: brand_name_header ? brand_name_header?.trim() : '',
      ...rest,
    });
    for (let [key, value] of Object.entries(rest)) {
      const id = extractIDFromString(key);
      if (value) {
        customFields[id] = value?.trim();
      }
    }

    setCustomFieldValue(customFields);
    setActiveStep((prevState) => prevState + 1);
  };

  const handleBrandFinish = (data) => {
    setBrandInfo((prev) => ({ ...prev, ...data }));
    setActiveStep((prevState) => prevState + 1);
  };

  const handleAffiliateFinish = (data) => {
    setAffiliateInfo((prev) => ({ ...prev, ...data }));
    setActiveStep((prevState) => prevState + 1);
  };

  const handleLabelFinish = (data) => {
    setLabelsInfo((prev) => ({ ...prev, ...data }));
    setActiveStep((prevState) => prevState + 1);
  };

  const handleTeamAgentFinish = (data) => {
    if (!data.agent_id) {
      delete data.agent_id;
    }
    setTeamAgentInfo((prev) => ({ ...prev, ...data }));
    setActiveStep((prevState) => prevState + 1);
  };

  const handleDescriptionFinish = (data) => {
    createInjection(data);
  };

  const steps = useMemo(() => {
    return [
      {
        label: "Detail",
        content: (
          <FileStep
            onBack={handleBack}
            onNext={handleFileStep}
            formData={dripping}
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
            customLeadFields={customLeadFields}
          />
        ),
      },
      {
        label: "Brand",
        content: (
          <BrandStep
            onBack={handleBack}
            onNext={handleBrandFinish}
            brand={brandInfo}
          />
        ),
      },
      {
        label: "Affiliate",
        content: (
          <AffiliateStep
            onBack={handleBack}
            onNext={handleAffiliateFinish}
            affiliate={affiliateInfo}
          />
        ),
      },
      {
        label: "Labels",
        content: (
          <LabelStep
            onBack={handleBack}
            onNext={handleLabelFinish}
            labels={labelsInfo}
          />
        ),
      },
      {
        label: "Team and Agent",
        content: (
          <TeamAgentStep
            onBack={handleBack}
            onNext={handleTeamAgentFinish}
            teamAgentInfo={teamAgentInfo}
          />
        ),
      },
      {
        label: "Description",
        content: (
          <DescriptionStep
            onBack={(data) => {
              setDescriptionInfo(data);
              handleBack(data);
            }}
            data={descriptionInfo}
            onNext={handleDescriptionFinish}
            isPending={isPending}
          />
        ),
      },
    ];
  }, [
    handleFileStep,
    handleHeaderStep,
    handleLabelFinish,
    handleTeamAgentFinish,
    handleDescriptionFinish,
    handleBack,
    handleBrandFinish,
    handleAffiliateFinish,
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
      {steps.map((step) => {
        const brand = brandsList?.find((b) => b?.value == brandInfo?.brand_id);

        if (step?.label === "Team and Agent" && brand?.default) {
          return null;
        }

        if (step?.label === "Brand" && !user?.aff_acc_brands) {
          return null;
        }

        if (step?.label === "Brand" && company?.list_filtering) {
          return null;
        }

        if (step?.label === "Team and Agent" && company?.list_filtering) {
          return null;
        }

        if (step?.label === "Affiliate" && company?.list_filtering) {
          return null;
        }

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
  );
};
