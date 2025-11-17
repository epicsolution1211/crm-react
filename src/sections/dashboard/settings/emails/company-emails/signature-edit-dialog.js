import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { companyEmailsApi } from "src/api/company-emails";
import { QuillEditor } from "src/components/quill-editor";
import CustomModal from "src/components/customize/custom-modal";

export const SignatureEditDialog = ({ open, onClose, brandId, companyId, email, onGetEmails }) => {
  const { control, handleSubmit, setValue, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    if (email?.email_signature) {
      setValue("email_signature", email.email_signature);
    } else {
      reset();
    }
  }, [email, setValue]);

  const onSubmit = async (data) => {
    const signuature = data?.email_signature === "<p><br></p>" ? "" : data?.email_signature;
    try {
      const request = { 
        ...email, 
        internal_brand_id: brandId, 
        company_id: companyId,
        email_signature: signuature,
      };
      await companyEmailsApi.updateCompanyEmail(email?.id, request);
      toast.success("Signature successfully updated!");
      onGetEmails();
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <CustomModal
      open={open}  
      onClose={onClose}
      width={550}
    >
      <Stack direction="column" gap={3}>
        <Typography variant="h5" align="center">Email Signature</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack sx={{ width: 1, gap: 1 }}>
            <Controller
              control={control}
              name="email_signature"
              render={({ field: { value, onChange } }) => (
                <QuillEditor
                  className="email_signature"
                  value={value}
                  onChange={onChange}
                  placeholder="Write a text content"
                  sx={[
                    { height: 300, width: 1, transition: "0.3s" },
                  ]}
                />
              )}
            />
          </Stack>
          <Stack
            gap={2}
            sx={{
              width: 1,
              pt: 3,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <LoadingButton loading={isSubmitting} variant="contained" type="submit" sx={{ width: 100 }}>
              {email?.email_signature ? "Update" : "Save"}
            </LoadingButton>
            <Button variant="outlined" sx={{ width: 100 }} onClick={onClose}>
              Cancel
            </Button>
          </Stack>
        </form>
      </Stack>
    </CustomModal>
  );
};
