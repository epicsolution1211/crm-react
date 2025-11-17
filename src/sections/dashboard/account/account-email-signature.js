import * as yup from "yup";
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CustomModal from "src/components/customize/custom-modal";
import { QuillEditor } from 'src/components/quill-editor';
import { useAuth } from 'src/hooks/use-auth';
import { userApi } from 'src/api/user';

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

export const AccountEmailSignaureSection = () => {
  const { user, refreshUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const { control, setValue, reset, handleSubmit, formState: { errors, isSubmitting }} = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = async (data) => {
    try {
      await userApi.updateUser(user?.id, data);
      setTimeout(() => {
        refreshUser();
      }, 1000);
      setModalOpen(false);
      reset();
      toast.success(`Email signature successfully ${user?.email_signature? "updated" : "saved"}!`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong!"
      );
    } 
  };

  useEffect(() => {
    if(user?.email_signature) {
      setValue('email_signature', user?.email_signature);
    }
  }, [user])

  return (
    <>
      <Stack>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          gap={2}
        >
          <Stack spacing={1}>
            <Typography variant="subtitle1">
              Email Signature
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              An email signature is a personalized block of text automatically added at the end of emails sent by the system. It typically includes your name, position, company information, or any other details you'd like to share to give your emails a professional touch.
            </Typography>
          </Stack>
          <Button variant='outlined' sx={{ minWidth: 80 }} onClick={() => setModalOpen(true)}>{user?.email_signature? "Update" : "Add"}</Button>
        </Stack>
        {user?.email_signature ?
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
              __html: user?.email_signature,
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
                  {user?.email_signature? "Update" : "Save"}
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
