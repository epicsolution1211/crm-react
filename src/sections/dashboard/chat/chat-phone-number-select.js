import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

import { chatApi } from "src/api/chat";
import { customersApi } from "src/api/customers";
import { settingsApi } from "src/api/settings";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { useAuth } from "src/hooks/use-auth";
import { useMounted } from "src/hooks/use-mounted";
import { useSearchParams } from "src/hooks/use-search-params";
import { useSettings } from "src/hooks/use-settings";
import { useTwilio } from "src/hooks/use-twilio";
import { maskPhoneNumber } from "src/utils/mask-phone";
import { getAssetPath } from "src/utils/asset-path";

const NAME_TO_LOGO_LIGHT = {
  cypbx: getAssetPath("/assets/call-system/call-pbx.png"),
  coperato: getAssetPath("/assets/call-system/call-coperato.png"),
  nuvei: getAssetPath("/assets/call-system/call-nuvei.png"),
  perfectMoney: getAssetPath("/assets/call-system/call-perfect-money.png"),
  twilio: getAssetPath("/assets/call-system/call-twilio.png"),
  voiso: getAssetPath("/assets/call-system/call-voiso.png"),
  squaretalk: getAssetPath("/assets/call-system/call-squaretalk.png"),
  commpeak: getAssetPath("/assets/call-system/call-commpeak.png"),
  mmdsmart: getAssetPath("/assets/call-system/call-mmdsmart.svg"),
  prime_voip: getAssetPath("/assets/call-system/call-prime-light.png"),
  voicespin: getAssetPath("/assets/call-system/call-voicespin.svg"),
  didglobal: getAssetPath("/assets/call-system/call-didglobal.jpg"),
};

const NAME_TO_LOGO_DARK = {
  cypbx: getAssetPath("/assets/call-system/call-pbx.png"),
  coperato: getAssetPath("/assets/call-system/call-coperato.png"),
  nuvei: getAssetPath("/assets/call-system/call-nuvei.png"),
  perfectMoney: getAssetPath("/assets/call-system/call-perfect-money.png"),
  twilio: getAssetPath("/assets/call-system/call-twilio.png"),
  voiso: getAssetPath("/assets/call-system/call-voiso.png"),
  squaretalk: getAssetPath("/assets/call-system/call-squaretalk.png"),
  commpeak: getAssetPath("/assets/call-system/call-commpeak.png"),
  mmdsmart: getAssetPath("/assets/call-system/call-mmdsmart-dark.webp"),
  prime_voip: getAssetPath("/assets/call-system/call-prime.png"),
  voicespin: getAssetPath("/assets/call-system/call-voicespin-light.jpg"),
  didglobal: getAssetPath("/assets/call-system/call-didglobal.jpg"),
};

const NAME_TO_ID = {
  twilio: 1,
  coperato: 2,
  voiso: 3,
  cypbx: 4,
  squaretalk: 5,
  commpeak: 6,
  mmdsmart: 7,
  prime_voip: 8,
  voicespin: 9,
  didglobal: 10,
};

const PROVIDERS_DEFAULT_ENABLED = {
  twilio: "false",
  coperato: "false",
  voiso: "false",
  cypbx: "false",
  squaretalk: "false",
  commpeak: "false",
};

const PROVIDER_NAME = {
  twilio: "twilio",
  coperato: "coperato",
  voiso: "voiso",
  cypbx: "cy_pbx",
  squaretalk: "squaretalk",
  commpeak: "commpeak",
  mmdsmart: "mmdsmart",
  prime_voip: "prime_voip",
  voicespin: "voicespin",
  didglobal: "didglobal",
};

