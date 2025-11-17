import { useCallback, useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useForm, useWatch } from "react-hook-form";

import { AccountType } from "./account-type";
import { BrandForm } from "./brand-form";
import { ClientCards } from "../client-cards";
import { ICO } from "./ico";
import { DepositOptions } from "./deposit-option";
import { BankDeposit } from "./bank-deposit";
import { WDForms } from "./wd-form";
import { ImagesUpload } from "./images-upload";
import { MailContainer } from "src/sections/dashboard/mail/mail-container";
import { SavingAccounts } from "./saving-accounts";
import { Scrollbar } from "src/components/scrollbar";
import { SettingSidebar } from "./setting-sidebar";
import { Settings } from "./settings";
import { brandsApi } from "src/api/lead-management/brand";
import { DashboardCurrencies } from "./dashboard-currencies";
import { Iconify } from 'src/components/iconify';
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

export const useInternalBrands = () => {
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
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  return { internalBrandsList, internalBrandsInfo, isLoading, getBrands };
};

export const SettingsClientDashboard = () => {
  const rootRef = useRef(null);
  const sidebar = useSidebar();

  const { register, control, handleSubmit, formState: { isSubmitting }, setValue } = useForm();

  const {
    internalBrandsList: brands,
    internalBrandsInfo: brandsInfo,
    isLoading,
    getBrands,
  } = useInternalBrands();

  const [currentMenu, setCurrentMenu] = useState("");

  const brandId = useWatch({ control, name: "internal_brand_id" });

  useEffect(() => {
    getBrands();
  }, [brandId]);

  useEffect(() => {
    if (brandId && currentMenu === "") {
      setCurrentMenu("setting");
    }
  }, [brandId, currentMenu]);

  useEffect(() => {
    if (!brandId && brands?.length > 0) {
      setTimeout(() => {
        setValue("internal_brand_id", brands[0]?.value);
      }, 1000);
    }
  }, [brandId, brands]);

  const getMenuTitle = () => {
    switch (currentMenu) {
      case "setting": return "Settings";
      case "card": return "Client Cards";
      case "ico": return "ICO/IPO";
      case "saving_account": return "Saving Accounts";
      case "account_type": return "Account Type";
      case "forms": return "Brand Forms";
      case "deposit_option": return "Deposit Options";
      case "bank_deposit": return "Bank Deposit";
      case "wd_form": return "WD Form";
      case "currencies": return "Currencies";
      default: return "Dashboard Settings";
    }
  };

  return (
    <Card sx={{ height: "100vh" }}>
      <CardContent sx={{ p: sidebar.smUp ? 2 : 1, height: "100%" }}>
        <Box
          component="main"
          sx={{
            minHeight: { xs: 600, sm: 700, md: 800 },
            height: "100%",
            backgroundColor: "background.paper",
            flex: "1 1 auto",
            position: "relative",
          }}
        >
          <Box
            ref={rootRef}
            sx={{
              bottom: 0,
              display: "flex",
              left: 0,
              position: "absolute",
              right: 0,
              top: 0,
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
              {brandId && currentMenu === "setting" ? (
                <Scrollbar sx={{ height: { xs: '90%', sm: '93%' }}}>
                  <Stack 
                    sx={{ 
                      p: { xs: 1, sm: 2, md: 2 }, 
                      pt: { xs: 2, sm: 3, md: 4 },
                      opacity: currentMenu === "setting" ? 1 : 0,
                    }}
                  >
                    <Settings
                      {...{
                        control,
                        register,
                        isSubmitting,
                        handleSubmit,
                        setValue,
                        brandsInfo,
                        brandId,
                        getBrands
                      }}
                    />
                    <ImagesUpload brandId={brandId} brandsInfo={brandsInfo} getBrands={getBrands} />
                  </Stack>
                </Scrollbar>
              ) : null}
              {brandId && currentMenu === "card" ? (
                <Scrollbar sx={{ height: 1, pb: 4 }}>
                  <Stack p={{ xs: 1, sm: 2, md: 2 }}>
                    <Grid container direction="row" columnSpacing={2}>
                      <ClientCards brandId={brandId} brand={brandsInfo?.find(item => item.id == brandId)} getBrands={getBrands}/>
                    </Grid>
                  </Stack>
                </Scrollbar>
              ) : null}
              {brandId && currentMenu === "ico" ? (
                <ICO brandId={brandId} />
              ) : null}
              {brandId && currentMenu === "saving_account" ? (
                <SavingAccounts brandId={brandId} />
              ) : null}
              {brandId && currentMenu === "account_type" ? (
                <AccountType brandId={brandId} />
              ) : null}
              {brandId && currentMenu === "forms" ? (
                <BrandForm brandId={brandId} brand={brandsInfo?.find(item => item.id == brandId)} getBrands={getBrands} />
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
              {brandId && currentMenu === "currencies" ? (
                <DashboardCurrencies brandId={brandId} brand={brandsInfo?.find(item => item.id == brandId)} getBrands={getBrands} isLoading={isLoading}/>
              ) : null}
              {isLoading ? (
                <Box
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
                </Box>
              ) : brandId ? null : (
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
              )}
            </MailContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
