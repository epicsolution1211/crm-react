import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { EmailTemplateList } from "./email-template-list";
import { emailTemplateApi } from "src/api/emailTemplate";
import { DeleteModal } from "src/components/customize/delete-modal";
import { useSettings } from "src/hooks/use-settings";
import { useCssVars } from "src/layouts/dashboard/vertical-layout/side-nav";
import { EditEmailTemplateModal } from "./email-templates-add";
import { brandsApi } from "src/api/lead-management/brand";
import { Scrollbar } from "src/components/scrollbar";
import { TableNoData } from "src/components/table-empty";

export const useInternalBrands = () => {
  const [internalBrandsList, setInternalBrandsList] = useState([]);

  const getBrands = async () => {
    try {
      const res = await brandsApi.getInternalBrands();
      const brandsInfo = res?.internal_brands?.map((brand) => ({
        label: brand?.company_name,
        value: brand?.id,
      }));
      setInternalBrandsList(brandsInfo);
    } catch (error) {
      console.error(error);
    } 
  };

  useEffect(() => {
    getBrands();
  }, []);

  return { internalBrandsList };
};

export const EmailTemplate = ({ brandId }) => {
  const settings = useSettings();
  const cssVars = useCssVars(settings.navColor);
  const [emailTemplateList, setEmailTemplateList] = useState([]);
  const [selectedEmailTemplateId, setSelectedEmailTemplateId] = useState();
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedEditInfo, setSelectedEditInfo] = useState(undefined);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [addBtn, setAddBtn] = useState(false);
  const getEmailTemplateList = async () => {
    try {
      const { emails } = await emailTemplateApi.getEmailTemplates({
        internal_brand_id: brandId,
      });
      setEmailTemplateList(emails);
    } catch (error) {
      console.error("error: ", error);
    } 
  };

  const handleDeleteEmailTemplate = async () => {
    try {
      await emailTemplateApi.deleteEmailTemplate(selectedEmailTemplateId);

      const newList = emailTemplateList.filter(
        (item) => item.id !== selectedEmailTemplateId
      );
      setEmailTemplateList(newList);
      toast.success("Template successfully deleted!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong."
      );
      console.error("error: ", error);
    } finally {
      setIsOpenDeleteModal(false);
    }
  };
  const updateEmailTemplates = (data, isUpdate) => {
    if (isUpdate) {
      const newList = emailTemplateList.map((item) =>
        item.id == data.email.id ? data.email : item
      );
      setEmailTemplateList(newList);
    } else {
      setEmailTemplateList([...emailTemplateList, data.email]);
    }
  };

  useEffect(() => {
    if (!addBtn) {
      setSelectedEditInfo(emailTemplateList?.find((t) => t.id == selectedEmailTemplateId));
    }
  }, [selectedEmailTemplateId, isOpenEditModal]);

  useEffect(() => {
    if (brandId) {
      setSelectedEmailTemplateId(undefined);
      getEmailTemplateList();
    }
  }, [brandId]);

  return (
    <>
      <Paper sx={{ px: 2, mb: -2, pb: 4, minHeight:"calc(100vh - 360px)"}}>
        {brandId && (
          <Button
            sx={{ mt: 2 }}
            onClick={() => {
              setSelectedEditInfo(undefined);
              setAddBtn(true);
              setIsOpenEditModal(true);
            }}
          >
            Add
          </Button>
        )}
        <Grid
          container
          sx={{ mt: 2 }}
          direction={"row"}
          justifyContent={"space-between"}
        >
          { emailTemplateList?.length > 0 ?
          <>
            <Grid md={4} xs={12} >
              <Paper>
                <EmailTemplateList
                  setIsOpenDeleteModal={setIsOpenDeleteModal}
                  setIsOpenEditModal={setIsOpenEditModal}
                  emailTemplateList={emailTemplateList}
                  setAddBtn={setAddBtn}
                  setEmailTemplateList={setEmailTemplateList}
                  selectedEmailTemplateId={selectedEmailTemplateId}
                  setSelectedEmailTemplateId={setSelectedEmailTemplateId}
                />
              </Paper>
            </Grid>
            <Grid  md={8} xs={12} sx={{
              mt:{xs:4,md:0}
            }}>
              <Stack sx={{minHeight:{ md: "calc(100vh - 520px)", xs: "auto" }}}>
                {selectedEmailTemplateId ? (
                      <Paper
                      sx={{
                        ...cssVars,
                        backgroundColor:
                          settings.paletteMode == "dark"
                            ? "var(--nav-bg)"
                            : "background.default",
                        py: 1.5,
                        px: 2,
                        boxShadow: 8,
                        border: 1,
                        borderColor: "background.default",
                        minHeight: { md: "calc(100vh - 520px)", xs: "auto" },
                      }}
                    >
                      <Typography 
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700
                        }}
                      >
                        {emailTemplateList?.find(
                          (t) => t?.id === selectedEmailTemplateId
                        )?.subject ?? ""}
                      </Typography>
                      <Scrollbar
                        sx={{
                          pr:2,
                          height: { md: "calc(100vh - 520px)", xs: "auto" },
                        }}
                        >
                        <Stack
                          sx={{
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            '& p': {
                              margin: '0 0 6px 0'
                            }
                          }}
                          className="email-template-content"
                          dangerouslySetInnerHTML={{
                            __html: emailTemplateList?.find(
                              (t) => t?.id === selectedEmailTemplateId
                            )?.content,
                          }}
                        />
                      </Scrollbar>
                  </Paper>
                ) : (
                  <Stack
                    spacing={2}
                    sx={{ minHeight: "28vh", fontSize: "20", px: 5 }}
                  >
                    Select email template
                  </Stack>
                )}
              </Stack>
            </Grid>
          </>
           : 
           <Stack 
            sx={{
               textAlign:'center',
               verticalAlign:'center',
               px: 2,
               width: 1,
               height: 1,
            }}>
            <TableNoData label="There is no data" />
           </Stack>}

          <EditEmailTemplateModal
            open={isOpenEditModal}
            brandId={brandId}
            onClose={() => {
              setIsOpenEditModal(false);
            }}
            setIsOpenEditModal={setIsOpenEditModal}
            selectedValue={selectedEmailTemplateId}
            selectedEditInfo={selectedEditInfo}
            updateEmailTemplates={updateEmailTemplates}
          />
          <DeleteModal
            isOpen={isOpenDeleteModal}
            setIsOpen={() => setIsOpenDeleteModal(false)}
            onDelete={() => handleDeleteEmailTemplate()}
            title={"Delete Form"}
            description={"Are you sure you want to delete this form?"}
          />
        </Grid>
      </Paper>
    </>
  );
};
