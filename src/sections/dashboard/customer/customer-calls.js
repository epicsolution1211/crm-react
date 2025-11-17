import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import LabelIcon from "@mui/icons-material/Label";
import TranslateIcon from "@mui/icons-material/Translate";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";

import { Scrollbar } from "src/components/scrollbar";
import { chatApi } from "src/api/chat";
import { getAPIUrl } from "src/config";
import { Iconify } from "src/components/iconify";
import { useTimezone } from "src/hooks/use-timezone";

const getDispositionChip = (disposition) => {
  if (!disposition) return { color: "default", label: "n/a" };
  const normalized = String(disposition).toLowerCase();
  const successful = ["answered", "completed"];
  const failed = ["failed", "busy", "no_answer", "abandoned"];
  if (successful.includes(normalized))
    return { color: "success", label: normalized };
  if (failed.includes(normalized)) return { color: "error", label: normalized };
  return { color: "default", label: normalized };
};

const formatTitleCase = (value) => {
  if (!value) return "";
  const text = String(value).replace(/_/g, " ");
  return text
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

const formatDuration = (value) => {
  if (value === null || value === undefined) return "00:00";
  const seconds = Number(value);
  if (Number.isNaN(seconds)) return String(value);
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const SectionHeader = ({ icon, title, action }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    sx={{ mb: 1 }}
  >
    <Stack direction="row" spacing={1} alignItems="center">
      <SvgIcon sx={{ color: "text.secondary" }}>{icon}</SvgIcon>
      <Typography variant="h6">{title}</Typography>
    </Stack>
    {action}
  </Stack>
);

SectionHeader.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  action: PropTypes.node,
};

export const CustomerCalls = ({ customerId }) => {
  const { toLocalTime } = useTimezone();
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [calls, setCalls] = useState([]);
  const [selectedCallId, setSelectedCallId] = useState(null);
  const [selectedCall, setSelectedCall] = useState(null);

  const handleLoadCalls = useCallback(async () => {
    setIsLoadingList(true);
    try {
      const response = await chatApi.getCalls({
        client_id: customerId,
        per_page: 50,
      });
      const list = response?.calls || response?.data || response || [];
      setCalls(list);
      if (list?.length) {
        setSelectedCallId(
          list[0]?.id || list[0]?.call_id || list[0]?.internal_id
        );
      } else {
        setSelectedCallId(null);
        setSelectedCall(null);
      }
    } catch (error) {
      console.error("Error fetching calls", error);
    }
    setIsLoadingList(false);
  }, [customerId]);

  const handleLoadCall = useCallback(async (id) => {
    if (!id) return;
    setIsLoadingDetail(true);
    try {
      const response = await chatApi.getCall(id);
      setSelectedCall(response?.call || response);
    } catch (error) {
      console.error("Error fetching call details", error);
      setSelectedCall(null);
    }
    setIsLoadingDetail(false);
  }, []);

  useEffect(() => {
    if (customerId) {
      handleLoadCalls();
    }
  }, [customerId, handleLoadCalls]);

  useEffect(() => {
    if (selectedCallId) {
      handleLoadCall(selectedCallId);
    }
  }, [selectedCallId, handleLoadCall]);

  const audioUrl = useMemo(() => {
    if (!selectedCall) return "";
    const src =
      selectedCall?.audio_url ||
      selectedCall?.record_file ||
      selectedCall?.recording_url ||
      selectedCall?.audio?.url;
    if (!src) return "";
    return src?.includes("http") ? src : `${getAPIUrl()}/${src}`;
  }, [selectedCall]);

  

  const summaryRaw = selectedCall?.summary ?? selectedCall?.call_summary;
  const englishSummaryRaw =
    selectedCall?.english_summary ?? selectedCall?.en_summary;

  const originalSummary = (() => {
    if (typeof summaryRaw === "string") return summaryRaw;
    if (summaryRaw?.original?.text) return summaryRaw.original.text;
    if (selectedCall?.summary_original) return selectedCall.summary_original;
    if (selectedCall?.ai_summary) return selectedCall.ai_summary;
    return "";
  })();

  const englishSummary = (() => {
    if (typeof englishSummaryRaw === "string") return englishSummaryRaw;
    if (summaryRaw?.english?.text) return summaryRaw.english.text;
    if (selectedCall?.summary_english) return selectedCall.summary_english;
    if (selectedCall?.ai_summary_english)
      return selectedCall.ai_summary_english;
    return "";
  })();

  const originalTranscriptRaw =
    selectedCall?.transcript?.original?.text ??
    selectedCall?.transcript_original ??
    selectedCall?.ai_transcript ??
    selectedCall?.transcript ??
    selectedCall?.call_transcript ??
    selectedCall?.original_transcript;
  const englishTranscriptRaw =
    selectedCall?.transcript?.english?.text ??
    selectedCall?.transcript_english ??
    selectedCall?.ai_transcript_english ??
    selectedCall?.english_transcript ??
    selectedCall?.en_transcript;
  const originalTranscript =
    typeof originalTranscriptRaw === "string"
      ? originalTranscriptRaw
      : originalTranscriptRaw?.original ?? originalTranscriptRaw?.english ?? "";
  const englishTranscript =
    typeof englishTranscriptRaw === "string"
      ? englishTranscriptRaw
      : englishTranscriptRaw?.english ?? englishTranscriptRaw?.original ?? "";

  const detectedLanguage =
    selectedCall?.detected_language ??
    selectedCall?.ai_detected_language ??
    selectedCall?.transcript?.detected_language ??
    selectedCall?.detected_language_name ??
    selectedCall?.transcript?.detected_language_name;
  const languageProbability =
    selectedCall?.language_probability ??
    selectedCall?.ai_language_probability ??
    selectedCall?.transcript?.language_probability;
  const detectedLanguageName =
    selectedCall?.detected_language_name ??
    selectedCall?.transcript?.detected_language_name ??
    (typeof detectedLanguage === "string"
      ? detectedLanguage.toUpperCase()
      : "");
  const durationFormatted =
    selectedCall?.duration_formatted || formatDuration(selectedCall?.duration);
  const fromToDisplay = `${selectedCall?.caller_display || "-"} → ${
    selectedCall?.called_display || "-"
  }`;
  const agentDisplay =
    selectedCall?.account_name || selectedCall?.agent_name || "Unknown agent";
  const chipSx = {
    height: 28,
    borderRadius: 16,
    "& .MuiChip-label": { px: 1.25, py: 0.25 },
  };
  const [rightTab, setRightTab] = useState(0);
  const handleRightTabChange = useCallback((e, v) => setRightTab(v), []);

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ pt: 2 }}>
      <Card sx={{ width: { xs: 1, md: 360 }, flexShrink: 0 }}>
        <CardContent sx={{ p: 0 }}>
          <Stack alignItems="center" direction="row" spacing={1} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Calls
            </Typography>
            <Tooltip title="Refresh">
              <IconButton
                onClick={handleLoadCalls}
                aria-label="Refresh calls list"
              >
                <Iconify icon="material-symbols:refresh" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Divider />
          <Box sx={{ display: "block" }}>
            <Scrollbar
              sx={{ maxHeight: { xs: 360, md: "calc(100vh - 280px)" } }}
            >
              <Stack sx={{ p: 1 }} spacing={1}>
                {!isLoadingList && calls?.length === 0 ? (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{ py: 6, px: 2 }}
                    spacing={1}
                  >
                    <SvgIcon color="disabled">
                      <PhoneDisabledIcon />
                    </SvgIcon>
                    <Typography variant="subtitle1">No calls yet</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      When calls are available for this client, they will appear
                      here.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Refresh">
                        <IconButton
                          onClick={handleLoadCalls}
                          aria-label="Refresh calls list"
                        >
                          <Iconify icon="material-symbols:refresh" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                ) : null}
                {calls?.map((item) => {
                  const id = item?.id || item?.call_id || item?.internal_id;
                  const active = id === selectedCallId;
                  const chip = getDispositionChip(item?.disposition);
                  const isOutbound =
                    String(item?.call_type).toLowerCase() === "outbound";
                  const formattedStart = item?.start_time
                    ? toLocalTime(item?.start_time)
                    : "-";
                  const duration = formatDuration(item?.duration);
                  const aiLabels = item?.compliance_ai_labels || [];
                  return (
                    <Card
                      key={id}
                      variant={active ? "outlined" : "elevation"}
                      sx={{
                        borderColor: active ? "primary.main" : "divider",
                        cursor: "pointer",
                        "&:hover": { boxShadow: 4 },
                      }}
                      onClick={() => setSelectedCallId(id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          setSelectedCallId(id);
                      }}
                      aria-label={`Open call ${id}`}
                    >
                      <CardContent sx={{ p: 1.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <SvgIcon>
                            {isOutbound ? (
                              <CallMadeIcon />
                            ) : (
                              <CallReceivedIcon />
                            )}
                          </SvgIcon>
                          <Stack sx={{ minWidth: 0, flexGrow: 1 }}>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              sx={{ flexWrap: "wrap", mb: 0.5 }}
                            >
                              <Chip
                                size="small"
                                label={item?.provider_type || "n/a"}
                                variant="outlined"
                              />
                              {aiLabels.slice(0, 3).map((label) => (
                                <Chip
                                  key={`${id}-ai-${label}`}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                  label={label}
                                />
                              ))}
                              {aiLabels.length > 3 ? (
                                <Chip
                                  size="small"
                                  variant="outlined"
                                  label={`+${aiLabels.length - 3}`}
                                />
                              ) : null}
                            </Stack>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              sx={{ minWidth: 0 }}
                            >
                              <Typography variant="subtitle2" noWrap>
                                {item?.agent_name || "Unknown agent"}
                              </Typography>
                            </Stack>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {formattedStart} • {duration}
                            </Typography>
                          </Stack>
                          <Chip
                            size="small"
                            color={chip.color}
                            label={chip.label}
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            </Scrollbar>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, minHeight: 360 }}>
        <CardContent>
          {!selectedCall ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ py: 10 }}
              spacing={1}
            >
              <SvgIcon color="disabled" sx={{ fontSize: 36 }}>
                <HeadsetMicIcon />
              </SvgIcon>
              <Typography variant="h6">
                {isLoadingDetail
                  ? "Loading call…"
                  : "Select a call to view details"}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Choose a call from the list on the left to see its summary,
                transcript, and recording.
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SvgIcon color="action">
                  <PlayCircleOutlineIcon />
                </SvgIcon>
                <Typography variant="h6">Call</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Chip
                  size="small"
                  sx={chipSx}
                  label={selectedCall?.provider_type || "n/a"}
                  variant="outlined"
                />
                <Chip
                  size="small"
                  sx={chipSx}
                  label={String(selectedCall?.call_type || "").toUpperCase()}
                />
                <Chip
                  size="small"
                  sx={chipSx}
                  color={getDispositionChip(selectedCall?.disposition).color}
                  label={getDispositionChip(selectedCall?.disposition).label}
                />
              </Stack>

              <audio controls style={{ width: "100%" }} src={audioUrl} />

              <Divider />

              <Tabs
                value={rightTab}
                onChange={handleRightTabChange}
                aria-label="Call details tabs"
                variant="scrollable"
                allowScrollButtonsMobile
              >
                <Tab label="AI Summary" aria-label="AI Summary" />
                <Tab label="Insight" aria-label="Insight" />
                <Tab
                  label="Call Transcription"
                  aria-label="Call Transcription"
                />
              </Tabs>

              {rightTab === 1 ? (
                <Stack spacing={2}>
                  <SectionHeader
                    icon={<Iconify icon="mdi:clipboard-text-outline" />}
                    title="Call Transcript & Summary"
                  />
                  <Stack spacing={1.25}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <SvgIcon color="action">
                        <Iconify icon="mdi:calendar-clock" />
                      </SvgIcon>
                      <Typography variant="body2">
                        {selectedCall?.start_time
                          ? toLocalTime(selectedCall?.start_time)
                          : "-"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <SvgIcon color="action">
                        <Iconify icon="mdi:timer-outline" />
                      </SvgIcon>
                      <Typography variant="body2">
                        Duration: {durationFormatted}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <SvgIcon color="action">
                        <Iconify icon="mdi:account" />
                      </SvgIcon>
                      <Typography variant="body2">
                        Agent: {agentDisplay}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <SvgIcon color="action">
                        <Iconify icon="mdi:phone-forward" />
                      </SvgIcon>
                      <Typography variant="body2">
                        From: {fromToDisplay}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <SvgIcon color="action">
                        <Iconify icon="mdi:check-circle-outline" />
                      </SvgIcon>
                      <Typography variant="body2">
                        Result:{" "}
                        {formatTitleCase(
                          getDispositionChip(selectedCall?.disposition).label
                        )}
                      </Typography>
                    </Stack>
                    {detectedLanguage ? (
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <SvgIcon color="action">
                          <Iconify icon="mdi:translate" />
                        </SvgIcon>
                        <Typography variant="body2">
                          Language:{" "}
                          {detectedLanguageName ||
                            String(detectedLanguage).toUpperCase()}{" "}
                          (
                          {languageProbability
                            ? (Number(languageProbability) * 100).toFixed(1) +
                              "% confidence"
                            : "confidence —"}
                          )
                        </Typography>
                      </Stack>
                    ) : null}
                  </Stack>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    rowGap={1}
                    sx={{ flexWrap: "wrap" }}
                  >
                    {selectedCall?.agent_name ? (
                      <Chip
                        sx={chipSx}
                        label={`Agent: ${selectedCall?.agent_name}`}
                      />
                    ) : null}
                    {selectedCall?.start_time ? (
                      <Chip
                        sx={chipSx}
                        label={`Start: ${toLocalTime(selectedCall?.start_time)}`}
                      />
                    ) : null}
                    {selectedCall?.end_time ? (
                      <Chip
                        sx={chipSx}
                        label={`End: ${toLocalTime(selectedCall?.end_time)}`}
                      />
                    ) : null}
                    {selectedCall?.duration ? (
                      <Chip
                        sx={chipSx}
                        label={`Duration: ${formatDuration(
                          selectedCall?.duration
                        )}`}
                      />
                    ) : null}
                    {selectedCall?.ring_duration !== undefined ? (
                      <Chip
                        sx={chipSx}
                        label={`Ring: ${formatDuration(
                          selectedCall?.ring_duration
                        )}`}
                      />
                    ) : null}
                    {selectedCall?.hangup_cause ? (
                      <Chip
                        sx={chipSx}
                        label={`Hangup: ${selectedCall?.hangup_cause}`}
                      />
                    ) : null}
                    {detectedLanguage ? (
                      <Chip
                        sx={chipSx}
                        label={`Lang: ${String(
                          detectedLanguage
                        ).toUpperCase()} (${
                          languageProbability
                            ? (Number(languageProbability) * 100).toFixed(1) +
                              "%"
                            : "—"
                        })`}
                      />
                    ) : null}
                  </Stack>

                  <SectionHeader icon={<LabelIcon />} title="Labels" />
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {(selectedCall?.ai_labels || []).map((label) => (
                      <Chip
                        key={`ai-${label}`}
                        color="info"
                        variant="outlined"
                        label={label}
                      />
                    ))}
                    {!selectedCall?.custom_labels?.length &&
                    !selectedCall?.ai_labels?.length ? (
                      <Typography color="text.secondary">No labels.</Typography>
                    ) : null}
                  </Stack>

                  <SectionHeader
                    icon={<LabelIcon />}
                    title="Compliance Labels"
                  />
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {(selectedCall?.compliance_labels || []).map((label) => (
                      <Chip
                        key={`compliance-${label}`}
                        color="warning"
                        variant="outlined"
                        label={label}
                      />
                    ))}
                    {!selectedCall?.compliance_labels?.length ? (
                      <Typography color="text.secondary">
                        No compliance labels.
                      </Typography>
                    ) : null}
                  </Stack>

                  <SectionHeader
                    icon={<LabelIcon />}
                    title="Compliance AI Labels"
                  />
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {(selectedCall?.compliance_ai_labels || []).map((label) => (
                      <Chip
                        key={`compliance-ai-${label}`}
                        color="secondary"
                        variant="outlined"
                        label={label}
                      />
                    ))}
                    {!selectedCall?.compliance_ai_labels?.length ? (
                      <Typography color="text.secondary">
                        No compliance AI labels.
                      </Typography>
                    ) : null}
                  </Stack>
                </Stack>
              ) : null}

              {rightTab === 0 ? (
                <Stack spacing={1}>
                  <SectionHeader icon={<Iconify icon="healthicons:artificial-intelligence" />} title="AI Summary" />
                  <Typography variant="subtitle2">
                    Original Language (
                    {detectedLanguageName ||
                      String(detectedLanguage || "").toUpperCase() ||
                      "—"}
                    ):
                  </Typography>
                  <Typography whiteSpace="pre-wrap">
                    {originalSummary || "No summary."}
                  </Typography>
                  {englishSummary ? (
                    <>
                      <Typography variant="subtitle2">
                        English Summary:
                      </Typography>
                      <Typography whiteSpace="pre-wrap">
                        {englishSummary}
                      </Typography>
                    </>
                  ) : null}
                </Stack>
              ) : null}

              {rightTab === 2 ? (
                <Stack spacing={2}>
                  {!selectedCall?.transcript?.original?.segments?.length && !selectedCall?.transcript?.english?.segments?.length ? (
                    <>
                      <SectionHeader icon={<TranslateIcon />} title="Transcript" />
                      <Stack spacing={1}>
                        <Typography variant="subtitle2">Transcript</Typography>
                        <Typography whiteSpace="pre-wrap">
                          {originalTranscript || "No transcript."}
                        </Typography>
                        {englishTranscript ? (
                          <>
                            <Typography variant="subtitle2">
                              English Translation
                            </Typography>
                            <Typography whiteSpace="pre-wrap">
                              {englishTranscript}
                            </Typography>
                          </>
                        ) : null}
                      </Stack>
                    </>
                  ) : null}

                  <SectionHeader
                    icon={<TranslateIcon />}
                    title="Transcript Segments"
                  />
                  {(() => {
                    const segmentsOriginal =
                      selectedCall?.transcript?.original?.segments || [];
                    const segmentsEnglish =
                      selectedCall?.transcript?.english?.segments || [];
                    const hasSegments =
                      segmentsOriginal.length > 0 || segmentsEnglish.length > 0;
                    return (
                      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Original
                          </Typography>
                          <Stack spacing={1}>
                            {segmentsOriginal.map((seg, idx) => (
                              <Box
                                key={`orig-${seg?.start}-${idx}`}
                                sx={{
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: "action.hover",
                                  border: 1,
                                  borderColor: "divider",
                                }}
                              >
                                <Stack direction="row" spacing={1} alignItems="baseline">
                                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                                    {`${formatDuration(seg?.start)} - ${formatDuration(seg?.end)}`}
                                  </Typography>
                                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                    {typeof seg?.text === "string" ? seg.text : ""}
                                  </Typography>
                                </Stack>
                              </Box>
                            ))}
                            {segmentsOriginal.length === 0 ? (
                              hasSegments ? (
                                <Typography color="text.secondary">No segments.</Typography>
                              ) : (
                                <Stack spacing={1}>
                                  <Typography variant="subtitle2">Transcript</Typography>
                                  <Typography whiteSpace="pre-wrap">
                                    {originalTranscript || "No transcript."}
                                  </Typography>
                                </Stack>
                              )
                            ) : null}
                          </Stack>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            English
                          </Typography>
                          <Stack spacing={1}>
                            {segmentsEnglish.map((seg, idx) => (
                              <Box
                                key={`en-${seg?.start}-${idx}`}
                                sx={{
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: "action.hover",
                                  border: 1,
                                  borderColor: "divider",
                                }}
                              >
                                <Stack direction="row" spacing={1} alignItems="baseline">
                                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                                    {`${formatDuration(seg?.start)} - ${formatDuration(seg?.end)}`}
                                  </Typography>
                                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                    {typeof seg?.text === "string" ? seg.text : ""}
                                  </Typography>
                                </Stack>
                              </Box>
                            ))}
                            {segmentsEnglish.length === 0 ? (
                              hasSegments ? (
                                <Typography color="text.secondary">No segments.</Typography>
                              ) : (
                                <Stack spacing={1}>
                                  <Typography variant="subtitle2">English Translation</Typography>
                                  <Typography whiteSpace="pre-wrap">
                                    {englishTranscript || "No transcript."}
                                  </Typography>
                                </Stack>
                              )
                            ) : null}
                          </Stack>
                        </Box>
                      </Stack>
                    );
                  })()}
                </Stack>
              ) : null}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

CustomerCalls.propTypes = {
  customerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default CustomerCalls;
