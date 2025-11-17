import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { toast } from "react-hot-toast";
import { isArray } from "lodash";
import { useParams } from "react-router-dom";

import SettingsMemberAccessEdit from "src/sections/dashboard/settings/settings-member-access-edit";
import SettingsMemberIpAddress from "src/sections/dashboard/settings/settings-member-ip-address";
import { AccessSidebar } from "./access-sidebar";
import { DeleteModal } from "src/components/customize/delete-modal";
import { MailContainer } from "src/sections/dashboard/mail/mail-container";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { Seo } from "src/components/seo";
import { SettingsMemberAssign } from "src/components/settings/settings-member-assign";
import { SettingsMemberEditPassword } from "src/sections/dashboard/settings/settings-member-edit-password";
import { SettingsMemberInfo } from "src/sections/dashboard/settings/settings-member-info";
import { SettingsMemberOtp } from "src/sections/dashboard/settings/settings-member-otp";
import { getAPIUrl } from "src/config";
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { metabaseApi } from "src/api/metabase";
import { useAuth } from "src/hooks/use-auth";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { SettingsAiQuestion } from "src/components/settings/settings-ai-question";
import { SettingsSecurityReport } from 'src/components/settings/settings-security-report';
import { AccountEmails } from "src/sections/dashboard/settings/access/account-emails";
import { Iconify } from 'src/components/iconify';
import { getAssetPath } from "src/utils/asset-path";
import { ActivityHeatmap } from "./activity-heatmap";

const useSidebar = () => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [open, setOpen] = useState(mdUp);

  const handleScreenResize = useCallback(() => {
    if (!mdUp) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [mdUp]);

  useEffect(() => {
    handleScreenResize();
  }, [mdUp]);

  const handleToggle = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    handleToggle,
    handleClose,
    open,
  };
};

