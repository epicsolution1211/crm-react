import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import { Iconify } from "src/components/iconify";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { settingsApi } from "src/api/settings";
import { LoadingButton } from "@mui/lab";

const SECTION_PADDING = { xs: 2, sm: 3 };
const CARD_HEADER_PADDING = { px: SECTION_PADDING, pt: SECTION_PADDING, pb: 2 };
const CARD_CONTENT_PADDING = { px: SECTION_PADDING, pb: SECTION_PADDING };

export const TransactionTypeSettings = ({ company, refreshUser }) => {
  const [transactionTypeText, setTransactionTypeText] = useState(false);
  const [transactionOptions, setTransactionOptions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize transaction type settings
    if (company?.trx_settings) {
      try {
        const trxSettings = JSON.parse(company.trx_settings);
        setTransactionTypeText(trxSettings.transaction_type_text || false);
        setTransactionOptions(trxSettings.options || []);
      } catch (error) {
        console.error("Error parsing trx_settings:", error);
        setTransactionTypeText(false);
        setTransactionOptions([]);
      }
    } else {
      setTransactionTypeText(false);
      setTransactionOptions([]);
    }
  }, [company]);

  const handleUpdateTransactionTypeText = async (event) => {
    try {
      const newValue = event.target.value;
      const newTransactionTypeTextState = newValue === 'options';
      setIsLoading(true);
      setTransactionTypeText(newTransactionTypeTextState);
      
      const trxSettings = {
        transaction_type_text: newTransactionTypeTextState,
        options: transactionOptions
      };
      
      await settingsApi.updateCompany({
        id: company?.id,
        data: { trx_settings: JSON.stringify(trxSettings) },
      });
      setTimeout(() => {
        refreshUser(true);
      }, 1000);
      toast.success("Transaction type settings successfully updated!");
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
    setIsLoading(false);
  };

  const handleAddTransactionOption = () => {
    const newOptions = [...transactionOptions, ""];
    setTransactionOptions(newOptions);
  };

  const handleUpdateTransactionOption = (index, value) => {
    const newOptions = [...transactionOptions];
    newOptions[index] = value;
    setTransactionOptions(newOptions);
  };

  const handleDeleteTransactionOption = (index) => {
    const newOptions = transactionOptions.filter((_, i) => i !== index);
    setTransactionOptions(newOptions);
  };

  const handleSaveTransactionOptions = async () => {
    if (transactionOptions.some(option => !option.trim())) {
      toast.error("Transaction options cannot be empty. Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    try {
      const trxSettings = {
        transaction_type_text: transactionTypeText,
        options: transactionOptions
      };
      
      await settingsApi.updateCompany({
        id: company?.id,
        data: { trx_settings: JSON.stringify(trxSettings) },
      });
      setTimeout(() => {
        refreshUser(true);
      }, 1000);
      toast.success("Transaction options saved successfully!");
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <Box sx={CARD_HEADER_PADDING}>
        <Typography variant="h5" color="text.primary">
          Transaction Type Settings
        </Typography>
      </Box>
      <Divider />
      <CardContent sx={CARD_CONTENT_PADDING}>
        <Stack spacing={4}>
          <Box>
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography variant="h6" color="text.primary">
                Transaction Type Input Method
              </Typography>
              <FormControl sx={{ ml: 'auto', minWidth: 200 }}>
                <Select
                  value={transactionTypeText ? 'options' : 'text'}
                  onChange={handleUpdateTransactionTypeText}
                  size="small"
                >
                  <MenuItem value="text">Transaction Type Text</MenuItem>
                  <MenuItem value="options">Transaction Type Options</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ maxWidth: 600 }}
            >
              Choose between free text input or predefined options for transaction types
            </Typography>
          </Box>

          {transactionTypeText && (
            <Box>
              <Stack 
                direction="row" 
                spacing={2} 
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography variant="h6" color="text.primary">
                  Transaction Options
                </Typography>
                <Button
                  onClick={handleAddTransactionOption}
                  disabled={!transactionTypeText}
                  variant="outlined"
                  startIcon={<Iconify icon="si:add-line" width="24" height="24" />}
                  size="small"
                  sx={{ ml: 'auto' }}
                >
                  Add
                </Button>
              </Stack>
              
              <Stack spacing={2}>
                {transactionOptions.map((option, index) => (
                  <Stack 
                    key={index}
                    direction="row" 
                    spacing={2} 
                    alignItems="center"
                  >
                    <TextField
                      fullWidth
                      hiddenLabel
                      size="small"
                      placeholder="Enter transaction option"
                      value={option}
                      onChange={(event) => handleUpdateTransactionOption(index, event.target.value)}
                      disabled={!transactionTypeText}
                    />
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDeleteTransactionOption(index)}
                        disabled={!transactionTypeText}
                        color="error"
                        size="small"
                      >
                        <Iconify icon="tabler:trash" width={24} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ))}
                
                {transactionOptions.length === 0 && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontStyle: 'italic' }}
                  >
                    No transaction options configured. Add options when "Transaction Type Options" is enabled.
                  </Typography>
                )}
              </Stack>
              
              {transactionTypeText && (
                <Box sx={{ mt: 3 }}>
                  <LoadingButton
                    loading={isLoading}
                    onClick={handleSaveTransactionOptions}
                    variant="contained"
                    sx={{ minWidth: 120 }}
                  >
                    Save Options
                  </LoadingButton>
                </Box>
              )}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
