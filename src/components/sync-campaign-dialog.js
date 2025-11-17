import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Checkbox from "@mui/material/Checkbox";
import { toast } from "react-hot-toast";
import { settingsApi } from "src/api/settings";
import { getAssetPath } from "src/utils/asset-path";

export const SyncCampaignDialog = ({ open, onClose, filters, customFilters, columnSorting, selectedClients = [] }) => {
  const [selectedProfile, setSelectedProfile] = useState("");
  const [clientSelectionType, setClientSelectionType] = useState("selected");
  const [overwriteCampaign, setOverwriteCampaign] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);

  // Set default client selection type based on selected clients
  useEffect(() => {
    if (selectedClients && selectedClients.length > 0) {
      setClientSelectionType("selected");
    } else {
      setClientSelectionType("all");
    }
  }, [selectedClients]);

  // Get enabled voiso profiles when dialog opens
  useEffect(() => {
    if (open) {
      const fetchProfiles = async () => {
        try {
          const response = await settingsApi.getCallProfiles();
          const voisoProfiles = response?.provider_profiles?.filter(
            (profile) => profile.provider_type === "voiso" && profile.enabled
          ) || [];
          setProfiles(voisoProfiles);
        } catch (error) {
          console.error("Failed to fetch call profiles:", error);
          toast.error("Failed to fetch call profiles");
        }
      };
      fetchProfiles();
    }
  }, [open]);

  const handleSyncCampaign = async () => {
    if (!selectedProfile) {
      toast.error("Please select a call profile");
      return;
    }

    setIsLoading(true);
    try {
      // Prepare the request body with all filters
      const requestBody = {
        provider_profile_id: selectedProfile,
        overwite_campaign: overwriteCampaign,
        ...filters,
      };

      // Add client selection based on type
      if (clientSelectionType === "selected" && selectedClients && selectedClients.length > 0) {
        requestBody.client_ids = selectedClients;
      } else {
        requestBody.select_all = true;
      }

      // Remove unnecessary fields from filters
      delete requestBody.non_ids;
      delete requestBody.ids;
      delete requestBody.perPage;
      delete requestBody.currentPage;
      delete requestBody.first_assigned_agent_name;
      delete requestBody.second_assigned_agent_name;
      delete requestBody.third_assigned_agent_name;
      delete requestBody.first_caller_name;
      delete requestBody.second_caller_name;
      delete requestBody.third_caller_name;
      delete requestBody.frd_owner_name;

      // Add agent IDs if they exist
      if (filters?.first_assigned_agent_name?.length > 0) {
        requestBody.first_assigned_agent_id = filters.first_assigned_agent_name;
      }
      if (filters?.second_assigned_agent_name?.length > 0) {
        requestBody.second_assigned_agent_id = filters.second_assigned_agent_name;
      }
      if (filters?.third_assigned_agent_name?.length > 0) {
        requestBody.third_assigned_agent_id = filters.third_assigned_agent_name;
      }
      if (filters?.first_caller_name?.length > 0) {
        requestBody.first_call_by = filters.first_caller_name;
      }
      if (filters?.second_caller_name?.length > 0) {
        requestBody.second_call_by = filters.second_caller_name;
      }
      if (filters?.third_caller_name?.length > 0) {
        requestBody.third_call_by = filters.third_caller_name;
      }
      if (filters?.frd_owner_name?.length > 0) {
        requestBody.frd_owner_id = filters.frd_owner_name;
      }

      // Handle online filter
      if (filters?.online?.length === 1 && filters?.online[0] === "true") {
        requestBody.online = "true";
      }
      if (filters?.online?.length === 1 && filters?.online[0] === "false") {
        requestBody.online = "false";
      }

      // Add sorting if exists
      if (columnSorting) {
        requestBody.sorting = columnSorting;
      }

      // Add custom filters if they exist
      const customFiltersData = customFilters
        ?.filter(
          (filter) =>
            filter?.filter &&
            (
              (filter?.filter?.field_type === "text" && filter?.filter?.query) ||
              (filter?.filter?.field_type === "multi_choice_radio" && (filter?.filter?.non_query?.length > 0 || filter?.filter?.query?.length > 0)) ||
              (filter?.filter?.field_type === "multi_choice" && (filter?.filter?.non_query?.length > 0 || filter?.filter?.query?.length > 0)) ||
              (filter?.filter?.field_type === "boolean" && filter?.filter?.query) ||
              (filter?.filter?.field_type === "number" && (filter?.filter?.query?.gt || filter?.filter?.query?.lt))
            )
        )
        ?.map((filter) => filter?.filter);
      
      if (customFiltersData?.length > 0) {
        requestBody.custom_field = customFiltersData;
      }

      await settingsApi.syncCampaign(requestBody);
      toast.success("Campaign sync initiated successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to sync campaign:", error);
      toast.error(error?.response?.data?.message || "Failed to sync campaign");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedProfile("");
    setClientSelectionType(selectedClients && selectedClients.length > 0 ? "selected" : "all");
    setOverwriteCampaign(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Sync Campaign</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Select a Voiso call profile to sync with the current customer list filters.
          </Typography>
          
          <FormControl fullWidth>
            <InputLabel>Call Profile</InputLabel>
            <Select
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
              label="Call Profile"
            >
              {profiles.map((profile) => (
                <MenuItem key={profile.id} value={profile.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img
                      src={getAssetPath('/assets/call-system/call-voiso.png')}
                      alt="Voiso"
                      style={{ width: 20, height: 20 }}
                    />
                    {profile.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl component="fieldset">
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Client Selection
            </Typography>
            <RadioGroup
              value={clientSelectionType}
              onChange={(e) => setClientSelectionType(e.target.value)}
            >
              <FormControlLabel
                value="selected"
                control={<Radio />}
                label={`Selected clients (${selectedClients?.length || 0})`}
                disabled={!selectedClients || selectedClients.length === 0}
              />
              <FormControlLabel
                value="all"
                control={<Radio />}
                label="All clients from list"
              />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset">
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Campaign Options
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={overwriteCampaign}
                  onChange={(e) => setOverwriteCampaign(e.target.checked)}
                />
              }
              label="Overwrite campaign"
            />
          </FormControl>

          {profiles.length === 0 && (
            <Typography variant="body2" color="error">
              No enabled Voiso call profiles found.
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSyncCampaign}
          variant="contained"
          disabled={!selectedProfile || isLoading || profiles.length === 0}
          startIcon={isLoading ? <CircularProgress size={16} /> : null}
        >
          Sync Campaign with Current List
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 