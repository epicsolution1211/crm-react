import { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Helmet } from 'react-helmet-async';
import { PaymentSystemProviderDetail } from 'src/sections/dashboard/integration/payment-system/payment-system-provider-details';
import toast from 'react-hot-toast';
import { paymentProvidersApi } from 'src/api/payment-providers';
import { PaymentProviderCreateDialog } from 'src/sections/dashboard/integration/payment-system/create-provider-dialog';
import { useInternalBrands } from 'src/hooks/custom/use-brand';

const Page = () => {
  const { providerType } = useParams();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { internalBrandsList, isLoading: isBrandsLoading } = useInternalBrands();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        const response = await paymentProvidersApi.getPaymentProviders();
        const providers = response.data.providers || response;
        const foundProvider = providers.find(p => p?.provider?.type === providerType);
        setProvider(foundProvider?.provider || null);
      } catch (error) {
        console.error('Failed to fetch payment providers:', error);
        toast.error('Failed to load payment providers');
        setProvider(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
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
      await paymentProvidersApi.createManagedPaymentProvider(data);
      setIsCreateDialogOpen(false);
      toast.success('Payment provider created successfully');
      navigate('/dashboard/integration?tab=payment_system');
    } catch (error) {
      console.error('Failed to create payment provider:', error);
      toast.error('Failed to create payment provider');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Helmet>
          <title>Loading... | Payment System</title>
        </Helmet>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <h2>Loading provider details...</h2>
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
        <title>{provider.name} | Payment System</title>
      </Helmet>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Internal Brand</InputLabel>
            <Select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              label="Internal Brand"
              disabled={isBrandsLoading}
            >
              <MenuItem value="">
                <em>Select Brand</em>
              </MenuItem>
              {internalBrandsList.map((brand) => (
                <MenuItem key={brand.value} value={brand.value}>
                  {brand.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack> */}

        <PaymentSystemProviderDetail 
          provider={provider}
          onStartIntegration={handleStartIntegration}
        />
      </Box>

      <PaymentProviderCreateDialog
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

