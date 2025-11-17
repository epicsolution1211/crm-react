import { useMemo } from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { isValidJSON } from 'src/utils/function';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from "react-i18next";

export const handleDownLoadSignature = (signatureURL) => {
  const link = document.createElement('a');

  link.href = signatureURL;
  link.download = `signature.png`;
  document.body.appendChild(link);

  link.click();
  
  document.body.removeChild(link);
}

export const FormInfoDrawer = ({ onClose, open, form }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n?.resolvedLanguage;

  const theme = useTheme();

  const formNameInfo = useMemo(()=> {
    let formNameInfo = {};
    let formSettings = [];

    if (isValidJSON(form?.form_name)) {
      const parsedFormName = JSON.parse(form?.form_name);
      formNameInfo = {...parsedFormName};
    } else {
      formNameInfo.en = form?.form_name;
    }

    if (isValidJSON(form?.form_settings)) {
      const parsedFormSettings = JSON.parse(form?.form_settings);
      formSettings = [...parsedFormSettings];
    }


    return { 
      name: formNameInfo?.[currentLang]?.length > 0 ? formNameInfo?.[currentLang] :  formNameInfo?.en ?? "" , 
      settings: formSettings
    }
  
  }, [form, currentLang]);

  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          maxWidth: '100%',
          width: 440,
          bgcolor: 'background.default'
        }
      }}
    >
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%'
          }
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={3}
          sx={{
            px: 3,
            pt: 3
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: 600 }}>Form Information</Typography>
          <IconButton 
            color="inherit" 
            onClick={onClose}
          >
            <Iconify icon="iconamoon:close" width={24} />
          </IconButton>
        </Stack>
        <Stack
          spacing={3}
          sx={{ p: 3 }}
        >
          <Typography variant="subtitle1">Name: <span style={{ color: theme.palette.primary.main }}>{formNameInfo?.name}</span></Typography>
          <Scrollbar sx={{ maxHeight: 'calc(100vh - 150px)' }}>
            {form?.template_labels?.length > 0 && 
              <Stack direction="column" spacing={2} pb={3} mt={0.5}>
                <Typography variant="subtitle1" sx={{ color : 'text.primary' }}>Labels:</Typography>
                <Stack direction="row" justifyContent="flex-start" sx={{ flexWrap: 'wrap', rowGap: 2, columnGap: 1 }}>
                  {form?.template_labels?.map((item) => (
                    <Chip
                      key={item.name}
                      label={item.name}
                      size="small"
                      color="primary"
                      sx={{ backgroundColor: item?.color ?? "", mr: 1 }}
                    />
                  ))}
                </Stack>
              </Stack>
            }
            <Typography variant="subtitle1" sx={{ color : 'text.primary'}} pb={2}>Settings:</Typography>
            <Stack direction="column" gap={1.5}>
              {formNameInfo?.settings?.map(setting => {
                let settingNameInfo = {};
                if (isValidJSON(setting?.name)) {
                  const parsedForm = JSON.parse(setting?.name);
                  settingNameInfo = {...parsedForm};
                } else {
                  settingNameInfo.en = setting?.name;
                }
                
                if (setting.inputType === 1) {
                  return (
                    <Stack direction="column" spacing={1}>
                      <Typography variant="subtitle2" color={theme.palette.text.secondary}>- {settingNameInfo?.[currentLang]?.length > 0 ? settingNameInfo?.[currentLang] : settingNameInfo?.en ?? ""}</Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ maxWidth: '100%', pl: 1.5 }}
                      >
                        {setting.value}
                      </Typography>
                    </Stack>
                  );
                } 
                if ( setting.inputType === 2 && setting.options?.length > 0 ) {
                  return (
                    <Stack direction="column">
                      <Typography variant="subtitle2" mt={0.5} color={theme.palette.text.secondary}>- {settingNameInfo?.[currentLang]?.length > 0 ? settingNameInfo?.[currentLang] : settingNameInfo?.en ?? ""}</Typography>
                      <RadioGroup 
                        name={setting.id}
                        value={setting.value}
                        sx={{ pl: 1.5 }}
                      >
                        { 
                          setting.options.map(optionItem => {
                            let settingOptionInfo = {};

                            if (isValidJSON(optionItem?.option)) {
                              const parsedForm = JSON.parse(optionItem?.option);
                              settingOptionInfo = {...parsedForm};
                            } else {
                              settingOptionInfo.en = optionItem?.option;
                            }
                            return (
                              <FormControlLabel
                                key={optionItem.id}
                                control={<Radio value={optionItem.id} readOnly sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} />}
                                label={<Typography variant="subtitle2">{settingOptionInfo?.[currentLang]?.length > 0 ? settingOptionInfo?.[currentLang] : settingOptionInfo?.en ?? ""}</Typography>} />
                            );
                          }) 
                        }
                      </RadioGroup>
                    </Stack>
                  );
                }
                if ( setting.inputType === 3 && setting.options?.length > 0 ) {
                  return (
                    <Stack direction="column">
                      <Typography variant="subtitle2" mt={0.5} color={theme.palette.text.secondary}>-{settingNameInfo?.[currentLang]?.length > 0 ? settingNameInfo?.[currentLang] : settingNameInfo?.en ?? ""}</Typography>
                      { 
                        setting.options.map(optionItem => {
                          let settingOptionInfo = {};

                          if (isValidJSON(optionItem?.option)) {
                            const parsedForm = JSON.parse(optionItem?.option);
                            settingOptionInfo = {...parsedForm};
                          } else {
                            settingOptionInfo.en = optionItem?.option;
                          }
                          return (
                            <FormControlLabel
                              key={optionItem.id}
                              control={<Checkbox
                                size="medium"
                                checked={setting.value?.includes(optionItem.id) ? true : false}
                                readOnly
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 24 }, pl: 1.5 }} />}
                              label={<Typography variant="subtitle2">{settingOptionInfo?.[currentLang]?.length > 0 ? settingOptionInfo?.[currentLang] : settingOptionInfo?.en ?? ""}</Typography>} />
                          );
                        }) 
                      }
                    </Stack>
                  );
                }
                if ( setting.inputType === 4 && setting.value ) {
                  return (
                    <Stack direction="column">
                      <Typography variant="subtitle2" mt={0.5} color={theme.palette.text.secondary}>- {settingNameInfo?.[currentLang]?.length > 0 ? settingNameInfo?.[currentLang] : settingNameInfo?.en ?? ""}</Typography>
                      <Stack 
                        sx={{ 
                          width: 1,
                          marginTop: '10px', 
                          position: 'relative',
                          background: 'white',
                          borderRadius: 0.5,
                          '&:hover': {
                            '& .sign' : {
                              opacity: 0.5,
                            },
                            transition: "opacity 0.5s ease, height 0.5s ease",
                          },
                          '&:hover button': {
                            display: 'block'
                          },
                        }}
                      >
                        <Box
                          component="img"
                          alt="Signature"
                          src={setting.value}
                          className="sign"
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            height: 120,
                          }}
                        />
                        <IconButton
                          sx={{
                            display: 'none',
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            top: '30%',
                            width: 'fit-content',
                            zIndex: 500
                          }}
                          onClick={() => handleDownLoadSignature(setting.value)}
                        >
                          <Avatar
                            sx={{
                              '&:hover': {
                                color: 'primary.main',
                                backgroundColor: 'white',
                                transition: "opacity 1s ease, height 1s ease",
                              },
                            }}
                          >
                            <Iconify 
                              icon="icons8:download-2" 
                              color="black"
                            />
                          </Avatar>
                        </IconButton>
                      </Stack>
                    </Stack>
                  );
                }
                return null;
              })}
            </Stack>
          </Scrollbar>
        </Stack>
      </Scrollbar>
    </Drawer>
  );
};
