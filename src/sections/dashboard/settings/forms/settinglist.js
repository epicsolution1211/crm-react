import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Radio from '@mui/material/Radio';
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { isValidJSON } from "src/utils/function";
import { useCssVars } from "src/layouts/dashboard/vertical-layout/side-nav";
import { useSettings } from "src/hooks/use-settings";

export const SettingList = ({ settingList, selectedForm, selectedSetting, setSelectedSetting, handleAddSetting, handleDeleteSetting, addButtonLabel = "Add Question" }) => {
  const settings = useSettings();
  const cssVars = useCssVars(settings.navColor);
  
  return (
    <Scrollbar sx={{ height: { md: "calc(100vh - 250px)", xs: 'auto'}, pr: 1.5 }}>
      {
        selectedForm ?
          <Stack direction='column' gap={1}>
            {settingList?.map((setting) => {
              let settingName = {};
              if (isValidJSON(setting?.name)) {
                const parsedForm = JSON.parse(setting?.name);
                settingName = {...parsedForm};
              } else {
                settingName.en = setting?.name;
              }

              return (
                <Paper
                  sx={{
                    ...cssVars,
                    minHeight: 84,
                    backgroundColor: settings.paletteMode == "dark" ? "var(--nav-bg)" : 'background.default',
                    py: 1.5,
                    px: 2,
                    boxShadow: 8,
                    border: 1,
                    borderColor: selectedSetting?.id == setting.id ? 'primary.main' : (settings.paletteMode == "dark" ? 'background.default' : 'text.disabled'),
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover': {
                      '& .hide': {
                        opacity: 1,
                        transition: 'opacity 0.2s ease, height 0.2s ease',
                      },
                    },
                  }}
                  onClick={() => setSelectedSetting(setting)}
                >
                  <Stack direction='column' justifyContent='flex-start' alignItems='stretch' gap={1}>
                    <Typography sx={{ fontSize: 14 }}>
                      {settingName.en}
                    </Typography>
                    {(setting.inputType == 4) ? (
                      <Stack direction='row' gap={1} mt={0.5} sx={{ flexWrap: 'wrap' }}>
                        <Iconify icon="wpf:signature" />
                      </Stack>
                    )
                      : (setting.inputType == 3) ?
                        (
                          <Stack direction='row' gap={1} mt={0.5} sx={{ flexWrap: 'wrap', pl: 1 }}>
                            {setting.options?.map((option, index) => {
                              let settingOption = {};
                              if (isValidJSON(option?.option)) {
                                const parsedForm = JSON.parse(option?.option);
                                settingOption = {...parsedForm};
                              } else {
                                settingOption.en = option?.option;
                              }
                              return (
                                <FormControlLabel
                                  key={`${option}-${index}`}
                                  control={<Checkbox sx={{ p: 0 }} fontSize='small' defaultChecked />}
                                  label={<Typography fontSize='small' sx={{ whiteSpace: 'nowrap', pl: 0.5 }}>
                                    {settingOption?.en ??""}
                                  </Typography>} />
                              );
                            })}
                          </Stack>
                        )
                        : (setting.inputType == 2 ?
                          (
                            <RadioGroup
                              aria-labelledby="demo-radio-buttons-group-label"
                              name="radio-buttons-group"
                              defaultValue={setting?.options?.[0]?.option}
                            >
                              <Stack direction='row' gap={1} mt={0.5} sx={{ flexWrap: 'wrap', pl: 1 }}>
                                {setting.options?.map((option, index) => {
                                  let settingOption = {};
                                  if (isValidJSON(option?.option)) {
                                    const parsedForm = JSON.parse(option?.option);
                                    settingOption = {...parsedForm};
                                  } else {
                                    settingOption.en = option?.option;
                                  }
                                  return (
                                    <FormControlLabel
                                      key={`${option}-${index}`}
                                      value={option.option}
                                      control={<Radio sx={{ p: 0 }} fontSize='small' value={option.option} />}
                                      label={<Typography fontSize='small' sx={{ whiteSpace: 'nowrap', pl: 0.5 }}>
                                        {settingOption?.en ??""}
                                      </Typography>} />
                                  );
                                })}
                              </Stack>
                            </RadioGroup>
                          )
                          : setting.inputType == 5 ?
                            <Stack direction='row' gap={1} mt={0.5} sx={{ flexWrap: 'wrap' }}>
                              <Iconify icon="fluent:document-text-48-regular" />
                            </Stack>
                            :
                            setting.inputType == 6 ?
                              <Stack direction='row' gap={1} mt={0.5} sx={{ flexWrap: 'wrap' }}>
                                <Iconify icon="ri:information-line" />
                              </Stack>
                              : <Input sx={{ maxWidth: '110px', p: 0 }} />
                        )}
                  </Stack>
                  <Tooltip
                    placement="bottom"
                    title="Delete">
                    <Box
                      className="hide"
                      sx={{
                        opacity: 0,
                        transition: 'opacity 0.2s ease, height 0.2s ease'
                      }}
                    >
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); handleDeleteSetting(setting?.id); } }
                        size="small"
                        sx={{ color: "error.main" }}
                      >
                        <Iconify icon="heroicons:trash" />
                      </IconButton>
                    </Box>
                  </Tooltip>
                </Paper>
              );
            })}
            <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Button
                variant="text"
                onClick={() => handleAddSetting(settingList?.length ?? 0)}
              >
                {addButtonLabel ?? ""}
              </Button>
            </Stack>
          </Stack>
          : null
      }
    </Scrollbar>
  );
};
