import { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Helmet } from 'react-helmet-async';
import { CallSystemProviderDetail } from 'src/sections/dashboard/integration/call-system/call-system-provider-detail';
import { CreateProfileDialog } from 'src/sections/dashboard/settings/call-system/create-profile-dialog';
import toast from 'react-hot-toast';
import { useInternalBrands } from 'src/hooks/custom/use-brand';
import { callProvidersApi } from 'src/api/call-providers';

const Page = () => {
  const { providerType } = useParams();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const { internalBrandsList, isLoading: isBrandsLoading } = useInternalBrands();
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        const response = await callProvidersApi.getCallProviders();
        
        if (response?.data?.providers) {
          const transformedProviders = response.data.providers.map(item => ({
            ...item.provider
          }));
          setProviders(transformedProviders);
        }
      } catch (error) {
        console.error('Error fetching call providers:', error);
        setProviders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const provider = providers?.find(p => p.name?.toLowerCase() === providerType?.toLowerCase());

  useEffect(() => {
    if (!isBrandsLoading && internalBrandsList.length > 0 && !selectedBrandId) {
      setSelectedBrandId(internalBrandsList[0].value);
    }
  }, [isBrandsLoading, internalBrandsList, selectedBrandId]);

  const handleStartIntegration = useCallback(() => {
    if (!selectedBrandId) {
      toast.error('Please select an internal brand first');
      return;
    }
    setIsCreateDialogOpen(true);
  }, [selectedBrandId]);

  const handleCreateProfile = async (data) => {
    try {
      await callProvidersApi.createManagedCallProvider(data);
      setIsCreateDialogOpen(false);
      toast.success('Call system profile created successfully');
      navigate('/dashboard/integration?tab=call_system');
    } catch (error) {
      console.error('Failed to create call system profile:', error);
      toast.error('Failed to create call system profile');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Helmet>
          <title>Loading... | Call Systems</title>
        </Helmet>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <h2>Loading provider...</h2>
        </Box>
      </Box>
    );
  }

  if (!provider) {
    return (
      <Box sx={{ p: 3 }}>
        <Helmet>
          <title>Provider Not Found | Call Systems</title>
        </Helmet>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <h2>Provider not found</h2>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title>{provider.name} | Call Systems</title>
      </Helmet>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CallSystemProviderDetail 
          provider={provider}
          onStartIntegration={handleStartIntegration}
          selectedBrandId={selectedBrandId}
          onBrandChange={setSelectedBrandId}
          internalBrandsList={internalBrandsList}
          isBrandsLoading={isBrandsLoading}
        />
      </Box>

      <CreateProfileDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateProfile}
        preselectedProvider={provider}
        providers={providers}
      />
    </>
  );
};

export default Page;