const usePhoneNumbers = ({ customerId, defaultPhoneNumbers }) => {
  const isMounted = useMounted();
  const [companyPhoneNumbers, setCompanyPhoneNumbers] = useState([]);
  const [customerPhoneNumbers, setCustomerPhoneNumbers] = useState([]);
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const handleCompanyNumbersGet = useCallback(
    async (selectedProvider = null) => {
      const request = {
        ...PROVIDERS_DEFAULT_ENABLED,
        client_id: customerId,
      };
      if (selectedProvider) {
        request[PROVIDER_NAME[selectedProvider?.provider_type]] = true;
      }
      const response = await chatApi.getCompanyPhoneNumbers(request);
      if (isMounted()) setCompanyPhoneNumbers(response?.phone_numbers);
    },
    [customerId, isMounted]
  );

  const handleCustomerNumbersGet = useCallback(async () => {
    const ticket = searchParams.get("ticketId") || "";

    const response = await customersApi.getTicket({ id: ticket });
    if (isMounted()) {
      setCustomerPhoneNumbers(response?.client_phone_numbers);
    }
  }, [isMounted, searchParams, user]);

  useEffect(() => {
    handleCompanyNumbersGet();
    if (!defaultPhoneNumbers) {
      handleCustomerNumbersGet();
    }
  }, [user, defaultPhoneNumbers]);

  return {
    companyPhoneNumbers,
    customerPhoneNumbers,
    getCompanyNumbers: handleCompanyNumbersGet,
  };
};

