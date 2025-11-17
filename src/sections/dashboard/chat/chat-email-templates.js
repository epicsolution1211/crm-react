import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Scrollbar } from "src/components/scrollbar";
import { SelectMenu } from "src/components/customize/select-menu";
import { settingsApi } from "src/api/settings";

const useEmailTemplate = (brandId, setValue) => {
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const detectHtml = (content) => {
    if (!content || typeof content !== 'string') return false;
    const trimmedContent = content.trim();
    return trimmedContent.startsWith('<!doctype html') || 
           trimmedContent.startsWith('<html') ||
           trimmedContent.startsWith('<!DOCTYPE HTML') ||
           trimmedContent.startsWith('<HTML');
  };

  const getEmailTemplates = async () => {
    setIsLoading(true);
    try {
      const { emails } = await settingsApi.getEmailTemplates({
        internal_brand_id: brandId,
      });

      if (emails?.length > 0) {
        setEmailTemplates(
          emails?.map((item) => ({
            value: item.id,
            label: item.name,
            subject: item?.subject ?? "",
            description: item?.content ?? "",
            isHtml: detectHtml(item?.content),
          }))
        );
        setValue("selected_template", emails[0].id);
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (brandId) {
      getEmailTemplates();
    }
  }, [brandId]);

  return { emailTemplates, setEmailTemplates, isLoading };
};

export const ChatEmailTemplates = ({
  open,
  onClose,
  brandId,
  onApplyTemplate,
}) => {
  const { control, setValue } = useForm();
  const { emailTemplates, isLoading } = useEmailTemplate(brandId, setValue);

  const selectedTemplateId = useWatch({ control, name: "selected_template" });
  const currentTemplateInfo = useMemo(
    () =>
      emailTemplates?.find((template) => template?.value == selectedTemplateId),
    [selectedTemplateId, emailTemplates]
  );

  const handleClose = () => {
    onClose();
    setValue("selected_template", null);
  };

  const handleApply = () => {
    onApplyTemplate(currentTemplateInfo);
    setValue("selected_template", null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
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
              Email Templates
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
            list={emailTemplates}
            name="selected_template"
            control={control}
            isSearch
          />
          {selectedTemplateId ? (
            <Stack alignItems="center" justifyContent="center" gap={2}>
              <Card
                sx={{
                  width: 1,
                  py: 2,
                  "&:hover": {
                    "& .hide": {
                      opacity: 1,
                      transition: "opacity 0.2s ease, height 0.2s ease",
                    },
                  },
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: 1,
                    px: 2,
                  }}
                >
                  <Typography fontSize={18} fontWeight={600}>
                    {emailTemplates?.find(
                      (t) => t?.value === selectedTemplateId
                    )?.subject ?? ""}
                  </Typography>
                </Stack>
                <Scrollbar sx={{ height: 250, overflow: "auto", pl: 2, pr: 3 }}>
                  <Stack
                    sx={{
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                      "& p": {
                        my: "4px",
                      },
                    }}
                    dangerouslySetInnerHTML={{
                      __html: emailTemplates?.find(
                        (t) => t?.value === selectedTemplateId
                      )?.description,
                    }}
                  />
                </Scrollbar>
              </Card>
            </Stack>
          ) : (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ minHeight: "32vh" }}
            >
              {emailTemplates?.length > 0
                ? "Select email template"
                : "There is no template"}
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
              <Button
                variant="contained"
                sx={{ width: 100 }}
                onClick={handleApply}
              >
                Apply
              </Button>
              <Button
                variant="outlined"
                sx={{ width: 100 }}
                onClick={handleClose}
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
