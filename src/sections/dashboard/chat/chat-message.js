import { useMemo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha } from "@mui/system/colorManipulator";
import { format, isYesterday, differenceInDays, differenceInYears, startOfDay } from "date-fns";

import { Iconify } from 'src/components/iconify';
import { getAPIUrl } from "src/config";
import { getSystemMessage } from "src/utils/system-message";
import { isImageFilename } from "src/utils/is-image-file";

export const ChatMessage = (props) => {
  const {
    authorAvatar,
    authorName,
    attachments,
    body,
    message = {},
    contentType,
    createdAt,
    isUser,
    systemInfo,
    active,
    isNote,
    access,
    deleted,
    isSystem,
    isGrouped,
    id,
    onDelete = () => { },
    onEdit = () => { },
    ...other
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const systemMessage = getSystemMessage(systemInfo, message);

  const isDateYesterday = useMemo(
    () =>
      createdAt
        ? isYesterday(startOfDay(new Date(createdAt)))
        : isYesterday(startOfDay(new Date())),
    [createdAt]
  );

  const timeFormat = useMemo(() => {
    const diffInDays = createdAt
      ? differenceInDays(
        startOfDay(new Date()),
        startOfDay(new Date(createdAt))
      )
      : 0;
    const diffInYears = createdAt
      ? differenceInYears(
        startOfDay(new Date()),
        startOfDay(new Date(createdAt))
      )
      : 0;
    if (diffInDays <= 1) {
      return "h:mm a";
    }
    if (diffInDays > 1 && diffInDays <= 7) {
      return "EEE h:mm a";
    }
    if (diffInDays > 7 && diffInYears < 1) {
      return "MMM d h:mm a";
    }
    if (diffInYears >= 1) {
      return "YYY MMM dd";
    }
  }, [createdAt]);

  const handleEdit = () => {
    setAnchorEl(null);
    onEdit(id, body);
  };
  
  const handleDelete = () => {
    setAnchorEl(null);
    onDelete(id);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mt: isGrouped ? 1 : 3,
        px: 2,
      }}
      {...other}
    >
      <Stack
        alignItems="flex-start"
        direction={isUser ? "row-reverse" : "row"}
        spacing={1.5}
        sx={{
          maxWidth: "60%",
          minWidth: "fit-content",
        }}
      >
        {!isGrouped ? (
          <Tooltip title={authorName}>
            <Box sx={{ position: "relative" }}>
              <Badge
                anchorOrigin={{
                  horizontal: "right",
                  vertical: "bottom",
                }}
                color={active ? "success" : "warning"}
                variant="dot"
                sx={{
                  "& .MuiBadge-dot": {
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    border: "2px solid white",
                  },
                }}
              >
                <Avatar
                  src={authorAvatar ? authorAvatar?.includes('http') ? authorAvatar : `${getAPIUrl()}/${authorAvatar}` : ""}
                  sx={{
                    height: 36,
                    width: 36,
                    border: "2px solid",
                    borderColor: "background.paper",
                    boxShadow: 1,
                  }}
                />
              </Badge>
            </Box>
          </Tooltip>
        ) : (
          <Box sx={{ width: 36, height: 36 }} />
        )}

        <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
          {!isGrouped && (
            <Stack
              alignItems="center"
              gap={1}
              direction={isUser ? "row-reverse" : "row"}
              sx={{ 
                pb: 0.5,
                px: 0.5,
                justifyContent: isUser ? "flex-end" : "flex-start",
              }}
            >
              {!isUser && (
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {authorName}
                </Typography>
              )}
              <Typography 
                color="text.secondary" 
                variant="caption"
                sx={{
                  fontSize: "0.75rem",
                  opacity: 0.8,
                }}
              >
                {isDateYesterday ? "Yesterday" : ""}{" "}
                {createdAt
                  ? format(new Date(createdAt), timeFormat)
                  : format(new Date(), timeFormat)}
              </Typography>
              {isNote && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 0.75,
                    py: 0.25,
                    bgcolor: (theme) => alpha(theme.palette.info.main, 0.15),
                    borderRadius: 0.75,
                    border: "1px solid",
                    borderColor: (theme) => alpha(theme.palette.info.main, 0.3),
                    boxShadow: 0.5,
                  }}
                >
                  <Iconify 
                    icon="mdi:note-text" 
                    sx={{ 
                      width: 12,
                      height: 12,
                      color: "info.main",
                    }} 
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      color: "info.dark",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                    }}
                  >
                    Note
                  </Typography>
                </Box>
              )}
            </Stack>
          )}

          {isGrouped && isNote && (
            <Stack
              alignItems="center"
              gap={1}
              direction={isUser ? "row-reverse" : "row"}
              sx={{ 
                pb: 0.5,
                px: 0.5,
                justifyContent: isUser ? "flex-end" : "flex-start",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 0.75,
                  py: 0.25,
                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.15),
                  borderRadius: 0.75,
                  border: "1px solid",
                  borderColor: (theme) => alpha(theme.palette.info.main, 0.3),
                  boxShadow: 0.5,
                }}
              >
                <Iconify 
                  icon="mdi:note-text" 
                  sx={{ 
                    width: 12,
                    height: 12,
                    color: "info.main",
                  }} 
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    color: "info.dark",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                  }}
                >
                  Note
                </Typography>
              </Box>
            </Stack>
          )}

          <Stack sx={{ position: "relative", alignItems: isUser ? 'flex-end' : 'flex-start' }}>
            {((isUser && access?.edit && !deleted) || (isUser && access?.deleteOwn && !deleted && !isSystem) || (access?.deleteAll && !deleted && !isSystem)) && (
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{
                  position: "absolute",
                  top: 8,
                  [isUser ? "left" : "right"]: -32,
                  zIndex: 1,
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <Iconify icon="eva:more-vertical-fill" width={16} />
              </IconButton>
            )}
            <Card
              elevation={0}
              sx={{
                backgroundColor: isUser
                  ? (theme) => theme.palette.primary.main
                  : contentType === "system"
                    ? (theme) => alpha(theme.palette.warning.main, 0.1)
                    : (theme) => theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.primary.light, 0.1)
                      : alpha(theme.palette.grey[100], 0.8),
                color: isUser
                  ? "primary.contrastText"
                  : contentType === "system"
                    ? "text.primary"
                    : "text.primary",
                border: (theme) => `1px solid ${isUser 
                  ? "transparent" 
                  : contentType === "system"
                    ? "transparent"
                    : theme.palette.mode === 'dark'
                      ? "transparent"
                      : alpha(theme.palette.grey[300], 0.5)
                }`,
                borderRadius: 2,
                px: 2,
                py: 1.25,
                maxWidth: "100%",
                width: "fit-content",
                position: "relative",
                "&:hover": {
                  boxShadow: 1,
                }
              }}
            >
              {contentType === "email" && (
                <Box
                  sx={{
                    "& *": {
                      color: "inherit !important",
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              )}

              {contentType === "system" && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify 
                    icon="mdi:information-outline" 
                    sx={{ 
                      color: "warning.main",
                      width: 18,
                      height: 18,
                    }} 
                  />
                  <Typography 
                    color="inherit" 
                    variant="body2"
                    sx={{ fontWeight: 500 }}
                  >
                    {systemMessage}
                  </Typography>
                </Stack>
              )}

              {contentType === "image" && (
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    image={body}
                    sx={{
                      height: "auto",
                      maxHeight: 250,
                      width: "100%",
                      maxWidth: 300,
                      borderRadius: 1.5,
                      cursor: "pointer",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                    onClick={() => window.open(body, "_blank")}
                  />
                  <Tooltip title="Download image">
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        bgcolor: "rgba(0, 0, 0, 0.6)",
                        color: "white",
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.8)",
                        },
                      }}
                      component="a"
                      href={body}
                      download
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Iconify icon="material-symbols:download" width={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

              {contentType === "text" && (
                <Typography 
                  color="inherit" 
                  variant="body2"
                  sx={{
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    '& p': {
                      padding: 0,
                      margin: 0
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              )}

              {contentType === "textWithAttachment" && (
                <Stack spacing={2}>
                  {body && (
                    <Typography 
                      color="inherit" 
                      variant="body2"
                      sx={{
                        lineHeight: 1.5,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {body}
                    </Typography>
                  )}
                  
                  {attachments.map((att, index) => {
                    const isImage = isImageFilename(att.name);
                    const fileUrl = att?.link 
                      ? att?.link?.includes("http") 
                        ? att?.link 
                        : `${getAPIUrl()}/${att?.link}` 
                      : "";
                    
                    if (isImage) {
                      return (
                        <Box key={index} sx={{ position: "relative" }}>
                                                      <CardMedia
                              component="img"
                              image={fileUrl}
                              sx={{
                                height: "auto",
                                maxHeight: 200,
                                width: "100%",
                                maxWidth: 280,
                                borderRadius: 1.5,
                                cursor: "pointer",
                                transition: "transform 0.2s ease-in-out",
                                "&:hover": {
                                  transform: "scale(1.02)",
                                },
                              }}
                              onClick={() => window.open(fileUrl, "_blank")}
                            />
                          <Stack 
                            direction="row" 
                            spacing={1} 
                            alignItems="center"
                            sx={{ 
                              mt: 1,
                              px: 1,
                              py: 0.5,
                              bgcolor: "rgba(255, 255, 255, 0.1)",
                              borderRadius: 1,
                            }}
                          >
                            <Iconify 
                              icon="mdi:image" 
                              sx={{ 
                                color: "inherit",
                                width: 16,
                                height: 16,
                              }} 
                            />
                            <Typography 
                              variant="caption" 
                              noWrap 
                              sx={{ 
                                color: "inherit",
                                flex: 1,
                                fontSize: "0.75rem",
                              }}
                            >
                              {att.name}
                            </Typography>
                            <Tooltip title="Download">
                              <IconButton
                                size="small"
                                component="a"
                                href={fileUrl}
                                download
                                target="_blank"
                                sx={{ 
                                  color: "inherit",
                                  p: 0.5,
                                }}
                                rel="noreferrer"
                              >
                                <Iconify icon="material-symbols:download" width={16} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Box>
                      );
                    } else {
                      return (
                        <Card
                          key={index}
                          elevation={0}
                          sx={{
                            bgcolor: "rgba(255, 255, 255, 0.1)",
                            borderRadius: 1.5,
                            p: 1.25,
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                          }}
                        >
                          <Stack 
                            direction="row" 
                            spacing={1.5} 
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                p: 1,
                                bgcolor: "rgba(255, 255, 255, 0.2)",
                                borderRadius: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Iconify 
                                icon="mdi:file-document-outline" 
                                sx={{ 
                                  color: "inherit",
                                  width: 20,
                                  height: 20,
                                }} 
                              />
                            </Box>
                            <Typography 
                              variant="body2" 
                              noWrap 
                              sx={{ 
                                color: "inherit",
                                flex: 1,
                                fontWeight: 500,
                              }}
                            >
                              {att.name}
                            </Typography>
                            <Tooltip title="Download">
                              <IconButton
                                size="small"
                                component="a"
                                href={fileUrl}
                                download
                                target="_blank"
                                sx={{ 
                                  color: "inherit",
                                }}
                                rel="noreferrer"
                              >
                                <Iconify icon="material-symbols:download" width={18} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Card>
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
                  sx={{ width: "100%", py: 1 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      width: "100%",
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: 1.5,
                      p: 1.5,
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                      <Box
                        sx={{
                          p: 1,
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                          borderRadius: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Iconify 
                          icon="mdi:music" 
                          sx={{ 
                            color: "inherit",
                            width: 20,
                            height: 20,
                          }} 
                        />
                      </Box>
                      <Typography 
                        variant="subtitle2" 
                        noWrap 
                        sx={{ 
                          color: "inherit",
                          flex: 1,
                          fontWeight: 600,
                        }}
                      >
                        {attachments?.[0]?.name || "Audio file"}
                      </Typography>
                    </Stack>
                    
                    <audio
                      controls
                      style={{ 
                        width: "100%",
                        height: 40,
                        borderRadius: "8px",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
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
                  </Card>
                  
                  <Tooltip title="Download audio">
                    <IconButton
                      component="a"
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
                        color: "inherit",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                        },
                      }}
                      rel="noreferrer"
                    >
                      <Iconify icon="material-symbols:download" width={18} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}
            </Card>
          </Stack>
        </Stack>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: isUser ? 'left' : 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isUser ? 'right' : 'left',
        }}
        PaperProps={{
          sx: {
            minWidth: 120,
            boxShadow: 2,
            border: '1px dashed',
            borderColor: 'divider',
          },
        }}
      >
        {(isUser && access?.edit && !deleted) && (
          <MenuItem onClick={handleEdit} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="mage:edit" width={16} sx={{ color: 'primary.main' }} />
            Edit
          </MenuItem>
        )}
        
        {((isUser && access?.deleteOwn && !deleted && !isSystem) || (access?.deleteAll && !deleted && !isSystem)) && (
          <MenuItem onClick={handleDelete} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="heroicons:trash" width={16} sx={{ color: 'error.main' }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};
