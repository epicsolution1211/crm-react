import * as yup from "yup";
import { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { Iconify } from 'src/components/iconify';
import { brandsApi } from "src/api/lead-management/brand";
import { SelectMenu } from "src/components/customize/select-menu";
import { BrandStatusEditDialog } from "src/sections/dashboard/lead-management/status-create/brand-status-edit-dialog";

const validationSchema = yup.object({
  brand_id: yup.string().required('Brand is required field.'),
  brand_status: yup.string().required('Brand status is a required field'),
});

export const BrandStep = ({ onBack, onNext, brand }) => {
  const { handleSubmit, control, reset } = useForm({ resolver: yupResolver(validationSchema) });

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [brandsList, setBrandsList] = useState([]);
  const [brandStatusesList, setBrandStatusesList] = useState([]);

  const getBrands = async () => {
    try {
      const res = await brandsApi.getBrands();
      const brandsInfo = res?.brands?.map((item) => (
        { label: item?.name, value: item?.id, default: item?.default }
      ));
      setBrandsList(brandsInfo);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const getBrandStatuses = async () => {
    try {
      const res = await brandsApi.getBrandStatuses();
      const brandStatusInfo = res?.status?.map((item) => (
        { label: item?.name, value: item?.id }
      ));
      setBrandStatusesList(brandStatusInfo);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  const onSubmit = (data) => {
    onNext(data)
  };

  useEffect(() => {
    getBrands();
    getBrandStatuses();
  }, []);

  useEffect(() => {
    reset({
      'brand_id': brand?.brand_id ?? brandsList[0]?.value,
      'brand_status': brand?.brand_status ?? brandStatusesList[0]?.value
    })
  }, [brandsList, brandStatusesList]);

  return (
    <Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <SelectMenu
            control={control}
            label="Brand"
            name="brand_id"
            list={brandsList}
          />
          <SelectMenu
            control={control}
            label="Brand Status*"
            name="brand_status"
            list={brandStatusesList}
            isLabel
            openModal={() => setOpenStatusModal(true)}
          />
        </Stack>
        <Stack alignItems="center"
          direction="row"
          sx={{ mt: 3 }}
          spacing={2}>
          <Button
            endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
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

      <BrandStatusEditDialog
        title="Edit Brand Status"
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        getStatusList={() => getBrandStatuses()}
        onGetStatuses={() => getBrandStatuses()}
      />
    </Stack>
  );
};
