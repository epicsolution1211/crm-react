import { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { v4 as uuid4 } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { phoneRegExp } from "src/utils/constant";
import { Iconify } from 'src/components/iconify';

const requiredEmailMessage = "Email is required field.";
const validEmailMessage = "Email must be a valid email";
const validPhoneMessage = "Phone must be a valid phone number.";

export const CustomerDetailsStep = ({
  onNext,
  tempDetail,
  ...other
}) => {
  const [emailKeys, setEmailKeys] = useState(["email"]);
  const [emailValidObj, setEmailValidObj] = useState({});

  const [phoneKeys, setPhoneKeys] = useState(["phone"]);
  const [phoneValidObj, setPhoneValidObj] = useState({});

  const validationSchema = yup.object({
    ...emailValidObj,
    ...phoneValidObj,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  useEffect(() => {
    if (Object.keys(tempDetail).length > 0) {
      const phoneKeys = Object.keys(tempDetail)?.filter(
        (item) => item?.includes("phone") && tempDetail[item]
      );
      setPhoneKeys(phoneKeys);
      const emailKeys = Object.keys(tempDetail)?.filter(
        (item) => item?.includes("email") && tempDetail[item]
      );
      setEmailKeys(emailKeys);
    }
  }, [tempDetail]);

  useEffect(() => {
    if (tempDetail) {
      reset(tempDetail);
    }
  }, [emailKeys, phoneKeys]);

  const handleFinish = (data) => {
    const tempData = data;
    const formData = {
      first_name: data?.first_name,
      last_name: data?.last_name,
      phoneNumbers: Object.keys(data)
        ?.filter((item) => item?.includes("phone"))
        ?.map((item) => data[item]),
      emails: Object.keys(data)
        ?.filter((item) => item?.includes("email"))
        ?.map((item) => data[item]),
    };
    onNext(formData, tempData);
  };

  useEffect(() => {
    let validationObj = {};
    if (emailKeys?.length) {
      emailKeys.forEach((item, index) => {
        validationObj = {
          ...validationObj,
          [item]:
            index === 0
              ? yup
                  .string()
                  .required(requiredEmailMessage)
                  .email(validEmailMessage)
              : yup.string().email(validEmailMessage),
        };
      });
    }
    setEmailValidObj(validationObj);
  }, [emailKeys]);

  useEffect(() => {
    let validationObj = {};
    if (phoneKeys?.length) {
      phoneKeys.forEach((item) => {
        validationObj = {
          ...validationObj,
          [item]: yup
            .string()
            .matches(phoneRegExp, {
              message: validPhoneMessage,
              excludeEmptyString: true,
            }),
        };
      });
    }
    setPhoneValidObj(validationObj);
  }, [phoneKeys]);

  return (
    <form onSubmit={handleSubmit(handleFinish)}>
      <Stack spacing={3} {...other}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="First Name"
            name="first_name"
            placeholder="e.g John"
            {...register("first_name")}
          />
        </Stack>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Last Name"
            name="last_name"
            placeholder="e.g Doe"
            {...register("last_name")}
          />
        </Stack>
        <Stack spacing={3}>
          {emailKeys.map((key, index) => (
            <TextField
              key={key}
              fullWidth
              label="Email"
              placeholder="e.g email@test.com"
              {...register(key)}
              error={!!errors[key]?.message}
              helperText={errors[key]?.message}
              InputProps={
                index !== 0 && {
                  endAdornment: (
                    <IconButton
                      onClick={() =>
                        setEmailKeys((prev) =>
                          prev.filter((item) => item !== key)
                        )
                      }
                      size="small"
                    >
                      <Iconify icon="iconamoon:close" width={22} color="text.secondary" />
                    </IconButton>
                  ),
                }
              }
            />
          ))}
          <Button
            onClick={() =>
              setEmailKeys((prev) => [...prev, `email-${uuid4()}`])
            }
            variant="contained"
            startIcon={<Iconify icon="lucide:plus" width={24} />}
          >
            Email
          </Button>
        </Stack>
        <Stack spacing={3}>
          {phoneKeys.map((key, index) => (
            <TextField
              key={key}
              fullWidth
              label="Phone"
              placeholder="e.g +38 (093) 921-88-32"
              {...register(key)}
              error={!!errors[key]?.message}
              helperText={errors[key]?.message}
              InputProps={
                index !== 0 && {
                  endAdornment: (
                    <IconButton
                      onClick={() =>
                        setPhoneKeys((prev) =>
                          prev.filter((item) => item !== key)
                        )
                      }
                      size="small"
                    >
                      <Iconify icon="iconamoon:close" width={22} color="text.secondary" />
                    </IconButton>
                  ),
                }
              }
            />
          ))}
          <Button
            onClick={() =>
              setPhoneKeys((prev) => [...prev, `phone-${uuid4()}`])
            }
            variant="contained"
            startIcon={<Iconify icon="lucide:plus" width={24} />}
          >
            Phone number
          </Button>
        </Stack>
        <Box>
          <Typography variant="h6">Add phone number(s)</Typography>
        </Box>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Button
            endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
            type="submit"
            variant="contained"
          >
            Continue
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

CustomerDetailsStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
};
