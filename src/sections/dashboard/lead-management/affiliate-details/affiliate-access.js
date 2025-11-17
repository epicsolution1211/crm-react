import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "src/hooks/use-auth";

const checkBoxList = [
  { label: "Only view access", name: "aff_acc_only_view" },
  { label: "Can access api", name: "aff_acc_api" },
  { label: "Can access leads", name: "aff_acc_leads" },
  { label: "Can edit leads", name: "aff_acc_leads_edit" },
  { label: "Can Inject Leads", name: "aff_acc_inject" },
  { label: "Can see brands", name: "aff_acc_brands" },
  { label: "Can see affiliate", name: "aff_acc_affiliates" },
  { label: "Can see offers", name: "aff_acc_offers" },
  { label: "Can see phone", name: "aff_acc_phone" },
  { label: "Can see email", name: "aff_acc_email" },
];

export const AffiliateAccess = ({ affiliate, updateAffiliate }) => {
  const { control, handleSubmit, setValue } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const onSubmit = (data) => {
    setIsLoading(true);
    updateAffiliate(affiliate?.id, data);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (affiliate) {
      checkBoxList?.forEach((item) => {
        setValue(item?.name, affiliate[item?.name]);
      });
    }
  }, [affiliate]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={4}
          sx={{ pt: 4, px: 4, pb: 2 }}
        >
          <Typography variant="h5">Affiliate Management</Typography>
        </Stack>
        <Stack sx={{ px: 4, pt: 2 }}>
          {checkBoxList?.map((item) => (
            <Controller
              key={item.name}
              name={item.name}
              control={control}
              render={({ field: { onChange = () => { }, value = false } }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value ?? false}
                      onChange={(event) => onChange(event?.target?.checked)}
                    />
                  }
                  label={item?.label}
                />
              )}
            />
          ))}
        </Stack>
        <CardActions sx={{ display: "flex", justifyContent: "end", p: 2 }}>
          <Button disabled={isLoading || !user?.acc?.acc_e_lm_aff} variant="outlined" type="submit">
            Update
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
