import { useState, useEffect } from "react";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from '@mui/lab/LoadingButton';

import AccountTable from "./account-table";
import CustomModal from "src/components/customize/custom-modal";
import { settingsApi } from "src/api/settings";
import { DeleteModal } from "src/components/customize/delete-modal";
import CustomSwitch from "src/components/customize/custom-switch";

const validationSchema = Yup.object({
  name: Yup.string().required("Account type name is required"),
  friendly_name: Yup.string().required("Friendly name is required"),
  enabled: Yup.boolean(),
  demo: Yup.boolean(),
});

export const AccountType = ({ brandId }) => {
  const { register, handleSubmit, reset, setValue, control, formState : { errors, isSubmitting } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      enabled: true
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [defaultAccountType, setDefaultAccountType] = useState();
  const [accountTypes, setAccountTypes] = useState([]);

  const [selectedAccountType, setSelectedAccountType] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      if (isUpdate) {
        await settingsApi.updateAccountType(selectedAccountType.id, {
          ...data,
          internal_brand_id: brandId,
        });
      } else {
        await settingsApi.createAccountType({
          ...data,
          internal_brand_id: brandId,
        });
      }
      getAccountType();
      toast(
        `${
          isUpdate
            ? "Account type successfully updated!"
            : "Account type successfully created!"
        }`
      );
    } catch (error) {
      console.error('error: ', error);
      toast.error(error?.response?.data?.message ?? 'Something went wrong!');
    } finally {
      setModalOpen(false);
    }
  }
  
  const getAccountType = async () => {
    setIsLoading(true);
    try {
      const res = await settingsApi.getAccountType({
        internal_brand_id: brandId,
      });
      setDefaultAccountType(res.default_account_type);
      setAccountTypes(res.account_types);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const handleDefaultAccountType = async (existing) => {
    try {
      const request = {
        accountTypeId: defaultAccountType?.id,
        default_type: true,
        internal_brand_id: brandId,
      };
      if (existing) {
        request.update_exisiting = true;
      }
      const res = await settingsApi.updateAccountType(defaultAccountType?.id, request);
      setDefaultAccountType(res.account_type);
      getAccountType();
      toast(`Default account type is changed to "${res?.account_type?.name}"`);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const deleteAccountType = async () => {
    setIsDeleteLoading(true);
    try {
      await settingsApi.deleteAccountType(selectedAccountType.id);
      await getAccountType();
      toast.success("Account type successfully deleted!");
    } catch (error) {
      toast.error(error?.response?.data?.message??'Something went wrong!');
    }
    setIsDeleteLoading(false);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    getAccountType();
  }, [brandId]);

  return (
    <>
      <Stack sx={{ height: 1, p: { xs: 2, md: 4 }, bgcolor: 'background.paper' }}>
        <Stack sx={{ gap: 1, pb: 3 }}>
          <Typography variant="h6" sx={{ color: "text.primary" }}>
            Account Type
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            List of all customers plans in client dashboard
          </Typography>
        </Stack>
        <Stack sx={{ gap: 1, pb: 3 }}>
          <Typography variant="h6" sx={{ color: "text.primary", pb: 1 }}>
            Default Account Type
          </Typography>
          <Stack direction="row" alignItems="center" spacing={4} justifyContent="space-between">
            <Autocomplete
              options={accountTypes?.map((item) => ({
                label: item.name,
                id: item.id,
              }))}
              value={defaultAccountType?.name ?? defaultAccountType?.label ?? ""}
              onChange={(event, newValue) => {
                if (newValue) {
                  setDefaultAccountType(newValue);
                }
              }}
              sx={{ width: { md: 300, xs: 250 }, height: 50 }}
              renderInput={(params) => (
                <TextField {...params} label="Account Type" />
              )}
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Button variant="contained" onClick={() => handleDefaultAccountType(true)}>Update All Clients</Button>
              <Button variant="contained" onClick={() => handleDefaultAccountType(false)}>Update Future Clients Only</Button>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pb: 3 }}
        >
          <Typography variant="h6" sx={{ color: "text.primary" }}>
            Available Plan
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setModalOpen(true);
              setIsUpdate(false);
              reset();
            }}
          >
            Add Plan
          </Button>
        </Stack>
        <Stack>
          <AccountTable
            isLoading={isLoading}
            accountTypes={accountTypes}
            selectedAccountType={selectedAccountType}
            setSelectedAccountType={setSelectedAccountType}
            setDeleteModalOpen={setDeleteModalOpen}
            editAccount={(account) => {
              setModalOpen(true);
              setIsUpdate(true);
              setValue('name', account.name);
              setValue('friendly_name', account.friendly_name);
              setValue('enabled', account.enabled);
              setValue('demo', account.demo);
            }}
          />
        </Stack>
      </Stack>
      <CustomModal onClose={() => setModalOpen(false)} open={modalOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              align="center"
              sx={{ fontSize: 22, fontWeight: "bold" }}
            >
              {isUpdate ? "Update account type" : "Create new account type"}
            </Typography>
            <Stack spacing={2} sx={{ py: 3 }}>
              <TextField
                fullWidth
                autoFocus
                error={!!(errors?.name?.message)}
                helperText={errors?.name?.message}
                label="Account Type Name"
                {...register('name')}
                type="text"
              />
              <TextField
                fullWidth
                error={!!(errors?.friendly_name?.message)}
                helperText={errors?.friendly_name?.message}
                label="Friendly Name"
                {...register('friendly_name')}
                type="text"
              />
              <Stack direction="row" spacing={2}>
                <CustomSwitch control={control} name="enabled" label="Enabled" />
                <CustomSwitch control={control} name="demo" label="Demo" />
              </Stack>
            </Stack>
            <Stack sx={{ gap: 2 }} direction="row" justifyContent="center">
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                disabled={isSubmitting}
                type="onSubmit"
              >
                {isUpdate ? "Update" : "Create"}
              </LoadingButton>
              <Button variant="outlined" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </CustomModal>
      <DeleteModal
        isLoading={isDeleteLoading}
        isOpen={deleteModalOpen}
        setIsOpen={() => setDeleteModalOpen(false)}
        onDelete={() => deleteAccountType()}
        title={"Delete account type"}
        description={"Are you sure you want to delete this account type?"}
      />
    </>
  );
}; 