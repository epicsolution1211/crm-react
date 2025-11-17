import { useCallback, useEffect, useMemo, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Chip from "@mui/material/Chip";
import TranslateIcon from "@mui/icons-material/Translate";
import LabelIcon from "@mui/icons-material/Label";
import { toast } from "react-hot-toast";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { getAPIUrl } from "src/config";
import { complianceApi } from "src/api/compliance";

export const ComplianceDrawer = ({ open, complianceId, onClose }) => {
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [complianceDetail, setComplianceDetail] = useState(null);
  const [detailTab, setDetailTab] = useState(0);

  const formatDuration = (value) => {
    if (value === null || value === undefined) return "00:00";
    const seconds = Number(value);
    if (Number.isNaN(seconds)) return String(value);
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const audioUrl = useMemo(() => {
    const src = complianceDetail?.call_data?.audio?.url || "";
    if (!src) return "";
    return src.includes("http") ? src : `${getAPIUrl()}/${src}`;
  }, [complianceDetail]);

  useEffect(() => {
    const loadDetail = async () => {
      if (!open || !complianceId) return;
      setIsLoadingDetail(true);
      try {
        const res = await complianceApi.getCompliance(complianceId);
        setComplianceDetail(res?.compliance || res || null);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load compliance");
        setComplianceDetail(null);
      } finally {
        setIsLoadingDetail(false);
      }
    };
    loadDetail();
  }, [open, complianceId]);

  const handleClose = useCallback(() => {
    onClose?.();
    setComplianceDetail(null);
    setDetailTab(0);
  }, [onClose]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 560, md: 720 } } }}
    >
      <Stack sx={{ height: "100%" }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Iconify icon="grommet-icons:compliance" />
          <Typography variant="h6">Compliance Call Details</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleClose} aria-label="Close compliance details">
            <Iconify icon="ic:round-close" width={22} />
          </IconButton>
        </Stack>
        {isLoadingDetail ? (
          <Stack alignItems="center" justifyContent="center" sx={{ p: 4, flexGrow: 1 }} spacing={2}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">Loading compliance…</Typography>
          </Stack>
        ) : !complianceDetail ? (
          <Stack alignItems="center" justifyContent="center" sx={{ p: 4, flexGrow: 1 }} spacing={1}>
            <Typography variant="body2" color="text.secondary">No data.</Typography>
          </Stack>
        ) : (
          <Scrollbar sx={{ flexGrow: 1 }}>
            <Stack spacing={2} sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="proicons:call" />
                <Typography variant="h6">Call</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Chip size="small" sx={{ height: 28, borderRadius: 16, '& .MuiChip-label': { px: 1.25, py: 0.25 } }} label={complianceDetail?.provider || "n/a"} variant="outlined" />
                <Chip size="small" sx={{ height: 28, borderRadius: 16, '& .MuiChip-label': { px: 1.25, py: 0.25 } }} label={String(complianceDetail?.channel || "").toUpperCase()} />
                <Chip size="small" sx={{ height: 28, borderRadius: 16, '& .MuiChip-label': { px: 1.25, py: 0.25 } }} color={complianceDetail?.status === "approved" ? "success" : complianceDetail?.status === "rejected" ? "error" : "warning"} label={complianceDetail?.status || "n/a"} />
              </Stack>

              <audio controls style={{ width: "100%" }} src={audioUrl} />

              <Divider />

              <Tabs value={detailTab} onChange={(e, v) => setDetailTab(v)} aria-label="Compliance details tabs" variant="scrollable" allowScrollButtonsMobile>
                <Tab label="AI Summary" aria-label="AI Summary" />
                <Tab label="Insight" aria-label="Insight" />
                <Tab label="Call Transcription" aria-label="Call Transcription" />
              </Tabs>

              {detailTab === 1 ? (
                <Stack spacing={2}>
                  <Stack spacing={1.25}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <SvgIcon color="action">
                        <Iconify icon="mdi:calendar-clock" />
                      </SvgIcon>
                      <Typography variant="body2">{complianceDetail?.created_at ? new Date(complianceDetail?.created_at).toLocaleString() : "-"}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <SvgIcon color="action">
                        <Iconify icon="mdi:timer-outline" />
                      </SvgIcon>
                      <Typography variant="body2">Duration: {complianceDetail?.call_data?.duration_formatted || formatDuration(complianceDetail?.call_data?.duration)}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <SvgIcon color="action">
                        <Iconify icon="mdi:account" />
                      </SvgIcon>
                      <Typography variant="body2">Agent: {complianceDetail?.agent?.name || complianceDetail?.account_name || "Unknown agent"}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <SvgIcon color="action">
                        <Iconify icon="mdi:translate" />
                      </SvgIcon>
                      <Typography variant="body2">Language: {String(complianceDetail?.call_data?.transcript?.detected_language || complianceDetail?.call_data?.transcript?.original?.language || "").toUpperCase() || "—"} ({complianceDetail?.call_data?.transcript?.language_probability ? (Number(complianceDetail?.call_data?.transcript?.language_probability) * 100).toFixed(1) + "%" : "confidence —"})</Typography>
                    </Stack>
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} rowGap={1} sx={{ flexWrap: "wrap" }}>
                    {complianceDetail?.agent?.name ? (
                      <Chip sx={{ height: 28, borderRadius: 16, '& .MuiChip-label': { px: 1.25, py: 0.25 } }} label={`Agent: ${complianceDetail?.agent?.name}`} />
                    ) : null}
                    {complianceDetail?.client?.name ? (
                      <Chip sx={{ height: 28, borderRadius: 16, '& .MuiChip-label': { px: 1.25, py: 0.25 } }} label={`Client: ${complianceDetail?.client?.name}`} />
                    ) : null}
                    {complianceDetail?.country ? (
                      <Chip sx={{ height: 28, borderRadius: 16, '& .MuiChip-label': { px: 1.25, py: 0.25 } }} label={`Country: ${complianceDetail?.country}`} />
                    ) : null}
                    {complianceDetail?.provider ? (
                      <Chip sx={{ height: 28, borderRadius: 16, '& .MuiChip-label': { px: 1.25, py: 0.25 } }} label={`Provider: ${complianceDetail?.provider}`} />
                    ) : null}
                    {complianceDetail?.channel ? (
                      <Chip sx={{ height: 28, borderRadius: 16, '& .MuiChip-label': { px: 1.25, py: 0.25 } }} label={`Channel: ${complianceDetail?.channel}`} />
                    ) : null}
                    {complianceDetail?.status ? (
                      <Chip sx={{ height: 28, borderRadius: 16, '& .MuiChip-label': { px: 1.25, py: 0.25 } }} label={`Status: ${complianceDetail?.status}`} />
                    ) : null}
                  </Stack>

                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <SvgIcon color="action">
                        <LabelIcon />
                      </SvgIcon>
                      <Typography variant="h6">Labels</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                      {(complianceDetail?.compliance_labels || []).map((l) => (
                        <Chip key={`lbl-${l?.id || l?.name}`} color="info" variant="outlined" label={l?.name} sx={{ backgroundColor: l?.color || undefined }} />
                      ))}
                      {!complianceDetail?.compliance_labels?.length ? (
                        <Typography color="text.secondary">No labels.</Typography>
                      ) : null}
                    </Stack>
                  </Stack>

                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <SvgIcon color="action">
                        <LabelIcon />
                      </SvgIcon>
                      <Typography variant="h6">Compliance AI Labels</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                      {(complianceDetail?.compliance_ai_labels || []).map((l) => (
                        <Chip key={`ai-${l?.id || l?.name}`} color="secondary" variant="outlined" label={l?.name} />
                      ))}
                      {!complianceDetail?.compliance_ai_labels?.length ? (
                        <Typography color="text.secondary">No compliance AI labels.</Typography>
                      ) : null}
                    </Stack>
                  </Stack>
                </Stack>
              ) : null}

              {detailTab === 0 ? (
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <SvgIcon color="action">
                      <Iconify icon="healthicons:artificial-intelligence" />
                    </SvgIcon>
                    <Typography variant="h6">AI Summary</Typography>
                  </Stack>
                  <Typography variant="subtitle2">Original Language ({String(complianceDetail?.call_data?.transcript?.original?.language || complianceDetail?.call_data?.transcript?.detected_language || "").toUpperCase() || "—"}):</Typography>
                  <Typography whiteSpace="pre-wrap">{complianceDetail?.call_data?.summary?.original?.text || complianceDetail?.summary?.original?.text || "No summary."}</Typography>
                  {complianceDetail?.call_data?.summary?.english?.text || complianceDetail?.summary?.english?.text ? (
                    <>
                      <Typography variant="subtitle2">English Summary:</Typography>
                      <Typography whiteSpace="pre-wrap">{complianceDetail?.call_data?.summary?.english?.text || complianceDetail?.summary?.english?.text}</Typography>
                    </>
                  ) : null}
                </Stack>
              ) : null}

              {detailTab === 2 ? (
                <Stack spacing={2}>
                  {!complianceDetail?.call_data?.transcript?.original?.segments?.length && !complianceDetail?.call_data?.transcript?.english?.segments?.length ? (
                    <>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <SvgIcon color="action">
                          <TranslateIcon />
                        </SvgIcon>
                        <Typography variant="h6">Transcript</Typography>
                      </Stack>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2">Transcript</Typography>
                        <Typography whiteSpace="pre-wrap">{complianceDetail?.call_data?.transcript?.original?.text || "No transcript."}</Typography>
                        {complianceDetail?.call_data?.transcript?.english?.text ? (
                          <>
                            <Typography variant="subtitle2">English Translation</Typography>
                            <Typography whiteSpace="pre-wrap">{complianceDetail?.call_data?.transcript?.english?.text}</Typography>
                          </>
                        ) : null}
                      </Stack>
                    </>
                  ) : null}

                  <Stack>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <SvgIcon color="action">
                        <TranslateIcon />
                      </SvgIcon>
                      <Typography variant="h6">Transcript Segments</Typography>
                    </Stack>
                    {(() => {
                      const segmentsOriginal = complianceDetail?.call_data?.transcript?.original?.segments || [];
                      const segmentsEnglish = complianceDetail?.call_data?.transcript?.english?.segments || [];
                      const hasSegments = segmentsOriginal.length > 0 || segmentsEnglish.length > 0;
                      return (
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Original</Typography>
                            <Stack spacing={1}>
                              {segmentsOriginal.map((seg, idx) => (
                                <Box key={`orig-${seg?.start}-${idx}`} sx={{ p: 1, borderRadius: 1, bgcolor: "action.hover", border: 1, borderColor: "divider" }}>
                                  <Stack direction="row" spacing={1} alignItems="baseline">
                                    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>{`${formatDuration(seg?.start)} - ${formatDuration(seg?.end)}`}</Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{typeof seg?.text === "string" ? seg.text : ""}</Typography>
                                  </Stack>
                                </Box>
                              ))}
                              {segmentsOriginal.length === 0 ? (
                                hasSegments ? (
                                  <Typography color="text.secondary">No segments.</Typography>
                                ) : (
                                  <Stack spacing={1}>
                                    <Typography variant="subtitle2">Transcript</Typography>
                                    <Typography whiteSpace="pre-wrap">{complianceDetail?.call_data?.transcript?.original?.text || "No transcript."}</Typography>
                                  </Stack>
                                )
                              ) : null}
                            </Stack>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>English</Typography>
                            <Stack spacing={1}>
                              {segmentsEnglish.map((seg, idx) => (
                                <Box key={`en-${seg?.start}-${idx}`} sx={{ p: 1, borderRadius: 1, bgcolor: "action.hover", border: 1, borderColor: "divider" }}>
                                  <Stack direction="row" spacing={1} alignItems="baseline">
                                    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>{`${formatDuration(seg?.start)} - ${formatDuration(seg?.end)}`}</Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{typeof seg?.text === "string" ? seg.text : ""}</Typography>
                                  </Stack>
                                </Box>
                              ))}
                              {segmentsEnglish.length === 0 ? (
                                hasSegments ? (
                                  <Typography color="text.secondary">No segments.</Typography>
                                ) : (
                                  <Stack spacing={1}>
                                    <Typography variant="subtitle2">English Translation</Typography>
                                    <Typography whiteSpace="pre-wrap">{complianceDetail?.call_data?.transcript?.english?.text || "No transcript."}</Typography>
                                  </Stack>
                                )
                              ) : null}
                            </Stack>
                          </Box>
                        </Stack>
                      );
                    })()}
                  </Stack>
                </Stack>
              ) : null}
            </Stack>
          </Scrollbar>
        )}
      </Stack>
    </Drawer>
  );
};

export default ComplianceDrawer;


