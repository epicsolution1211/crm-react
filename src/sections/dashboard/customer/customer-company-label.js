import { useCallback, useEffect, useState, useMemo } from "react";
import Stack from "@mui/material/Stack";
import { toast } from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import MultiSelectMenu from "src/components/customize/multi-select-menu";
import { ChipSet } from "src/components/customize/chipset";
import { CompanyDialog } from "src/components/company-dialog";
import { CustomerOtpPhones } from "./customer-otp-phones";
import { LabelsDialog } from "src/components/labels-dialog";
import { SelectMenu } from "src/components/customize/select-menu";
import { brandsApi } from "src/api/lead-management/brand";
import { customersApi } from "src/api/customers";
import { useAuth } from "src/hooks/use-auth";
import { useDebounce } from "src/hooks/use-debounce";
import { useMounted } from "src/hooks/use-mounted";

const useCompanies = () => {
  const isMounted = useMounted();
  const [companies, setCompanies] = useState([]);

  const handleCompaniesGet = useCallback(async () => {
    const res = await customersApi.getClientCompanies();
    const companies = res?.companies?.map((item) => ({
      value: item?.id,
      label: item?.name,
    }));
    setCompanies(companies);
  }, [isMounted]);

  useEffect(() => {
    handleCompaniesGet();
  }, []);

  return { companies, handleCompaniesGet };
};

const useLabels = () => {
  const [labels, setLabels] = useState([]);
  const [labelList, setLabelList] = useState([]);

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

  useEffect(() => {
    getLabels();
  }, []);

  return { labels, labelList, getLabels };
};

