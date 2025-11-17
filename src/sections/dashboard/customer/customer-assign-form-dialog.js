import { useCallback, useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LoadingButton from '@mui/lab/LoadingButton';

import { Iconify } from "src/components/iconify";
import { ChipSet } from "src/components/customize/chipset";
import { Scrollbar } from "src/components/scrollbar";
import { customersApi } from "src/api/customers";
import { useGetFormList } from "src/api-swr/customer";
import { isValidJSON } from "src/utils/function";
import { getAssetPath } from "src/utils/asset-path";

const useForms = () => {
  const [selectedForms, setSelectedForms] = useState([]);
  const [search, setSearch] = useState("");
  const [formList, setFormList] = useState([]);

  const { formList: forms } = useGetFormList();

  useEffect(() => {
    if(search?.length>0 && forms?.length >0) {
      setFormList(forms?.filter((form) => (form.label?.toLowerCase()?.includes(search?.toLocaleLowerCase()))))
    } else {
      setFormList(forms??[]);
    }
  }, [search, forms])

  const handleFormsSearch = (event) => {
    setSearch(event?.target?.value || "");
  };

  const handleFormSelect = useCallback(
    (id) => {
      if (selectedForms?.includes(id)) {
        setSelectedForms(selectedForms.filter((m) => m !== id));
      } else {
        setSelectedForms(selectedForms.concat(id));
      }
    },
    [selectedForms]
  );

  return {
    forms,
    formList,
    handleFormSelect,
    handleFormsSearch,
    selectedForms,
    setSelectedForms,
  };
};

export const CustomerAssignFormDialog = ({
  open,
  onClose,
  filters,
  customFilters,
  selectAll,
  selected,
  perPage,
  onDeselectAll = () => {},
  customerId,
  query,
}) => {
  const { forms, formList, selectedForms, setSelectedForms, handleFormSelect, handleFormsSearch } = useForms();
  const { i18n } = useTranslation();
  const currentLang = i18n?.resolvedLanguage;

  const [isLoading, setIsLoading] = useState(false);

  const formChip = useMemo(
    () =>
      selectedForms?.map((value) => {
        const currentFormLabel = formList?.find((form) => form.value == value)?.label ?? "";
      
        let formNameInfo = {};

        if (isValidJSON(currentFormLabel)) {
          const parsedForm = JSON.parse(currentFormLabel);
          formNameInfo = {...parsedForm};
        } else {
          formNameInfo.en = currentFormLabel;
        }
        return ({
          displayValue: formNameInfo?.[currentLang]?.length > 0 ? formNameInfo?.[currentLang] : formNameInfo?.en ?? "",
          value: value,
        });
      }),
    [selectedForms, formList, currentLang]
  );

  const handleAssignForms = async () => {
    try {
      setIsLoading(true);
      if (selectedForms.length) {
        const request = {
          form_ids: selectedForms
        };

        const params = {
          ...filters,
          q: query?.length > 0 ? query : null,
        };
        if (perPage && perPage > 0) {
          params["per_page"] = perPage;
        }
        if (selectAll) {
          params["select_all"] = true;
        } else {
          params["client_ids"] = selected;
        }

        if (selectAll) {
          params["select_all"] = true;
        } else if (customerId) {
          params["client_ids"] = [customerId];
        } else {
          params["client_ids"] = selected;
        }

        if (filters?.online?.length === 1 && filters?.online[0] === "true") {
          params.online = "true";
        }
        if (filters?.online?.length === 1 && filters?.online[0] === "false") {
          params.online = "false";
        }

        delete params?.non_ids;
        delete params?.ids;
        delete params?.perPage;
        delete params?.currentPage;

        const customFiltersData = customFilters
          ?.filter(
            (filter) =>
              filter?.filter &&
              (
                (filter?.filter?.field_type === "text" && filter?.filter?.query) ||
                (filter?.filter?.field_type === "multi_choice_radio" && (filter?.filter?.non_query?.length > 0 || filter?.filter?.query?.length > 0)) ||
                (filter?.filter?.field_type === "multi_choice" && (filter?.filter?.non_query?.length > 0 || filter?.filter?.query?.length > 0)) ||
                (filter?.filter?.field_type === "boolean" && filter?.filter?.query) ||
                (filter?.filter?.field_type === "number" && (filter?.filter?.query?.gt || filter?.filter?.query?.lt))
              )
          )
          ?.map((filter) => filter?.filter);
        params["custom_field"] = customFiltersData;

        await customersApi.assignCustomerForms(request, params);

        onDeselectAll();

        toast.success("Form assigned successfully!");
      } else {
        setIsLoading(false);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("error", error);
      toast.error(error?.response?.data?.message);
    }
    onClose();
    setIsLoading(false);
  };

  useEffect(() => {
    setSelectedForms([]);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm" sx={{ p: 3 }}>
        <Stack direction="column" spacing={3}>
          <Stack pt={2} direction="column" justifyContent="center" alignItems="center" gap={2}>
            <Typography 
              variant="h5" 
              sx={{
                fontWeight: 600,
                width: 'fit-content',
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100%',
                  height: 2,
                  bgcolor: 'primary.main'
                }
              }}
            >
              Assign Form
            </Typography>
            <Stack direction='row' alignItems='center' gap={1}>
              <Iconify icon="tdesign:info-circle" width={20} sx={{ color: "primary.main" }}/>
              <Typography variant="subtitle1" color="text.secondary">Client will be required to submit this form on login</Typography>
            </Stack>
          </Stack>

          <Stack spacing={3}>
            <Stack>
              <Box component="form" sx={{ flexGrow: 1 }}>
                <OutlinedInput
                  defaultValue=""
                  fullWidth
                  onChange={handleFormsSearch}
                  placeholder="Search by form name"
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify icon="lucide:search" color="text.secondary" width={24} />
                    </InputAdornment>
                  }
                  sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 1.5,
                    '&:hover': {
                      '& > fieldset': {
                        borderColor: 'primary.main',
                      }
                    }
                  }}
                />
              </Box>
              {forms?.length>0 ?
                <Scrollbar 
                  sx={{ 
                    pt: 2,
                    maxHeight: 220,
                    minHeight: 160, 
                    width: 1,
                    '& .simplebar-scrollbar:before': {
                      backgroundColor: 'primary.main'
                    }
                  }}
                >
                  <Table>
                    {formList?.map((form) => {
                        let formNameInfo = {};
            
                        if (isValidJSON(form?.label)) {
                          const parsedForm = JSON.parse(form?.label);
                          formNameInfo = {...parsedForm};
                        } else {
                          formNameInfo.en = form?.label;
                        }
                        return (
                        <TableRow
                          hover
                          selected={selectedForms?.includes(form?.value)}
                          key={form?.value}
                          sx={{
                            cursor: "pointer",
                            py: 2,
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                            '&.Mui-selected': {
                              backgroundColor: 'primary.lighter',
                              '&:hover': {
                                backgroundColor: 'primary.lighter',
                              }
                            }
                          }}
                          onClick={() => handleFormSelect(form?.value)}
                        >
                          <TableCell sx={{ border: 0 }}>
                            <Stack
                              alignItems="center"
                              direction="row"
                              spacing={1}
                            >
                              <Iconify icon="mdi:form-outline" width={24} />
                              <div>
                                <Typography variant="subtitle2">
                                  {formNameInfo?.[currentLang]?.length > 0 ? formNameInfo?.[currentLang] : formNameInfo?.en ?? ""}
                                </Typography>
                              </div>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </Table>
                </Scrollbar>
              :
                <Stack py={2} direction='column' justifyContent='center' alignItems='center'>
                  <Box
                    component="img"
                    src={getAssetPath("/assets/errors/error-404.png")}
                    sx={{
                      p: 4,
                      height: "auto",
                      width: 150,
                    }}
                  />
                  <Typography>There is no form</Typography>
                </Stack>
              }
              <Divider sx={{ mx: 1, mt: 1 }}/>
              {selectedForms?.length ? (
                <Stack
                  alignItems="center"
                  direction="row"
                  flexWrap="wrap"
                  gap={1}
                  sx={{ py: 2, px: 1 }}
                >
                  <ChipSet
                    chips={formChip}
                    handleRemoveChip={(value) =>
                      handleFormSelect(value)
                    }
                  />
                </Stack>
              ) : null}
              <Stack direction='row' justifyContent='end' gap={2} py={2}>
                <Button 
                  variant="outlined"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <LoadingButton
                  loading={isLoading}
                  variant="contained"
                  disabled={selectedForms?.length==0}
                  onClick={()=> handleAssignForms()}
                >
                  Assign
                </LoadingButton>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Dialog>
  );
};
