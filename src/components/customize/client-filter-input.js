import { useState, useEffect, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Iconify } from 'src/components/iconify';

import { useDebounce } from "src/hooks/use-debounce";
import { customersApi } from "src/api/customers";
import { usePopover } from "src/hooks/use-popover";

export const ClientFilterInput = ({ updateFilters, updateClientList = () => {} }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientList, setClientList] = useState([]);
  const [clientSearch, setClientSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const clientQuery = useDebounce(clientSearch, 500);

  const popover = usePopover();

  const getClients = useCallback(async () => {
    if (!popover.open) return;
    
    setIsLoading(true);
    try {
      const { clients } = await customersApi.getCustomers({ 
        q: clientQuery?.length > 0 ? clientQuery : null,
        per_page: 10,
        net_deposit: 0.1
      });

      const formattedClients = clients?.map(client => ({
        label: client?.full_name ?? client?.id,
        value: client?.id,
      })) || [];

      setClientList(formattedClients);
      updateClientList(formattedClients);
    } catch (error) {
      console.error("Error fetching clients: ", error);
      setClientList([]);
      updateClientList([]);
    } finally {
      setIsLoading(false);
    }
  }, [clientQuery, popover.open]);

  useEffect(() => {
    getClients();
  }, [getClients]);


  const handleClientSelect = (client) => {
    setSelectedClient(client);
    updateFilters({ client_ids: [client.value] });
    setClientSearch('');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setClientSearch(value);
  };

  return (
    <>
      <Button
        color="inherit"
        endIcon={
          <Iconify
            icon={popover.open ? "eva:arrow-ios-upward-fill" : "eva:arrow-ios-downward-fill"}
            width={18}
          />
        }
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        sx={{ px: 0, py: 0, display: "flex", justifyContent: "start" }}
      >
        <Typography
          fontSize={14}
          fontWeight="600"
          whiteSpace="nowrap"
          sx={{ whiteSpace: "nowrap" }}
        >
          CLIENT
        </Typography>
      </Button>

      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{ style: { px: 10, width: 250 } }}
      >
        <Input
          inputRef={inputRef}
          fullWidth
          disableUnderline
          value={clientSearch}
          onChange={handleInputChange}
          placeholder="Type to search..."
          sx={{
            px: 2,
            py: 1,
            bgcolor: 'background.paper',
            borderRadius: '4px 4px 0 0',
            '& input': {
              color: 'text.primary',
              '&::placeholder': {
                color: 'text.secondary',
                opacity: 0.7
              }
            }
          }}
        />
        <Divider />
        <Box sx={{ maxHeight: 250, overflowY: 'auto' }}>
          {isLoading ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Loading...
              </Typography>
            </Box>
          ) : clientList?.length > 0 ? (
            clientList.map((client) => (
              <Box
                key={client.value}
                onClick={() => handleClientSelect(client)}
                sx={{
                  px: 2,
                  py: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  ...(selectedClient?.value === client.value && {
                    bgcolor: 'action.selected',
                  }),
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {client.label}
                </Typography>
              </Box>
            ))
          ) : (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {clientSearch ? 'No results found' : 'Type to search...'}
              </Typography>
            </Box>
          )}
        </Box>
      </Menu>
    </>
  );
};