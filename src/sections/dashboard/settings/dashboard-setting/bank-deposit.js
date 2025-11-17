import { useEffect, useMemo, useState, useCallback } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { v4 as uuid4 } from 'uuid';
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@mui/material/Button";
import Grid from "@mui/system/Unstable_Grid/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import CustomModal from "src/components/customize/custom-modal";
import { Iconify } from "src/components/iconify";
import { DeleteModal } from "src/components/customize/delete-modal";
import { FormList } from "../forms/formlist";
import { Scrollbar } from 'src/components/scrollbar';
import { SettingList } from "../forms/settinglist";
import { SettingSetting } from "../forms/setting-setting";
import { brandsApi } from "src/api/lead-management/brand";
import { formLangList, PAYMENT_TYPES } from "src/utils/constant";
import { isValidJSON } from "src/utils/function";

export const currencyFlagMap = {
  0: 'fe:disabled',
  1: 'circle-flags:us',
  2: 'circle-flags:european-union', 
  3: 'circle-flags:uk',
  4: 'circle-flags:ca',
  5: 'circle-flags:au',
  6: 'circle-flags:ae',
  7: 'circle-flags:in'
};

export const BankDeposit = ({ brandId, brand, getBrands, isLoading = false }) => {
  const [formList, setFormList] = useState([]);
  const [initialFormList, setInitialFormList] = useState([]);

  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const availableLangList = useMemo(()=> {
    return formLangList?.filter((item)=> 
      selectedLanguages.includes(item?.code)
    );
  }, [formLangList, selectedLanguages]);

  const [selectedEditForm, setSelectedEditForm]= useState();
  const [currency, setCurrency] = useState(0);

  const [commissionPaymentType, setCommissionPaymentType] = useState('percentage');
  const [commissionAmount, setCommissionAmount] = useState(0);
  const [commissionCurrency, setCommissionCurrency] = useState(1);

  const [formActive, setFormActive] = useState(true);

  const formNameValidation = useMemo(()=> {
    const validationSchema = yup.object({
      formName_en: yup.string().required("Form name is a required field").notOneOf(formList?.filter((item)=> item?.id != selectedEditForm?.id)?.map((item)=> item?.name)??[], 'Form name is already exist.'),
    });
    return validationSchema;
  }, [formList, selectedEditForm]);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({ resolver: yupResolver(formNameValidation)});
  
  const [settingList, setSettingList] = useState([]);
  const [changedIds, setChangedIds] = useState([]);

  const [selectedForm, setSelectedForm] = useState();
  const [selectedSetting, setSelectedSetting] = useState();

  const [openChangeNameModal, setOpenChangeNameModal] = useState(false);

  const [selectedDeleteFromId, setSelectedDeleteFormId] = useState();
  const [deleteModalOpen, setDeleteModalOpen]= useState(false);

  const [saveLoading, setSaveLoading]= useState(false);

  const [selectedDuplicateForm, setSelectedDuplicateForm] = useState(null);
  const [openDuplicateModal, setOpenDuplicateModal] = useState(false);

  const duplicateFormNameValidation = useMemo(() => {
    const validationSchema = yup.object({
      duplicateFormName_en: yup.string()
        .required("Form name is a required field")
        .notOneOf(formList?.map((item) => {
          const name = isValidJSON(item?.name) ? JSON.parse(item?.name)?.en : item?.name;
          return name;
        }) ?? [], 'Form name is already exist.'),
    });
    return validationSchema;
  }, [formList]);

  const duplicateForm = useForm({ resolver: yupResolver(duplicateFormNameValidation) });

  const handleSetInputType = (val) => {
    setSelectedSetting(prev => ({
      ...prev,
      inputType: val
    }));

    if (selectedForm) {
      const updatedFormList = formList.map(form => {
        if (form.id == selectedForm) {
          return {
            ...form,
            settings:
              form.settings?.map(setting => {
                if (setting.id == selectedSetting.id) {
                  return selectedSetting;
                } else return setting;
              })
          }
        } else return form;
      });
      setFormList([...updatedFormList]);
    }
  }

  const handleSetName = (val) => {
    setSelectedSetting(prev => ({
      ...prev,
      name: val
    }));

    if (selectedForm) {
      const updatedFormList = formList.map(form => {
        if (form.id == selectedForm) {
          return {
            ...form,
            settings:
              form.settings?.map(setting => {
                if (setting.id == selectedSetting.id) {
                  return selectedSetting;
                } else return setting;
              })
          }
        } else return form;
      });
      setFormList([...updatedFormList]);
    }
  }

  const onSubmitFormName = useCallback((data) => {
    const nameTrans = {
      en: data?.formName_en,
      fr: data?.formName_fr,
      de: data?.formName_de,
      ar: data?.formName_ar,
      ru: data?.formName_ru,
      es: data?.formName_es,
      nl: data?.formName_nl,
      it: data?.formName_it,
      tr: data?.formName_tr,
    };

    const descriptionTrans = {
      en: data?.formDescription_en,
      fr: data?.formDescription_fr,
      de: data?.formDescription_de,
      ar: data?.formDescription_ar,
      ru: data?.formDescription_ru,
      es: data?.formDescription_es,
      nl: data?.formDescription_nl,
      it: data?.formDescription_it,
      tr: data?.formDescription_tr,
    };

    if(selectedEditForm) {
      setFormList(prev=> prev?.map((item)=> {
        if(item.id==selectedEditForm?.id) {
          return { 
            ...item, 
            name: JSON.stringify(nameTrans), 
            description: JSON.stringify(descriptionTrans), 
            currency: currency,
            multiLangs: JSON.stringify(selectedLanguages),
            commission : {
              payment_type: commissionPaymentType,
              amount: commissionAmount,
              currency: commissionCurrency,
            },
            is_active: formActive, 
          } 
        } else {
          return item;
        }
      }));
      setSelectedSetting(undefined);
      setSelectedForm(selectedEditForm?.id);
      setSelectedEditForm(undefined);
      setOpenChangeNameModal(false);
    } else {
      const formId = uuid4();
      setFormList([
        ...formList,
        {
          name: JSON.stringify(nameTrans),
          description: JSON.stringify(descriptionTrans), 
          is_active: formActive,
          currency: currency,
          multiLangs: JSON.stringify(selectedLanguages),
          commission: {
            payment_type: commissionPaymentType,
            amount: commissionAmount,
            currency: commissionCurrency,
          },
          id: formId,
          settings: []
        }
      ]);
      setSelectedForm(formId);
      setSelectedSetting(undefined);
      setOpenChangeNameModal(false);
    }
    reset();
  }, [
    selectedEditForm,
    currency,
    selectedLanguages,
    commissionPaymentType,
    commissionAmount,
    commissionCurrency,
    formList,
    reset,
    formActive,
    setFormList,
    setSelectedSetting,
    setSelectedForm,
    setSelectedEditForm,
    setOpenChangeNameModal
  ]);

  const handleSetFieldOptions = (val) => {
    setSelectedSetting(prev => ({
      ...prev,
      options: [...val]
    }));

    if (selectedForm) {
      const updatedFormList = formList.map(form => {
        if (form.id == selectedForm) {
          return {
            ...form,
            settings:
              form.settings?.map(setting => {
                if (setting.id == selectedSetting.id) {
                  return selectedSetting;
                } else return setting;
              })
          }
        } else return form;
      });
      setFormList([...updatedFormList]);
    }
  }

  const handleSetOptional = (val) => {
    setSelectedSetting(prev=> ({
      ...prev,
      isOptional: val,
    }))

    if (selectedForm) {
      const updatedFormList = formList.map(form => {
        if (form.id == selectedForm) {
          return {
            ...form,
            settings:
              form.settings?.map(setting => {
                if (setting.id == selectedSetting.id) {
                  return selectedSetting;
                } else return setting;
              })
          }
        } else return form;
      });
      setFormList([...updatedFormList]);
    }
  };

  const handleShowCopyButton = (val) => {
    setSelectedSetting(prev=> ({
      ...prev,
      isShowCopy: val,
    }))

    if (selectedForm) {
      const updatedFormList = formList.map(form => {
        if (form.id == selectedForm) {
          return {
            ...form,
            settings:
              form.settings?.map(setting => {
                if (setting.id == selectedSetting.id) {
                  return selectedSetting;
                } else return setting;
              })
          }
        } else return form;
      });
      setFormList([...updatedFormList]);
    }
  };

  const handleAddSetting = (questionLength) => {
    if (selectedForm) {
      const newSettingId = uuid4();
      const newQuestion = {
        id: newSettingId,
        isOptional: false,
        name: `NEW LABEL ${questionLength + 1}`,
        inputType: 1,
      };
      const updatedFormList = formList.map(form => {
        if (form.id == (selectedForm ?? newFormId)) {
          return {
            ...form,
            settings: [
              ...form.settings,
              newQuestion,
            ]
          }
        } else return form;
      });
      setFormList([...updatedFormList]);
      setSelectedSetting(newQuestion);
    }
  }

  const handleDeleteSetting = (id) => {
    if (selectedForm) {
      const updatedFormList = formList.map(form => {
        if (form?.id == selectedForm) {
          return {
            ...form,
            settings: form.settings?.filter(item => item.id !== id)
          }
        } else return form;
      });
      setFormList([...updatedFormList]);
      setSelectedSetting(undefined);
    }
  }

  const handleAddForm = () => {
    setOpenChangeNameModal(true);
    setFormActive(true);
    setCurrency(0);
    setCommissionPaymentType('percentage');
    setCommissionAmount(0);
    setCommissionCurrency(1);
    setSelectedLanguages([]);
  }

  const handleDeleteForm = async () => {
    const isNew = initialFormList?.findIndex(item => item.id == selectedDeleteFromId) == -1 ? true : false;

    if (isNew) {
      setFormList(prev => prev?.filter(item => item.id !== selectedDeleteFromId));
    } else {
      try {
        const request = {
          bank_details : JSON.stringify(formList?.filter(item => item.id !== selectedDeleteFromId))
        };
  
        await brandsApi.updateInternalBrand(brandId, request);

        toast.success('Form successfully deleted!', { position: 'top-right' })
      } catch (error) {
        toast.error('Something went wrong!', { position: 'top-right' });
        console.error('error: ', error);
      }
      setFormList(prev => prev?.filter(item => item.id !== selectedDeleteFromId));
    } 

    if(selectedDeleteFromId===selectedForm) {
      setSelectedSetting(undefined);
    }  
    
    setSelectedDeleteFormId(undefined);
    setDeleteModalOpen(false);
    
  }

  const handleSaveForm = async () => {
    setSaveLoading(true);
    try {
      const request = {
        bank_details : JSON.stringify(formList)
      };

      await brandsApi.updateInternalBrand(brandId, request);

      setTimeout(()=> getBrands(), 500);

      toast.success("form successfully saved!");
      setInitialFormList(formList);

    } catch (error) {
      toast.error('Something went wrong!', { position: 'top-right' });
    }
    setSaveLoading(false);
  }

  const saveAll = () => {
    const emptyQuestion= formList?.find((item)=> item?.settings?.length==0);
    if(emptyQuestion) {
      toast.error('There is no question in some forms', { position: 'top-right' });
    } else {
      handleSaveForm();
    }
  }

  const handleSetSelectedForm = (val) => {
    setSelectedForm(val);
    const currentForm = formList?.find((form)=> form.id == val)
    setSelectedSetting(currentForm?.settings[0]);
  };

  const handleDuplicateForm = (form) => {
    setSelectedDuplicateForm(form);
    setOpenDuplicateModal(true);
    
    // Pre-fill the form name with "Copy of [original name]"
    let formName = {};
    if (isValidJSON(form?.name)) {
      formName = JSON.parse(form?.name);
    } else {
      formName.en = form?.name;
    }
    
    formLangList?.forEach((lang) => {
      const originalName = formName?.[lang.code] || '';
      duplicateForm.setValue(`duplicateFormName_${lang.code}`, originalName ? `Copy of ${originalName}` : '');
    });
    
    const originalNameEn = formName?.en || '';
    duplicateForm.setValue('duplicateFormName_en', `Copy of ${originalNameEn}`);
  };

  const onSubmitDuplicateForm = (data) => {
    const nameTrans = {
      en: data?.duplicateFormName_en,
      fr: data?.duplicateFormName_fr,
      de: data?.duplicateFormName_de,
      ar: data?.duplicateFormName_ar,
      ru: data?.duplicateFormName_ru,
      es: data?.duplicateFormName_es,
      nl: data?.duplicateFormName_nl,
      it: data?.duplicateFormName_it,
      tr: data?.duplicateFormName_tr,
    };

    const descriptionTrans = {
      en: data?.duplicateFormDescription_en,
      fr: data?.duplicateFormDescription_fr,
      de: data?.duplicateFormDescription_de,
      ar: data?.duplicateFormDescription_ar,
      ru: data?.duplicateFormDescription_ru,
      es: data?.duplicateFormDescription_es,
      nl: data?.duplicateFormDescription_nl,
      it: data?.duplicateFormDescription_it,
      tr: data?.duplicateFormDescription_tr,
    };

    const newFormId = uuid4();
    const duplicatedForm = {
      ...selectedDuplicateForm,
      id: newFormId,
      name: JSON.stringify(nameTrans),
      description: JSON.stringify(descriptionTrans),
      settings: [...selectedDuplicateForm.settings],
    };

    setFormList([...formList, duplicatedForm]);
    setSelectedForm(newFormId);
    setSelectedSetting(undefined);
    setOpenDuplicateModal(false);
    setSelectedDuplicateForm(null);
    duplicateForm.reset();
    
    toast.success('Form duplicated successfully!', { position: 'top-right' });
  };

  useEffect(() => {
    if (selectedForm) {
      const selectedOne = formList?.find(item => item.id == selectedForm);
      const settings = selectedOne?.settings ?? [];
      if (settings.length > 0) {
        setSettingList([...selectedOne?.settings]);
      } else setSettingList([]);
    }
  }, [selectedForm, formList])

  useEffect(() => {
    const tempChangedIds = [];
    formList?.map(form => {
      const id = form.id;
      const isNew = initialFormList.findIndex(initItem => initItem.id == id) == -1 ? true : false;
      if (isNew) {
        tempChangedIds.push(id);
      } else {
        if (JSON.stringify(initialFormList?.find(item => item.id == id)) !== JSON.stringify(formList?.find(item => item.id == id)))
          tempChangedIds.push(id);
      }

    })
    setChangedIds([...tempChangedIds]);

  }, [formList, initialFormList])

  useEffect(() => {
    if (selectedForm && selectedSetting) {
      const updatedFormList = formList.map(form => {
        if (form.id == selectedForm) {
          return {
            ...form,
            settings:
              form.settings?.map(setting => {
                if (setting.id == selectedSetting.id) {
                  return selectedSetting
                } else return setting
              })
          }
        } else return form;
      });

      setFormList([...updatedFormList]);

    }

  }, [selectedSetting, selectedForm])

  const handleUpdateFormList = () => {
    const bankDetail = brand?.bank_details;
    if(bankDetail) {
      const formList = JSON.parse(bankDetail);
      setFormList(formList??[]);
      setInitialFormList(formList??[]);

      if(formList?.length > 0) {
        setSelectedForm(formList[0].id);
        setSelectedSetting(formList[0].settings?.[0]);
        setCurrency(formList[0].currency ?? '');
        setCommissionPaymentType(formList[0].commission?.payment_type ?? 'percentage');
        setCommissionAmount(formList[0].commission?.amount ?? 0);
        setCommissionCurrency(formList[0].commission?.currency ?? 1);
        setSelectedLanguages(formList[0]?.multiLangs ? JSON.parse(formList[0].multiLangs) : []);
        setFormActive(formList[0]?.is_active ?? true);
      }
    }
  }

  useEffect(() => {
    if(brand) {
      handleUpdateFormList()
    }
  }, [brand])

  const availableCurrencies = useMemo(() => {
    return brand?.available_currencies ? Object.values(brand.available_currencies) : [];
  }, [brand?.available_currencies]);

  const enabledCurrencies = useMemo(() => {
    return brand?.enabled_currencies ? JSON.parse(brand.enabled_currencies)?.map((currency) => parseInt(currency)) : [];
  }, [brand?.enabled_currencies]);

  const bankCurrencyList = useMemo(()=> {
    const currencyNone =   {
      value: 0,
      key: 0,
      name: 'NONE',
      currency: 'NONE',
    };
    if(enabledCurrencies?.length > 0) {
      const convertedCurrencies = availableCurrencies?.map((currency)=> ({
        ...currency,
        enabled: enabledCurrencies?.includes(currency?.key),
      }));
      return [currencyNone, ...convertedCurrencies];
    }
    return [currencyNone, ...availableCurrencies];
  }, 
  [availableCurrencies, enabledCurrencies]);

  return (
    <>
      <>
        <Paper direction="row" justifyContent='flex-end' width={1} sx={{py:1, px: 3,  boxShadow: 12, mb: 2}} >
        <Stack direction='row' justifyContent={changedIds?.length > 0 ? 'space-between': 'flex-end' } alignItems='center'>
            {changedIds?.length > 0 &&
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Iconify icon="si:alert-duotone" width={24} color="info.main" />
              <Typography color='info.main' variant="subtitle2">There are some draft forms now, please save before leaving this page.</Typography>
            </Stack>
            }
            <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5 }}>
              {isLoading && (
                <Iconify
                  icon='svg-spinners:8-dots-rotate'
                  width={24}
                  sx={{ color: 'white' }}
                />
              )}
              <Stack direction='row' alignItems='center' gap={1}>
                <Tooltip title="Reload">
                  <IconButton
                    onClick={()=> getBrands()}
                    sx={{ '&:hover': { color: 'primary.main', transform: 'rotate(180deg)', }, transition: 'transform 0.3s' }}
                  >
                    <Iconify icon="ion:reload-sharp" width={24} />
                  </IconButton>
                </Tooltip>
                <Stack direction='row' alignItems='center' gap={1}>
                  <LoadingButton
                    onClick={()=> saveAll()}
                    loading={saveLoading}
                    size="small"
                    variant="contained"
                    disabled={!(changedIds?.length > 0)}
                  >
                    Save All
                  </LoadingButton>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
        <Paper sx={{ p: 2, mb: -2 }}>
          <Grid container>
            <Grid
              item
              xs={12}
              md={3.5}
              sx={{
                cursor: "pointer",
              }}
              size="large"
            >
              <Typography variant="subtitle1" p={1}>Forms</Typography>
              <FormList 
                isLoading={isLoading}
                formList={formList} 
                changedIds={changedIds} 
                selectedForm={selectedForm} 
                handleAddForm={handleAddForm}
                handleDuplicateForm={handleDuplicateForm}
                handleDeleteForm={(id)=> {
                  setSelectedDeleteFormId(id);
                  setDeleteModalOpen(true);
                }} 
                setSelectedForm={handleSetSelectedForm} 
                setFormList={setFormList} 
                saveForm={handleSaveForm}
                setSelectedEditForm={(form)=> {
                  setSelectedEditForm(form);
                  let formName = {};
                  let formDescription = {};
      
                  if (isValidJSON(form?.name)) {
                    const parsedForm = JSON.parse(form?.name);
                    formName = {...parsedForm};
                  } else {
                    formName.en = form?.name;
                  }
      
                  if (isValidJSON(form?.description)) {
                    const parsedForm = JSON.parse(form?.description);
                    formDescription = {...parsedForm};
                  } else {
                    formDescription.en = form?.description;
                  }

                  formLangList?.forEach((lang)=> {
                    setValue(`formName_${lang.code}`, formName?.[`${lang.code}`])
                    setValue(`formDescription_${lang.code}`, formDescription?.[`${lang.code}`])
                  })
                  setValue(`formName_en`, formName?.en)
                  setValue(`formDescription_en`, formDescription?.en)
                  setFormActive(form?.is_active ?? true);
                  setCurrency(form?.currency ?? '');
                  setCommissionPaymentType(form?.commission?.payment_type ?? 'percentage');
                  setCommissionAmount(form?.commission?.amount ?? 0);
                  setCommissionCurrency(form?.commission?.currency ?? 1);
                  setOpenChangeNameModal(true);
                  setSelectedLanguages(form?.multiLangs ? JSON.parse(form?.multiLangs) : []);
                }} 
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={3.5}
              sx={{
                cursor: "pointer",
              }}
            >
              {selectedForm && <Typography variant="subtitle1" p={1}>Form Section</Typography>}
              <SettingList 
                settingList={settingList} 
                selectedSetting={selectedSetting} 
                setSelectedSetting={setSelectedSetting} 
                selectedForm={selectedForm} 
                handleAddSetting={handleAddSetting} 
                handleDeleteSetting={handleDeleteSetting}
                addButtonLabel="Add section"
              /> 
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                cursor: "pointer",
              }}
            >
              {selectedSetting && <Typography variant="subtitle1" p={1}>Selected Field Settings</Typography>}
              <SettingSetting 
                selectedSetting={selectedSetting} 
                setName={handleSetName} 
                setInputType={handleSetInputType} 
                setFieldOptions={handleSetFieldOptions}
                setOptionalField={handleSetOptional}
                setShowCopyButton={handleShowCopyButton}
              />
            </Grid>
          </Grid>
        </Paper>
      </>
      <CustomModal
        onClose={() => {
          setOpenChangeNameModal(false);
          setSelectedEditForm(undefined);
          reset();
        }}
        open={openChangeNameModal}
      >
        <form onSubmit={handleSubmit(onSubmitFormName)}>
          <Stack spacing={1.5} sx={{ width: { xs: '100%', sm: 450 } }}>
            <Typography variant="h5" sx={{ textAlign: 'center', pb: 1 }}>{selectedEditForm ? "Edit Form": "Create Form"}</Typography>
            <Scrollbar sx={{ maxHeight: 'calc(100vh - 220px)', pr: 1.2, pl: 0.2, width: '100%', overflowX: 'hidden' }}>
              <Stack sx={{ pb: 1 }} direction="column" justifyContent="center" gap={2}>
                <TextField
                  select
                  fullWidth
                  label="Add multi languages"
                  SelectProps={{
                    multiple: true,
                    value: selectedLanguages,
                    onChange: (e) => setSelectedLanguages(e.target.value),
                    renderValue: (selected) => {
                      const selectedNames = selected.map(value => {
                        const lang = formLangList.find(l => l.code === value);
                        return lang?.name;
                      });
                      return selectedNames.join(', ');
                    }
                  }}
                  size="small"
                >
                  {formLangList.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Checkbox 
                          checked={selectedLanguages.includes(lang.code)}
                          size="small"
                          sx={{ m: 0, p: 0 }}
                        />
                        <Iconify icon={lang.icon} width={18} />
                        <Typography>{lang.name}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon={`circle-flags:lang-en`} width={18} />
                      </InputAdornment>
                    ),
                  }}
                  label="Name (English)"
                  type="text"
                  error={!!errors?.formName_en?.message}
                  helperText={errors?.formName_en?.message}
                  {...register('formName_en')}
                  size="small"
                />
                {availableLangList?.length > 0 && <Grid container spacing={1} pl={1}>
                  {availableLangList?.map((lang)=> (
                    <Grid xs={availableLangList?.length > 1 ? 6 : 12} key={lang?.code}>
                      <TextField
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon={`circle-flags:lang-${lang?.code}`} width={18} />
                            </InputAdornment>
                          ),
                        }}
                        fullWidth
                        label={`Name (${lang?.name})`}
                        type="text"
                        size="small"
                        {...register(`formName_${lang?.code}`)}
                      />
                    </Grid>
                  ))}
                </Grid>}
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon={`circle-flags:lang-en`} width={18} />
                      </InputAdornment>
                    ),
                  }}
                  label="Description (English)"
                  type="text"
                  size="small"
                  {...register('formDescription_en')}
                />
                {availableLangList?.length > 0 && <Grid container spacing={1} pl={1}>
                  {availableLangList?.map((lang)=> (
                    <Grid xs={availableLangList?.length > 1 ? 6 : 12} key={lang?.code}>
                      <TextField
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon={`circle-flags:lang-${lang?.code}`} width={18} />
                            </InputAdornment>
                          ),
                        }}
                        fullWidth
                        label={`Description (${lang?.name})`}
                        type="text"
                        size="small"
                        {...register(`formDescription_${lang?.code}`)}
                      />
                    </Grid>
                  ))}
                </Grid>}

                <TextField
                  select
                  fullWidth
                  name="currency"
                  label="Currency"
                  size="small"
                  value={currency}
                  onChange={(e) => {
                    const selectedCurrency = bankCurrencyList.find(c => c.key === e.target.value);
                    if (selectedCurrency?.enabled === false) {
                      return;
                    }
                    return setCurrency(e.target.value);
                  }}
                >
                  {bankCurrencyList.map((currency) => {
                    return (
                      <MenuItem
                        key={currency.key}
                        value={currency.key}
                      >
                        <Stack direction="row" alignItems="center" gap={1}>
                          <Iconify
                            icon={currencyFlagMap?.[currency?.key]}
                            color={currency?.key == 0 ? 'text.disabled' : 'inherit'}
                            width={18}
                            sx={{ flexShrink: 0 }} />
                          <Typography variant="body2">
                            {currency?.name ?? ''}
                          </Typography>
                          {currency?.enabled == false &&
                            <Chip
                              label={currency?.enabled == false ? 'Disabled in settings' : ''}
                              size="small"
                              sx={{
                                fontSize: 11,
                                color: 'text.secondary',
                                pl: 0.2,
                              }}
                            />
                          }
                        </Stack>
                      </MenuItem>
                    );
                  })}
                </TextField>

                <Stack spacing={0.2}>
                  <Typography fontSize={13} color='text.secondary' pl={1}>Commission</Typography>
                  <Stack sx={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                    <TextField
                      select
                      label="Payment Type"
                      fullWidth
                      size="small"
                      value={commissionPaymentType}
                      onChange={(e) => {
                        setCommissionPaymentType(e.target.value);
                      }}
                    >
                      {PAYMENT_TYPES.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    {commissionPaymentType === 'fixed' && (
                      <TextField
                        select
                        fullWidth
                        name="currency"
                        label="Currency"
                        size="small"
                        value={commissionCurrency}
                        onChange={(e) => {
                          setCommissionCurrency(e.target.value);
                        }}
                      >
                        {bankCurrencyList?.filter((currency) => currency?.enabled === true)?.map((currency) => (
                          <MenuItem
                            key={currency.key}
                            value={currency.key}
                          >
                            <Stack direction="row" alignItems="center" gap={1}>
                              <Iconify
                                icon={currencyFlagMap?.[currency?.key]}
                                color={currency?.key == 0 ? 'text.disabled' : 'inherit'}
                                width={18}
                                sx={{ flexShrink: 0 }} />
                              <Typography variant="body2">
                                {currency?.name ?? ''}
                              </Typography>
                              {currency?.enabled == false &&
                                <Chip
                                  label={currency?.enabled == false ? 'Disabled in settings' : ''}
                                  size="small"
                                  sx={{
                                    fontSize: 11,
                                    color: 'text.secondary',
                                    pl: 0.2,
                                  }} />}
                            </Stack>
                          </MenuItem>
                        ))}
                      </TextField>
                    )}

                    <TextField
                      type="number"
                      label="Amount"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={commissionAmount}
                      onChange={(e) => {
                        setCommissionAmount(e.target.value);
                      }}
                    />
                  </Stack>
                </Stack>
              </Stack>
              <Stack direction='row' justifyContent='center'>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formActive}
                      onChange={(e) => setFormActive(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Active"
                  labelPlacement="start"
                  sx={{ m: 0 }}
                />
              </Stack>
            </Scrollbar>

            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <Button
                type="submit" 
                variant="contained" 
                sx={{ width: 90 }} 
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenChangeNameModal(false);
                  setSelectedEditForm(undefined);
                  reset();
                }}
                sx={{ width: 90 }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>
      <DeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={() => {
          setSelectedDeleteFormId(undefined);
          setDeleteModalOpen(false);
        }}
        onDelete={() => handleDeleteForm()}
        title={'Delete Form'}
        description={'Are you sure you want to delete this form?'}
      />
      <CustomModal
        onClose={() => {
          setOpenDuplicateModal(false);
          setSelectedDuplicateForm(null);
          duplicateForm.reset();
        }}
        open={openDuplicateModal}
      >
        <form onSubmit={duplicateForm.handleSubmit(onSubmitDuplicateForm)}>
          <Stack spacing={1.5} sx={{ width: { xs: '100%', sm: 450 } }}>
            <Typography variant="h5" sx={{ textAlign: 'center', pb: 1 }}>Duplicate Form</Typography>
            <Scrollbar sx={{ maxHeight: 'calc(100vh - 220px)', pr: 1.2, pl: 0.2, width: '100%', overflowX: 'hidden' }}>
              <Stack sx={{ pb: 1 }} direction="column" justifyContent="center" gap={2}>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon={`circle-flags:lang-en`} width={18} />
                      </InputAdornment>
                    ),
                  }}
                  label="Name (English)"
                  type="text"
                  error={!!duplicateForm.formState.errors?.duplicateFormName_en?.message}
                  helperText={duplicateForm.formState.errors?.duplicateFormName_en?.message}
                  {...duplicateForm.register('duplicateFormName_en')}
                  size="small"
                />
                
                {availableLangList?.length > 0 && <Grid container spacing={1} pl={1}>
                  {availableLangList?.map((lang)=> (
                    <Grid xs={availableLangList?.length > 1 ? 6 : 12} key={lang?.code}>
                      <TextField
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon={`circle-flags:lang-${lang?.code}`} width={18} />
                            </InputAdornment>
                          ),
                        }}
                        fullWidth
                        label={`Name (${lang?.name})`}
                        type="text"
                        size="small"
                        {...duplicateForm.register(`duplicateFormName_${lang?.code}`)}
                      />
                    </Grid>
                  ))}
                </Grid>}

                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon={`circle-flags:lang-en`} width={18} />
                      </InputAdornment>
                    ),
                  }}
                  label="Description (English)"
                  type="text"
                  size="small"
                  {...duplicateForm.register('duplicateFormDescription_en')}
                />
                
                {availableLangList?.length > 0 && <Grid container spacing={1} pl={1}>
                  {availableLangList?.map((lang)=> (
                    <Grid xs={availableLangList?.length > 1 ? 6 : 12} key={lang?.code}>
                      <TextField
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon={`circle-flags:lang-${lang?.code}`} width={18} />
                            </InputAdornment>
                          ),
                        }}
                        fullWidth
                        label={`Description (${lang?.name})`}
                        type="text"
                        size="small"
                        {...duplicateForm.register(`duplicateFormDescription_${lang?.code}`)}
                      />
                    </Grid>
                  ))}
                </Grid>}
              </Stack>
            </Scrollbar>
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <Button
                type="submit" 
                variant="contained" 
                sx={{ width: 90 }} 
              >
                Duplicate
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenDuplicateModal(false);
                  setSelectedDuplicateForm(null);
                  duplicateForm.reset();
                }}
                sx={{ width: 90 }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>
    </>
  );
};
