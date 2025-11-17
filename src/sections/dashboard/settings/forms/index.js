import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { v4 as uuid4 } from 'uuid';
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@mui/material/Button";
import Grid from "@mui/system/Unstable_Grid/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import LoadingButton from '@mui/lab/LoadingButton';
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";

import CustomModal from "src/components/customize/custom-modal";
import { Iconify } from "src/components/iconify";
import { DeleteModal } from "src/components/customize/delete-modal";
import { FormList } from "./formlist";
import { SettingList } from "./settinglist";
import { SettingSetting } from "./setting-setting";
import { formLangList } from "src/utils/constant/index";
import { formsApi } from "src/api/forms";
import { isValidJSON } from "src/utils/function";

export const Forms = () => {
  const [formList, setFormList] = useState([]);
  const [initialFormList, setInitialFormList] = useState([]);
  const [selectedEditForm, setSelectedEditForm]= useState();

  const formNameValidation = useMemo(()=> {
    const validationSchema = yup.object({
      formName_en: yup.string().required("Form name is a required field").notOneOf(formList?.filter((item)=> item?.id != selectedEditForm?.id)?.map((item)=> item?.name)??[], 'Form name is already exist.'),
    });
    return validationSchema;
  }, [formList, selectedEditForm]);
  
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({ resolver: yupResolver(formNameValidation)});
  
  const [settingList, setSettingList] = useState([]);
  const [changedIds, setChangedIds] = useState([]);
  
  const [selectedSetting, setSelectedSetting] = useState();
  
  const [selectedForm, setSelectedForm] = useState();
  const [openChangeNameModal, setOpenChangeNameModal] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const [isLoading, setIsLoading]= useState(false);

  const [selectedDeleteFromId, setSelectedDeleteFormId] = useState();
  const [deleteModalOpen, setDeleteModalOpen]= useState(false);

  const [saveLoading, setSaveLoading]= useState(false);

  const [selectedDuplicateForm, setSelectedDuplicateForm] = useState(null);
  const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
  const [duplicateFormLanguages, setDuplicateFormLanguages] = useState([]);
  const [duplicateAnchorEl, setDuplicateAnchorEl] = useState(null);
  const duplicatePopoverOpen = Boolean(duplicateAnchorEl);

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

  const getFormList = async () => {
    try {
      setIsLoading(true);

      const response = await formsApi.getForms();

      const parsedResponse = response.forms?.map(item => ({
        ...item,
        settings: item.settings ? JSON.parse(item.settings) : []
      }))
  
      setFormList([...parsedResponse]);
      setInitialFormList([...parsedResponse]);
    } catch (error) {
      console.error('error: ', error);
    } finally {
      setIsLoading(false);
    }
  }

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

  const onSubmitFormName= (data) => {
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
      multiLangs: selectedLanguages,
    };

    // const descriptionTrans = {
    //   en: data?.formDescription_en,
    //   fr: data?.formDescription_fr,
    //   de: data?.formDescription_de,
    //   ar: data?.formDescription_ar,
    //   ru: data?.formDescription_ru,
    //   es: data?.formDescription_es,
    //   nl: data?.formDescription_nl,
    //   it: data?.formDescription_it,
    //   tr: data?.formDescription_tr,
    // };

    if(selectedEditForm) {
      setFormList(prev=> prev?.map((item)=> {
        if(item.id==selectedEditForm?.id) {
          return { 
            ...item, 
            name: JSON.stringify(nameTrans), 
            // description: JSON.stringify(descriptionTrans), 
            // is_active: data?.formActive, 
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
          // description: JSON.stringify(descriptionTrans), 
          // is_active: data?.formActive, 
          id: formId,
          settings: []
        }
      ]);
      setSelectedForm(formId);
      setSelectedSetting(undefined);
      setOpenChangeNameModal(false);
    }
    reset();
  }

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
    setSelectedLanguages([]);
    // setValue('formActive', true);
  }

  const handleDeleteForm = async () => {
    const isNew = initialFormList?.findIndex(item => item.id == selectedDeleteFromId) == -1 ? true : false;

    if (isNew) {
      setFormList(prev => prev?.filter(item => item.id !== selectedDeleteFromId));
    } else {
      try {
        await formsApi.deleteForm(selectedDeleteFromId);
        toast.success('Form successfully deleted!')
      } catch (error) {
        toast.error('Something went wrong!');
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

  const handleSaveForm = async (id) => {
    setSaveLoading(true);
    const isNew = initialFormList?.findIndex(item => item.id == id) == -1 ? true : false;
    if (isNew) {
      let form = formList.find(item => item.id == id);
      form.settings = JSON.stringify(form.settings);
      try {
        const response = await formsApi.createForm(form);
        let resForm = response.form;
        resForm.settings = resForm.settings ? JSON.parse(resForm.settings) : [];
        setFormList(prev => {
          return prev.map(item => {
            if (item.id == id) {
              return resForm;
            } else return item;
          })
        });
        setInitialFormList(prev => ([
          ...prev,
          resForm
        ]));
        setSelectedForm(resForm?.id)
        toast.success('Form successfully saved!')
      } catch (error) {
        console.error('error: ', error);
        toast.error('Something went wrong!');
      }

    } else {
      let form = formList.find(item => item.id == id);
      form.settings = JSON.stringify(form.settings);

      try {
        const response = await formsApi.updateForm(id, form);
        let resForm = response.form;
        resForm.settings = resForm.settings ? JSON.parse(resForm.settings) : [];
        setFormList(prev => {
          return prev.map(item => {
            if (item.id == id) {
              return resForm;
            } else return item;
          })
        });
        setInitialFormList(prev => {
          return prev.map(item => {
            if (item.id == id) {
              return resForm;
            } else return item;
          })
        });
        toast.success('Form successfully saved!')
      } catch (error) {
        console.error('error: ', error);
        toast.error('Something went wrong!');
      }
    }
    setSaveLoading(false);
  }

  const saveAll = () => {
    const emptyQuestion= formList?.find((item)=> item?.settings?.length==0);
    if(emptyQuestion) {
      toast.error('There is no question in some forms');
    } else {
      changedIds?.map(id => {
        handleSaveForm(id);
      })
    }
  }

  const handleSetSelectedForm = (val) => {
    setSelectedForm(val);
    setSelectedSetting(undefined);
  };

  const handleOpenLanguagePopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseLanguagePopover = () => {
    setAnchorEl(null);
  };

  const handleOpenDuplicateLanguagePopover = (event) => {
    setDuplicateAnchorEl(event.currentTarget);
  };

  const handleCloseDuplicateLanguagePopover = () => {
    setDuplicateAnchorEl(null);
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

    // Set selected languages from original form
    if(formName?.multiLangs) {
      setDuplicateFormLanguages(formName?.multiLangs);
    } else {
      setDuplicateFormLanguages([...formLangList?.map((lang)=> lang.code)]);
    }
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
      multiLangs: duplicateFormLanguages,
    };

    const newFormId = uuid4();
    const duplicatedForm = {
      ...selectedDuplicateForm,
      id: newFormId,
      name: JSON.stringify(nameTrans),
      settings: [...selectedDuplicateForm.settings],
    };

    setFormList([...formList, duplicatedForm]);
    setSelectedForm(newFormId);
    setSelectedSetting(undefined);
    setOpenDuplicateModal(false);
    setSelectedDuplicateForm(null);
    setDuplicateFormLanguages([]);
    duplicateForm.reset();
    
    toast.success('Form duplicated successfully!');
  };

  useEffect(() => {
    getFormList();
  }, [])

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

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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
                    onClick={()=> getFormList()}
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
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={3}
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
                  // let formDescription = {};
      
                  if (isValidJSON(form?.name)) {
                    const parsedForm = JSON.parse(form?.name);
                    formName = {...parsedForm};
                  } else {
                    formName.en = form?.name;
                  }
      
                  // if (isValidJSON(form?.description)) {
                  //   const parsedForm = JSON.parse(form?.description);
                  //   formDescription = {...parsedForm};
                  // } else {
                  //   formDescription.en = form?.description;
                  // }

                  formLangList?.forEach((lang)=> {
                    setValue(`formName_${lang.code}`, formName?.[`${lang.code}`])
                    // setValue(`formDescription_${lang.code}`, formDescription?.[`${lang.code}`])
                  })
                  setValue(`formName_en`, formName?.en)

                  if(formName?.multiLangs) {
                    setSelectedLanguages(formName?.multiLangs);
                  } else {
                    setSelectedLanguages([...formLangList?.map((lang)=> lang.code)]);
                  }
                  // setValue(`formDescription_en`, formDescription?.en)
                  // setValue('formActive', form?.is_active ?? true);
                  setOpenChangeNameModal(true);
                }} 
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                cursor: "pointer",
              }}
            >
              {selectedForm && <Typography variant="subtitle1" p={1}>Form Questions</Typography>}
              <SettingList settingList={settingList} selectedSetting={selectedSetting} setSelectedSetting={setSelectedSetting} selectedForm={selectedForm} handleAddSetting={handleAddSetting} handleDeleteSetting={handleDeleteSetting}> </SettingList>
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
          <Stack spacing={1.5} sx={{ width: { xs: '100%', md: 450 }}}>
            <Typography variant="h5" sx={{ textAlign: 'center' }}>{selectedEditForm ? "Edit Form": "Create Form"}</Typography>
            <Stack sx={{ pt: 3, pb: 1 }} direction="column" justifyContent="center" gap={2}>
              <Stack direction="row" alignItems="center" gap={1}>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon={`circle-flags:lang-en`} width={22} />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  label="Name (English)"
                  type="text"
                  error={!!errors?.formName_en?.message}
                  helperText={errors?.formName_en?.message}
                  {...register('formName_en')}
                />
                <Tooltip title="Set Multi Languages">
                  <IconButton
                    onClick={handleOpenLanguagePopover}
                    sx={{
                      color: 'text.primary',
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        color: 'text.primary',
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    <Iconify icon="fluent-mdl2:locale-language" width={22} />
                  </IconButton>
                </Tooltip>
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleCloseLanguagePopover}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <Paper sx={{ p: 0, width: 250, border: '1px dashed', borderColor: 'divider' }}>
                    {formLangList.map((lang) => (
                      <MenuItem key={lang.code} onClick={(event) => {
                        event.stopPropagation();
                        const newSelected = selectedLanguages.includes(lang.code)
                          ? selectedLanguages.filter(code => code !== lang.code)
                          : [...selectedLanguages, lang.code];
                        setSelectedLanguages(newSelected);
                      }}>
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
                  </Paper>
                </Popover>
              </Stack>
              <Grid container spacing={1.5}>
                {formLangList?.filter((lang)=> selectedLanguages.includes(lang.code))?.map((lang)=> (
                  <Grid xs={selectedLanguages?.length > 1 ? 6 : 12} key={lang?.code}>
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
              </Grid>
            </Stack>
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
          setDuplicateFormLanguages([]);
          duplicateForm.reset();
        }}
        open={openDuplicateModal}
      >
        <form onSubmit={duplicateForm.handleSubmit(onSubmitDuplicateForm)}>
          <Stack spacing={1.5} sx={{ width: { xs: '100%', md: 450 }}}>
            <Typography variant="h5" sx={{ textAlign: 'center' }}>Duplicate Form</Typography>
            <Stack sx={{ pt:3, pb: 1 }} direction="column" justifyContent="center" gap={2}>
              <Stack direction="row" alignItems="center" gap={1}>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon={`circle-flags:lang-en`} width={22} />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  label="Name (English)"
                  type="text"
                  error={!!duplicateForm.formState.errors?.duplicateFormName_en?.message}
                  helperText={duplicateForm.formState.errors?.duplicateFormName_en?.message}
                  {...duplicateForm.register('duplicateFormName_en')}
                />
                <Tooltip title="Set Multi Languages">
                  <IconButton
                    onClick={handleOpenDuplicateLanguagePopover}
                    sx={{
                      color: 'text.primary',
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        color: 'text.primary',
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    <Iconify icon="fluent-mdl2:locale-language" width={22} />
                  </IconButton>
                </Tooltip>
                <Popover
                  open={duplicatePopoverOpen}
                  anchorEl={duplicateAnchorEl}
                  onClose={handleCloseDuplicateLanguagePopover}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <Paper sx={{ p: 0, width: 250, border: '1px dashed', borderColor: 'divider' }}>
                    {formLangList.map((lang) => (
                      <MenuItem key={lang.code} onClick={(event) => {
                        event.stopPropagation();
                        const newSelected = duplicateFormLanguages.includes(lang.code)
                          ? duplicateFormLanguages.filter(code => code !== lang.code)
                          : [...duplicateFormLanguages, lang.code];
                        setDuplicateFormLanguages(newSelected);
                      }}>
                        <Stack direction="row" alignItems="center" gap={1}>
                          <Checkbox 
                            checked={duplicateFormLanguages.includes(lang.code)}
                            size="small"
                            sx={{ m: 0, p: 0 }}
                          />
                          <Iconify icon={lang.icon} width={18} />
                          <Typography>{lang.name}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Paper>
                </Popover>
              </Stack>
              <Grid container spacing={1}>
                {formLangList?.filter((lang)=> duplicateFormLanguages.includes(lang.code))?.map((lang)=> (
                  <Grid xs={duplicateFormLanguages?.length > 1 ? 6 : 12} key={lang?.code}>
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
              </Grid>
            </Stack>
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
                  setDuplicateFormLanguages([]);
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
