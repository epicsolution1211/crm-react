import { useEffect, useState } from 'react';
import * as yup from "yup";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { SelectMenu } from "src/components/customize/select-menu";
import { affiliateApi } from "src/api/lead-management/affiliate";
import { Iconify } from 'src/components/iconify';

const validationSchema = yup.object({
  account_id: yup.string().required('Affiliate is required field.'),
});

export const AffiliateStep = ({ onBack, onNext, affiliate }) => {
  const { handleSubmit, control, reset } = useForm({ resolver: yupResolver(validationSchema) });
  const [affiliateList, setAffiliateList] = useState([]);

  const affiliateId = useWatch({ control, name: 'account_id' });

  const getAffiliate = async () => {
    try {
      const res = await affiliateApi.getAffiliates();
      const affiliateInfo = res?.affiliates?.map((item) => (
        { label: item?.full_name, value: item?.id }
      ));
      setAffiliateList(affiliateInfo);
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const onSubmit = (data) => {
    onNext(data);
  };

  useEffect(() => {
    getAffiliate();
  }, []);

  useEffect(() => {
    if (affiliateList?.length) {
      reset({ 'account_id': Number(affiliate?.account_id) ?? affiliateList[0]?.value });
    }
  }, [affiliateList]);

  return (
    <Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <SelectMenu
            control={control}
            label="Affiliate *"
            name="account_id"
            list={affiliateList}
          />
        </Stack>
        <Stack alignItems="center"
          direction="row"
          sx={{ mt: 3 }}
          spacing={2}>
          <Button
            endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
            disabled={!affiliateId}
            type="submit"
            variant="contained"
          >
            Continue
          </Button>
          <Button
            color="inherit"
            onClick={onBack}
          >
            Back
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};
