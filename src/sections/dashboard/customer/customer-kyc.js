import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { Iconify } from 'src/components/iconify';
import { CustomerChangeCountry } from "./customer-change-country";
import { countries } from "src/utils/constant";
import { customersApi } from "src/api/customers";
import { getAPIUrl } from "src/config";
import { useAuth } from "src/hooks/use-auth";
import { brandsApi } from "src/api/lead-management/brand";
import { getAssetPath } from "src/utils/asset-path";

const useGetBrands = () => {
  const [brands, setBrands] = useState([]);

  const handleGetBrands = async () => {
    try {
      const res = await brandsApi.getInternalBrands();
      setBrands(res?.internal_brands ?? []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleGetBrands();
  }, []);

  return { brands };
}

export const CustomerKyc = ({ customer, onGetClient }) => {
  const [openCountryModal, setOpenCountryModal] = useState(false);
  const [isFetching, setIsFetching] = useState([false, false, false, false]);

  const { user } = useAuth();
  const frontSideRef = useRef(null);
  const backSideRef = useRef(null);
  const billingRef = useRef(null);

  const { brands } = useGetBrands();

  const customerInternalBrand = brands.find(brand => brand.id === customer?.internal_brand_id);

  const handleDownload = async (url, name, id) => {
    setIsFetching((prev) => {
      let temp = [...prev];
      temp[id] = true;
      return temp;
    });

    const downloadName = name.split("/")?.at(-1);
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = downloadName;
    setIsFetching((prev) => {
      let temp = [...prev];
      temp[id] = false;
      return temp;
    });
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleIdStatusChange = async (status) => {
    try {
      await customersApi.updateCustomer({
        id: customer?.id,
        kyc_id_status: status,
      });
      toast.success("ID status successfully updated!");
      setTimeout(() => {
        onGetClient();
      }, 1000);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleBillingStatusChange = async (status) => {
    try {
      await customersApi.updateCustomer({
        id: customer?.id,
        kyc_billing_status: status,
      });
      toast.success("Billing status successfully updated!");
      setTimeout(() => {
        onGetClient();
      }, 1000);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  function isImage(url) {
    return /\.(jpg|jpeg|png|gif|bmp)$/.test(url);
  }

  const handleFrontAttach = useCallback(() => {
    frontSideRef?.current?.click();
  }, []);

  const handleBackAttach = useCallback(() => {
    backSideRef?.current?.click();
  }, []);

  const handleBillingAttach = useCallback(() => {
    billingRef?.current?.click();
  }, []);

  const handleUploadFrontSide = useCallback(async (event) => {
    event.preventDefault();
    const file = event?.target?.files[0];
    const formData = new FormData();
    formData.append("kyc_id_front", file);

    await customersApi.updateCustomerKyc(customer?.id, formData);
    toast.success("KYC front side successfully uploaded!");
    setTimeout(() => {
      onGetClient();
    }, 1500);
  }, []);

  const handleUploadBackSide = useCallback(async (event) => {
    event.preventDefault();
    const file = event?.target?.files[0];
    const formData = new FormData();
    formData.append("kyc_id_back", file);

    await customersApi.updateCustomerKyc(customer?.id, formData);
    toast.success("KYC back side successfully uploaded!");
    setTimeout(() => {
      onGetClient();
    }, 1500);
  }, []);

  const handleUploadBilling = useCallback(async (event) => {
    event.preventDefault();
    const file = event?.target?.files[0];
    const formData = new FormData();
    formData.append("kyc_billing", file);

    await customersApi.updateCustomerKyc(customer?.id, formData);
    toast.success("KYC billing successfully uploaded!");
    setTimeout(() => {
      onGetClient();
    }, 1500);
  }, []);

  return (
    <Card>
      <CardHeader title={<Typography variant="h5">KYC</Typography>} />
      <CardContent>
        <Stack spacing={5}>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Typography variant="h6">Country of residence:</Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              {customer?.residence_country ? (
                <Stack direction="row" alignItems="center" spacing={1}> 
                  <Iconify icon={`circle-flags:${customer?.residence_country?.toLowerCase()}`} width={24} />
                  <Typography variant="h6">
                    {
                      countries.find(
                        (c) => c.code === customer?.residence_country
                      )?.label
                    }
                  </Typography>
                </Stack>
              ) : (
                <Typography>N/A</Typography>
              )}
              <Button
                variant="outlined"
                onClick={() => setOpenCountryModal(true)}
              >
                Change
              </Button>
            </Stack>
          </Stack>

          {user?.acc?.acc_v_client_kyc_view === undefined ||
          user?.acc?.acc_v_client_kyc_view ? (
            <Stack spacing={5}>
              <Stack direction='column' gap={1}>
                <Typography variant="h6">ID</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Stack spacing={2} alignItems="center">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="h6">Front side</Typography>
                          {user?.acc?.acc_v_client_kyc_upload === undefined ||
                          user?.acc?.acc_v_client_kyc_upload ? (
                            <>
                              <Tooltip title="Upload front side">
                                <IconButton 
                                  onClick={handleFrontAttach}
                                  sx={{ '&:hover': { color: 'primary.main' }}}
                                  >
                                  <Iconify icon="material-symbols:cloud-upload" />
                                </IconButton>
                              </Tooltip>
                              <input
                                hidden
                                ref={frontSideRef}
                                type="file"
                                onChange={handleUploadFrontSide}
                              />
                            </>
                          ) : null}
                        </Stack>
                        {customer?.kyc_id_front_url && !isFetching[0] && (
                          <Tooltip title="Download front side">
                            <IconButton
                              variant="text"
                              onClick={() => {
                                if (customer?.kyc_id_front_url) {
                                handleDownload(`${getAPIUrl()}/${customer?.kyc_id_front_url}`,customer?.kyc_id_front_url, 0);
                                }
                              }}
                              target="_blank"
                              sx={{ '&:hover': { color: 'primary.main' }}}
                            >
                              <Iconify icon="mdi:cloud-download" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {customer?.kyc_id_front_url && isFetching[0] && (
                          <Box sx={{ px: 0.7, py: 0.3 }}>
                            <CircularProgress
                              size={26}
                              sx={{
                                alignSelf: "center",
                                justifySelf: "center",
                              }}
                            />
                          </Box>
                        )}
                      </Stack>
                      {customer?.kyc_id_front_url ? (
                        <Box
                          component="img"
                          alt="Front side of ID"
                          src={customer?.kyc_id_front_url ? `${getAPIUrl()}/${customer?.kyc_id_front_url}` : ""}
                          sx={{
                            height: 400,
                            width: 1,
                            borderRadius: "15px",
                            objectFit: "cover"
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            pt: 8,
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
                              maxWidth: 120,
                            }}
                          />
                          <Typography
                            color="text.secondary"
                            sx={{ mt: 2 }}
                            variant="subtitle1"
                          >
                            There is no image
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={2} alignItems="center">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="h6">Back side</Typography>
                          {user?.acc?.acc_v_client_kyc_upload === undefined ||
                          user?.acc?.acc_v_client_kyc_upload ? (
                            <>
                              <Tooltip title="Upload back side">
                                <IconButton 
                                  onClick={handleBackAttach}
                                  sx={{ '&:hover': { color: 'primary.main' }}}
                                  >
                                  <Iconify icon="material-symbols:cloud-upload" />
                                </IconButton>
                              </Tooltip>
                              <input
                                hidden
                                ref={backSideRef}
                                type="file"
                                onChange={handleUploadBackSide}
                              />
                            </>
                          ) : null}
                        </Stack>
                        {customer?.kyc_id_back_url && !isFetching[1] && (
                          <Tooltip title="Download back side">
                            <IconButton
                              variant="text"
                              onClick={() => {
                                if (customer?.kyc_id_back_url) {
                                handleDownload(`${getAPIUrl()}/${customer?.kyc_id_back_url}`, customer?.kyc_id_back_url, 1);
                                }
                              }}
                              sx={{ '&:hover': { color: 'primary.main' }}}
                            >
                              <Iconify icon="mdi:cloud-download" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {customer?.kyc_id_back_url && isFetching[1] && (
                          <Box sx={{ px: 0.7, py: 0.3 }}>
                            <CircularProgress
                              size={26}
                              sx={{ alignSelf: "center", justifySelf: "center" }}
                            />
                          </Box>
                        )}
                      </Stack>
                      {customer?.kyc_id_back_url ? (
                        <Box
                          component="img"
                          alt="Front side of ID"
                          src={customer?.kyc_id_back_url ? `${getAPIUrl()}/${customer?.kyc_id_back_url}` : ""}
                          sx={{
                            height: 400,
                            width: 1,
                            borderRadius: "15px",
                            objectFit: "cover"
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            pt: 8,
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
                              maxWidth: 120,
                            }}
                          />
                          <Typography
                            color="text.secondary"
                            sx={{ mt: 2 }}
                            variant="subtitle1"
                          >
                            There is no image
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Grid>
                  {user?.acc?.acc_v_client_kyc_approve === undefined ||
                  user?.acc?.acc_v_client_kyc_approve ? (
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Button
                          variant="contained"
                          color="success"
                          sx={{ width: "120px" }}
                          disabled={
                            !customerInternalBrand?.kyc_manual_id
                          }
                          onClick={() => handleIdStatusChange("Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          sx={{ width: "120px" }}
                          disabled={
                            !customerInternalBrand?.kyc_manual_id
                          }
                          onClick={() => handleIdStatusChange("Rejected")}
                        >
                          Reject
                        </Button>
                        {customer?.kyc_id_status !== null ? (
                          <Typography
                            color={
                              customer?.kyc_id_status === "Approved"
                                ? "success.main"
                                : "error.main"
                            }
                          >
                            {customer?.kyc_id_status}
                          </Typography>
                        ) : null}
                      </Stack>
                    </Grid>
                  ) : null}
                </Grid>
              </Stack>
            </Stack>
          ) : null}

          {user?.acc?.acc_v_client_kyc_view === undefined ||
          user?.acc?.acc_v_client_kyc_view ? (
            <Stack spacing={5} sx={{ pt: 5 }}>
            <Stack direction='column' gap={1}>
              <Typography variant="h6">Proof of address</Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Stack spacing={1} alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h6">Billing</Typography>
                        {user?.acc?.acc_v_client_kyc_upload === undefined ||
                        user?.acc?.acc_v_client_kyc_upload ? (
                          <>
                            <Tooltip title="Upload billing">
                              <IconButton 
                                onClick={handleBillingAttach}
                                sx={{ '&:hover': { color: 'primary.main' }}}
                                >
                                <Iconify icon="material-symbols:cloud-upload" />
                              </IconButton>
                            </Tooltip>
                            <input
                              hidden
                              ref={billingRef}
                              type="file"
                              onChange={handleUploadBilling}
                            />
                          </>
                        ) : null}
                      </Stack>
                      {customer?.kyc_billing_url &&
                      isImage(`${getAPIUrl()}/${customer?.kyc_billing_url}`) ? (
                        <Tooltip title="Download billing">
                          {!isFetching[2] ? (
                            <IconButton
                              variant="text"
                              onClick={() => {
                                handleDownload(
                                  `${getAPIUrl()}/${customer?.kyc_billing_url}`,
                                  customer?.kyc_billing_url,
                                  2
                                );
                              }}
                              sx={{ '&:hover': { color: 'primary.main' }}}
                            >
                              <Iconify icon="mdi:cloud-download" />
                            </IconButton>
                          ) : (
                            <Box sx={{ px: 0.7, py: 0.3 }}>
                              <CircularProgress
                                size={26}
                                sx={{
                                  alignSelf: "center",
                                  justifySelf: "center",
                                }}
                              />
                            </Box>
                          )}
                        </Tooltip>
                      ) : null}
                    </Stack>

                    {customer?.kyc_billing_url &&
                      isImage(`${getAPIUrl()}/${customer?.kyc_billing_url}`) ? (
                        <Box
                          component="img"
                          alt="Front side of ID"
                          src={customer?.kyc_billing_url ? `${getAPIUrl()}/${customer?.kyc_billing_url}` : ""}
                          sx={{
                            height: 1,
                            width: 1,
                            borderRadius: "15px",
                          }}
                        />
                      ) : customer?.kyc_billing_url &&
                        !isImage(
                          `${getAPIUrl()}/${customer?.kyc_billing_url}`
                        ) ? (
                        <Box
                          sx={{
                            pt: 8,
                            maxWidth: 1,
                            alignItems: "center",
                            display: "flex",
                            flexGrow: 1,
                            flexDirection: "column",
                            justifyContent: "center",
                            overflow: "hidden",
                            gap: 1,
                          }}
                        >
                          {!isFetching[3] ? (
                            <Tooltip title="Download billing">
                              <Button
                                variant="outlined"
                                onClick={() =>
                                  handleDownload(
                                    `${getAPIUrl()}/${customer?.kyc_billing_url}`,
                                    customer?.kyc_billing_url,
                                    3
                                  )
                                }
                              >
                                Download billing
                              </Button>
                            </Tooltip>
                          ) : (
                            <Box sx={{ px: 0.7, py: 0.3 }}>
                              <CircularProgress
                                size={26}
                                sx={{
                                  alignSelf: "center",
                                  justifySelf: "center",
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      ) : null
                    }
                  </Stack>
                </Grid>
                {user?.acc?.acc_v_client_kyc_approve === undefined ||
                user?.acc?.acc_v_client_kyc_approve ? (
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ width: "120px" }}
                        disabled={
                          !customerInternalBrand?.kyc_manual_billing
                        }
                        onClick={() => handleBillingStatusChange("Approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{ width: "120px" }}
                        disabled={
                          !customerInternalBrand?.kyc_manual_billing
                        }
                        onClick={() => handleBillingStatusChange("Rejected")}
                      >
                        Reject
                      </Button>
                      {customer?.kyc_billing_status !== null ? (
                        <Typography
                          color={
                            customer?.kyc_billing_status === "Approved"
                              ? "success.main"
                              : "error.main"
                          }
                        >
                          {customer?.kyc_billing_status}
                        </Typography>
                      ) : null}
                    </Stack>
                  </Grid>
                ) : null}
              </Grid>
            </Stack>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>

      <CustomerChangeCountry
        open={openCountryModal}
        onClose={() => setOpenCountryModal(false)}
        customerId={customer?.id}
        onGetClient={onGetClient}
        defaultCountry={customer?.residence_country}
      />
    </Card>
  );
};