const useInternalBrands = () => {
  const [internalBrandsList, setInternalBrandsList] = useState([]);

  const getBrands = async () => {
    try {
      const res = await brandsApi.getInternalBrands();
      const brandsInfo = res?.internal_brands?.map((brand) => ({
        label: brand?.company_name,
        value: brand?.id,
      }));
      setInternalBrandsList([
        {
          label: "Don't send",
          value: 0,
        },
        ...brandsInfo,
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  return internalBrandsList;
};

function arraysAreEqual(arr1, arr2) {
  // Check if the arrays are of different lengths
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Sort the arrays
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  // Check if each element in the sorted arrays matches
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}

export const CompanyLabelPanel = ({ onGetClient, customer, teams }) => {
  const { register, control, setValue } = useForm();
  const { user } = useAuth();

  const { companies, handleCompaniesGet } = useCompanies();
  const { labels, labelList, getLabels } = useLabels();
  const internalBrandsList = useInternalBrands();
  const selectedLabels = useWatch({ control, name: "label_ids" });
  const companyId = useWatch({ control, name: "company_id" });
  const pinCode = useWatch({ control, name: "pin_code" });
  const internalBrandId = useWatch({ control, name: "internal_brand_id" });
  const pinCodeDebounced = useDebounce(pinCode, 500);

  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [openLabelModal, setOpenLabelModal] = useState();
  const [openPhonesModal, setOpenPhonesModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [pinHidden, setPinHidden] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({});

  useEffect(() => {
    if (user?.acc?.acc_h_client_pin) {
      setPinHidden(true);
    }
  }, [user]);

  useEffect(() => {
    if (customer) {
      setCustomerInfo({
        ...customer,
        client: {
          ...customer?.client,
          internal_brand_id: customer?.client?.internal_brand_id === null ? 0 : customer?.client?.internal_brand_id,
        }
      });
    }
  }, [customer]);

  const currentChip = useMemo(() => {
    const newChips = selectedLabels?.map((selected) => {
      const chip = labelList?.find((item) => selected === item?.value);
      return {
        displayValue: chip?.label,
        value: selected,
        label: "Label",
      };
    });
    return newChips;
  }, [selectedLabels, labelList]);

  useEffect(() => {
    if (companyId && customerInfo && companyId !== customerInfo?.client?.client_company_id) {
      onSubmit({ company_id: companyId });
    }
  }, [companyId]);

  useEffect(() => {
    if (pinCodeDebounced && customerInfo && pinCodeDebounced !== customerInfo?.client?.pin_code) {
      onSubmit({ pin_code: pinCodeDebounced });
    }
  }, [pinCodeDebounced]);

  useEffect(() => {
    if (internalBrandId !== undefined && customerInfo && internalBrandId !== null && internalBrandId !== customerInfo?.client?.internal_brand_id) {
      onSubmit({ internal_brand_id: internalBrandId });
    }
  }, [internalBrandId]);

  useEffect(() => {
    if (customerInfo?.client && customerInfo && selectedLabels && !arraysAreEqual(selectedLabels, customerInfo?.client_labels?.map((item) => item?.id))) {
      onSubmit({ label_ids: selectedLabels });
    }
  }, [selectedLabels]);


  const handleRemoveChip = (value) => {
    const newStatus = [...selectedLabels].filter((item) => item !== value);
    setValue("label_ids", newStatus);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await customersApi.updateCustomer({ id: customer?.client?.id, ...data });
      setIsLoading(false);
      setTimeout(() => {
        onGetClient();
      }, 1500);
      toast.success("Customer successfully updated!");
    } catch (error) {
      setIsLoading(false);
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (customerInfo) {
      setValue("pin_code", customerInfo?.client?.pin_code);
      setValue("company_id", customerInfo?.client?.client_company_id);
      if (customerInfo?.client_labels) {
        setValue(
          "label_ids",
          customerInfo?.client_labels?.map((item) => item?.id)
        );
      }
      setValue("internal_brand_id", customerInfo?.client?.internal_brand_id);
    }
  }, [customerInfo]);

  return (
    <>
      <form>
        <Card>
          <CardHeader title="Company and labels" />
          <CardContent sx={{ pt: 2, pb: 1 }}>
            {user?.acc?.acc_v_client_company ? (
              <Stack
                direction="row"
                sx={{ width: 1 }}
                gap={1}
                alignItems="center"
              >
                <Box direction="row" sx={{ width: 1 }}>
                  <SelectMenu
                    control={control}
                    label="Select a Company"
                    name="company_id"
                    list={companies}
                    disabled={!user?.acc?.acc_e_client_company}
                  />
                </Box>
                <IconButton
                  onClick={() => setCompanyModalOpen(true)}
                  sx={{ '&:hover': { color: 'primary.main' }, color:'text.secondary', mt: 4}}
                >
                  <Tooltip title="Edit Company">
                    <Iconify icon="carbon:settings-edit" />
                  </Tooltip>
                </IconButton>
              </Stack>
            ) : null}

            {user?.acc?.acc_v_client_pin? (
              <Stack spacing={2} direction="column" sx={{ mt: 2 }}>
                <Typography variant="h7">Pin Code</Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <TextField
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    {...register("pin_code")}
                    label="Pin code"
                    disabled={!user?.acc?.acc_e_client_pin}
                    type={pinHidden ? "password" : "text"}
                    InputProps={{
                      endAdornment: user?.acc?.acc_h_client_pin? (
                        <IconButton 
                          onClick={() => {
                            setPinHidden(!pinHidden);
                          }}
                          sx={{ '&:hover': { color: 'primary.main' }, color: 'text.secondary' }}
                        >
                          <Iconify
                            icon={!pinHidden ? 'fluent:eye-32-filled' : 'fluent:eye-off-16-filled'}
                          />
                        </IconButton>
                      ) : null
                    }}
                  />
                  {user?.acc?.acc_v_client_otp === undefined ||
                    user?.acc?.acc_v_client_otp ? (
                    <Button
                      variant="contained"
                      sx={{ width: "160px" }}
                      onClick={() => setOpenPhonesModal(true)}
                      disabled={customer?.phone_numbers?.length === 0 || !customer?.client?.pin_code}
                    >
                      Send OTP
                    </Button>
                  ) : null}
                </Stack>
              </Stack>
            ) : null}
            {user?.acc?.acc_v_client_label ? (
              <>
                <Stack spacing={2} direction="column" sx={{ mt: 2 }}>
                  <MultiSelectMenu
                    control={control}
                    label="Select Labels"
                    name="label_ids"
                    isLabel={user?.acc?.acc_e_client_label_manage}
                    openModal={() => setOpenLabelModal(true)}
                    list={labelList}
                    disabled={!user?.acc?.acc_e_client_label}
                  />
                </Stack>
                {currentChip?.length > 0 && (
                  <Stack
                    alignItems="center"
                    direction="row"
                    flexWrap="wrap"
                    gap={1}
                    sx={{ px: 1, mt: 2 }}
                  >
                    <ChipSet
                      chips={currentChip}
                      handleRemoveChip={
                        user?.acc?.acc_e_client_label && handleRemoveChip
                      }
                    />
                  </Stack>
                )}
              </>
            ) : null}

            {user?.acc?.acc_v_client_internal_brand === undefined ||
              user?.acc?.acc_v_client_internal_brand ? (
              <Stack spacing={2} direction="column" sx={{ mt: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <SelectMenu
                    label="Internal Brand"
                    control={control}
                    name="internal_brand_id"
                    list={internalBrandsList}
                    disabled={
                      !user?.acc?.acc_e_client_internal_brand &&
                      user?.acc?.acc_e_client_internal_brand !== undefined
                    }
                  />
                </Stack>
              </Stack>
            ) : null}
          </CardContent>
        </Card>
      </form>

      {openLabelModal && ( 
        <LabelsDialog
          title="Edit Label"
          labels={labels}
          teams={teams}
          open={openLabelModal}
          onClose={() => setOpenLabelModal(false)}
          getLabelList={getLabels}
        />
      )}

      {companyModalOpen && (
        <CompanyDialog
          open={companyModalOpen}
          onClose={() => setCompanyModalOpen(false)}
          handleChange={() => handleCompaniesGet()}
          onGetCompanies={handleCompaniesGet}
        />
      )}

      {openPhonesModal && (
        <CustomerOtpPhones
          open={openPhonesModal}
          onClose={() => setOpenPhonesModal(false)}
          numbers={customer?.phone_numbers}
          customerId={customer?.client?.id}
        />
      )}
    </>
  );
};