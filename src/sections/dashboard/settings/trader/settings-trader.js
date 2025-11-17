import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import { BankDeposit } from "../dashboard-setting/bank-deposit";
import { Branding } from "src/components/settings/trader/banding";
import { DepositOptions } from "../dashboard-setting/deposit-option";
import { MailContainer } from "../../mail/mail-container";
import { Scrollbar } from "src/components/scrollbar";
import { SettingSidebar } from "./setting-sidebar";
import { Spreads } from "src/components/settings/trader/spreads/spreads";
import { Tickers } from 'src/components/settings/trader/tickers/tickers';
import { TraderAccount } from "src/components/settings/trader/account/trader-account";
import { TraderSetting } from "./trader-setting";
import { WDForms } from "../dashboard-setting/wd-form";
import { Wallets } from "src/components/settings/trader/wallets";
import { brandsApi } from "src/api/lead-management/brand";
import { Iconify } from "src/components/iconify";
import { getAssetPath } from "src/utils/asset-path";

const useSidebar = () => {
  const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [open, setOpen] = useState(mdUp);

  const handleScreenResize = useCallback(() => {
    if (!mdUp) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [mdUp]);

  useEffect(() => {
    handleScreenResize();
  }, [mdUp]);

  const handleToggle = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    handleToggle,
    handleClose,
    open,
    smUp,
    mdUp,
  };
};

