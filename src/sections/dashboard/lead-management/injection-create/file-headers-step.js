import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { SelectMenu } from "src/components/customize/select-menu";

export const FileHeadersStep = ({
  onBack,
  onNext,
  headerList,
  headerValue,
  customLeadFields = [],
}) => {
  
  const injectionHeader = [
    { name: "email_header", label: "Email *" },
    { name: "first_name_header", label: "First Name" },
    { name: "last_name_header", label: "Last Name" },
    { name: "phone_header", label: "Phone *" },
    { name: "ftd_amount_header", label: "FTD Amount" },
    { name: "ftd_date_header", label: "FTD Date" },
    { name: "deposit_header", label: "Deposit" },
    { name: "registration_date_header", label: "Registration Date" },
    { name: "brand_name_header", label: "Brand Name" },
    { name: "ip_address_header", label: "IP Address" },
    { name: "campaign_header", label: "Campaign" },
    { name: "description_header", label: "Description" }
];

  const { handleSubmit, control, reset, watch } = useForm();

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
            <Grid xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1, mx: 1 }}>
              <Iconify icon="jam:alert" width={20} sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Please choose phone number or email.
              </Typography>
            </Grid>
            {injectionHeader.map((headerItem)=>(
              <Grid xs={4} key={headerItem.name}>
                <SelectMenu control={control} label={headerItem.label} name={headerItem.name} list={headerList} clearable />
              </Grid>
            ))}

            {customLeadFields?.length > 0 &&
              customLeadFields.map((field) => (
                <Grid xs={4} key={field?.id}>
                  <SelectMenu
                    clearable
                    control={control}
                    list={headerList}
                    label={field?.friendly_name}
                    name={`${field?.id}_customfield`}
                  />
                </Grid>
              ))
            }
          </Grid>          
        </Stack>
        
        <Stack alignItems="center" direction="row" sx={{ mt: 3 }} spacing={2}>
          <Button
            disabled={!watch()?.email_header && !watch()?.phone_header}
            type="submit"
            variant="contained"
            endIcon={<Iconify icon="ri:arrow-right-line"/>}
          >
            Continue
          </Button>
          <Button color="inherit" onClick={onBack}>
            Back
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};
