import { useState, useEffect } from "react";
import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Add, Delete, Close, Edit } from "@mui/icons-material";
import { toast } from "react-hot-toast";

import { affiliateApi } from "src/api/lead-management/affiliate";
import { settingsApi } from "src/api/settings";

const validationSchema = yup.object({
  rule_type: yup.string().required("Rule type is required"),
  rule_value: yup.string().required("Rule value is required"),
  desk_percentages: yup.array().of(
    yup.object({
      desk_id: yup.number().required("Desk is required"),
      percentage: yup
        .number()
        .min(0, "Percentage must be at least 0")
        .max(100, "Percentage cannot exceed 100")
        .required("Percentage is required"),
      enable_agent_percentages: yup.boolean().default(false),
      agent_percentages: yup.array().of(
        yup.object({
          agent_id: yup.number().optional(),
          percentage: yup.number().optional(),
        })
      ).optional(),
    })
  ).min(1, "At least one desk must be selected"),
  description: yup.string().optional(),
});

const CreateRuleModal = ({ open, onClose, onSubmit, affiliate, editRule = null }) => {
  const [availableAreas, setAvailableAreas] = useState([]);
  const [commonCountries, setCommonCountries] = useState([]);
  const [availableDesks, setAvailableDesks] = useState([]);
  const [agentsByDesk, setAgentsByDesk] = useState({});

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      rule_type: "",
      rule_value: "",
      desk_percentages: [{ 
        desk_id: "", 
        percentage: "", 
        enable_agent_percentages: false,
        agent_percentages: []
      }],
      description: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "desk_percentages",
  });

  const watchDeskPercentages = watch("desk_percentages");

  useEffect(() => {
    if (affiliate?.country_routing_options) {
      setAvailableAreas(affiliate.country_routing_options.available_areas || []);
      setCommonCountries(affiliate.country_routing_options.common_countries || []);
      setAvailableDesks(affiliate.country_routing_options.available_desks || []);
    }
  }, [affiliate]);

  // Populate form when edit modal opens and desks are available
  useEffect(() => {
    if (editRule && open && availableDesks.length > 0 && typeof reset === 'function') {
      // Convert desk_percentages object to array format
      const deskPercentages = Object.entries(editRule.desk_percentages || {}).map(([deskId, percentage]) => {
        const enableAgentPercentages = editRule.agent_percentages?.[deskId] ? true : false;
        
        let agentPercentages = [];
        if (enableAgentPercentages && editRule.agent_percentages?.[deskId]) {
          agentPercentages = Object.entries(editRule.agent_percentages[deskId]).map(([agentId, agentPercentage]) => ({
            agent_id: Number(agentId),
            percentage: agentPercentage.toString()
          }));
        }

        return {
          desk_id: Number(deskId),
          percentage: percentage.toString(),
          enable_agent_percentages: enableAgentPercentages,
          agent_percentages: agentPercentages
        };
      });
      
      // Reset form with all the data at once
      reset({
        rule_type: editRule.rule_type,
        rule_value: editRule.rule_value,
        desk_percentages: deskPercentages,
        description: editRule.description || "",
      });

      // Fetch agents for selected desks
      deskPercentages.forEach(desk => {
        if (desk.desk_id) {
          fetchAgentsForDesk(desk.desk_id);
        }
      });
    }
  }, [editRule, open, availableDesks, reset]);

  const fetchAgentsForDesk = async (deskId) => {
    if (!deskId) return;
    
    try {
      const response = await settingsApi.getMembers([], "*", { 
        active: true, 
        desk_ids: [deskId] 
      });
      
      const agents = response?.accounts
        ?.filter(account => !account?.admin_hide)
        ?.map((account) => ({
          id: account.id,
          name: `${account.first_name} ${account.last_name}`,
          avatar: account.avatar,
        }))
        ?.sort((a, b) => a.name.localeCompare(b.name)) || [];
      
      setAgentsByDesk(prev => ({
        ...prev,
        [deskId]: agents
      }));
    } catch (error) {
      console.error("Failed to fetch agents for desk:", error);
    }
  };



  const handleFormSubmit = async (data) => {
    try {
      // Validate desk percentages
      const totalPercentage = data.desk_percentages.reduce(
        (sum, desk) => sum + Number(desk.percentage),
        0
      );

      if (totalPercentage !== 100) {
        toast.error("Total percentage must equal 100%");
        return;
      }

      // Validate agent percentages for each desk
      for (let i = 0; i < data.desk_percentages.length; i++) {
        const desk = data.desk_percentages[i];
        if (desk.enable_agent_percentages) {
          // If agent percentages are enabled, at least one agent must be added
          if (!desk.agent_percentages || desk.agent_percentages.length === 0) {
            toast.error(`Please add at least one agent for desk ${desk.desk_id} when agent percentages are enabled`);
            return;
          }

          const agentTotal = desk.agent_percentages.reduce(
            (sum, agent) => sum + Number(agent.percentage),
            0
          );
          
          if (agentTotal !== 100) {
            toast.error(`Agent percentages for desk ${desk.desk_id} must equal 100% (current total: ${agentTotal}%)`);
            return;
          }

          // Validate that all agent fields are filled
          const hasEmptyFields = desk.agent_percentages.some(
            agent => !agent.agent_id || !agent.percentage
          );
          
          if (hasEmptyFields) {
            toast.error(`Please fill all agent fields for desk ${desk.desk_id}`);
            return;
          }
        }
      }

      const formattedData = {
        affiliate_id: affiliate.id,
        rule_type: data.rule_type,
        rule_value: data.rule_value,
        desk_percentages: data.desk_percentages.reduce((acc, desk) => {
          acc[desk.desk_id] = Number(desk.percentage);
          return acc;
        }, {}),
        agent_percentages: data.desk_percentages.reduce((acc, desk) => {
          if (desk.enable_agent_percentages && desk.agent_percentages?.length > 0) {
            acc[desk.desk_id] = desk.agent_percentages.reduce((agentAcc, agent) => {
              agentAcc[agent.agent_id] = Number(agent.percentage);
              return agentAcc;
            }, {});
          }
          return acc;
        }, {}),
        description: data.description,
      };

      await onSubmit(formattedData);
      if (typeof reset === 'function') {
        reset();
      }
      onClose();
      toast.success(editRule ? "Country routing rule updated successfully!" : "Country routing rule created successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || (editRule ? "Failed to update rule" : "Failed to create rule"));
    }
  };

  const handleClose = () => {
    if (typeof reset === 'function') {
      reset();
    }
    onClose();
  };

  const addDesk = () => {
    append({ 
      desk_id: "", 
      percentage: "", 
      enable_agent_percentages: false,
      agent_percentages: []
    });
  };

  const removeDesk = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const addAgent = (deskIndex) => {
    const currentDesk = watchDeskPercentages[deskIndex];
    const currentAgentTotal = (currentDesk.agent_percentages || []).reduce((sum, agent) => sum + (Number(agent.percentage) || 0), 0);
    const remainingPercentage = Math.max(0, 100 - currentAgentTotal);
    
    const updatedDesk = {
      ...currentDesk,
      agent_percentages: [...(currentDesk.agent_percentages || []), { 
        agent_id: "", 
        percentage: remainingPercentage > 0 ? remainingPercentage.toString() : "0" 
      }]
    };
    setValue(`desk_percentages.${deskIndex}`, updatedDesk);
  };

  const removeAgent = (deskIndex, agentIndex) => {
    const currentDesk = watchDeskPercentages[deskIndex];
    const updatedAgents = currentDesk.agent_percentages.filter((_, i) => i !== agentIndex);
    
    // If this was the last agent, disable agent distribution
    if (updatedAgents.length === 0) {
      const updatedDesk = {
        ...currentDesk,
        agent_percentages: [],
        enable_agent_percentages: false
      };
      setValue(`desk_percentages.${deskIndex}`, updatedDesk);
    } else {
      const updatedDesk = {
        ...currentDesk,
        agent_percentages: updatedAgents
      };
      setValue(`desk_percentages.${deskIndex}`, updatedDesk);
    }
    

  };

  const getAgentTotalPercentage = (deskIndex) => {
    const desk = watchDeskPercentages[deskIndex];
    if (!desk?.agent_percentages) return 0;
    return desk.agent_percentages.reduce((sum, agent) => sum + (Number(agent.percentage) || 0), 0);
  };

  const getRemainingAgentPercentage = (deskIndex) => {
    const agentTotal = getAgentTotalPercentage(deskIndex);
    return Math.max(0, 100 - agentTotal);
  };

  const getRuleValueOptions = () => {
    const currentRuleType = watch("rule_type");
    if (currentRuleType === "area") {
      return availableAreas.map((area) => ({
        value: area.value,
        label: `${area.label} (${area.countries_count} countries)`,
        sample: area.sample_countries,
      }));
    } else if (currentRuleType === "country") {
      return commonCountries.map((country) => ({
        value: country.code,
        label: country.name,
      }));
    }
    return [];
  };

  const getCurrentTotalPercentage = () => {
    return watchDeskPercentages.reduce(
      (sum, desk) => sum + (Number(desk.percentage) || 0),
      0
    );
  };

  const totalPercentage = getCurrentTotalPercentage();
  const isTotalValid = totalPercentage === 100;
  
  const isAgentPercentagesValid = () => {
    return watchDeskPercentages.every((desk, index) => {
      if (!desk.enable_agent_percentages) return true;
      if (!desk.agent_percentages || desk.agent_percentages.length === 0) return false;
      return getAgentTotalPercentage(index) === 100;
    });
  };
  
  const isFormValid = isTotalValid && isAgentPercentagesValid();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 600,
        },
      }}
    >
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography variant="h6">
            {editRule ? "Edit Routing Rule" : "Create Routing Rule"}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.rule_type}>
                  <Select
                    value={watch("rule_type") || ""}
                    displayEmpty
                    renderValue={(value) => {
                      if (!value) return <span style={{ color: 'text.secondary' }}>Select Rule Type</span>;
                      return value === 'area' ? 'Area' : 'Country';
                    }}
                    onChange={async (e) => {
                      setValue("rule_type", e.target.value);
                      setValue("rule_value", "");
                      await trigger("rule_type");
                    }}
                  >
                    <MenuItem value="area">Area</MenuItem>
                    <MenuItem value="country">Country</MenuItem>
                  </Select>
                  {errors.rule_type && (
                    <FormHelperText>{errors.rule_type.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.rule_value}>
                  <Select
                    value={watch("rule_value") || ""}
                    displayEmpty
                    disabled={!watch("rule_type")}
                    renderValue={(value) => {
                      if (!value) return <span style={{ color: 'text.secondary' }}>Select Rule Value</span>;
                      const option = getRuleValueOptions().find(opt => opt.value === value);
                      return option ? option.label : value;
                    }}
                    onChange={async (e) => {
                      setValue("rule_value", e.target.value);
                      await trigger("rule_value");
                    }}
                  >
                    {getRuleValueOptions().map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.rule_value && (
                    <FormHelperText>{errors.rule_value.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            {watch("rule_type") === "area" && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Sample Countries:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {getRuleValueOptions()
                    .find((opt) => opt.value === watch("rule_value"))
                    ?.sample?.slice(0, 8)
                    .map((country) => (
                      <Chip
                        key={country}
                        label={country}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                </Stack>
              </Box>
            )}

            <Divider />

            <Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Typography variant="h6">Desk Distribution</Typography>
                <Button
                  onClick={addDesk}
                  variant="outlined"
                  startIcon={<Add />}
                  size="small"
                >
                  Add Desk
                </Button>
              </Stack>

              <Stack spacing={2}>
                {fields.map((field, index) => {
                  const deskId = watch(`desk_percentages.${index}.desk_id`);
                  const enableAgentPercentages = watch(`desk_percentages.${index}.enable_agent_percentages`);
                  const agentTotalPercentage = getAgentTotalPercentage(index);
                  const isAgentTotalValid = agentTotalPercentage === 100;
                  
                  return (
                    <Card key={field.id} variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Stack spacing={2}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={5}>
                              <FormControl fullWidth error={!!errors.desk_percentages?.[index]?.desk_id}>
                                <Select
                                  value={watch(`desk_percentages.${index}.desk_id`) || ""}
                                  displayEmpty
                                  renderValue={(value) => {
                                    if (!value) return <span style={{ color: 'text.secondary' }}>Select Desk</span>;
                                    const desk = availableDesks.find(d => d.id === value);
                                    return desk ? desk.name : value;
                                  }}
                                  onChange={(e) => {
                                    setValue(`desk_percentages.${index}.desk_id`, e.target.value);
                                    setValue(`desk_percentages.${index}.agent_percentages`, []);
                                    setValue(`desk_percentages.${index}.enable_agent_percentages`, false);
                                    if (e.target.value) {
                                      fetchAgentsForDesk(e.target.value);
                                    }
                                  }}
                                >
                                    {availableDesks.map((desk) => (
                                      <MenuItem key={desk.id} value={desk.id}>
                                        {desk.name}
                                        {desk.is_default && (
                                          <Chip
                                            label="Default"
                                            size="small"
                                            color="primary"
                                            sx={{ ml: 1 }}
                                          />
                                        )}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  {errors.desk_percentages?.[index]?.desk_id && (
                                    <FormHelperText>
                                      {errors.desk_percentages[index].desk_id.message}
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                            <Grid item xs={12} md={3}>
                                                          <TextField
                              value={watch(`desk_percentages.${index}.percentage`) || ""}
                              onChange={(e) => {
                                setValue(`desk_percentages.${index}.percentage`, e.target.value);
                              }}
                              label="Percentage"
                              type="number"
                              fullWidth
                              error={!!errors.desk_percentages?.[index]?.percentage}
                              helperText={errors.desk_percentages?.[index]?.percentage?.message}
                              InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              }}
                            />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="body2">Agents</Typography>
                                <Switch
                                  checked={enableAgentPercentages}
                                  onChange={(e) => {
                                    setValue(`desk_percentages.${index}.enable_agent_percentages`, e.target.checked);
                                    if (!e.target.checked) {
                                      setValue(`desk_percentages.${index}.agent_percentages`, []);
                                    } else if (deskId) {
                                      setValue(`desk_percentages.${index}.agent_percentages`, [{ 
                                        agent_id: "", 
                                        percentage: "100" 
                                      }]);
                                    }
                                    

                                  }}
                                  size="small"
                                  disabled={!deskId}
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <IconButton
                                onClick={() => removeDesk(index)}
                                disabled={fields.length === 1}
                                color="error"
                                size="small"
                              >
                                <Delete />
                              </IconButton>
                            </Grid>
                          </Grid>

                          {enableAgentPercentages && deskId && (
                            <Box sx={{ pl: 2, borderLeft: 2, borderColor: 'primary.main' }}>
                              <Stack spacing={2}>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  justifyContent="space-between"
                                  spacing={2}
                                >
                                  <Typography variant="subtitle2" color="primary">
                                    Agent Distribution
                                  </Typography>
                                  <Button
                                    onClick={() => addAgent(index)}
                                    variant="outlined"
                                    startIcon={<Add />}
                                    size="small"
                                  >
                                    Add Agent
                                  </Button>
                                </Stack>

                                <Stack spacing={1}>
                                  {watch(`desk_percentages.${index}.agent_percentages`)?.map((agent, agentIndex) => (
                                    <Card key={agentIndex} variant="outlined" sx={{ bgcolor: 'background.neutral' }}>
                                      <CardContent sx={{ p: 1.5 }}>
                                        <Grid container spacing={2} alignItems="center">
                                          <Grid item xs={12} md={6}>
                                            <FormControl fullWidth size="small">
                                              <Select
                                                value={agent.agent_id || ""}
                                                displayEmpty
                                                renderValue={(value) => {
                                                  if (!value) return <span style={{ color: 'text.secondary' }}>Select Agent</span>;
                                                  const agentData = agentsByDesk[deskId]?.find(a => a.id === value);
                                                  return agentData ? agentData.name : value;
                                                }}
                                                onChange={(e) => {
                                                  const currentAgents = watch(`desk_percentages.${index}.agent_percentages`);
                                                  const updatedAgents = [...currentAgents];
                                                  updatedAgents[agentIndex] = { ...updatedAgents[agentIndex], agent_id: e.target.value };
                                                  setValue(`desk_percentages.${index}.agent_percentages`, updatedAgents);
                                                }}
                                              >
                                                {agentsByDesk[deskId]?.map((agent) => {
                                                  const isSelected = watch(`desk_percentages.${index}.agent_percentages`)?.some(
                                                    (selectedAgent, selectedIndex) => 
                                                      selectedAgent.agent_id === agent.id && selectedIndex !== agentIndex
                                                  );
                                                  
                                                  return (
                                                    <MenuItem 
                                                      key={agent.id} 
                                                      value={agent.id}
                                                      disabled={isSelected}
                                                      sx={{
                                                        opacity: isSelected ? 0.5 : 1,
                                                        color: isSelected ? 'text.disabled' : 'text.primary'
                                                      }}
                                                    >
                                                      {agent.name}
                                                      {isSelected && " (Already selected)"}
                                                    </MenuItem>
                                                  );
                                                }) || []}
                                              </Select>
                                            </FormControl>
                                          </Grid>
                                          <Grid item xs={12} md={4}>
                                            <TextField
                                              value={agent.percentage || ""}
                                              onChange={(e) => {
                                                const currentAgents = watch(`desk_percentages.${index}.agent_percentages`);
                                                const updatedAgents = [...currentAgents];
                                                updatedAgents[agentIndex] = { ...updatedAgents[agentIndex], percentage: e.target.value };
                                                setValue(`desk_percentages.${index}.agent_percentages`, updatedAgents);
                                              }}
                                              label="Percentage"
                                              type="number"
                                              size="small"
                                              fullWidth
                                              InputProps={{
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                              }}
                                            />
                                          </Grid>
                                          <Grid item xs={12} md={2}>
                                            <IconButton
                                              onClick={() => removeAgent(index, agentIndex)}
                                              color="error"
                                              size="small"
                                            >
                                              <Delete />
                                            </IconButton>
                                          </Grid>
                                        </Grid>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </Stack>

                                <Box>
                                  <Alert
                                    severity={isAgentTotalValid ? "success" : "warning"}
                                    sx={{ alignItems: "center" }}
                                  >
                                    <Typography variant="body2">
                                      Agent Total: <strong>{agentTotalPercentage}%</strong>
                                      {!isAgentTotalValid && (
                                        <span style={{ color: "#ed6c02" }}>
                                          {" "}
                                          (Must equal 100%)
                                        </span>
                                      )}
                                      {isAgentTotalValid && (
                                        <span style={{ color: "#2e7d32" }}>
                                          {" "}
                                          ✓ Allocated
                                        </span>
                                      )}
                                    </Typography>
                                  </Alert>
                                  {!isAgentTotalValid && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                                      Remaining to allocate: {getRemainingAgentPercentage(index)}%
                                    </Typography>
                                  )}
                                </Box>
                              </Stack>
                            </Box>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>

              <Box sx={{ mt: 2 }}>
                <Alert
                  severity={isTotalValid ? "success" : "warning"}
                  sx={{ alignItems: "center" }}
                >
                  <Typography variant="body2">
                    Total Percentage: <strong>{totalPercentage}%</strong>
                    {!isTotalValid && (
                      <span style={{ color: "#ed6c02" }}>
                        {" "}
                        (Must equal 100%)
                      </span>
                    )}
                  </Typography>
                </Alert>
              </Box>
            </Box>

            <Divider />

            <TextField
              value={watch("description") || ""}
              onChange={(e) => {
                setValue("description", e.target.value);
              }}
              label="Description (Optional)"
              multiline
              rows={3}
              fullWidth
              placeholder="Enter a description for this routing rule..."
            />
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? (editRule ? "Updating..." : "Creating...") : (editRule ? "Update Rule" : "Create Rule")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export const GeoCountryRouting = ({ affiliate, updateAffiliate }) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);
  const [ruleToEdit, setRuleToEdit] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableDesks, setAvailableDesks] = useState([]);
  const [agentsByDesk, setAgentsByDesk] = useState({});

  useEffect(() => {
    if (affiliate?.id) {
      fetchRules();
      if (affiliate?.country_routing_options) {
        setAvailableDesks(affiliate.country_routing_options.available_desks || []);
      }
    }
  }, [affiliate?.id, affiliate?.country_routing_options]);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await affiliateApi.getAllCountryRoutings({
        affiliate_id: affiliate.id,
      });
      setRules(response?.country_routings || []);
      
      // Fetch agents for all desks used in rules
      const allDeskIds = new Set();
      response?.country_routings?.forEach(rule => {
        Object.keys(rule.desk_percentages || {}).forEach(deskId => {
          allDeskIds.add(Number(deskId));
        });
      });
      
      allDeskIds.forEach(deskId => {
        fetchAgentsForDesk(deskId);
      });
    } catch (error) {
      console.error("Failed to fetch rules:", error);
      toast.error("Failed to fetch routing rules");
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentsForDesk = async (deskId) => {
    if (!deskId || agentsByDesk[deskId]) return;
    
    try {
      const response = await settingsApi.getMembers([], "*", { 
        active: true, 
        desk_ids: [deskId] 
      });
      
      const agents = response?.accounts
        ?.filter(account => !account?.admin_hide)
        ?.map((account) => ({
          id: account.id,
          name: `${account.first_name} ${account.last_name}`,
          avatar: account.avatar,
        }))
        ?.sort((a, b) => a.name.localeCompare(b.name)) || [];
      
      setAgentsByDesk(prev => ({
        ...prev,
        [deskId]: agents
      }));
    } catch (error) {
      console.error("Failed to fetch agents for desk:", error);
    }
  };

  const getDeskName = (deskId) => {
    const desk = availableDesks.find(d => d.id === Number(deskId));
    return desk?.name || `Desk ${deskId}`;
  };

  const getAgentName = (deskId, agentId) => {
    const agents = agentsByDesk[deskId];
    if (!agents) return `Agent ${agentId}`;
    const agent = agents.find(a => a.id === Number(agentId));
    return agent?.name || `Agent ${agentId}`;
  };

  const handleCreateRule = async (data) => {
    await affiliateApi.createCountryRoutings(data);
    await fetchRules();
  };

  const handleEditRule = async (data) => {
    try {
      await affiliateApi.updateCountryRoutings(ruleToEdit.id, data);
      await fetchRules();
      toast.success("Rule updated successfully");
      setEditModalOpen(false);
      setRuleToEdit(null);
    } catch (error) {
      toast.error("Failed to update rule");
    }
  };

  const handleDeleteRule = async (ruleId) => {
    try {
      await affiliateApi.deleteCountryRoutings(ruleId);
      await fetchRules();
      toast.success("Rule deleted successfully");
      setDeleteModalOpen(false);
      setRuleToDelete(null);
    } catch (error) {
      toast.error("Failed to delete rule");
    }
  };

  const openEditModal = (rule) => {
    setRuleToEdit(rule);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setRuleToEdit(null);
  };

  const openDeleteModal = (rule) => {
    setRuleToDelete(rule);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setRuleToDelete(null);
  };

  return (
    <Box>
      <Stack spacing={3}>
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Typography variant="h5">Country Routing Rules</Typography>
            <Button
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
              startIcon={<Add />}
              disabled={!affiliate?.country_routing}
            >
              Create Rule
            </Button>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Configure traffic distribution rules based on geographic location or specific countries.
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Box>
                <Typography variant="h6" gutterBottom>
                  Enable Country Routing
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  When enabled, traffic will be distributed based on geographic location and country-specific rules.
                </Typography>
              </Box>
              <Switch
                checked={affiliate?.country_routing || false}
                onChange={async (event) => {
                  try {
                    await updateAffiliate(affiliate.id, {
                      country_routing: event.target.checked
                    });
                    toast.success(
                      `Country routing ${event.target.checked ? 'enabled' : 'disabled'} successfully!`
                    );
                  } catch (error) {
                    toast.error('Failed to update country routing setting');
                  }
                }}
                color="primary"
              />
            </Stack>
          </CardContent>
        </Card>

        {!affiliate?.country_routing ? (
          <Card>
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Country Routing Disabled
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enable country routing above to start creating geographic traffic distribution rules.
              </Typography>
            </CardContent>
          </Card>
        ) : loading ? (
          <Card>
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Typography>Loading rules...</Typography>
            </CardContent>
          </Card>
        ) : rules.length === 0 ? (
          <Card>
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Routing Rules
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first country routing rule to get started.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {rules.map((rule) => (
              <Card key={rule.id} variant="outlined">
                <CardContent>
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Chip
                          label={rule.rule_type === "area" ? "Area" : "Country"}
                          color="primary"
                          size="small"
                        />
                        <Typography variant="h6">
                          {rule.rule_type === "area" ? rule.rule_value : rule.rule_value}
                        </Typography>
                      </Stack>
                      {rule.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {rule.description}
                        </Typography>
                      )}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Desk Distribution:
                        </Typography>
                        <Grid container spacing={2}>
                          {Object.entries(rule.desk_percentages || {}).map(([deskId, percentage]) => (
                            <Grid item xs={12} sm={6} md={4} key={deskId}>
                              <Card variant="outlined" sx={{ p: 1.5, bgcolor: 'background.neutral', height: '100%' }}>
                                <Stack spacing={1}>
                                  <Box>
                                    <Typography variant="subtitle2" fontWeight="medium" color="primary">
                                      {getDeskName(deskId)}
                                    </Typography>
                                    <Chip
                                      label={`${percentage}%`}
                                      size="small"
                                      color="primary"
                                      variant="filled"
                                    />
                                  </Box>
                                  {rule.agent_percentages?.[deskId] && (
                                    <Box>
                                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                        Agent Distribution:
                                      </Typography>
                                      <Stack spacing={0.5}>
                                        {Object.entries(rule.agent_percentages[deskId]).map(([agentId, agentPercentage]) => (
                                          <Box key={agentId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="caption" color="text.primary">
                                              {getAgentName(deskId, agentId)}
                                            </Typography>
                                            <Chip
                                              label={`${agentPercentage}%`}
                                              size="small"
                                              variant="outlined"
                                              sx={{ fontSize: '0.7rem', height: 20 }}
                                            />
                                          </Box>
                                        ))}
                                      </Stack>
                                    </Box>
                                  )}
                                </Stack>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        onClick={() => openEditModal(rule)}
                        color="primary"
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => openDeleteModal(rule)}
                        color="error"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>

      <CreateRuleModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateRule}
        affiliate={affiliate}
      />

      <CreateRuleModal
        open={editModalOpen}
        onClose={closeEditModal}
        onSubmit={handleEditRule}
        affiliate={affiliate}
        editRule={ruleToEdit}
      />

      <Dialog
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6">Delete Routing Rule</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this routing rule?
          </Typography>
          {ruleToDelete && (
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'background.neutral' }}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Chip
                    label={ruleToDelete.rule_type === "area" ? "Area" : "Country"}
                    color="primary"
                    size="small"
                  />
                  <Typography variant="subtitle1" fontWeight="medium">
                    {ruleToDelete.rule_value}
                  </Typography>
                </Stack>
                {ruleToDelete.description && (
                  <Typography variant="body2" color="text.secondary">
                    {ruleToDelete.description}
                  </Typography>
                )}
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Desk Distribution:
                  </Typography>
                  <Grid container spacing={1}>
                    {Object.entries(ruleToDelete.desk_percentages || {}).map(([deskId, percentage]) => (
                      <Grid item xs={12} sm={6} key={deskId}>
                        <Card variant="outlined" sx={{ p: 1, bgcolor: 'background.paper' }}>
                          <Stack spacing={0.5}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" fontWeight="medium" color="primary">
                                {getDeskName(deskId)}
                              </Typography>
                              <Chip
                                label={`${percentage}%`}
                                size="small"
                                color="primary"
                                variant="filled"
                              />
                            </Box>
                            {ruleToDelete.agent_percentages?.[deskId] && (
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                  Agents:
                                </Typography>
                                <Stack spacing={0.5}>
                                  {Object.entries(ruleToDelete.agent_percentages[deskId]).map(([agentId, agentPercentage]) => (
                                    <Box key={agentId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Typography variant="caption" color="text.primary">
                                        {getAgentName(deskId, agentId)}
                                      </Typography>
                                      <Chip
                                        label={`${agentPercentage}%`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: '0.7rem', height: 18 }}
                                      />
                                    </Box>
                                  ))}
                                </Stack>
                              </Box>
                            )}
                          </Stack>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Stack>
            </Card>
          )}
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeDeleteModal} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteRule(ruleToDelete?.id)}
            variant="contained"
            color="error"
            disabled={!ruleToDelete?.id}
          >
            Delete Rule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
