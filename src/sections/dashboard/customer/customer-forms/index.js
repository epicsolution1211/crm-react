import { useEffect, useMemo, useState } from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { formsApi } from "src/api/forms";
import PDFGeneratorButton from "./pdf-generator";
import { isValidJSON } from "src/utils/function";
import { useTranslation } from "react-i18next";

export const handleDownLoadSignature = (signatureURL) => {
  const link = document.createElement('a');

  link.href = signatureURL;
  link.download = `signature.png`;
  document.body.appendChild(link);

  link.click();
  
  document.body.removeChild(link);
}

export const CustomerForms = ({ customerId, customerInfo }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n?.resolvedLanguage;
  
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState({});
  const [selectedSettings, setSelectedSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const formNameInfo = useMemo(()=> {
    let formNameInfo = {};
  
    if (isValidJSON(selectedForm?.form_name)) {
      const parsedFormName = JSON.parse(selectedForm?.form_name);
      formNameInfo = {...parsedFormName};
    } else {
      formNameInfo.en = selectedForm?.form_name;
    }
    return { 
      name: formNameInfo?.[currentLang]?.length > 0 ? formNameInfo?.[currentLang] :  formNameInfo?.en ?? "" , 
    }
  
  }, [selectedForm, currentLang]);

  const initialize = async () => {
    setIsLoading(true);
    const res = await formsApi.getClientForms(customerId);
    setForms(res.forms ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    try {
      if (selectedForm.form_settings) {
        const settings = JSON.parse(selectedForm.form_settings);
        setSelectedSettings(settings);
      } 
    } catch (error) {
      setSelectedSettings(null);
    }
  }, [selectedForm]);

  return (
    <Card>
      <CardContent>
          <Box
            sx={{
              minHeight: "auto",
              display: "flex",
              bottom: 0,
              left: 0,
              right: 0,
              top: 0,
            }}
          >
            <nav>
              <Box>
                <Typography sx={{ mt: 2, mb: 2, ml: 2 }} variant="h6" component="div">
                  Submitted Forms
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>
              <List sx = {{ minWidth: '200px' }}>
                <Scrollbar sx={{ height: 400 }}>
                  {forms?.map((form) => {
                    let formNameInfo = {};
        
                    if (isValidJSON(form?.form_name)) {
                      const parsedForm = JSON.parse(form?.form_name);
                      formNameInfo = {...parsedForm};
                    } else {
                      formNameInfo.en = form?.form_name;
                    }
                    return (
                      <ListItem disablePadding key={form.form_id}>
                        <ListItemButton selected={form.form_id == selectedForm.form_id} onClick={() => setSelectedForm(form)}>
                          <ListItemText primary={formNameInfo?.[currentLang]?.length > 0 ? formNameInfo?.[currentLang] : formNameInfo?.en ?? ""} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </Scrollbar>
              </List>
            </nav>
            <Stack direction="column" fontSize={20} sx={{ height: '100%', flexGrow: 1, mx: 2 }}>
              <Stack position="absolute" right={80}>
                <PDFGeneratorButton forms={forms} loading={isLoading} customerInfo={customerInfo}/>
              </Stack>
                <Box>
                  <Typography sx={{ mt: 2, mb: 2, ml: 2, minHeight: 20 }} variant="h6" component="div" fontWeight="">
                    { formNameInfo?.name ?? 'Form Name' }
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                  <Scrollbar sx={{ maxHeight: 500 }}>
                    <Stack sx={{ mx: 2, mb:3 }}>
                      {
                        selectedSettings?.map(setting => {
                          let settingNameInfo = {};
                          if (isValidJSON(setting?.name)) {
                            const parsedForm = JSON.parse(setting?.name);
                            settingNameInfo = {...parsedForm};
                          } else {
                            settingNameInfo.en = setting?.name;
                          }
                          
                          if (setting.inputType === 1) {
                            return (
                              <>
                                <Typography marginTop={3}>{settingNameInfo?.[currentLang]?.length > 0 ? settingNameInfo?.[currentLang] : settingNameInfo?.en ?? ""}</Typography>
                                <Input 
                                  sx={{ maxWidth: '100%' }} 
                                  value={setting.value}
                                  readOnly
                                />
                              </>
                            );
                          } 
                          if ( setting.inputType === 2 && setting.options?.length > 0 ) {
                            return (
                              <>
                                <Typography marginTop={3}>{settingNameInfo?.[currentLang]?.length > 0 ? settingNameInfo?.[currentLang] : settingNameInfo?.en ?? ""}</Typography>
                                <RadioGroup 
                                  name={setting.id}
                                  value={setting.value}
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
                                          control={<Radio value={optionItem.id} readOnly sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />}
                                          label={settingOptionInfo?.[currentLang]?.length > 0 ? settingOptionInfo?.[currentLang] : settingOptionInfo?.en ?? ""} />
                                      );
                                    }) 
                                  }
                                </RadioGroup>
                              </>
                            );
                          }
                          if ( setting.inputType === 3 && setting.options?.length > 0 ) {
                            return (
                              <>
                                <Typography marginTop={3}>{settingNameInfo?.[currentLang]?.length > 0 ? settingNameInfo?.[currentLang] : settingNameInfo?.en ?? ""}</Typography>
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
                                          sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />}
                                        label={settingOptionInfo?.[currentLang]?.length > 0 ? settingOptionInfo?.[currentLang] : settingOptionInfo?.en ?? ""} />
                                    );
                                  }) 
                                }
                              </>
                            );
                          }
                          if ( setting.inputType === 4 && setting.value ) {
                            return (
                              <>
                                <Typography marginTop={3}>{settingNameInfo?.[currentLang]?.length > 0 ? settingNameInfo?.[currentLang] : settingNameInfo?.en ?? ""}</Typography>
                                <Stack 
                                  sx={{ 
                                    width: '50%', 
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
                                      borderColor: 'divider' 
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
                                      top: '35%',
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
                              </>
                            );
                          }
                          return null;
                        })
                      }
                    </Stack>
                  </Scrollbar>
                </Box>
            </Stack>
          </Box>
      </CardContent>
    </Card>
  );
};
