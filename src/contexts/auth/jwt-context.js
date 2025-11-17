import { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { getTimezoneOffset } from "date-fns-tz";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import axios from "axios";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { Issuer } from "src/utils/auth";
import { authApi } from "src/api/auth";
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { useRouter } from "src/hooks/use-router";
import { updateBaseURL } from "src/utils/request";

const STORAGE_KEY = "accessToken";

var ActionType;
(function (ActionType) {
  ActionType["INITIALIZE"] = "INITIALIZE";
  ActionType["SET_TIMEZONE_OFFSET"] = "SET_TIMEZONE_OFFSET";
  ActionType["REFRESH_USER"] = "REFRESH_USER";
  ActionType["UPDATE_COMPANY"] = "UPDATE_COMPANY";
  ActionType["SIGN_IN"] = "SIGN_IN";
  ActionType["SIGN_UP"] = "SIGN_UP";
  ActionType["SIGN_OUT"] = "SIGN_OUT";
  ActionType["GET_COMPANIES"] = "GET_COMPANIES";
})(ActionType || (ActionType = {}));

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  company: null,
  email: null,
  password: null,
  companyLoading: false,
  timezoneOffset: -new Date().getTimezoneOffset() / 60,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user, company } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      company,
    };
  },
  SET_TIMEZONE_OFFSET: (state, action) => {
    const { timezoneOffset } = action.payload;

    return {
      ...state,
      timezoneOffset,
    };
  },
  REFRESH_USER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      user,
    };
  },
  UPDATE_COMPANY: (state, action) => {
    const { company } = action.payload;
    return {
      ...state,
      company,
    };
  },
  GET_COMPANIES: (state, action) => {
    const { companies, email, password } = action.payload;

    return {
      ...state,
      isAuthenticated: false,
      companies,
      email,
      password,
    };
  },
  SIGN_IN: (state, action) => {
    const { user, company } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      company,
    };
  },
  SIGN_UP: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  SIGN_OUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({
  ...initialState,
  issuer: Issuer.JWT,
  initialize: () => Promise.resolve(),
  refreshUser: () => Promise.resolve(),
  updateCompany: () => { },
  signIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  getCompanies: () => Promise.resolve(),
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  const [showWarning, setShowWarning] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [warning, setWarning] = useState("");
  const [user, setUser] = useState();

  useEffect(() => {
    if (user) {
      const offSet = user?.timezone ? getTimezoneOffset(user?.timezone) / 3600000
        : -new Date().getTimezoneOffset() / 60;

      dispatch({
        type: ActionType.SET_TIMEZONE_OFFSET,
        payload: {
          timezoneOffset: offSet,
        },
      });
    }
  }, [user]);

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("token");
      const accountId = localStorage.getItem("account_id");
      const serverUrl = localStorage.getItem("server_url");

      if (serverUrl) {
        updateBaseURL(serverUrl);
      }

      if (accessToken && accountId) {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: true,
          },
        });

        const { account: user, company } = await authApi.me({ accountId });

        if (user) {
          setUser(user);
        }

        if (company?.auto_logout && company?.auto_logout_time) {
          setInterval(() => {
            checkLogout(company?.auto_logout_time);
          }, 60000);
        }

        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: true,
            user,
            company,
          },
        });
      } else {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
            company: null,
          },
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [dispatch]);

  const refreshUser = useCallback(async (refreshCompany = false) => {
    const accountId = localStorage.getItem("account_id");

    const { account: user, company } = await authApi.me({ accountId });

    if (user) {
      setUser(user);
    }

    dispatch({
      type: ActionType.REFRESH_USER,
      payload: {
        user,
      },
    });

    if (refreshCompany) {
      dispatch({
        type: ActionType.UPDATE_COMPANY,
        payload: {
          company,
        },
      });
    }
  }, [dispatch]);

  const updateCompany = useCallback(async (newCompany) => {
    dispatch({
      type: ActionType.UPDATE_COMPANY,
      payload: {
        company: newCompany,
      },
    });
  }, [dispatch]);

  useEffect(() => {
    initialize();
    const accountId = localStorage.getItem("account_id");

    if (accountId) {
      // Send last beat on load
      // settingsApi.updateMember(accountId, { last_beat: true });
      localStorage.setItem("last_beat_time", new Date().getTime());

      subscribeOnSendLastBeat(accountId);
    }

    return () => {
      document.removeEventListener("click", null);
    };
  }, []);

  const checkLogout = useCallback((_autoLogoutTime) => {
    const autoLogoutTime = parseInt(_autoLogoutTime, 10);
    const lastActivityTime = parseInt(
      localStorage.getItem("last_beat_time"),
      10
    );
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - lastActivityTime) / 1000 / 60;

    if (elapsedTime >= autoLogoutTime) {
      signOut();
      router.push(paths.auth.jwt.login);
    }
  }, []);


  // eslint-disable-next-line no-unused-vars
  const subscribeOnSendLastBeat = (accountId) => {
    document.addEventListener("click", async () => {
      const prevLastBeatTime = localStorage.getItem("last_beat_time") ? parseInt(localStorage.getItem("last_beat_time")) : 0;
      const now = new Date().getTime();
      if ((now - prevLastBeatTime) / 1000 > 3) {
        localStorage.setItem("last_beat_time", new Date().getTime());
        const token = localStorage.getItem("token");
        if (token) {
          const res = await settingsApi.updateMember(accountId, {
            last_beat: true,
          });

          if (res.warning) {
            setWarning(res.warning);
            setShowWarning(true);
            localStorage.setItem("license_warning", "true");
          } else {
            setWarning("");
            setShowWarning(false);
            localStorage.removeItem("license_warning");
          }
        }
      }
    });
  };

  const getCompanies = useCallback(
    async (email, password, server_id) => {
      try {
        const serverResponse = await axios.post(`https://api.octolit.com/api/company/server_urls`, { server_code: server_id });
        const server_url = serverResponse?.data?.server_url;
        
        if (server_url) {
          localStorage.setItem("server_url", server_url);
          updateBaseURL(server_url);
        }

        const companies = await authApi.getCompanies({ email, password });

        if (companies?.length < 1) {
          toast.error("There is no company for this account!");
          setTimeout(() => {
            router.push(paths.auth.jwt.login);
          }, 1500);
          return;
        }

        const existingCompanies = localStorage.getItem("tenants") ? JSON.parse(localStorage.getItem("tenants")) : [];

        let dispatchCompanies = [];

        if (companies?.length > 0) {
          const modifiedCompanies = companies?.map(company => {
            return {
              ...company,
              server_url: server_url,
              server_code: server_id,
            }
          });
          const allCompanies = [...modifiedCompanies, ...existingCompanies];
          dispatchCompanies = allCompanies.filter((company, index, self) =>
            company.server_code &&
            index === self.findIndex(
              c => c.server_code === company.server_code && c.company.id === company.company.id
            )
          );
          localStorage.setItem("tenants", JSON.stringify(dispatchCompanies));
        }

        dispatch({
          type: ActionType.GET_COMPANIES,
          payload: {
            companies: dispatchCompanies,
            email,
            password,
          },
        });
      } catch (error) {
        toast.error(error?.response?.data?.error ?? error?.response?.data?.message);
        console.error('Error getting server URL or companies:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const signIn = useCallback(
    async (company) => {
      try {
        const { company: companyObj, account, token } = company;
        if (account) {
          setUser(account);
        }

        localStorage.setItem("token", token);

        await settingsApi.updateMember(account?.id, { last_beat: true });

        localStorage.setItem("company_id", companyObj.id);
        localStorage.setItem("account_id", account.id);
        localStorage.setItem("chat_account_id", `account${account.id}`);
        localStorage.setItem("company", JSON.stringify({
          companyId: companyObj.id,
          companyName: companyObj.name,
          companyAvatar: companyObj.avatar,
          serverCode: company.server_code,
          token: token,
        }));

        localStorage.setItem("last_beat_time", new Date().getTime());
        subscribeOnSendLastBeat(account?.id);

        if (companyObj?.auto_logout && companyObj?.auto_logout_time) {
          setInterval(() => {
            checkLogout(companyObj?.auto_logout_time);
          }, 10000);
        }

        dispatch({
          type: ActionType.SIGN_IN,
          payload: {
            user: account,
            company: companyObj,
          },
        });
      } catch (error) {
        console.error('SignIn error:', error);
      }
    },
    [dispatch]
  );

  const signUp = useCallback(
    async (email, name) => {
      const { accessToken } = await authApi.signUp({ email, name });
      const user = await authApi.me({ accessToken });

      if (user) {
        setUser(user);
      }

      sessionStorage.setItem(STORAGE_KEY, accessToken);

      dispatch({
        type: ActionType.SIGN_UP,
        payload: {
          user,
        },
      });
    },
    [dispatch]
  );

  const signOut = useCallback(async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("company_id");
    localStorage.removeItem("account_id");
    localStorage.removeItem("chat_account_id");
    localStorage.removeItem("company");
    // localStorage.removeItem("tenants");
    localStorage.removeItem("server_url");
    // localStorage.removeItem("customFieldSetting");
    // localStorage.removeItem("tableSetting");
    localStorage.removeItem("last_beat_time");
    dispatch({ type: ActionType.SIGN_OUT });
  }, [dispatch]);

  return (
    <>
      <AuthContext.Provider
        value={{
          ...state,
          issuer: Issuer.JWT,
          initialize,
          signIn,
          signUp,
          signOut,
          getCompanies,
          refreshUser,
          updateCompany,
        }}
      >
        {showWarning ? (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              minHeight: "48px",
              backgroundColor: "#fff3cd",
              border: "1px solid #ffeaa7",
              borderTop: "3px solid #f39c12",
              position: "fixed",
              left: "0px",
              top: "0px",
              width: "100%",
              px: { md: 4, xs: 2 },
              py: 1,
              zIndex: 999999,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#f39c12",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold",
                    lineHeight: 1,
                  }}
                >
                  !
                </Typography>
              </Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: "#856404", 
                  fontSize: { md: "14px", xs: "13px" }, 
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {warning}
              </Typography>
            </Stack>
            <Box
              onClick={() => {
                setShowWarning(false);
                setWarning("");
              }}
              sx={{
                cursor: "pointer",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: "rgba(133, 100, 4, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(133, 100, 4, 0.2)",
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#856404",
                  fontSize: "14px",
                  fontWeight: "bold",
                  lineHeight: 1,
                }}
              >
                ×
              </Typography>
            </Box>
          </Stack>
        ) : null}
        {children}
      </AuthContext.Provider>
    </>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AuthConsumer = AuthContext.Consumer;
