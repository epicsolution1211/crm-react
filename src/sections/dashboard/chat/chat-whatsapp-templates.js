import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";

import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

import { Scrollbar } from "src/components/scrollbar";
import { SelectMenu } from "src/components/customize/select-menu";
import { brandsApi } from "src/api/lead-management/brand";

const useWhatsAppTemplate = (brandId, setValue) => {
  const [whatsappTemplates, setWhatsappTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getWhatsAppTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await brandsApi.getWhatsAppTemplates(brandId);
      const templates = response?.templates || [];

      if (templates?.length > 0) {
        // Filter only active templates that can be used
        const availableTemplates = templates.filter(template => 
          template.active && template.can_be_used && template.status === "APPROVED"
        );

        setWhatsappTemplates(
          availableTemplates?.map((item) => ({
            value: item.id,
            label: item.name,
            template: item,
            // Extract body text from components
            bodyText: item?.components?.find(comp => comp.type === "BODY")?.text || "",
            // Extract footer text from components
            footerText: item?.components?.find(comp => comp.type === "FOOTER")?.text || "",
            // Extract header text from components
            headerText: item?.components?.find(comp => comp.type === "HEADER")?.text || "",
            category: item.category,
            language: item.language,
            status: item.status
          }))
        );
        
        if (availableTemplates.length > 0) {
          setValue("selected_template", availableTemplates[0].id);
        }
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (brandId) {
      getWhatsAppTemplates();
    }
  }, [brandId]);

  return { whatsappTemplates, setWhatsappTemplates, isLoading };
};

export const ChatWhatsAppTemplates = ({
  open,
  onClose,
  brandId,
  onSendTemplate,
}) => {
  const { control, setValue } = useForm();
  const { whatsappTemplates, isLoading } = useWhatsAppTemplate(brandId, setValue);
  const [isSending, setIsSending] = useState(false);

  const selectedTemplateId = useWatch({ control, name: "selected_template" });
  const currentTemplateInfo = useMemo(
    () =>
      whatsappTemplates?.find((template) => template?.value == selectedTemplateId),
    [selectedTemplateId, whatsappTemplates]
  );

  const handleClose = () => {
    onClose();
    setValue("selected_template", null);
  };

  const handleSend = async () => {
    if (currentTemplateInfo) {
      setIsSending(true);
      try {
        // Format the template content for WhatsApp
        let messageContent = "";
        
        if (currentTemplateInfo.headerText) {
          messageContent += `${currentTemplateInfo.headerText}\n\n`;
        }
        
        if (currentTemplateInfo.bodyText) {
          messageContent += currentTemplateInfo.bodyText;
        }
        
        if (currentTemplateInfo.footerText) {
          messageContent += `\n\n${currentTemplateInfo.footerText}`;
        }

        // Send template message directly
        onSendTemplate({
          description: messageContent,
          template: currentTemplateInfo.template,
          templateId: currentTemplateInfo.value,
          templateName: currentTemplateInfo.label
        });
        
        // Show success toast
        toast.success("WhatsApp template sent successfully!");
        
        setValue("selected_template", null);
        onClose();
      } catch (error) {
        console.error('Error sending WhatsApp template:', error);
        toast.error("Failed to send WhatsApp template. Please try again.");
      } finally {
        setIsSending(false);
      }
    }
  };

  const renderTemplatePreview = () => {
    if (!currentTemplateInfo) return null;

    return (
      <Card
        sx={{
          width: 1,
          py: 2,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider'
        }}
      >
        <Stack spacing={2} sx={{ px: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography fontSize={18} fontWeight={600}>
              {currentTemplateInfo.label}
            </Typography>
            <Chip 
              size="small" 
              label={currentTemplateInfo.status} 
              color="success" 
              variant="outlined"
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Chip 
              size="small" 
              label={currentTemplateInfo.category} 
              variant="outlined"
            />
            <Chip 
              size="small" 
              label={currentTemplateInfo.language} 
              variant="outlined"
            />
          </Stack>

          <Scrollbar sx={{ height: 200, overflow: "auto" }}>
            <Stack spacing={2}>
              {currentTemplateInfo.headerText && (
                <Box>
                  <Typography variant="body2" fontWeight={600} color="primary.main" gutterBottom>
                    Header:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      whiteSpace: "pre-wrap",
                      bgcolor: "action.hover",
                      p: 1,
                      borderRadius: 1
                    }}
                  >
                    {currentTemplateInfo.headerText}
                  </Typography>
                </Box>
              )}

              {currentTemplateInfo.bodyText && (
                <Box>
                  <Typography variant="body2" fontWeight={600} color="primary.main" gutterBottom>
                    Body:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      whiteSpace: "pre-wrap",
                      bgcolor: "action.hover",
                      p: 1,
                      borderRadius: 1
                    }}
                  >
                    {currentTemplateInfo.bodyText}
                  </Typography>
                </Box>
              )}

              {currentTemplateInfo.footerText && (
                <Box>
                  <Typography variant="body2" fontWeight={600} color="primary.main" gutterBottom>
                    Footer:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      whiteSpace: "pre-wrap",
                      bgcolor: "action.hover",
                      p: 1,
                      borderRadius: 1
                    }}
                  >
                    {currentTemplateInfo.footerText}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Scrollbar>
        </Stack>
      </Card>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Container
        sx={{
          p: 5,
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Stack direction="column" gap={2}>
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              WhatsApp Templates
            </Typography>
            <Stack
              sx={{
                position: "absolute",
              }}
            >
              {isLoading && <CircularProgress size={24} />}
            </Stack>
          </Stack>
          
          <SelectMenu
            label="Select a Template"
            list={whatsappTemplates}
            name="selected_template"
            control={control}
            isSearch
          />
          
          {selectedTemplateId ? (
            <Stack alignItems="center" justifyContent="center" gap={2}>
              {renderTemplatePreview()}
            </Stack>
          ) : (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ minHeight: "32vh" }}
            >
              {whatsappTemplates?.length > 0
                ? "Select WhatsApp template"
                : "There are no approved WhatsApp templates available"}
            </Stack>
          )}
          
          <Stack
            direction="row"
            sx={{
              justifyContent: "flex-end",
              alignItems: "center",
              width: 1,
            }}
          >
            <Stack direction="row" gap={2}>
              <LoadingButton
                variant="contained"
                sx={{ width: 100 }}
                onClick={handleSend}
                disabled={!selectedTemplateId}
                loading={isSending}
                loadingPosition="center"
              >
                Send
              </LoadingButton>
              <Button
                variant="outlined"
                sx={{ width: 100 }}
                onClick={handleClose}
                disabled={isSending}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Dialog>
  );
};
