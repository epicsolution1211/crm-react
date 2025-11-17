import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import MuiDatePicker from "src/components/customize/date-picker";

import { betsApi } from "src/api/bets";
import { customersApi } from "src/api/customers";
import { Iconify } from "src/components/iconify";

export const UpdateBetDialog = ({ open, onClose, onSuccess, bet }) => {
  const [clients, setClients] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    defaultValues: {
      client_id: "",
      external_bet_id: "",
      external_brand: "",
      external_user_id: "",
      source_system: "",
      bet_type: "",
      bet_category: "",
      bet_sub_type: "",
      bet_amount: "",
      win_amount: "",
      status: "",
      settlement_status: "",
      bet_date: "",
      settlement_date: "",
      total_odds: "",
      platform: "",
      timing: "",
      provider: "",
      game_name: "",
      game_type: "",
      vendor: "",
      description: ""
    }
  });

  useEffect(() => {
    if (bet && open) {
      setValue("client_id", bet.client_id || "");
      setValue("external_bet_id", bet.external_bet_id || "");
      setValue("external_brand", bet.external_brand || "");
      setValue("external_user_id", bet.external_user_id || "");
      setValue("source_system", bet.source_system || "");
      setValue("bet_type", bet.bet_type || "");
      setValue("bet_category", bet.bet_category || "");
      setValue("bet_sub_type", bet.bet_sub_type || "");
      setValue("bet_amount", bet.bet_amount || "");
      setValue("win_amount", bet.win_amount || "");
      setValue("status", bet.status || "");
      setValue("settlement_status", bet.settlement_status || "");
      setValue("bet_date", bet.bet_date || "");
      setValue("settlement_date", bet.settlement_date || "");
      setValue("total_odds", bet.total_odds || "");
      setValue("platform", bet.platform || "");
      setValue("timing", bet.timing || "");
      setValue("provider", bet.game_data?.provider || "");
      setValue("game_name", bet.game_data?.game_name || "");
      setValue("game_type", bet.game_data?.game_type || "");
      setValue("vendor", bet.game_data?.vendor || "");
      setValue("description", bet.description || "");
    }
  }, [bet, open, setValue]);

  const searchClients = useCallback(async (query) => {
    if (!query || query.length < 2) {
      return;
    }

    setIsLoadingClients(true);
    try {
      const response = await customersApi.getCustomers({ 
        q: query, 
        per_page: 20 
      });
      
      const formattedClients = response?.clients?.map(client => ({
        id: client.id,
        label: client.full_name || `${client.first_name || ''} ${client.last_name || ''}`.trim() || `Client ${client.id}`,
        value: client.id
      })) || [];
      
      setClients(formattedClients);
    } catch (error) {
      console.error("Error searching clients:", error);
      setClients([]);
    } finally {
      setIsLoadingClients(false);
    }
  }, []);

  const loadInitialClients = useCallback(async () => {
    setIsLoadingClients(true);
    try {
      const response = await customersApi.getCustomers({ 
        per_page: 20 
      });
      
      const formattedClients = response?.clients?.map(client => ({
        id: client.id,
        label: client.full_name || `${client.first_name || ''} ${client.last_name || ''}`.trim() || `Client ${client.id}`,
        value: client.id
      })) || [];
      
      setClients(formattedClients);
    } catch (error) {
      console.error("Error loading initial clients:", error);
      setClients([]);
    } finally {
      setIsLoadingClients(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (clientSearchQuery) {
        searchClients(clientSearchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [clientSearchQuery, searchClients]);

  useEffect(() => {
    if (open) {
      loadInitialClients();
    }
  }, [open, loadInitialClients]);

  const handleUpdateBet = async (data) => {
    try {
      setIsSubmitting(true);
      const betData = {
        ...data,
        bet_amount: parseFloat(data.bet_amount),
        win_amount: parseFloat(data.win_amount),
        total_odds: parseFloat(data.total_odds),
        game_data: {
          provider: data.provider,
          game_name: data.game_name,
          game_type: data.game_type,
          vendor: data.vendor
        }
      };

      await betsApi.updateBet(bet.id, betData);
      toast.success("Bet updated successfully");
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error updating bet:", error);
      toast.error("Failed to update bet");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setClientSearchQuery("");
    setClients([]);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Update Bet</DialogTitle>
      <form onSubmit={handleSubmit(handleUpdateBet)}>
        <DialogContent>
          <Stack spacing={3}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
              <Controller
                name="client_id"
                control={control}
                rules={{ required: "Client is required" }}
                render={({ field }) => (
                  <Autocomplete
                    options={clients}
                    loading={isLoadingClients}
                    autoHighlight
                    popupIcon={null}
                    value={clients.find(client => client.value === field.value) || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.value : "");
                      setClientSearchQuery("");
                      setClients([]);
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === 'input') {
                        setClientSearchQuery(newInputValue);
                      }
                    }}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    noOptionsText={clientSearchQuery ? "No clients found" : "No clients available"}
                    clearOnBlur={false}
                    selectOnFocus
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Client"
                        placeholder="Search for a client..."
                        error={!!errors.client_id}
                        helperText={errors.client_id?.message}
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
                            </InputAdornment>
                          ),
                          endAdornment: isLoadingClients ? (
                            <InputAdornment position="end" sx={{ mr: -2 }}>
                              <Iconify
                                icon="svg-spinners:8-dots-rotate"
                                width={22}
                                sx={{ color: 'white' }}
                              />
                            </InputAdornment>
                          ) : null
                        }}
                      />
                    )}
                  />
                )}
              />
              <Controller
                name="external_bet_id"
                control={control}
                rules={{ required: "External Bet ID is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="External Bet ID"
                    error={!!errors.external_bet_id}
                    helperText={errors.external_bet_id?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="external_brand"
                control={control}
                rules={{ required: "External Brand is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="External Brand"
                    error={!!errors.external_brand}
                    helperText={errors.external_brand?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="external_user_id"
                control={control}
                rules={{ required: "External User ID is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="External User ID"
                    error={!!errors.external_user_id}
                    helperText={errors.external_user_id?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="source_system"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Source System</InputLabel>
                    <Select {...field} label="Source System">
                      <MenuItem value="internal">Internal</MenuItem>
                      <MenuItem value="casino_aggregator">Casino Aggregator</MenuItem>
                      <MenuItem value="sports_aggregator">Sports Aggregator</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="bet_type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Bet Type</InputLabel>
                    <Select {...field} label="Bet Type">
                      <MenuItem value="sports">Sports</MenuItem>
                      <MenuItem value="casino">Casino</MenuItem>
                      <MenuItem value="virtual">Virtual</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="bet_category"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Bet Category</InputLabel>
                    <Select {...field} label="Bet Category">
                      <MenuItem value="slots">Slots</MenuItem>
                      <MenuItem value="table_games">Table Games</MenuItem>
                      <MenuItem value="live_casino">Live Casino</MenuItem>
                      <MenuItem value="sports_betting">Sports Betting</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="bet_sub_type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Bet Sub Type</InputLabel>
                    <Select {...field} label="Bet Sub Type">
                      <MenuItem value="single">Single</MenuItem>
                      <MenuItem value="multiple">Multiple</MenuItem>
                      <MenuItem value="parlay">Parlay</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="bet_amount"
                control={control}
                rules={{ required: "Bet Amount is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bet Amount"
                    type="number"
                    inputProps={{ step: "0.01", min: "0" }}
                    error={!!errors.bet_amount}
                    helperText={errors.bet_amount?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="win_amount"
                control={control}
                rules={{ required: "Win Amount is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Win Amount"
                    type="number"
                    inputProps={{ step: "0.01", min: "0" }}
                    error={!!errors.win_amount}
                    helperText={errors.win_amount?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      <MenuItem value="open">Open</MenuItem>
                      <MenuItem value="settled_win">Settled Win</MenuItem>
                      <MenuItem value="settled_lose">Settled Lose</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                      <MenuItem value="void">Void</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="settlement_status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Settlement Status</InputLabel>
                    <Select {...field} label="Settlement Status">
                      <MenuItem value="Win">Win</MenuItem>
                      <MenuItem value="Loss">Loss</MenuItem>
                      <MenuItem value="Push">Push</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <MuiDatePicker
                control={control}
                setValue={setValue}
                name="bet_date"
                label="Bet Date"
                defaultNull
              />
              <MuiDatePicker
                control={control}
                setValue={setValue}
                name="settlement_date"
                label="Settlement Date"
                defaultNull
              />
              <Controller
                name="total_odds"
                control={control}
                rules={{ required: "Total Odds is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Total Odds"
                    type="number"
                    inputProps={{ step: "0.01", min: "0" }}
                    error={!!errors.total_odds}
                    helperText={errors.total_odds?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="platform"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Platform</InputLabel>
                    <Select {...field} label="Platform">
                      <MenuItem value="WEB">Web</MenuItem>
                      <MenuItem value="MOBILE">Mobile</MenuItem>
                      <MenuItem value="APP">App</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="timing"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Timing</InputLabel>
                    <Select {...field} label="Timing">
                      <MenuItem value="INSTANT">Instant</MenuItem>
                      <MenuItem value="DELAYED">Delayed</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
            
            <Typography variant="h6" sx={{ mt: 2 }}>Game Data</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
              <Controller
                name="provider"
                control={control}
                rules={{ required: "Provider is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Provider"
                    error={!!errors.provider}
                    helperText={errors.provider?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="game_name"
                control={control}
                rules={{ required: "Game Name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Game Name"
                    error={!!errors.game_name}
                    helperText={errors.game_name?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="game_type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Game Type</InputLabel>
                    <Select {...field} label="Game Type">
                      <MenuItem value="Slots">Slots</MenuItem>
                      <MenuItem value="Table Games">Table Games</MenuItem>
                      <MenuItem value="Live Casino">Live Casino</MenuItem>
                      <MenuItem value="Sports">Sports</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="vendor"
                control={control}
                rules={{ required: "Vendor is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Vendor"
                    error={!!errors.vendor}
                    helperText={errors.vendor?.message}
                    fullWidth
                  />
                )}
              />
            </Box>
            
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  multiline
                  rows={3}
                  fullWidth
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            variant="contained"
          >
            Update Bet
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
