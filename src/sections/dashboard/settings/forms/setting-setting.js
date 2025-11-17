import { v4 as uuid4 } from "uuid";
import { useMemo } from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/system/Unstable_Grid/Grid";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { useCssVars } from "src/layouts/dashboard/vertical-layout/side-nav";
import { useSettings } from "src/hooks/use-settings";
import { formLangList } from "src/utils/constant/index"
import { isValidJSON } from "src/utils/function";

export const SettingSetting = ({ 
  selectedSetting, 
  setInputType, 
  setFieldOptions, 
  setName,
  setOptionalField,
  setShowCopyButton,
  disableFileUpload = false,
  }) => {

  const settings = useSettings();
  const cssVars = useCssVars(settings.navColor);

  const fieldOptions = selectedSetting?.options ?? [];
  const inputType = selectedSetting?.inputType ?? 1;
  const isOptional = selectedSetting?.isOptional ?? '';
  const isShowButton = selectedSetting?.isShowCopy ?? '';

  const settingNameInfo = useMemo(()=> {
    if(selectedSetting?.name) {
      let settingName = {};
        if (isValidJSON(selectedSetting?.name)) {
          const parsedForm = JSON.parse(selectedSetting?.name);
          settingName = {...parsedForm};
        } else {
          settingName.en = selectedSetting?.name;
        }
      return settingName;
    }
    return {}
  }, [selectedSetting?.name]);

  const settingFieldOptionsList = useMemo(()=> {
    if(selectedSetting?.options?.length > 0) {
      const updatedOption = selectedSetting?.options?.map((optionItem)=> {
        let settingOption = {};

        if (isValidJSON(optionItem?.option)) {
          const parsedForm = JSON.parse(optionItem?.option);
          settingOption = {...parsedForm};
        } else {
          settingOption.en = optionItem?.option;
        }
        return ({
          id: optionItem.id,
          option: settingOption
        })
      })
      return updatedOption;
    } else {
      return [];
    }
  }, [selectedSetting?.options]);

  const handleChangeFieldType = (e) => {
    setInputType(e?.target?.value);
    if(e?.target?.value === 2 || e?.target?.value === 3 || e?.target?.value === 6) {
      if(fieldOptions?.length === 0) {
        setFieldOptions([
          {
            id: uuid4(),
            option: e?.target?.value === 6 ? `Description ${length+1}`: `Option ${length+1}`
          }
        ])
      }
    } else {
      setFieldOptions([]);
    }
  };

  const handleSwitchOption = (event) => {
    setOptionalField(event?.target?.checked)
  }

  const handleSwitchButtonOption = (event) => {
    setShowCopyButton(event?.target?.checked);
  }

  const handleChangeName = (e, target) => {
    let updateSettingName = {
      ...settingNameInfo,
      [target]: event?.target?.value 
    }
    setName(JSON.stringify(updateSettingName));
  }

  const handleChangeField = (e, optionItem, target) => {
    const updatedOption = {
      ...optionItem.option,
      [ target ]: e.target?.value ?? '',
    }

    setFieldOptions(
      fieldOptions.map((field) => {
        if (optionItem?.id === field?.id) {
          return {
            ...field,
            option: JSON.stringify(updatedOption),
          };
        } else {
          return field;
        }
      })
    );
  };

  const handleAddOption = (length, isDescription = false) => {
    setFieldOptions([
      ...fieldOptions,
      {
        id: uuid4(),
        option: isDescription ? `Description ${length+1}` :  `Options ${length+1}`
      }
    ])
  }
  return (
    selectedSetting?
      <Paper
        sx={{
          ...cssVars,
          backgroundColor: settings.paletteMode == "dark" ?"var(--nav-bg)": 'background.default',
          border: 1,
          borderColor: 'primary.main',
          minHeight: 68,
          boxShadow: 8,
          py: 2, 
          pl: 2,
        }}
      >
        <Scrollbar sx={{ height: {md: "calc(100vh - 290px)", xs: 'auto'}, pr: 3.5 }}>
          <form>
            <Stack direction='column' gap={1.5}>
              <Stack spacing={1}>
                <Typography variant='subtitle2' px={1}>Label</Typography>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon={`circle-flags:lang-en`} width={20} />
                      </InputAdornment>
                    ),
                  }}
                  value={settingNameInfo?.en ?? ""}
                  onChange={(event)=> handleChangeName(event, 'en')}
                  fullWidth
                  label="Label (English)"
                  type="text"
                />
                <Grid container spacing={1}>
                  {formLangList?.map((lang)=> (
                    <Grid xs={6} key={lang?.code}>
                      <TextField
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon={`circle-flags:lang-${lang?.code}`} width={18} />
                            </InputAdornment>
                          ),
                        }}
                        value={settingNameInfo?.[lang?.code] ?? ""}
                        onChange={(event)=> handleChangeName(event, lang?.code)}
                        fullWidth
                        label={`Label (${lang?.name})`}
                        type="text"
                        size="small"
                      />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
              <Stack spacing={1} direction="row" alignItems="center" gap={1}>
                <Typography variant='subtitle2' px={1}>Optional Field:</Typography>
                <Switch
                  checked={isOptional}
                  color="primary"
                  edge="start"
                  onChange={handleSwitchOption}
                  value={isOptional}
                />
              </Stack>
              {inputType == 1 || inputType == 2 || inputType == 3 || inputType == 6 ?
                <Stack spacing={1} direction="row" alignItems="center" gap={1}>
                  <Typography variant='subtitle2' px={1}>Show Copy:</Typography>
                  <Switch
                    checked={isShowButton}
                    color="primary"
                    edge="start"
                    onChange={handleSwitchButtonOption}
                    value={isShowButton}
                  />
                </Stack>:
                null
              }
              <Stack spacing={1} justifyContent="center">
                <Typography variant='subtitle2' px={1}>Type</Typography>
                <Select
                  value={inputType}
                  onChange={handleChangeFieldType}
                  sx={{ width: "100%" }}
                >
                  <MenuItem value={1}>Text</MenuItem>
                  <MenuItem value={2}>Single Select</MenuItem>
                  <MenuItem value={3}>Multi Select</MenuItem>
                  <MenuItem value={4}>Signature</MenuItem>
                  {!disableFileUpload && <MenuItem value={5}>Upload Document</MenuItem>}
                  <MenuItem value={6}>Info</MenuItem>
                </Select>
              </Stack>
              {(inputType === 3 || inputType === 2) && (
                <Stack spacing={1}>
                  {settingFieldOptionsList?.length > 0 ?
                    <Typography variant='subtitle2' px={1}>Options</Typography>
                  : null}
                    <Stack spacing={1} pb={settingFieldOptionsList?.length > 0 ? 2 : 0}>
                      {settingFieldOptionsList?.map((optionItem, index) => (
                        <Stack direction='column' gap={1}>
                          <Stack direction="row" spacing={1} key={`${optionItem?.id} - ${index}`}>
                            <TextField
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Iconify icon={`circle-flags:lang-en`} width={22} />
                                  </InputAdornment>
                                ),
                              }}
                              value={optionItem?.option?.en ?? ""}
                              onChange={(e) => handleChangeField(e, optionItem, 'en')}
                              fullWidth
                              label="Option (English)"
                              type="text"
                            />
                            <IconButton
                              onClick={() =>
                                setFieldOptions(
                                  fieldOptions?.filter(
                                    (opt) => opt?.id !== optionItem?.id
                                  )
                                )
                              }
                            >
                              <Iconify icon="gravity-ui:xmark" color="primary.main" width={24} height={24} />
                            </IconButton>
                          </Stack>
                          <Grid container spacing={1} pl={2}>
                            {formLangList?.map((lang)=> (
                              <Grid xs={6} key={lang?.code}>
                                <TextField
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <Iconify icon={`circle-flags:lang-${lang?.code}`} width={18} />
                                      </InputAdornment>
                                    ),
                                  }}
                                  value={optionItem?.option?.[lang.code] ?? ""}
                                  onChange={(e) => handleChangeField(e, optionItem, lang.code)}
                                  fullWidth
                                  label={`Option (${lang?.name})`}
                                  type="text"
                                  size="small"
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </Stack>
                      ))}
                    </Stack>
                    <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                      <Button
                        variant="text"
                        sx={{ py: 0.5 }}
                        onClick={()=> handleAddOption(settingFieldOptionsList?.length ?? 0)}
                      >
                        Add Option
                      </Button>
                    </Stack>
                </Stack>
              )}
              {(inputType === 6) && (
                <Stack spacing={1}>
                  {settingFieldOptionsList?.length > 0 ?
                    <Typography variant='subtitle2' px={1}>Description</Typography>
                  : null}
                    <Stack spacing={1} pb={settingFieldOptionsList?.length > 0 ? 2 : 0}>
                      {settingFieldOptionsList?.map((optionItem, index) => (
                        <Stack key={`${optionItem?.id} - ${index}`} direction='column' gap={1}>
                          <Stack direction="row" spacing={1}>
                            <TextField
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start" sx={{ mt: -2 }}>
                                    <Iconify icon={`circle-flags:lang-en`} width={22} />
                                  </InputAdornment>
                                ),
                              }}
                              value={optionItem?.option?.en ?? ""}
                              onChange={(e) => handleChangeField(e, optionItem, 'en')}
                              fullWidth
                              label="Description (English)"
                              type="text"
                              multiline
                              rows={2}
                            />
                            <IconButton
                              onClick={() =>
                                setFieldOptions(
                                  fieldOptions?.filter(
                                    (opt) => opt?.id !== optionItem?.id
                                  )
                                )
                              }
                            >
                              <Iconify icon="gravity-ui:xmark" color="primary.main" width={24} height={24} />
                            </IconButton>
                          </Stack>
                          <Grid container spacing={1} pl={2}>
                            {formLangList?.map((lang)=> (
                              <Grid xs={12} key={lang?.code}>
                                <TextField
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <Iconify icon={`circle-flags:lang-${lang?.code}`} width={18} />
                                      </InputAdornment>
                                    ),
                                  }}
                                  value={optionItem?.option?.[lang.code] ?? ""}
                                  onChange={(e) => handleChangeField(e, optionItem, lang.code)}
                                  fullWidth
                                  label={`Description (${lang?.name})`}
                                  type="text"
                                  size="small"
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </Stack>
                      ))}
                    </Stack>
                    <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                      <Button
                        variant="text"
                        sx={{ py: 0.5 }}
                        onClick={()=> handleAddOption(fieldOptions?.length ?? 0, true)}
                      >
                        Add Description
                      </Button>
                    </Stack>
                </Stack>
              )}
            </Stack>
          </form>
        </Scrollbar>
      </Paper>
    :
    null
  );
};
