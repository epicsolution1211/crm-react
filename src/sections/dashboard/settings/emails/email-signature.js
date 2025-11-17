import * as yup from "yup";
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { QuillEditor } from 'src/components/quill-editor';
import CustomModal from "src/components/customize/custom-modal";
import { Iconify } from "src/components/iconify";
import { brandsApi } from "src/api/lead-management/brand";

const validationSchema = yup.object({
  email_signature: yup
    .string()
    .required("Email signature is a required field")
    .test("no-html-only", "Description is a required field", (value) => {
      return (
        value === "" || !/^\s*<[^>]+>(\s*<[^>]+>\s*)*<\/[^>]+>\s*$/.test(value)
      );
    }),
});

export const EmailSignaure = ({ brandId }) => {
  const [signature, setSignature] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const { control, setValue, reset, handleSubmit, formState: { errors, isSubmitting }} = useForm({ resolver: yupResolver(validationSchema) });
  
  const onSubmit = async (data) => {
    try {
      await brandsApi.updateInternalBrand(brandId, data);
      setSignature(data?.email_signature)
      setModalOpen(false);
      reset();
      toast.success(`Email signature successfully ${signature? "updated" : "saved"}!`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong!"
      );
    } 
  };

  const getEmailSignature = async () => {
    try {
      const res = await brandsApi.getInternalBrands();
      if(res?.internal_brands?.length > 0) {
        const currentBrandInfo = res?.internal_brands?.find((item)=> item?.id === brandId);
        if(currentBrandInfo) {
          setSignature(currentBrandInfo?.email_signature);
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    if(brandId) {
      getEmailSignature();
    }
  }, [brandId]);

  return (
    <>
      <Stack pt={2}>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
        >
          <Stack spacing={1}>
            <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5">
                Email Signature
              </Typography>
              <Tooltip title={signature? "Update signature" : "Add signature" }>
                <IconButton
                  onClick={() => {
                    setModalOpen(true)
                    setValue('email_signature', signature);
                  }}
                  sx={{ color: 'primary.main' }}
                >
                  <Iconify icon={signature ? "mage:edit" : "fluent:add-24-filled" } />
                </IconButton>
              </Tooltip>
            </Stack>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ maxWidth: '95%' }}
            >
              An email signature is a personalized block of text automatically added at the end of emails sent by the system. It typically includes your name, position, company information, or any other details you'd like to share to give your emails a professional touch.
            </Typography>
          </Stack>
        </Stack>
        {signature ?
          <Stack
            sx={{
              p: 2,
              mt: 2,
              backgroundColor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              maxWidth: "100%",
              "& p": {
                my: "2px",
                fontSize: 15,
              },
            }}
            dangerouslySetInnerHTML={{
              __html: signature,
            }}
          />: null
        }
      </Stack>

      <CustomModal
        open={modalOpen}  
        onClose={() => {
          reset();
          setModalOpen(false);
        }}
        width={550}
      >
        <Stack direction="column" gap={3} sx={{ pb: 1 }}>
          <Stack direction="row" justifyContent="center" gap={2} pb={2}>
            <Typography variant="h5">Email Signature</Typography>
          </Stack>
          <Stack>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack
                sx={{
                  width: 1,
                  "& .quill": {
                    transition:
                      "border-color 0.15s ease, border-width 0.15s ease",
                    borderColor:
                      errors?.content?.message?.length > 0
                        ? "error.main"
                        : "auto",
                    borderWidth: errors?.content?.message?.length > 0 ? 2 : 2,
                    "&:focus-within": {
                      borderWidth: 2,
                      borderColor:
                        errors?.content?.message?.length > 0
                          ? "error.main"
                          : "primary.main",
                    },
                  },
                  gap: 1,
                }}
              >
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
                        { height: 300, width: 1, transition: 0.3 },
                        !!errors?.content?.message && {
                          border: "solid 4px",
                          borderColor: "error.main",
                          
                        },
                      ]}
                    />
                  )}
                />
                {!!errors?.content?.message && (
                  <FormHelperText
                    sx={{ px: 2, mt: -1 }}
                    error={!!errors?.content?.message}
                  >
                    {errors?.content?.message}
                  </FormHelperText>
                )}
              </Stack>
              <Stack
                gap={2}
                sx={{
                  width: { md: 1, xs: 1 },
                  px: { md: 0, xs: 12 },
                  pt: 3,
                  flexDirection: "row",
                  justifyContent: { md: "flex-end", xs: "center" },
                }}
              >
                <LoadingButton
                  loading={isSubmitting}
                  variant="contained"
                  type="submit"
                  sx={{
                    width: 100,
                  }}
                >
                  {signature? "Update" : "Save"}
                </LoadingButton>
                <Button
                  variant="outlined"
                  sx={{ width: 100 }}
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
              </Stack>
            </form>
          </Stack>
        </Stack>
      </CustomModal>
    </>
  )
};
