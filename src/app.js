// Remove if react-quill is not used
import "react-quill/dist/quill.snow.css";
// Remove if simplebar is not used
import "simplebar-react/dist/simplebar.min.css";
import { useLocation, useRoutes } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Provider as ReduxProvider } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { RTL } from "src/components/rtl";
import { SplashScreen } from "src/components/splash-screen";
import { SettingsDrawer } from "src/components/settings/settings-drawer";
import { Toaster } from "src/components/toaster";
import { SettingsConsumer, SettingsProvider } from "src/contexts/settings-context";
import { AuthConsumer, AuthProvider } from "src/contexts/auth/jwt-context";
import { TwilioVoiceProvider } from "./contexts/twilio-context";
import { gtmConfig } from "src/config";
import { useNprogress } from "src/hooks/use-nprogress";
import { useAnalytics } from "src/hooks/use-analytics";
import { routes } from "src/routes";
import { store } from "src/store";
import { createTheme } from "src/theme";

// Remove if locales are not used
import "src/locales/i18n";
import { CallProvider } from "./contexts/call-provider-context";
import { NotificationsProvider } from "./contexts/notifications-context";
import { useEffect } from "react";

export const App = () => {
  useAnalytics(gtmConfig);
  useNprogress();

  const location = useLocation();

  useEffect(() => {
    if (location?.pathname && !location?.pathname?.includes('/auth')) {
      localStorage.setItem("last_page", location.pathname);
    }
  }, [location]);

  const element = useRoutes(routes);

  return (
    <ReduxProvider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <AuthConsumer>
            {(auth) => (
              <SettingsProvider>
                <SettingsConsumer>
                  {(settings) => {
                    // Prevent theme flicker when restoring custom settings from browser storage
                    if (!settings.isInitialized) {
                      // return null;
                    }

                    const theme = createTheme({
                      colorPreset: settings.colorPreset,
                      contrast: settings.contrast,
                      direction: settings.direction,
                      paletteMode: settings.paletteMode,
                      responsiveFontSizes: settings.responsiveFontSizes,
                    });

                    // Prevent guards from redirecting
                    const showSlashScreen = !auth.isInitialized;

                    return (
                      <ThemeProvider theme={theme}>
                        <Helmet>
                          <meta
                            name="color-scheme"
                            content={settings.paletteMode}
                          />
                          <meta
                            name="theme-color"
                            content={theme.palette.neutral[900]}
                          />
                        </Helmet>
                        <RTL direction={settings.direction}>
                          <CssBaseline />
                          {showSlashScreen ? (
                            <SplashScreen />
                          ) : (
                            <>
                              <NotificationsProvider>
                                <CallProvider>
                                  <TwilioVoiceProvider>
                                    {element}
                                    {/* {isAuth || location?.pathname?.includes('/miniChat') ? null :
                                      <SettingsButton onClick={settings.handleDrawerOpen} />
                                    } */}
                                    <SettingsDrawer
                                      canReset={settings.isCustom}
                                      onClose={settings.handleDrawerClose}
                                      onReset={settings.handleReset}
                                      onUpdate={settings.handleUpdate}
                                      open={settings.openDrawer}
                                      values={{
                                        colorPreset: settings.colorPreset,
                                        contrast: settings.contrast,
                                        direction: settings.direction,
                                        paletteMode: settings.paletteMode,
                                        responsiveFontSizes:
                                          settings.responsiveFontSizes,
                                        stretch: settings.stretch,
                                        layout: settings.layout,
                                        navColor: settings.navColor,
                                      }}
                                    />
                                  </TwilioVoiceProvider>
                                </CallProvider>
                              </NotificationsProvider>
                            </>
                          )}
                          <Toaster />
                        </RTL>
                      </ThemeProvider>
                    );
                  }}
                </SettingsConsumer>
              </SettingsProvider>
            )}
          </AuthConsumer>
        </AuthProvider>
      </LocalizationProvider>
    </ReduxProvider>
  );
};
