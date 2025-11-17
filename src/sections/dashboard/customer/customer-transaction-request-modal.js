import { useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { getAPIUrl } from 'src/config';
import { isValidJSON } from "src/utils/function";

export const TransactionRequestModal = ({
  open,
  onClose,
  docInfo = [],
  requestInfo = [],
  bankDetailList =[],
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n?.resolvedLanguage;

  const [ loadingStatus, setLoadingStatus ] = useState({ name: undefined, loading: false });

  const formatText = (text) => {
    return text?.replace(/_/g, ' ')?.replace(/\b\w/g, c => c.toUpperCase()); 
  }

  const handleDownloadFile = async (name, url, contentType) => {
    if (url) {
    setLoadingStatus({ name, loading: true });
      try {
        const response = await fetch(`${getAPIUrl()}/${url}`, {
          headers: {
            Accept: contentType,
          },
        });
    
        if (!response.ok) {
          throw new Error("File download failed");
        }
    
        const blob = await response.blob();
        const extension = contentType?.split("/")[1] || "";
        const filename = `${name || "download"}.${extension}`;
        const blobUrl = window.URL.createObjectURL(blob);
    
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Download error:", error);
      }
        setLoadingStatus({ name: undefined, loading: false });
      }
  };

  const renderRequestInfo = (requestInfo) => {
    if (Array.isArray(requestInfo)) {
      return (
        requestInfo?.map((item, index) => {
          let hasCopyButton = false;
          const currentFormSetting = bankDetailList?.find((bankDetail)=> bankDetail.id == item?.form_id)?.settings;
          if(currentFormSetting?.length > 0 ) {
            const isCopyShown =  currentFormSetting?.find((setting)=> setting.id == item.id)?.isShowCopy ?? false;
            hasCopyButton = isCopyShown;
          }
          if(item.inputType === 4 ) {
            let formNameInfo = {};
            let formValueInfo = {};

            if (isValidJSON(item?.name)) {
              const parsedForm = JSON.parse(item?.name);
              formNameInfo = {...parsedForm};
            } else {
              formNameInfo.en = item?.name;
            }

            if (isValidJSON(item?.value)) {
              const parsedValue = JSON.parse(item?.value);
              formValueInfo = {...parsedValue};
            } else {
              formValueInfo.en = item?.value;
            }
            return (
              <Stack key={index} gap={0.5}>
                <Stack direction='row' alignItems='center' gap={1}>
                  <Typography fontWeight={600}>{formNameInfo?.[currentLang]?.length > 0 ? formNameInfo?.[currentLang] : formNameInfo?.en ?? ""}:</Typography>
                </Stack>
                <Stack 
                  sx={{ 
                    width: 1,
                    background: 'white',
                    borderRadius: 0.5,
                  }}
                >
                  <Box
                    component="img"
                    alt="Signature"
                    src={formValueInfo?.[currentLang]?.length > 0 ? formValueInfo?.[currentLang] : formValueInfo?.en ?? ""}
                    sx={{
                      border: 1,
                      borderColor: 'divider' 
                    }}
                  />
                </Stack>
              </Stack>
            )
          } else {
            let formNameInfo = {};
            let formValueInfo = {};

            if (isValidJSON(item?.name)) {
              const parsedForm = JSON.parse(item?.name);
              formNameInfo = {...parsedForm};
            } else {
              formNameInfo.en = item?.name;
            }

            if (isValidJSON(item?.value)) {
              const parsedValue = JSON.parse(item?.value);
              formValueInfo = {...parsedValue};
            } else {
              if(Array.isArray(item?.value)) {
                const parsedArray = item?.value?.map((item)=> JSON.parse(item));
                parsedArray.forEach(item => {
                  Object.entries(item).forEach(([key, value]) => {
                    if (!formValueInfo[key]) {
                      formValueInfo[key] = value;
                    } else {
                      formValueInfo[key] += `, ${value}`;
                    }
                  });
                });
              } else {
                formValueInfo.en = item?.value;
              }
            }
            return (
              <Stack key={index} direction='row' alignItems='center' gap={1}>
                <Typography fontWeight={600} whiteSpace='nowrap'>{formNameInfo?.[currentLang]?.length > 0 ? formNameInfo?.[currentLang] : formNameInfo?.en ?? ""}:</Typography>
                <Stack direction='row' alignItems='center' gap={1}>
                  <Typography direction="row" alignItems="center">
                    {formValueInfo?.[currentLang]?.length > 0 ? formValueInfo?.[currentLang] : formValueInfo?.en ?? ""}
                  </Typography>
                  {hasCopyButton &&
                    <Tooltip title="Copy to clipboard">
                      <IconButton edge="end" onClick={() => copyToClipboard(formValueInfo?.[currentLang]?.length > 0 ? formValueInfo?.[currentLang] : formValueInfo?.en ?? "")}>
                        <Iconify icon="mdi:content-copy" color="primary.main" />
                      </IconButton>
                    </Tooltip>
                  }
                </Stack>
              </Stack>)}
        })
      )
    } else if (typeof requestInfo === 'object' && requestInfo !== null) {
      return (
        Object.entries(requestInfo)?.map(([key, value])=> (
          <Stack key={key} direction="row" alignItems="center" gap={2}>
            <Typography fontWeight={600} whiteSpace='nowrap'>{formatText(key)}:</Typography>
            <Typography direction="row" alignItems="center" sx={{ wordBreak: 'break-all' }}>
              {formatText(value)}
            </Typography>
            <Tooltip title="Copy to clipboard">
              <IconButton edge="end" onClick={() => copyToClipboard(value)}>
                <Iconify icon="mdi:content-copy" color="primary.main" />
              </IconButton>
            </Tooltip>
          </Stack>
        ))
      )
    } 
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm" sx={{ p: 3 }}>
        <Stack py={2} direction="row" justifyContent="center">
          <Typography variant="h5">Request Data Info</Typography>
        </Stack>
        <Stack direction="column" gap={1.5} p={2}>
          {renderRequestInfo(requestInfo)}
          {docInfo?.map((doc, index)=> (
            <Stack key={index} direction="row" alignItems="center" gap={0.5}>
              <Iconify icon="ion:document-text-outline" width={24} />
              <Typography fontWeight={600} whiteSpace='nowrap'>{doc?.name}:</Typography>
              <Tooltip title="Download">
                <IconButton
                  onClick={() => handleDownloadFile(doc?.name, doc?.url, doc?.content_type)}
                  color="primary"
                >
                  {(loadingStatus.name ==doc.name && loadingStatus.loading) 
                  ? <Iconify icon="line-md:downloading-loop" width={24}/>
                  : <Iconify icon="pajamas:download" width={24}/>}
                </IconButton>
              </Tooltip>
            </Stack>
          ))}
        </Stack>
        <Stack direction="column" spacing={3}>
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 2,
                px: 3,
              }}
              gap={3}
            >
              <Button
                variant="contained"
                type="submit"
                onClick={() => onClose()}
              >
                Close
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Dialog>
  );
};