export const ChatPhoneNumberSelect = (props) => {
  const {
    onClose,
    open,
    conversationId,
    profiles = [],
    ticket = {},
    customerPhoneNumbers = null,
    ...other
  } = props;
  const { customerId } = useParams();
  const numbers = usePhoneNumbers({
    customerId,
    defaultPhoneNumbers: customerPhoneNumbers,
  });

  const { makeCall, makeInternalCall, handleTwilioExtrasInit, allowed } = useTwilio();
  const { user } = useAuth();
  const settings = useSettings();
  const theme = useTheme();

  const [selectedCompanyNumber, setSelectedCompanyNumber] = useState(null);
  const [selectedCustomerNumber, setSelectedCustomerNumber] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    const defaultProvider = profiles?.find((p) => p.is_default);
    if (defaultProvider) {
      setSelectedProvider(defaultProvider);
    } else if (profiles?.length === 1) {
      setSelectedProvider(profiles[0]);
    }
  }, [profiles]);

  useEffect(() => {
    if (selectedProvider) {
      numbers?.getCompanyNumbers(selectedProvider);
    }
  }, [selectedProvider]);

  const handleSelectCompanyNumber = useCallback(
    (id) => {
      if (selectedCompanyNumber === id) {
        setSelectedCompanyNumber(null);
      } else {
        setSelectedCompanyNumber(id);
      }
    },
    [selectedCompanyNumber]
  );

  const handleSelectCustomerNumber = useCallback(
    (id) => {
      if (selectedCustomerNumber === id) {
        setSelectedCustomerNumber(null);
      } else {
        setSelectedCustomerNumber(id);
      }
    },
    [selectedCustomerNumber, customerId]
  );

  const handleMakeTwilioCall = useCallback(() => {
    handleTwilioExtrasInit({
      conversation: conversationId,
      token: ticket?.conversation?.token,
      ticket: ticket?.id,
      customer: ticket?.client_id,
    });

    makeInternalCall({
      target_id: `conversation_internal_${conversationId}_${user.id}`,
    });

    setTimeout(() => {
      makeCall({
        target_id: `phone_${conversationId}_${selectedCustomerNumber}_${selectedCompanyNumber}_${user.id}`,
      });

      onClose();
    }, 3000);
  }, [
    conversationId,
    customerId,
    makeCall,
    makeInternalCall,
    onClose,
    selectedCompanyNumber,
    selectedCustomerNumber,
    ticket,
    user,
  ]);

  const handleMakeProviderCall = useCallback(async () => {
    try {
      await settingsApi.callRequest({
        call_system: NAME_TO_ID[selectedProvider?.provider_type],
        provider_profile_id: selectedProvider?.id,
        phone_number: selectedCustomerNumber,
        company_phone: selectedCompanyNumber,
      });
      toast(`${selectedProvider?.name} call has started!`);
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [
    customerId,
    onClose,
    selectedCompanyNumber,
    selectedCustomerNumber,
    selectedProvider,
  ]);

  const handlePhoneCall = useCallback(() => {
    if (selectedProvider?.provider_type === "twilio") {
      handleMakeTwilioCall();
    } else {
      handleMakeProviderCall();
    }
  }, [
    selectedProvider,
    selectedCustomerNumber,
    selectedCompanyNumber,
    customerId,
  ]);

  const customerPhoneNumbersActual = customerPhoneNumbers
    ? customerPhoneNumbers
    : numbers.customerPhoneNumbers;

  return (
    <Drawer
      disableScrollLock
      anchor="right"
      onClose={onClose}
      open={open}
      ModalProps={{
        BackdropProps: {
          invisible: true,
        },
        sx: { zIndex: 1400 },
      }}
      PaperProps={{
        elevation: 24,
        sx: {
          maxWidth: "100%",
          width: 440,
          bgcolor: "background.paper",
        },
      }}
      {...other}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          zIndex: 1,
          px: 3,
          py: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            Phone Call Configuration
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: "text.secondary",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <Iconify icon="iconamoon:close" width={24} />
          </IconButton>
        </Stack>
      </Box>

      <Scrollbar
        sx={{
          height: "100%",
          "& .simplebar-content": {
            height: "100%",
          },
          "& .simplebar-scrollbar:before": {
            background: "rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <Stack spacing={4} sx={{ p: 3 }}>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                textTransform: "uppercase",
                color: "text.secondary",
                mb: 2,
              }}
            >
              Call Profile
            </Typography>
            <Box
              sx={{
                bgcolor: "background.neutral",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 1,
              }}
            >
              {profiles?.map((profile, index) => {
                if (profile?.provider_type === "twilio" && !allowed)
                  return null;
                const isSelected =
                  profile?.id === selectedProvider?.id;

                return (
                  <Box
                    key={`${profile?.provider_type + index}-provider`}
                    onClick={() => setSelectedProvider(profile)}
                    sx={{
                      cursor: "pointer",
                      p: 2,
                      transition: "all 0.2s ease",
                      bgcolor: isSelected ? "action.selected" : "transparent",
                      borderLeft: "3px solid",
                      borderLeftColor: isSelected
                        ? "primary.main"
                        : "transparent",
                      "&:hover": {
                        bgcolor: isSelected
                          ? "action.selected"
                          : "action.hover",
                      },
                      borderBottom: "1px solid",
                      borderBottomColor: "divider",
                      "&:last-child": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          bgcolor: "background.paper",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: 1,
                          p: 1,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Box
                          component="img"
                          src={
                            settings?.paletteMode === "light"
                              ? NAME_TO_LOGO_LIGHT[profile?.provider_type]
                              : NAME_TO_LOGO_DARK[profile?.provider_type]
                          }
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: isSelected ? 600 : 500,
                          color: isSelected ? "primary.main" : "text.primary",
                        }}
                      >
                        {profile?.name}
                      </Typography>
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {selectedProvider && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "text.secondary",
                  mb: 2,
                }}
              >
                Company Phone Numbers
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                {numbers.companyPhoneNumbers
                  ?.filter((number) => {
                    const providerAccessKey = `acc_v_${selectedProvider?.provider_type}_numbers`;
                    const hasAccess = user?.acc?.[providerAccessKey] !== false;
                    
                    if (hasAccess) {
                      return number[selectedProvider?.provider_type] === true;
                    }
                    
                    return false;
                  })
                  ?.map((number, index) => {
                  const isSelected = number.id === selectedCompanyNumber;

                  return (
                    <Fade in key={`${number.id + index}-phone`}>
                      <TableRow
                        hover
                        selected={isSelected}
                        sx={{
                          cursor: "pointer",
                          transition: theme.transitions.create([
                            "background-color",
                            "box-shadow",
                          ]),
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                          ...(isSelected && {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.08
                            ),
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.12
                              ),
                            },
                          }),
                        }}
                        onClick={() => handleSelectCompanyNumber(number.id)}
                      >
                        <TableCell sx={{ border: 0, py: 1.5 }}>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                              }}
                            >
                              <Iconify
                                icon={`circle-flags:${number?.country_code?.[0]?.toLowerCase()}`}
                                width={24}
                              />
                            </Box>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: isSelected ? 600 : 500,
                                color: isSelected
                                  ? theme.palette.primary.main
                                  : theme.palette.text.primary,
                              }}
                            >
                              {number.phone_number}
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    </Fade>
                  );
                })}
                {numbers.companyPhoneNumbers
                  ?.filter((number) => {
                    const providerAccessKey = `acc_v_${selectedProvider?.provider_type}_numbers`;
                    const hasAccess = user?.acc?.[providerAccessKey] !== false;
                    
                    if (hasAccess) {
                      return number[selectedProvider?.provider_type] === true;
                    }
                    
                    return false;
                  })?.length === 0 && (
                  <Box
                    sx={{
                      p: 3,
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      No company phone numbers available for this call profile
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          )}

          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                textTransform: "uppercase",
                color: "text.secondary",
                mb: 2,
              }}
            >
              Customer Phone Numbers
            </Typography>
            <Box
              sx={{
                bgcolor: "background.neutral",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 1,
              }}
            >
              {customerPhoneNumbersActual?.length ? (
                customerPhoneNumbersActual?.map((number, index) => {
                  const isSelected = number.id === selectedCustomerNumber;

                  return (
                    <Box
                      key={`${number.id + index}`}
                      onClick={() => handleSelectCustomerNumber(number.id)}
                      sx={{
                        cursor: "pointer",
                        p: 2,
                        transition: "all 0.2s ease",
                        bgcolor: isSelected ? "action.selected" : "transparent",
                        borderLeft: "3px solid",
                        borderLeftColor: isSelected
                          ? "primary.main"
                          : "transparent",
                        "&:hover": {
                          bgcolor: isSelected
                            ? "action.selected"
                            : "action.hover",
                        },
                        borderBottom: "1px solid",
                        borderBottomColor: "divider",
                        "&:last-child": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            bgcolor: "background.paper",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: 1,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Iconify
                            icon={`circle-flags:${number?.country?.toLowerCase()}`}
                            width={24}
                          />
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: isSelected ? 600 : 500,
                            color: isSelected ? "primary.main" : "text.primary",
                          }}
                        >
                          {user?.acc?.acc_v_client_phone === undefined ||
                          user?.acc?.acc_v_client_phone
                            ? number.name
                            : maskPhoneNumber(number.name)}
                        </Typography>
                      </Stack>
                    </Box>
                  );
                })
              ) : (
                <Box
                  sx={{
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    No customer phone numbers available
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Stack>
      </Scrollbar>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          p: 3,
        }}
      >
        <Box
          onClick={!selectedCustomerNumber ? undefined : handlePhoneCall}
          sx={{
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: selectedCustomerNumber
              ? "primary.main"
              : "action.disabledBackground",
            color: selectedCustomerNumber
              ? "primary.contrastText"
              : "text.disabled",
            borderRadius: 1.5,
            cursor: selectedCustomerNumber ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            "&:hover": selectedCustomerNumber
              ? {
                  bgcolor: "primary.dark",
                  transform: "translateY(-1px)",
                  boxShadow: 2,
                }
              : {},
            fontWeight: 600,
            boxShadow: selectedCustomerNumber ? 1 : "none",
          }}
        >
          Make Call
        </Box>
      </Box>
    </Drawer>
  );
};