const useMember = (id) => {
  const isMounted = useMounted();
  const [member, setMember] = useState(null);

  const handleMemberGet = useCallback(async () => {
    try {
      const account = await settingsApi.getMember({ id });

      if (isMounted()) {
        setMember(account);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    handleMemberGet();
  }, []);

  return {member, handleMemberGet};
};

const Page = () => {
  const rootRef = useRef(null);
  const sidebar = useSidebar();
  const params = useParams();
  const router = useRouter();
  const {member, handleMemberGet} = useMember(params.memberId);
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.acc?.acc_v_settings === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user]);

  const [modalOpen, setModalOpen] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState();
  const [currentMenu, setCurrentMenu] = useState("member_info");
  const [metabaseGroup, setMetabaseGroup] = useState();
  const [metabaseGroups, setMetabaseGroups] = useState([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [isSavingGroup, setIsSavingGroup] = useState(false);

  const handleMemberDelete = useCallback(async () => {
    try {
      await settingsApi.deleteMember(params?.memberId);
      toast("Agent successfully deleted!");
      setTimeout(router.back(), 1500);
    } catch (error) {
      console.error("error: ", error);
    }
  }, [params]);

  const handleGetMetabaseGroups = useCallback(async () => {
    try {
      setIsLoadingGroups(true);
      const response = await metabaseApi.getMetabaseGroups();
      if (response?.reports && isArray(response?.reports)) {
        setMetabaseGroups(response?.reports || []);
      }
    } catch (error) {
      console.error("Error fetching metabase groups:", error);
      toast.error("Failed to load metabase groups");
    } finally {
      setIsLoadingGroups(false);
    }
  }, []);

  useEffect(() => {
    if (member) {
      setMetabaseGroup(member?.metabase_group?.id || 0);
    }
  }, [member]);

  useEffect(() => {
    if (currentMenu === "data_management") {
      handleGetMetabaseGroups();
    }
  }, [currentMenu, handleGetMetabaseGroups]);

  const handleUpdateMetabaseGroup = useCallback(async () => {
    try {
      setIsSavingGroup(true);
      await metabaseApi.updateMetabaseGroup(metabaseGroup, { user_id: member.id });
      toast.success("Metabase group updated successfully!");
    } catch (error) {
      console.error("Error updating metabase group:", error);
      toast.error("Failed to update metabase group");
    } finally {
      setIsSavingGroup(false);
    }
  }, [metabaseGroup, member?.id]);

  usePageView();

  const backLink = searchParams?.get("backLink");
  const link = useMemo(() => {
    if (backLink) {
      return paths.dashboard.agents;
    } else {
      return paths.dashboard.settings;
    }
  }, [backLink]);

  if (!member) {
    return null;
  }

  return (
    <>
      <Seo title={`Member Access Edit`} />
      <Box
        component="main"
        sx={{ flexGrow: 1, pt: 4, pb: 2 }}
      >
        <Container maxWidth="xxl">
          <Stack spacing={4}>
            <Stack spacing={2}>
              <div>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={link}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">
                    {backLink ? "Agents" : "Settings"}
                  </Typography>
                </Link>
              </div>
              <Stack
                alignItems="flex-start"
                direction={{
                  xs: "column",
                  md: "row",
                }}
                justifyContent="space-between"
                spacing={4}
              >
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Avatar
                    src={(previewAvatar ?? member.avatar) ? (previewAvatar ?? member.avatar)?.includes('http') ? previewAvatar ?? member.avatar : `${getAPIUrl()}/${previewAvatar ?? member.avatar}` : ""}
                    sx={{
                      height: 64,
                      width: 64,
                    }}
                  ></Avatar>
                  <Stack spacing={1}>
                    <Typography variant="h4">{member.email}</Typography>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">User ID:</Typography>
                      <Chip label={member.id} size="small" />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>

            <Stack spacing={4}>
              <Card>
                <CardContent sx={{ px: { md: 3, xs: 0 }, py: { md: 4, xs: 1 } }}>
                  <Box
                    component="main"
                    sx={{
                      backgroundColor: "background.paper",
                      flex: "1 1 auto",
                      position: "relative",
                    }}
                  >
                    <Box
                      ref={rootRef}
                      sx={{
                        minHeight: 600,
                        display: "flex",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        top: 0,
                        position: 'relative'
                      }}
                    >
                      <AccessSidebar
                        container={rootRef.current}
                        currentLabelId={"currentLabelId"}
                        currentMenu={currentMenu}
                        setCurrentMenu={setCurrentMenu}
                        onClose={sidebar.handleClose}
                        open={sidebar.open}
                      />
                      <MailContainer open={sidebar.open}>
                        <Scrollbar sx={{ height: 1 }}>
                          <Box>
                            <IconButton
                              sx={{ mb: 1, ml: 1 }}
                              onClick={sidebar.handleToggle}
                            >
                              <Iconify icon="lucide:menu" width={24} height={24} />
                            </IconButton>
                            <Divider />
                          </Box>
                          {currentMenu === "member_info" ? (
                            <Stack sx={{ p: { md: 3, xs: 0 } }}>
                              <SettingsMemberInfo
                                member={member}
                                setPreviewAvatar={setPreviewAvatar}
                                onGetMember={handleMemberGet}
                              />
                            </Stack>
                          ) : null}
                          {currentMenu === "member_access" ? (
                            <Scrollbar>
                              <SettingsMemberAccessEdit member={member} onGetMember={handleMemberGet} />
                            </Scrollbar>
                          ) : null}
                          {currentMenu === "update_password" ? (
                            <Stack sx={{ p: { md: 3, xs: 0 } }}>
                              <SettingsMemberEditPassword member={member}/>
                            </Stack>
                          ) : null}
                          {currentMenu === "ip_address" ? (
                            <Stack sx={{ p: { md: 3, xs: 0 } }}>
                              <SettingsMemberIpAddress member={member} onGetMember={handleMemberGet}/>
                            </Stack>
                          ) : null}

                          {currentMenu === "email_setup" ? (
                            <Stack sx={{ p: { md: 3, xs: 0 } }}>
                              <AccountEmails member={member}/>
                            </Stack>
                          ) : null}

                          {currentMenu === "2fa" ? (
                            <Stack sx={{ p: { md: 3, xs: 0 } }}>
                              <SettingsMemberOtp member={member} onGetMember={handleMemberGet}/>
                            </Stack>
                          ) : null}
                          {currentMenu === "desk_team" ? (
                            <Stack sx={{ p: { md: 3, xs: 0 } }}>
                              <SettingsMemberAssign member={member} onGetMember={handleMemberGet}/>
                            </Stack>
                          ) : null}
                          {currentMenu === "ai_questions" ? (
                            <Stack sx={{ p: { md: 3, xs: 0 } }}>
                              <SettingsAiQuestion member={member}/>
                            </Stack>
                          ) : null}
                          {currentMenu === "security_report" ? (
                            <Stack sx={{ p: { md: 3, xs: 0 } }}>
                              <SettingsSecurityReport agent={member}/>
                            </Stack>
                          ) : null}
                          {currentMenu === "activity_heatmap" ? (
                            <Stack sx={{ p: { md: 3, xs: 0 } }}>
                              <ActivityHeatmap agent={member}/>
                            </Stack>
                          ) : null}
                          {currentMenu === "data_management" ? (
                            <Stack sx={{ p: { md: 3, xs: 0 } }}>
                              {user?.acc?.acc_e_delete_agent === undefined ||
                                user?.acc?.acc_e_delete_agent ? (
                                <Stack spacing={4}>
                                  {/* Metabase Group Section */}
                                  <Card sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                                    <CardHeader title={<Typography variant="h6">Metabase Group</Typography>} />
                                    <CardContent>
                                      <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel id="metabase-group-label">Select Metabase Group</InputLabel>
                                        <Select
                                          labelId="metabase-group-label"
                                          value={metabaseGroup}
                                          label="Select Metabase Group"
                                          onChange={(e) => setMetabaseGroup(e.target.value)}
                                          disabled={isLoadingGroups}
                                          inputProps={{
                                            'aria-label': 'Select Metabase Group',
                                            'tabIndex': 0
                                          }}
                                        >
                                          <MenuItem value={0}>No access</MenuItem>
                                          {metabaseGroups?.map((group) => (
                                            <MenuItem key={group.id} value={group.id}>
                                              {group.name}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                      <Button
                                        variant="contained"
                                        onClick={handleUpdateMetabaseGroup}
                                        disabled={isSavingGroup || isLoadingGroups}
                                        aria-label="Save Metabase Group"
                                      >
                                        {isSavingGroup ? "Saving..." : "Save Group"}
                                      </Button>
                                    </CardContent>
                                  </Card>
                                  {/* Delete Agent Section */}
                                  <Card sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                                    <CardHeader title={<Typography variant="h6" color="error.main">Delete Agent</Typography>} />
                                    <CardContent>
                                      <Button
                                        color="error"
                                        variant="outlined"
                                        onClick={() => setModalOpen(true)}
                                        aria-label="Delete Agent"
                                      >
                                        Delete Agent
                                      </Button>
                                      <Box sx={{ mt: 2 }}>
                                        <Typography color="text.secondary" variant="body2">
                                          Please be aware that what has been deleted can never be brought back
                                        </Typography>
                                      </Box>
                                    </CardContent>
                                  </Card>
                                </Stack>
                              ) : null}
                            </Stack>
                          ) : null}
                          {currentMenu ? null : (
                            <Box
                              sx={{
                                pb: 2,
                                mt: 3,
                                minHeight: 500,
                                maxWidth: 1,
                                alignItems: "center",
                                display: "flex",
                                flexGrow: 1,
                                flexDirection: "column",
                                justifyContent: "center",
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                component="img"
                                src={getAssetPath("/assets/errors/error-404.png")}
                                sx={{
                                  height: "auto",
                                  maxWidth: 120,
                                }}
                              />
                              <Typography
                                color="text.secondary"
                                sx={{ mt: 2 }}
                                variant="subtitle1"
                              >
                                Select a category
                              </Typography>
                            </Box>
                          )}
                        </Scrollbar>
                      </MailContainer>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
            <DeleteModal
              isOpen={modalOpen}
              setIsOpen={setModalOpen}
              onDelete={() => handleMemberDelete()}
              title={"Delete Agent"}
              description={"Are you sure you want to delete this agent  ?"}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
