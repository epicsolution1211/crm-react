import { useEffect } from "react";
import { useForm, Controller } from 'react-hook-form';
import PropTypes from "prop-types";

import Button from "@mui/material/Button";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from "@mui/material/Stack";

import { Iconify } from 'src/components/iconify';

const checkBoxList = [
  // { label: "Affiliate active", name: 'aff_active' },
  { label: "Only view access", name: "aff_acc_only_view" },
  { label: "Can access api", name: 'aff_acc_api' },
  { label: "Can Inject Leads", 'name': 'aff_acc_inject' },
  { label: "Can see brands", name: 'aff_acc_brands' },
  { label: "Can see affiliate", name: 'aff_acc_affiliates' },
  { label: "Can see phone", name: 'aff_acc_phone' },
  { label: "Can see email", name: 'aff_acc_email' },
];

export const AffiliateAccessStep = (props) => {
  const { onBack, onNext, ...other } = props;

  const { control, handleSubmit, setValue } = useForm();

  const onSubmit = (data) => {
    onNext(data);
  }

  useEffect(() => {
    checkBoxList?.forEach((item) => {
      setValue(item?.name, false);
    })
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}
        {...other}>
        <Stack>
          {checkBoxList?.map((item) => (
            <Controller
              key={item.name}
              name={item.name}
              control={control}
              render={({ field: { onChange = () => { }, value = false } }) => (
                <FormControlLabel
                  control={<Checkbox checked={value ?? false}
                    onChange={(event) => onChange(event?.target?.checked)} />}
                  label={item?.label}
                />
              )} />
          ))}
        </Stack>
        <Stack alignItems="center"
          direction="row"
          spacing={2}>
          <Button
            endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
            type="submit"
            variant="contained"
          >
            Continue
          </Button>
          <Button color="inherit"
            onClick={onBack}>
            Back
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

AffiliateAccessStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
};
