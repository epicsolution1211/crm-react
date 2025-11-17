import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';

import { useDebounce } from 'src/hooks/use-debounce';
import { customersApi } from 'src/api/customers';
import { ibsApi } from 'src/api/ibs';

export const CustomerIBLevel1Dialog = ({ open, onClose, onGetClient, clientId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [ibCode, setIbCode] = useState('');
  const [ibNameSearch, setIbNameSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIB, setSelectedIB] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  
  const debouncedSearchTerm = useDebounce(ibNameSearch, 300);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearchTerm) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await customersApi.getCustomers({
          is_ib_approved: true,
          q: debouncedSearchTerm?.length > 0 ? debouncedSearchTerm : null
        });
        setSearchResults(response?.clients || []);
      } catch (error) {
        console.error('Error searching IBs:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedIB(null);
  };

  const handleClose = () => {
    setIbCode('');
    setIbNameSearch('');
    setActiveTab(0);
    setSelectedIB(null);
    setSearchResults([]);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const data = activeTab === 0 
        ? { ib_code: ibCode, id: clientId }
        : { ib_id: selectedIB?.id, id: clientId };

      await ibsApi.createIBRelationship(data);
      
      toast.success('IB relationship created successfully');
      setTimeout(() => {
        handleClose();
        onGetClient();
      }, 1000);
    } catch (error) {
      console.error('Error creating IB relationship:', error);
      toast.error(error?.response?.data?.errors?.[0] || 'Failed to create IB relationship');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRemoveIB = async () => {
    try {
      setIsRemoving(true);
      
      const data = { ib_id: 0, id: clientId };

      await ibsApi.createIBRelationship(data);
      
      toast.success('IB relationship removed successfully');
      setTimeout(() => {
        handleClose();
        onGetClient();
      }, 1000);
    } catch (error) {
      console.error('Error removing IB relationship:', error);
      toast.error(error?.response?.data?.errors?.[0] || 'Failed to remove IB relationship');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleSelectIB = (ib) => {
    setSelectedIB(ib);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Update Level 1 IB</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="IB Code" />
            <Tab label="Search by Name" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 ? (
            <TextField
              autoFocus
              fullWidth
              label="IB Code"
              value={ibCode}
              onChange={(e) => setIbCode(e.target.value)}
              placeholder="Enter IB code"
              disabled={isSubmitting}
            />
          ) : (
            <>
              <TextField
                fullWidth
                label="Search IB Name"
                value={ibNameSearch}
                onChange={(e) => setIbNameSearch(e.target.value)}
                placeholder="Search by IB name"
                disabled={isSubmitting}
              />
              {isSearching ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : searchResults.length > 0 ? (
                <List sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
                  {searchResults.map((ib) => (
                    <ListItem key={ib.id} disablePadding>
                      <ListItemButton 
                        onClick={() => handleSelectIB(ib)}
                        selected={selectedIB?.id === ib.id}
                        disabled={isSubmitting}
                      >
                        <ListItemText 
                          primary={ib?.full_name || 'N/A'} 
                          secondary={`ID: ${ib?.id || 'N/A'} • IB Code: ${ib?.ib_code || 'N/A'}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : debouncedSearchTerm && !isSearching && (
                <Box sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                  No results found
                </Box>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
        <Button 
          onClick={handleRemoveIB}
          variant="contained"
          color="error"
          disabled={isRemoving}
        >
          {isRemoving ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} color="inherit" />
              Removing...
            </Box>
          ) : (
            'Remove IB'
          )}
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={activeTab === 0 ? !ibCode : !selectedIB || isSubmitting}
        >
          {isSubmitting ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} color="inherit" />
              Updating...
            </Box>
          ) : (
            'Update IB'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CustomerIBLevel1Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}; 