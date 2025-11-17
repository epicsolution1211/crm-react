import toast from "react-hot-toast";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { useCssVars } from "src/layouts/dashboard/vertical-layout/side-nav";
import { useSettings } from "src/hooks/use-settings";
import { isValidJSON } from "src/utils/function/index"
import { currencyOption, PAYMENT_TYPES } from "src/utils/constant";

export const FormList = ({ formList, changedIds, selectedForm, setSelectedForm, setSelectedEditForm, handleAddForm, handleDeleteForm, handleDuplicateForm, saveForm, isLoading, }) => {
  const settings = useSettings();
  const cssVars = useCssVars(settings.navColor);

  return (
    <>
      <Scrollbar sx={{ height: { md: "calc(100vh - 250px)", xs: 'auto'}, pr: 1.5 }}>
        <Stack direction='column' gap={1}>
          {formList?.map((form) => {
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

            let commission = {};

            if(isValidJSON(form?.commission)) {
              const parsedCommission = JSON.parse(form?.commission);
              commission = {...parsedCommission};
            } else {
              commission = form?.commission;
            }

            return (
              <Paper
                sx={{
                  ...cssVars,
                  backgroundColor: settings.paletteMode == "dark" ? "var(--nav-bg)" : 'background.default',
                  py: 1.5, px: 2,
                  boxShadow: 8,
                  border: 1,
                  borderColor: selectedForm == form.id ? 'primary.main' : (settings.paletteMode == "dark" ? 'background.default' : 'text.disabled'),
                  minHeight: 68,
                  '&:hover': {
                    '& .hide': {
                      opacity: 1,
                      transition: 'opacity 0.2s ease, height 0.2s ease',
                    },
                  },
                }}
              >
                <Stack alignItems='center' direction="row" justifyContent='space-between'
                  onClick={() => { setSelectedForm(form.id); } }
                  key={form?.id}
                  sx={{ position: 'relative' }}
                >
                  <Stack direction='column' gap={0.5}>
                    <Stack direction='row' alignItems='center' gap={0.5}>
                      <Iconify icon="fluent-mdl2:status-circle-inner" color={form?.is_active === false ? "error.main" : "success.main"} width={16} />
                      <Typography>{formName?.en ?? ''}</Typography>
                    </Stack>
                    <Typography fontSize={12} pl={0.5}>{formDescription?.en ?? ''}</Typography>
                  </Stack>
                  <Stack 
                    sx={{ 
                      position: 'absolute',
                      flexDirection: 'row',
                      right: 0,
                      top: 0,
                      ...cssVars,
                      backgroundColor: settings.paletteMode == "dark" ? "var(--nav-bg)" : 'background.default',
                    }}>
                    <Tooltip
                      placement="bottom"
                      title="Duplicate">
                      <Box
                        className="hide"
                        sx={{
                          opacity: 0,
                          transition: 'opacity 0.2s ease, height 0.2s ease'
                        }}>
                        <IconButton
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleDuplicateForm(form);
                          }}
                          sx={{ color: "info.main" }}
                        >
                          <Iconify icon="solar:copy-linear" />
                        </IconButton>
                      </Box>
                    </Tooltip>
                    <Tooltip
                      placement="bottom"
                      title="Edit">
                      <Box
                        className="hide"
                        sx={{
                          opacity: 0,
                          transition: 'opacity 0.2s ease, height 0.2s ease'
                        }}>
                        <IconButton
                          onClick={(e) => { e.stopPropagation(); setSelectedEditForm(form); } }
                          sx={{ color: "primary.main" }}
                        >
                          <Iconify icon="mage:edit" />
                        </IconButton>
                      </Box>
                    </Tooltip>
                    <Tooltip
                      placement="bottom"
                      title="Delete">
                      <Box
                        className="hide"
                        sx={{
                          opacity: 0,
                          transition: 'opacity 0.2s ease, height 0.2s ease'
                        }}>
                        <IconButton
                          onClick={(e) => { e.stopPropagation(); handleDeleteForm(form?.id); } }
                          sx={{ color: "error.main" }}
                        >
                          <Iconify icon="heroicons:trash" />
                        </IconButton>
                      </Box>
                    </Tooltip>
                    {(changedIds.includes(form.id)) ?
                      <Tooltip
                        placement="bottom"
                        title="Save">
                        <Box>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              if (form?.settings.length !== 0) {
                                saveForm(form?.id);
                              } else {
                                toast.error('There is no question in this form', { position: 'top-right' });
                              }
                            } }
                            sx={{ color: "primary.main" }}
                          >
                            <Iconify icon="fluent:save-32-regular" />
                          </IconButton>
                        </Box>
                      </Tooltip> :
                      null}
                  </Stack>
                </Stack>
                {currencyOption?.find((currency) => currency.value == form?.currency) &&
                  <Stack direction="row" alignItems="center" gap={0.5} pl={0.5}>
                    <Typography fontSize={12}>
                      Currency:
                    </Typography>
                    <Iconify 
                      icon={currencyOption?.find((currency) => currency.value == form?.currency)?.icon} 
                      width={14}
                      sx={{ flexShrink: 0 }}
                    />
                    <Typography fontSize={12}>
                      {currencyOption?.find((currency) => currency.value == form?.currency)?.currency}
                    </Typography>
                  </Stack>
                }
                {commission &&
                  <Stack direction="row" alignItems="center" gap={0.5} pl={0.5}>
                    <Typography fontSize={12}>
                      Commission:
                    </Typography>
                    <Typography fontSize={12}>
                      {commission?.amount}
                      {commission?.payment_type == 'percentage' 
                        ? '%' 
                        : `${currencyOption?.find((currency) => currency.value == commission?.currency)?.symbol}`
                      } 
                      ({PAYMENT_TYPES?.find((payment) => payment.value == commission?.payment_type)?.label})
                    </Typography>
                  </Stack>
                }
              </Paper>
            );
          })}
          {isLoading && formList?.length==0 ?
            null:
            <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Button
                variant="text"
                onClick={() => handleAddForm(formList?.length ?? 0)}
              >
                Add Form
              </Button>
            </Stack>
          }
        </Stack>
      </Scrollbar>
      
    </>
  );
};
