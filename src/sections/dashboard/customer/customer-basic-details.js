import { useEffect, useState } from "react";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { v4 as uuid4 } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { PropertyList } from "src/components/property-list";
import { customersApi } from "src/api/customers";
import { phoneRegExp } from "src/utils/constant";
import { settingsApi } from "src/api/settings";
import { useAuth } from "src/hooks/use-auth";

const validEmailMessage = "Email must be a valid email";
const validPhoneMessage = "Phone must be a valid phone number.";

export const CustomerBasicDetails = ({ customer }) => {
  const params = useParams();
  const id = params?.customerId;
  const { user } = useAuth();

  const [emailHidden, setEmailHidden] = useState(false);
  const [phoneHidden, setPhoneHidden] = useState(false);

  const [emailItems, setEmailItems] = useState([]);
  const [emailValidObj, setEmailValidObj] = useState({});

  const [phoneItems, setPhoneItems] = useState([]);
  const [phoneValidObj, setPhoneValidObj] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = yup.object({
    full_name: yup.string().required("Full name is required field."),
    ...emailValidObj,
    ...phoneValidObj,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  useEffect(() => {
    if (user?.acc?.acc_h_client_email) setEmailHidden(true);
    if (user?.acc?.acc_h_client_phone) setPhoneHidden(true);
  }, [user]);

  useEffect(() => {
    if (user?.acc?.acc_v_client_phone && customer?.phone_numbers) {
      const phoneItems = customer?.phone_numbers
        ?.filter((item) => item?.value?.length > 0)
        ?.map((item) => `phone-${item?.id}-initial`);
      setPhoneItems(phoneItems);
    }
    if (user?.acc?.acc_v_client_email && customer?.emails) {
      const emailItems = customer?.emails
        ?.filter((item) => item?.value?.length > 0)
        ?.map((item) => `email-${item?.id}-initial`);
      setEmailItems(emailItems);
    }
  }, [customer, user]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = {
      full_name: data?.full_name,
    };
    if (user?.acc?.acc_v_client_phone) {
      formData["phone_numbers"] = Object.keys(data)
        ?.filter((item) => item?.includes("phone"))
        ?.map((item) => data[item])
        ?.filter((item) => item.length > 0);
    }
    if (user?.acc?.acc_v_client_email) {
      formData["emails"] = Object.keys(data)
        ?.filter((item) => item?.includes("email"))
        ?.map((item) => data[item])
        ?.filter((item) => item.length > 0);
    }
    if (data?.first_name) {
      formData["first_name"] = data.first_name;
    }
    if (data?.last_name) {
      formData["last_name"] = data.last_name;
    }
    try {
      await customersApi.updateCustomer({ id, ...formData });
      toast.success("Customer successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message);
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const handleSendLastBeat = async (type) => {
    try {
      const accountId = localStorage.getItem("account_id");
      await settingsApi.updateMember(accountId, {
        last_beat: true,
        trigger: type,
        client_id: id,
      });
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  }

  useEffect(() => {
    if (customer?.phone_numbers) {
      phoneItems?.forEach((item, index) => {
        const itemValue = watch(item);
        if (!itemValue) {
          setValue(item, customer?.phone_numbers[index]?.value);
        }
      });
    }
    if (customer?.emails) {
      emailItems?.forEach((item, index) => {
        const itemValue = watch(item);
        if (!itemValue) {
          setValue(item, customer?.emails[index]?.value);
        }
      });
    }
    if (customer?.client?.full_name) {
      setValue("full_name", customer?.client?.full_name);
    }
    if (customer?.client?.first_name) {
      setValue("first_name", customer.client.first_name);
    }
    if (customer?.client?.last_name) {
      setValue("last_name", customer.client.last_name);
    }
  }, [emailItems, phoneItems, watch]);

  useEffect(() => {
    let validationObj = {};
    if (emailItems?.length) {
      emailItems.forEach((item, index) => {
        validationObj = {
          ...validationObj,
          [item]:
            index === 0
              ? yup
                .string()
                .email(validEmailMessage)
              : yup.string().email(validEmailMessage),
        };
      });
    }
    setEmailValidObj(validationObj);
  }, [emailItems]);

  useEffect(() => {
    let validationObj = {};
    if (phoneItems?.length) {
      phoneItems.forEach((item) => {
        validationObj = {
          ...validationObj,
          [item]: yup.string().matches(phoneRegExp, {
            message: validPhoneMessage,
            excludeEmptyString: true,
          }),
        };
      });
    }
    setPhoneValidObj(validationObj);
  }, [phoneItems]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title="Basic Details" />
        <CardContent sx={{
          pt: 2,
          pb: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}>
          {user?.acc?.acc_v_client_name ? (
            <PropertyList sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}>
              <Typography variant="h7">
                Full Name
              </Typography>
              <Stack
                spacing={2}
                direction="row"
                alignItems="center"
              >
                <TextField
                  {...register("full_name")}
                  label="Full Name"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={errors?.full_name?.message}
                  error={!!errors?.full_name?.message}
                  disabled={!user?.acc?.acc_e_client_name}
                />
              </Stack>
            </PropertyList>
          ) : null}
          {user?.acc?.acc_v_client_first_name === undefined || user?.acc?.acc_v_client_first_name ? (
            <PropertyList sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}>
              <Typography variant="h7">
                First Name
              </Typography>
              <Stack
                spacing={2}
                direction="row"
                alignItems="center"
              >
                <TextField
                  {...register("first_name")}
                  label="First Name"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={user?.acc?.acc_e_client_first_name !== undefined && !user?.acc?.acc_e_client_first_name}
                />
              </Stack>
            </PropertyList>
          ) : null}
          {user?.acc?.acc_v_client_last_name === undefined || user?.acc?.acc_v_client_last_name ? (
            <PropertyList sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}>
              <Typography variant="h7">
                Last Name
              </Typography>
              <Stack
                spacing={2}
                direction="row"
                alignItems="center"
              >
                <TextField
                  {...register("last_name")}
                  label="Last Name"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={user?.acc?.acc_e_client_last_name !== undefined && !user?.acc?.acc_e_client_last_name}
                />
              </Stack>
            </PropertyList>
          ) : null}
          {user?.acc?.acc_v_client_email ? (
            <PropertyList sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}>
              <Stack direction="row" alignItems="center">
                <Typography variant="h7" sx={{ pr: 1 }}>
                  Emails
                </Typography>

                {user?.acc?.acc_h_client_email ? (
                  <IconButton 
                    onClick={() => {
                      setEmailHidden(!emailHidden);
                      handleSendLastBeat("email");
                    }}
                    sx={{ '&:hover': { color: 'primary.main' }, color: 'text.secondary' }}
                  >
                    <Iconify
                      icon={!emailHidden ? 'fluent:eye-32-filled' : 'fluent:eye-off-16-filled'}
                    />
                  </IconButton>
                ) : null}

              </Stack>
              <Stack spacing={2} direction="column">
                {emailItems.map((key, index) => (
                  <TextField
                    disabled={!user?.acc?.acc_e_client_email && key.includes('initial')}
                    key={key}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    label="Email"
                    type="text"
                    {...register(key)}
                    error={!!errors[key]?.message}
                    helperText={errors[key]?.message}
                    InputProps={{
                      ...(index !== 0 && (user?.acc?.acc_e_client_email || !key.includes('initial'))
                        ? {
                            endAdornment: (
                              <IconButton
                                onClick={() => {
                                  setEmailItems((prev) =>
                                    prev.filter((item) => item !== key)
                                  );
                                  setValue(key, "");
                                }}
                                size="small"
                              >
                                <Iconify 
                                  icon="iconamoon:close"  
                                  width={22}
                                  color="text.secondary"
                                />
                              </IconButton>
                            ),
                          }
                        : {}),
                      ...(emailHidden ? { style: { WebkitTextSecurity: 'disc' } } : {}),
                    }}
                  />
                ))}
                {user?.acc?.acc_e_client_email_add === undefined ||
                  user?.acc?.acc_e_client_email_add ? (
                  <Button
                    variant="outlined"
                    onClick={() =>
                      setEmailItems((prev) => [...prev, `email-${uuid4()}`])
                    }
                  >
                    + Add new
                  </Button>
                ) : null}
              </Stack>
            </PropertyList>
          ) : null}
          {user?.acc?.acc_v_client_phone ? (
            <PropertyList sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}>
              <Stack direction="row" alignItems="center">
                <Typography variant="h7">
                  Phone numbers
                </Typography>

                {user?.acc?.acc_h_client_phone ? (
                  <IconButton 
                    onClick={() => {
                      setPhoneHidden(!phoneHidden);
                      handleSendLastBeat("phone");
                    }}
                    sx={{ '&:hover': { color: 'primary.main' }, color: 'text.secondary' }}
                  >
                    <Iconify
                      icon={!phoneHidden ? 'fluent:eye-32-filled' : 'fluent:eye-off-16-filled'}
                    />
                  </IconButton>
                ) : null}
              </Stack>

              <Stack spacing={2} direction="column">
                {phoneItems.map((key, index) => (
                  <TextField
                    InputLabelProps={{
                      shrink: true,
                    }}
                    key={key}
                    disabled={!user?.acc?.acc_e_client_phone && key.includes('initial')}
                    fullWidth
                    label="Phone"
                    type="text"
                    {...register(key)}
                    error={!!errors[key]?.message}
                    helperText={errors[key]?.message}
                    InputProps={{
                      ...(index !== 0 && (user?.acc?.acc_e_client_phone || !key.includes('initial'))
                        ? {
                            endAdornment: (
                              <IconButton
                                onClick={() => {
                                  setPhoneItems((prev) =>
                                    prev.filter((item) => item !== key)
                                  );
                                  setValue(key, "");
                                }}
                                size="small"
                              >
                                <Iconify icon="iconamoon:close" width={22} color="text.secondary" />
                              </IconButton>
                            ),
                          }
                        : {}),
                      ...(phoneHidden ? { style: { WebkitTextSecurity: 'disc' } } : {}),
                    }}
                  />
                ))}
                {user?.acc?.acc_e_client_phone_add === undefined ||
                  user?.acc?.acc_e_client_phone_add ? (
                  <Button
                    variant="outlined"
                    onClick={() =>
                      setPhoneItems((prev) => [...prev, `phone-${uuid4()}`])
                    }
                  >
                    + Add new
                  </Button>
                ) : null}
              </Stack>
            </PropertyList>
          ) : null}
        </CardContent>
        {user?.acc?.acc_v_client_name ||
          user?.acc?.acc_v_client_email ||
          user?.acc?.acc_v_client_phone ? (
          <CardActions
            sx={{ display: "flex", justifyContent: "end", pb: 3, px: 2 }}
          >
            <Button disabled={isLoading} type="submit" variant="contained">
              Update
            </Button>
          </CardActions>
        ) : null}
      </Card>
    </form>
  );
};
