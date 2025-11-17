import { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Helmet } from 'react-helmet-async';
import { GameStudioProviderDetail } from 'src/sections/dashboard/integration/game-studios/game-studio-provider-detail';
import { GameStudioProviderCreateDialog } from 'src/sections/dashboard/integration/game-studios/create-provider-dialog';
import toast from 'react-hot-toast';
import { useInternalBrands } from 'src/hooks/custom/use-brand';
import { gameProvidersApi } from 'src/api/game-providers';

const Page = () => {
  const { providerType } = useParams();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [provider, setProvider] = useState(null);
  const [isLoadingProvider, setIsLoadingProvider] = useState(true);
  const { internalBrandsList, isLoading: isBrandsLoading } = useInternalBrands();

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setIsLoadingProvider(true);
        const response = await gameProvidersApi.getGameProviders();
        const foundProvider = response.data.providers.find(p => p.provider.type === providerType);
        setProvider(foundProvider?.provider || null);
      } catch (error) {
        console.error('Failed to fetch game providers:', error);
        toast.error('Failed to load game provider');
      } finally {
        setIsLoadingProvider(false);
      }
    };

    fetchProvider();
  }, [providerType]);

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

  const handleCreateProvider = async (data) => {
    try {
      await gameProvidersApi.createManagedGameProvider(data);
      setIsCreateDialogOpen(false);
      toast.success('Game studio provider created successfully');
      navigate('/dashboard/integration?tab=game_studios');
    } catch (error) {
      console.error('Failed to create game studio provider:', error);
      toast.error('Failed to create game studio provider');
      throw error;
    }
  };

  if (isLoadingProvider || isBrandsLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Helmet>
          <title>Loading... | Game Studios</title>
        </Helmet>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <h2>Loading...</h2>
        </Box>
      </Box>
    );
  }

  if (!provider) {
    return (
      <Box sx={{ p: 3 }}>
        <Helmet>
          <title>Provider Not Found | Game Studios</title>
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
        <title>{provider.name} | Game Studios</title>
      </Helmet>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <GameStudioProviderDetail 
          provider={provider}
          onStartIntegration={handleStartIntegration}
          selectedBrandId={selectedBrandId}
          onBrandChange={setSelectedBrandId}
          internalBrandsList={internalBrandsList}
          isBrandsLoading={isBrandsLoading}
        />
      </Box>

      <GameStudioProviderCreateDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateProvider}
        preselectedProvider={provider}
        internalBrandId={selectedBrandId}
      />
    </>
  );
};

export default Page;

