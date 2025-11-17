import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import { WhatsAppTemplateList } from "./whatsapp-template-list";
import { brandsApi } from "src/api/lead-management/brand";
import { DeleteModal } from "src/components/customize/delete-modal";
import { useSettings } from "src/hooks/use-settings";
import { useCssVars } from "src/layouts/dashboard/vertical-layout/side-nav";
import { EditWhatsAppTemplateModal } from "./whatsapp-templates-add";
import { TableNoData } from "src/components/table-empty";

export const WhatsAppTemplates = ({ brandId }) => {
  const settings = useSettings();
  const cssVars = useCssVars(settings.navColor);
  const [whatsappTemplateList, setWhatsappTemplateList] = useState([]);
  const [selectedWhatsappTemplateId, setSelectedWhatsappTemplateId] = useState();
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedEditInfo, setSelectedEditInfo] = useState(undefined);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [addBtn, setAddBtn] = useState(false);

  const getWhatsappTemplateList = async () => {
    try {
      const response = await brandsApi.getWhatsAppTemplates(brandId);
      setWhatsappTemplateList(response?.templates || []);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const handleDeleteWhatsappTemplate = async () => {
    try {
      await brandsApi.deleteWhatsAppTemplate(brandId, selectedWhatsappTemplateId);

      const newList = whatsappTemplateList.filter(
        (item) => item.id !== selectedWhatsappTemplateId
      );
      setWhatsappTemplateList(newList);
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

  const updateWhatsappTemplates = (data, isUpdate) => {
    // Handle direct template object or wrapped response
    const template = data.whatsapp_template || data;
    
    
    // Ensure template has all required fields with defaults
    const processedTemplate = {
      ...template,
      active: template.active !== undefined ? template.active : true,
      status: template.status || "PENDING",
      approved: template.approved !== undefined ? template.approved : false,
      can_be_used: template.can_be_used !== undefined ? template.can_be_used : false,
    };
    
    if (isUpdate) {
      const newList = whatsappTemplateList.map((item) =>
        item.id == processedTemplate.id ? processedTemplate : item
      );
      setWhatsappTemplateList(newList);
    } else {
      const newList = [...whatsappTemplateList, processedTemplate];
      setWhatsappTemplateList(newList);
    }
  };

  const handleToggleActive = async (templateId, currentActiveStatus) => {
    try {
      await brandsApi.updateWhatsAppTemplate(brandId, templateId, {
        active: !currentActiveStatus
      });
      
      // Update the template in the list
      const updatedList = whatsappTemplateList.map((item) =>
        item.id === templateId ? { ...item, active: !currentActiveStatus } : item
      );
      setWhatsappTemplateList(updatedList);
      
      toast.success(`Template ${!currentActiveStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error("Error updating template status:", error);
      toast.error("Failed to update template status");
    }
  };

  useEffect(() => {
    if (!addBtn) {
      setSelectedEditInfo(whatsappTemplateList?.find((t) => t.id == selectedWhatsappTemplateId));
    }
  }, [selectedWhatsappTemplateId, isOpenEditModal]);

  useEffect(() => {
    if (brandId) {
      setSelectedWhatsappTemplateId(undefined);
      getWhatsappTemplateList();
    }
  }, [brandId]);

  const renderTemplatePreview = () => {
    const selectedTemplate = whatsappTemplateList?.find(
      (t) => t?.id === selectedWhatsappTemplateId
    );

    if (!selectedTemplate) return null;

    const bodyComponent = selectedTemplate?.components?.find(comp => comp.type === "BODY");
    const footerComponent = selectedTemplate?.components?.find(comp => comp.type === "FOOTER");

    return (
      <Paper
        sx={{
          ...cssVars,
          backgroundColor:
            settings.paletteMode == "dark"
              ? "var(--nav-bg)"
              : "background.default",
          py: 2,
          px: 3,
          boxShadow: 8,
          border: 1,
          borderColor: "background.default",
          minHeight: { md: "calc(100vh - 520px)", xs: "auto" },
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography 
              variant="subtitle1"
              sx={{ fontWeight: 700 }}
            >
              {selectedTemplate?.name}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={selectedTemplate?.active || false}
                  onChange={() => handleToggleActive(selectedTemplate?.id, selectedTemplate?.active)}
                  color="primary"
                />
              }
              label="Active"
              labelPlacement="start"
              sx={{ ml: 2 }}
            />
          </Stack>
          
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Category: {selectedTemplate?.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Language: {selectedTemplate?.language}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {selectedTemplate?.status}
              </Typography>
            </Stack>

            {bodyComponent && (
              <Stack spacing={1}>
                <Typography variant="body2" fontWeight="600" color="primary.main">
                  Body:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: "action.hover" }}>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {bodyComponent.text}
                  </Typography>
                </Paper>
              </Stack>
            )}

            {footerComponent && (
              <Stack spacing={1}>
                <Typography variant="body2" fontWeight="600" color="primary.main">
                  Footer:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: "action.hover" }}>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {footerComponent.text}
                  </Typography>
                </Paper>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Paper>
    );
  };

  return (
    <>
      <Paper sx={{ px: 2, mb: -2, pb: 4, minHeight: "calc(100vh - 360px)" }}>
        {brandId && (
          <Button
            sx={{ mt: 2 }}
            onClick={() => {
              setSelectedEditInfo(undefined);
              setAddBtn(true);
              setIsOpenEditModal(true);
            }}
          >
            Add Template
          </Button>
        )}
        <Grid
          container
          sx={{ mt: 2 }}
          direction={"row"}
          justifyContent={"space-between"}
        >
          {whatsappTemplateList?.length > 0 ? (
            <>
              <Grid md={4} xs={12}>
                <Paper>
                  <WhatsAppTemplateList
                    setIsOpenDeleteModal={setIsOpenDeleteModal}
                    setIsOpenEditModal={setIsOpenEditModal}
                    whatsappTemplateList={whatsappTemplateList}
                    setAddBtn={setAddBtn}
                    setWhatsappTemplateList={setWhatsappTemplateList}
                    selectedWhatsappTemplateId={selectedWhatsappTemplateId}
                    setSelectedWhatsappTemplateId={setSelectedWhatsappTemplateId}
                  />
                </Paper>
              </Grid>
              <Grid md={8} xs={12} sx={{ mt: { xs: 4, md: 0 } }}>
                <Stack sx={{ minHeight: { md: "calc(100vh - 520px)", xs: "auto" } }}>
                  {selectedWhatsappTemplateId ? (
                    renderTemplatePreview()
                  ) : (
                    <Stack
                      spacing={2}
                      sx={{ minHeight: "28vh", fontSize: "20", px: 5 }}
                    >
                      Select WhatsApp template
                    </Stack>
                  )}
                </Stack>
              </Grid>
            </>
          ) : (
            <Stack
              sx={{
                textAlign: "center",
                verticalAlign: "center",
                px: 2,
                width: 1,
                height: 1,
              }}
            >
              <TableNoData label="There are no WhatsApp templates" />
            </Stack>
          )}

          <EditWhatsAppTemplateModal
            open={isOpenEditModal}
            brandId={brandId}
            onClose={() => {
              setIsOpenEditModal(false);
            }}
            setIsOpenEditModal={setIsOpenEditModal}
            selectedValue={selectedWhatsappTemplateId}
            selectedEditInfo={selectedEditInfo}
            updateWhatsappTemplates={updateWhatsappTemplates}
            onGetWhatsappTemplateList={getWhatsappTemplateList}
          />
          <DeleteModal
            isOpen={isOpenDeleteModal}
            setIsOpen={() => setIsOpenDeleteModal(false)}
            onDelete={() => handleDeleteWhatsappTemplate()}
            title={"Delete WhatsApp Template"}
            description={"Are you sure you want to delete this WhatsApp template?"}
          />
        </Grid>
      </Paper>
    </>
  );
};