const useInternalBrands = () => {
  const [internalBrandsList, setInternalBrandsList] = useState([]);
  const [internalBrandsInfo, setInternalBrandsInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getBrands = async () => {
    try {
      setIsLoading(true);
      const res = await brandsApi.getInternalBrands();
      const brandsInfo = res?.internal_brands?.map((brand) => ({
        label: brand?.company_name,
        value: brand?.id,
      }));
      setInternalBrandsList(brandsInfo);
      setInternalBrandsInfo(res?.internal_brands);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  return { internalBrandsList, internalBrandsInfo, isLoading, getBrands };
};

export const SettingsTrader = () => {
  const rootRef = useRef(null);
  const sidebar = useSidebar();
  const { internalBrandsList: brands, internalBrandsInfo: brandsInfo, isLoading, getBrands } = useInternalBrands();
  const [currentMenu, setCurrentMenu] = useState("");
  const { control, setValue } = useForm();
  const brandId = useWatch({ control, name: "internal_brand_id" });

  useEffect(() => {
    if (brandId && currentMenu === "") {
      setCurrentMenu("account_type");
    }
  }, [brandId, currentMenu]);

  useEffect(() => {
    if (!brandId && brands?.length > 0) {
      setValue("internal_brand_id", brands[0]?.value);
    }
  }, [brandId, brands]);

  const getMenuTitle = () => {
    switch (currentMenu) {
      case "account_type": return "Account Type";
      case "settings": return "Settings";
      case "tickers": return "Tickers";
      case "spreads": return "Spreads";
      case "branding": return "Branding";
      case "wallets": return "Wallets";
      case "deposit_option": return "Deposit Options";
      case "bank_deposit": return "Bank Deposit";
      case "wd_form": return "WD Form";
      default: return "Trader Settings";
    }
  };

  return (
    <Stack spacing={4}>
      <Card>
        <CardContent sx={{ p: sidebar.smUp ? 2 : 1 }}>
          <Box
            component="main"
            sx={{
              backgroundColor: "background.paper",
              flex: "1 1 auto",
              position: "relative",
              minHeight: { xs: 600, sm: 700, md: 880 },
            }}
          >
            <Box
              ref={rootRef}
              sx={{
                display: "flex",
                bottom: 0,
                left: 0,
                right: 0,
                top: 0,
                position: "absolute",
              }}
            >
              <SettingSidebar
                container={rootRef.current}
                currentLabelId={"currentLabelId"}
                control={control}
                brands={brands}
                currentMenu={currentMenu}
                setCurrentMenu={(menu) => {
                  setCurrentMenu(menu);
                  if (!sidebar.mdUp) {
                    sidebar.handleClose();
                  }
                }}
                onClose={sidebar.handleClose}
                open={sidebar.open}
                isMobile={!sidebar.smUp}
              />
              <MailContainer 
                open={sidebar.open}
                sx={{ 
                  transition: 'margin 0.3s ease-in-out',
                  width: '100%'
                }}
              >
                <Scrollbar sx={{ height: 1 }}>
                  <Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1, 
                      ml: 1,
                      mr: 1,
                      justifyContent: 'space-between'
                    }}>
                      <IconButton
                        onClick={sidebar.handleToggle}
                        sx={{ 
                          display: 'flex',
                          p: sidebar.smUp ? 1 : 0.5
                        }}
                      >
                        <Iconify icon="lucide:menu" width={24} height={24} />
                      </IconButton>
                      {!sidebar.open && brandId && (
                        <Typography 
                          variant={sidebar.smUp ? "h6" : "subtitle1"}
                          sx={{ fontWeight: 'medium' }}
                        >
                          {getMenuTitle()}
                        </Typography>
                      )}
                    </Box>
                    <Divider />
                  </Box>
                  {brandId && currentMenu === "account_type" ? (
                    <Stack p={{ xs: 1, sm: 2, md: 3 }}>
                      <TraderAccount brandId={brandId} brands={brandsInfo} getBrands={getBrands} />
                    </Stack>
                  ) : null}
                  {brandId && currentMenu === "settings" ? (
                    <Stack p={{ xs: 1, sm: 2, md: 3 }}>
                      <TraderSetting brandId={brandId} />
                    </Stack>
                  ) : null}
                  {brandId && currentMenu === "tickers" ? (
                    <Stack p={{ xs: 1, sm: 2, md: 3 }}>
                      <Tickers brandId={brandId} />
                    </Stack>
                  ) : null}
                  {brandId && currentMenu === "spreads" ? (
                    <Stack p={{ xs: 1, sm: 2, md: 3 }}>
                      <Spreads brandId={brandId} />
                    </Stack>
                  ) : null}
                  {brandId && currentMenu === "branding" ? (
                    <Stack p={{ xs: 1, sm: 2, md: 3 }}>
                      <Branding brandId={brandId} />
                    </Stack>
                  ) : null}
                  {brandId && currentMenu === "wallets" ? (
                    <Stack p={{ xs: 1, sm: 2, md: 3 }}>
                      <Wallets brandId={brandId} />
                    </Stack>
                  ) : null}

                {brandId && currentMenu === "deposit_option" ? (
                  <DepositOptions brandId={brandId}/>
                ) : null}

                {brandId && currentMenu === "bank_deposit" ? (
                    <BankDeposit brandId={brandId} isLoading={isLoading} brand={brandsInfo?.find(item => item.id == brandId)} getBrands={getBrands}/>
                  ) : null}
                
                {brandId && currentMenu === "wd_form" ? (
                  <WDForms brandId={brandId} isLoading={isLoading} brand={brandsInfo?.find(item => item.id == brandId)} />
                ) : null}

                {isLoading
                  ? (<Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      minHeight: { xs: "400px", sm: "500px", md: "600px" }
                    }}
                  >
                    <CircularProgress
                      size={sidebar.mdUp ? 70 : 50}
                      sx={{ alignSelf: "center", justifySelf: "center" }}
                    />
                  </Box>)
                  : brandId ? null : (
                    <Box
                      sx={{
                        pb: 2,
                        mt: 3,
                        minHeight: { xs: "400px", sm: "450px", md: "500px" },
                        maxWidth: 1,
                        alignItems: "center",
                        display: "flex",
                        flexGrow: 1,
                        flexDirection: "column",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        component="img"
                        src={getAssetPath("/assets/errors/error-404.png")}
                        sx={{
                          height: "auto",
                          maxWidth: { xs: 80, sm: 100, md: 120 },
                        }}
                      />
                      <Typography
                        color="text.secondary"
                        sx={{ mt: 2 }}
                        variant="subtitle1"
                      >
                        Select a brand
                      </Typography>
                    </Box>
                  )
                }
                </Scrollbar>
              </MailContainer>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
};
