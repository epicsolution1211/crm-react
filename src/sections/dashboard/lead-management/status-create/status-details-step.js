import * as yup from "yup";
import { format } from 'date-fns';
import PropTypes from "prop-types";
import { useForm, useWatch } from 'react-hook-form';
import { useEffect, useState, useMemo } from "react";
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from '@mui/material/Unstable_Grid2';
import TextField from "@mui/material/TextField";

import { Iconify } from 'src/components/iconify';
import { phoneRegExp, countries } from "src/utils/constant";
import PhoneInput from "src/components/customize/phone-input";
import MuiDatePicker from "src/components/customize/date-picker";
import CountryInput from "src/components/customize/country-input";
import LanguageInput from "src/components/customize/language-input";

const validationSchema = yup.object({
  email: yup.string().email('Email must be a valid email.').required('Email is a required field'),
  phone: yup.string().matches(phoneRegExp, 'Phone must be a valid phone number.').required('Phone number is a required field'),
  first_name: yup.string().required('First name is a required field'),
  last_name: yup.string().required('Last name is a required field'),
  country_name: yup.string().required('Country name is a required field'),
});

export const StatusDetailsStep = (props) => {
  const { onNext, data, onBack } = props;
  const { register, handleSubmit, control, formState: { errors }, reset, setValue, watch } = useForm({ resolver: yupResolver(validationSchema) });

  const [selectedCountry, setSelectedCountry] = useState(null);

  const country = useWatch({ control, name: "country_name" });

  const onSubmit = (data) => {
    onNext(data);
  }

  const handleBack = () => {
    const filedValues = watch();
    onBack(filedValues);
  };

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data]);

  useEffect(() => {
    const date = format(new Date(), 'yyyy-MM-dd');
    setValue('ftd_date', date);
    setValue('registration_date', date);
  }, []);

  const handleCountrySelect = (_country) => {
    if (country) return;
    setSelectedCountry(_country);
    setValue("country_name", _country);
  };

  const defaultCountry = useMemo(() => {
    if (selectedCountry) {
      return countries?.find(c => c.code === selectedCountry?.toUpperCase());
    }
  }, [selectedCountry]);
  
  const StatusDetails = [
    { name: "email", label: "Email*", type: "text" },
    { name: "phone", label: "Phone*", type: "phone", extraProps: { onSelectCountry: handleCountrySelect } },
    { name: "first_name", label: "First Name*", type: "text" },
    { name: "last_name", label: "Last Name*", type: "text" },
    { name: "country_name", label: "Country*", type: "country", extraProps: { defaultCountry } },
    { name: "language", label: "Language", type: "language" },
    { name: "ip_message", label: "IP Address", type: "text" },
    { name: "deposit", label: "Deposit", type: "text" },
    { name: "ftd_amount", label: "FTD Amount", type: "text" },
    { name: "brand_name", label: "Source Brand", type: "text" },
    { name: "ftd_date", label: "FTD Date", type: "date" },
    { name: "registration_date", label: "Registration Date", type: "date" },
    { name: "campaign", label: "Campaign", type: "text" },
    { name: "description", label: "Description", type: "text" },
    { name: "note", label: "Note", type: "text", fullWidth: true },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Grid container spacing={2}>
          {StatusDetails.map(({ name, label, type, fullWidth, extraProps }) => (
            <Grid key={name} xs={fullWidth ? 12 : 6}>
              {type === "text" && (
                <TextField
                  fullWidth
                  label={label}
                  {...register(name)}
                  error={!!errors?.[name]?.message}
                  helperText={errors?.[name]?.message}
                />
              )}
              {type === "phone" && <PhoneInput name={name} label={label} control={control} {...extraProps} />}
              {type === "country" && <CountryInput name={name} label={label} control={control} {...extraProps} />}
              {type === "language" && <LanguageInput name={name} label={label} control={control} />}
              {type === "date" && <MuiDatePicker name={name} label={label} control={control} setValue={setValue} />}
            </Grid>
          ))}
        </Grid>
        <Stack aligns="center"
          direction="row"
          spacing={2}>
          <Button
            type="submit"
            variant="contained"
            endIcon={<Iconify icon="ri:arrow-right-line"/>}
          >
            Continue
          </Button>
          <Button color="inherit" onClick={handleBack}>
            Back
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

StatusDetailsStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
};
