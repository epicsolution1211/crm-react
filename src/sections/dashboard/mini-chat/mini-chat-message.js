import { useMemo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Badge from '@mui/material/Badge';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CloseIcon from '@mui/icons-material/Close';
import Link from "@mui/material/Link";
import Modal from '@mui/material/Modal';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { format, isYesterday, differenceInDays, differenceInYears, startOfDay } from "date-fns";
import { getSystemMessage } from "src/utils/system-message";
import { styled } from '@mui/material';
import { getAPIUrl } from "src/config";
import { Iconify } from 'src/components/iconify';
import { isImageFilename } from "src/utils/is-image-file";

export const MiniChatMessage = (props) => {
  const {
    authorAvatar,
    authorName,
    body,
    contentType,
    createdAt,
    isClient,
    systemInfo,
    active,
    attachments,
    ...other
  } = props;

  const [openModal, setOpenModal] = useState(false);

  const systemMessage = getSystemMessage(systemInfo, body);

  const textWithLinks = useMemo(() => {
    const linkRegex = /(\b(https?|ftp|file):\/\/(?:[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]|calendly\.com))/ig;
    const link = systemMessage?.match(linkRegex);
    const parts = systemMessage?.split(link);
    const prefix = parts ? parts[0]?.split("<")[0] : '';
    const suffix = parts ? parts[1]?.split(">.")[1] : '';
    if (link) {
      return {
        link, prefix, suffix
      }
    } else {
      return null;
    }
  }, [systemMessage])

  const isDateYesterday = useMemo(() => (
    createdAt ? isYesterday(startOfDay(new Date(createdAt))) : isYesterday(startOfDay(new Date()))
  ), [createdAt]);

  const timeFormat = useMemo(() => {
    const diffInDays = createdAt ? differenceInDays(startOfDay(new Date()), startOfDay(new Date(createdAt))) : 0;
    const diffInYears = createdAt ? differenceInYears(startOfDay(new Date()), startOfDay(new Date(createdAt))) : 0;
    if (diffInDays <= 1) {
      return "h:mm a";
    }
    if (diffInDays > 1 && diffInDays <= 7) {
      return "EEE h:mm a"
    }
    if (diffInDays > 7 && diffInYears < 1) {
      return "MMM d h:mm a"
    }
    if (diffInYears >= 1) {
      return "YYY MMM dd"
    }
  }, [createdAt]);

  const ThreeDot = styled(Box)(() => ({
    float: 'left',
    width: '8px',
    height: '8px',
    margin: '0 4px',
    background: '#8d8c91',
    borderRadius: '50%',
    opacity: '1',
    animation: 'loadingFade 1s infinite',
    '@keyframes loadingFade': {
      '0%': {
        opacity: '0',
      },
      '50%': {
        opacity: '0.8',
      },
      '100%': {
        opacity: '0',
      },
    },
  }
  ));

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: isClient ? "flex-end" : "flex-start",
        }}
        {...other}
      >
        <Stack
          alignItems="flex-start"
          direction={isClient ? "row-reverse" : "row"}
          spacing={2}
          sx={{
            maxWidth: 500,
            ml: isClient ? "auto" : 0,
            mr: !isClient ? "auto" : 0,
          }}
        >
          {!isClient && <Tooltip title={authorName}>
            {authorName !== 'System' ?
              <Badge
                anchorOrigin={{
                  horizontal: 'right',
                  vertical: 'bottom'
                }}
                color={active ? "success" : 'warning'}
                variant="dot"
              >
                <Avatar
                  src={authorAvatar ? authorAvatar?.includes('http') ? authorAvatar : `${getAPIUrl()}/${authorAvatar}` : ""}
                  sx={{
                    height: 32,
                    width: 32,
                  }}
                />
              </Badge> :
              <Avatar
                src={authorAvatar ? authorAvatar?.includes('http') ? authorAvatar : `${getAPIUrl()}/${authorAvatar}` : ""}
                sx={{
                  height: 32,
                  width: 32,
                }}
              />
            }
          </Tooltip>}
          <Box sx={{ flexGrow: 1 }}>
            <Stack
              alignItems='center'
              gap={1}
              direction={isClient ? "row-reverse" : "row"}
              sx={{ pb: '2px' }}>
              {true && <Link
                color="inherit"
                sx={{ cursor: "pointer" }}
                variant="subtitle2"
              >
                {authorName}
              </Link>}
              <Typography
                color="text.secondary"
                noWrap
                variant="caption">
                {isDateYesterday ? 'Yesterday' : ''} {createdAt ? format(new Date(createdAt), timeFormat) : format(new Date(), timeFormat)}
              </Typography>
            </Stack>
            <Card
              sx={{
                backgroundColor:
                  isClient ? "primary.main" : contentType === "system" ? "background.paper" : (contentType === "ellipsis" ? "background.paper" : "primary.main"),
                color:
                  isClient ? "primary.contrastText" : (contentType === "system" ? "text.primary" : "primary.contrastText"),
                px: 2,
                py: 1,
                maxWidth: 'sm',
              }}
            >
              {contentType === "system" && (textWithLinks ?
                <>
                  <Typography>
                    {textWithLinks.prefix}
                  </Typography>
                  <Button
                    onClick={() => setOpenModal(true)}
                    sx={{ p: 0 }}>{textWithLinks.link}</Button>
                  <Typography>
                    {textWithLinks.suffix}
                  </Typography>
                </> :
                <Typography color="inherit"
                  variant="body1">
                  {systemMessage}
                </Typography>
              )}
              {contentType === "ellipsis" && (
                <Box sx={{ py: "4px" }}>
                  <ThreeDot sx={{
                    animationDelay: '0s',
                  }}></ThreeDot>
                  <ThreeDot sx={{
                    animationDelay: '0.2s',
                  }}></ThreeDot>
                  <ThreeDot sx={{
                    animationDelay: '0.4s',
                  }}></ThreeDot>
                </Box>
              )}
              {contentType === "image" && (
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={body}
                    sx={{
                      height: 'auto',
                      maxHeight: 300,
                      width: '100%',
                      maxWidth: 400,
                      borderRadius: 1,
                      boxShadow: 1,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      window.open(body, '_blank');
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '50%',
                      p: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                      }
                    }}
                    component="a"
                    href={body}
                    download
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Iconify 
                      icon="material-symbols:download" 
                      sx={{ 
                        color: 'white',
                        width: 20,
                        height: 20
                      }} 
                    />
                  </Box>
                </Box>
              )}
              {contentType === "text" && (
                <Stack
                  direction='row'
                  gap={1}>
                  <Typography color="inherit"
                    variant="body1">
                    {body}
                  </Typography>
                </Stack>
              )}
              {contentType === "textWithAttachment" && (
                <Stack spacing={2}>
                  {body && (
                    <Typography color="inherit" variant="body1">
                      {body}
                    </Typography>
                  )}
                  
                  {attachments?.map((att, index) => {
                    const isImage = isImageFilename(att.name);
                    const fileUrl = att?.link 
                      ? att?.link?.includes('http') 
                        ? att?.link 
                        : `${getAPIUrl()}/${att?.link}` 
                      : "";
                    
                    if (isImage) {
                      return (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            image={fileUrl}
                            sx={{
                              height: 'auto',
                              maxHeight: 250,
                              width: '100%',
                              maxWidth: 350,
                              borderRadius: 1,
                              boxShadow: 1,
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              window.open(fileUrl, '_blank');
                            }}
                          />
                          <Stack 
                            direction="row" 
                            spacing={1} 
                            alignItems="center"
                            sx={{ 
                              mt: 1,
                              px: 1
                            }}
                          >
                            <Iconify 
                              icon="mdi:image" 
                              sx={{ 
                                color: isClient ? 'primary.contrastText' : 'primary.contrastText',
                                width: 16,
                                height: 16
                              }} 
                            />
                            <Typography 
                              variant="caption" 
                              noWrap 
                              sx={{ 
                                color: isClient ? 'primary.contrastText' : 'primary.contrastText',
                                flex: 1
                              }}
                            >
                              {att.name}
                            </Typography>
                            <Link
                              href={fileUrl}
                              download
                              target="_blank"
                              sx={{ 
                                color: isClient ? 'primary.contrastText' : 'primary.contrastText',
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                '&:hover': {
                                  textDecoration: 'underline'
                                }
                              }}
                              rel="noreferrer"
                            >
                              <Iconify icon="material-symbols:download" width={16} />
                            </Link>
                          </Stack>
                        </Box>
                      );
                    } else {
                      return (
                        <Stack 
                          key={index}
                          direction="row" 
                          spacing={1.5} 
                          alignItems="center"
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 1,
                            p: 1.5,
                          }}
                        >
                          <Iconify 
                            icon="mdi:file-document-outline" 
                            sx={{ 
                              color: isClient ? 'primary.contrastText' : 'primary.contrastText',
                              width: 24,
                              height: 24
                            }} 
                          />
                          <Typography 
                            variant="body2" 
                            noWrap 
                            sx={{ 
                              color: isClient ? 'primary.contrastText' : 'primary.contrastText',
                              flex: 1
                            }}
                          >
                            {att.name}
                          </Typography>
                          <Link
                            href={fileUrl}
                            download
                            target="_blank"
                            sx={{ 
                              color: isClient ? 'primary.contrastText' : 'primary.contrastText',
                              display: 'flex',
                              alignItems: 'center',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                            rel="noreferrer"
                          >
                            <Iconify icon="material-symbols:download" width={20} />
                          </Link>
                        </Stack>
                      );
                    }
                  })}
                </Stack>
              )}
              {contentType === "Audio" && (
                <Stack 
                  direction="column" 
                  spacing={2} 
                  alignItems="center"
                  sx={{ width: '100%', py: 1 }}
                >
                  <Box 
                    sx={{ 
                      width: '100%',
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      p: 1.5,
                      boxShadow: 1
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Iconify 
                        icon="mdi:music" 
                        sx={{ 
                          color: 'primary.main',
                          width: 24,
                          height: 24
                        }} 
                      />
                      <Typography 
                        variant="subtitle2" 
                        noWrap 
                        sx={{ 
                          color: 'text.primary',
                          flex: 1
                        }}
                      >
                        {attachments?.[0]?.name || "Audio file"}
                      </Typography>
                    </Stack>
                    
                    <audio
                      controls
                      style={{ 
                        width: '100%',
                        height: 40,
                        borderRadius: '8px'
                      }}
                    >
                      <source
                        src={
                          attachments?.[0]?.link
                            ? attachments?.[0]?.link?.includes("http")
                              ? attachments?.[0]?.link
                              : `${getAPIUrl()}/${attachments?.[0]?.link}`
                            : ""
                        }
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </Box>
                  
                  <Link
                    href={
                      attachments?.[0]?.link
                        ? attachments?.[0]?.link?.includes("http")
                          ? attachments?.[0]?.link
                          : `${getAPIUrl()}/${attachments?.[0]?.link}`
                        : ""
                    }
                    download
                    target="_blank"
                    sx={{ 
                      color: isClient ? 'primary.contrastText' : 'primary.contrastText',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                    rel="noreferrer"
                  >
                    <Iconify icon="material-symbols:download" width={16} />
                    <Typography variant="body2">
                      Download
                    </Typography>
                  </Link>
                </Stack>
              )}
            </Card>
            <Box
              sx={{
                display: "flex",
                justifyContent: isClient ? "flex-end" : "flex-start",
                mt: 1,
                px: 2,
              }}
            >
            </Box>
          </Box>
        </Stack>
      </Box>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack sx={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          bgcolor: 'white',
          overflow: "hidden",
          border: 1,
          borderColor: 'background.paper',
        }}>
          <>
            <Stack
              direction="row"
              justifyContent='end'>
              <IconButton
                onClick={() => setOpenModal(false)}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <Box sx={{ flexGrow: 1, height: 1 }}>
              <iframe
                title="Example Iframe"
                src={textWithLinks?.link ?? ''}
                width="100%"
                height="100%"
                style={{ border: 0 }}
              />
            </Box>
          </>
        </Stack>
      </Modal>
    </>
  );
};
