import { useState } from "react";

import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { Iconify } from "src/components/iconify";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";

import { copyToClipboard } from "src/utils/copy-to-clipboard";
import { aiSupportApi } from "src/api/ai-support";
import { useGetAiQuestions } from "src/hooks/swr/use-ai-support";
import { useTimezone } from "src/hooks/use-timezone";

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <Stack
      role="tabpanel"
      hidden={value !== index}
      id={`chat-tabpanel-${index}`}
      aria-labelledby={`chat-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </Stack>
  );
};

export const ChatWithAIDrawer = ({
  open,
  onClose,
  customer,
}) => {
  const { toLocalTime } = useTimezone();
  const [tabValue, setTabValue] = useState(0);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [aiResponse, setAiResponse] = useState("");

  const { questions, isLoading: isLoadingQuestions, mutate } = useGetAiQuestions({ client_id: customer?.id }, { refreshInterval: 5000 });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await aiSupportApi.createAIQuestion({ question: message, client_id: customer?.id });
      setAiResponse(response?.ai_question);
      setMessage("");
      setTimeout(() => {
        mutate();
      }, 500);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const parseQuestion = (question) => {
    const q = question ?? "";
    if (!q) return "";
    const firstChar = q.charAt(0).toUpperCase();
    const rest = q.slice(1);
    let formatted = firstChar + rest;
    return formatted;
  }

  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      ModalProps={{
        BackdropProps: {
          sx: {
            zIndex: 1100,
          }
        },
      }}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 500,
          zIndex: 1500,
        }
      }}
    >
      <IconButton 
        onClick={onClose} 
        sx={{ 
          display: { xs: 'flex', md: 'flex' },
          position: 'absolute',
          right: { xs: 8, md: 14 },
          top: { xs: 8, md: 14 },
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.hover',
          }
        }}
      >
        <Iconify icon="mingcute:close-line" width={20} height={20} />
      </IconButton>
      
      <Stack sx={{ pt: 4 }}>
        <Stack>
          <Typography variant="h6" sx={{ px: 3, pb: 2 }}>
            AI Chat : {customer?.full_name}
          </Typography>
        </Stack>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="chat tabs"
            sx={{ px: 3 }}
          >
            <Tab 
              label="Chat with AI" 
              id="chat-tab-0"
              aria-controls="chat-tabpanel-0"
            />
            <Tab 
              label="Chat History" 
              id="chat-tab-1"
              aria-controls="chat-tabpanel-1"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Stack spacing={2} sx={{ height: 'calc(100vh - 170px)' }}>
            {/* Chat messages area */}
            <Paper 
              sx={{ 
                flex: 1, 
                p: 2, 
                backgroundColor: 'background.neutral',
                overflowY: 'auto',
                minHeight: 300
              }}
            > 
              {aiResponse ? (
                <Stack direction="column" gap={1}>
                  <Typography variant="body2" color="text.primary" align="start">
                    {parseQuestion(aiResponse?.question ?? "")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="start">
                    {aiResponse?.answer ?? ""}
                  </Typography>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  Start a conversation with AI about <Typography variant="body2" color="text.primary" component="span">{customer?.full_name}</Typography>
                </Typography>
              )}
            </Paper>

            {/* Message input area */}
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your question here..."
                variant="outlined"
                size="small"
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                sx={{ 
                  minWidth: 48, 
                  height: 40,
                  px: 1
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Iconify icon="eva:paper-plane-fill" width={20} height={20} />
                )}
              </Button>
            </Stack>
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Stack spacing={2} sx={{ height: 'calc(100vh - 170px)', overflowY: 'auto' }}>
            {!isLoadingQuestions ? (
              questions?.length > 0 ? (
                <Stack spacing={2}>
                  {questions?.map((question) => (
                    <Card
                      key={question.id}
                      sx={{
                        border: '1px solid',
                        borderRadius: 1,
                        borderColor: 'divider',
                        '&:hover': {
                          boxShadow: 2,
                          borderColor: 'primary.main',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                        <Stack spacing={1.5}>
                          {/* Question Header */}
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            gap={2}
                          >
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: question.is_client_specific ? 'primary.main' : 'grey.500',
                                  fontSize: '0.875rem'
                                }}
                              >
                                <Iconify
                                  icon={question.is_client_specific ? "eva:person-fill" : "eva:question-mark-circle-fill"}
                                  width={16}
                                  height={16} />
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 600 }}>
                                  {question.is_client_specific ? question.client_name || 'Client Question' : 'General Question'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {toLocalTime(question.created_at)}
                                </Typography>
                              </Box>
                            </Stack>

                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {question.is_client_specific && (
                                <Chip
                                  label="Client Specific"
                                  size="small"
                                  color="primary"
                                  variant="outlined" />
                              )}
                            </Stack>
                          </Stack>

                          <Divider />

                          {/* Question Content */}
                          <Box>
                            <Typography variant="subtitle2" color="text.primary" sx={{ mb: 1, fontWeight: 600 }}>
                              Question:
                            </Typography>
                            <Typography variant="body2" color="text.primary" sx={{
                              p: 1.5,
                              bgcolor: 'background.neutral',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'divider'
                            }}>
                              {parseQuestion(question.question)}
                            </Typography>
                          </Box>

                          {/* Answer Content */}
                          {question.answer && (
                            <Box>
                              <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
                                <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 600 }}>
                                  Answer:
                                </Typography>
                                <Tooltip title="Copy to clipboard">
                                  <IconButton
                                    onClick={() => {
                                      copyToClipboard(question.answer);
                                    } }
                                    sx={{
                                      '&:hover': {
                                        backgroundColor: 'action.hover',
                                      }
                                    }}
                                    color="primary"
                                    size="small"
                                  >
                                    <Iconify icon="mingcute:copy-2-line" width={20} />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                              <Typography variant="body2" color="text.secondary" sx={{
                                p: 1.5,
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                whiteSpace: 'pre-wrap'
                              }}>
                                {question.answer}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Iconify 
                    icon="eva:message-circle-outline" 
                    width={48} 
                    height={48} 
                    sx={{ color: 'text.disabled', mb: 2 }} 
                  />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No history yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start a conversation with AI to see your questions history here.
                  </Typography>
                </Paper>
              )
            ) : (
              <Stack spacing={2}>
                {[...Array(3)].map((_, index) => (
                  <Card key={index} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Skeleton variant="circular" width={32} height={32} />
                          <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="60%" height={20} />
                            <Skeleton variant="text" width="40%" height={16} />
                          </Box>
                        </Stack>
                        <Skeleton variant="text" width="100%" height={20} />
                        <Skeleton variant="text" width="80%" height={16} />
                        <Skeleton variant="text" width="90%" height={16} />
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </TabPanel>
      </Stack>
    </Drawer>
  );
};

