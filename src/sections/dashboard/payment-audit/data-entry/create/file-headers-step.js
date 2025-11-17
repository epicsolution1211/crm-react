import * as yup from "yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";

import { Iconify } from 'src/components/iconify';
import { SelectMenu } from "src/components/customize/select-menu";

const validationSchema = yup.object({
  d_id_header: yup.string().required("Id header is required field."),
});

export const FileHeadersStep = ({
  onBack,
  onNext,
  headerList,
  headerValue,
  isPending,
}) => {
  const selectMenuItems = [
    { name: "d_id_header", label: "Id *" },
    { name: "d_reference_id_header", label: "Reference" },
    { name: "d_account_header", label: "Account" },
    { name: "d_client_name_header", label: "Client Name" },
    { name: "d_client_type_header", label: "Client Type" },
    { name: "d_account_provider_number_header", label: "Account Provider Number" },
    { name: "d_status_header", label: "Status" },
    { name: "d_type_header", label: "Type" },
    { name: "d_amount_header", label: "Amount" },
    { name: "d_currency_header", label: "Currency" },
    { name: "d_remitter_name_header", label: "Remitter Name" },
    { name: "d_remitter_account_header", label: "Remitter Account" },
    { name: "d_beneficiary_type_header", label: "Beneficiary Type" },
    { name: "d_beneficiary_name_header", label: "Beneficiary Name" },
    { name: "d_bank_account_number_header", label: "Bank Account" },
    { name: "d_bic_header", label: "Bic" },
    { name: "d_description_header", label: "Description" },
    { name: "d_charge_type_header", label: "Charge Type" },
    { name: "d_provider_header", label: "Provider" },
    { name: "d_provider_id_header", label: "Provider Id" },
    { name: "d_partner_id_header", label: "Partner Id" },
    { name: "d_created_header", label: "Created At" },
    { name: "d_updated_header", label: "Updated At" },
  ];

  const { handleSubmit, control, reset, watch } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const watchFields = watch();

  const onSubmit = (data) => {
    onNext(data);
  };

  useEffect(() => {
    if (headerValue) {
      reset(headerValue);
    }
  }, [headerList, headerValue]);
  return (
    <Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            {selectMenuItems.map(({ label, name }) => (
              <Grid xs={6} key={name}>
                <SelectMenu isSearch control={control} label={label} name={name} list={headerList} />
              </Grid>
            ))}
          </Grid>
        </Stack>
        <Stack alignItems="center" direction="row" sx={{ mt: 3 }} spacing={2}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isPending}
            endIcon={<Iconify icon="ri:arrow-right-line"/>}
          >
            Finish
          </LoadingButton>
          <Button color="inherit" onClick={() => onBack(watchFields)}>
            Back
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};
