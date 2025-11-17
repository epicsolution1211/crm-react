import { useEffect, useState } from "react";
import Container from '@mui/material/Container';
import Grid from "@mui/material/Unstable_Grid2";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import CallSystemSkeleton from "src/components/skeleton-call-system";
import NoProvider from 'src/components/integration/empty';
import { CallProviderItem } from "src/sections/dashboard/integration/call-provider-item";
import { CreateProfileDialog } from './create-profile-dialog';
import { settingsApi } from "src/api/settings";

import { toast } from 'react-hot-toast';
import { useCallProviders } from 'src/hooks/call-system/useCallProviders';

const useProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleGetProfiles = async () => {
    setIsLoading(true);
    try {
      const response = await settingsApi.getCallProfiles();
      setProfiles(response?.provider_profiles || []);
    } catch (error) {
      console.error("Failed to fetch call profiles:", error);
      setProfiles([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetProfiles();
  }, []);

  return {
    profiles,
    isLoading,
    refetch: handleGetProfiles
  };
};

export const CallSettings = () => {
  const providers = useCallProviders();
  const { profiles, isLoading, refetch } = useProfiles();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateProfile = async (data) => {
    try {
      await settingsApi.createCallProfile(data);
      toast.success('Profile created successfully');
      setTimeout(() => {
        refetch();
      }, 1000);
    } catch (error) {
      console.error('Failed to create profile:', error);
      toast.error('Failed to create profile');
      throw error;
    }
  };

  return (
    <>
      <Stack
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}>
        <Container maxWidth="xl">
          <Stack
            spacing={3}
            sx={{ mb: 4 }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 2
              }}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: {
                    xs: '1.5rem',
                    md: '2rem'
                  },
                  fontWeight: 600
                }}
              >
                Call Profiles
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsCreateDialogOpen(true)}
              >
                Create
              </Button>
            </Stack>
          </Stack>
          <Grid
            container
            spacing={3}
            sx={{
              mt: 2,
              animation: 'fadeIn 0.5s ease-in-out',
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(10px)'
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)'
                }
              }
            }}>
            {isLoading
              ? [...new Array(4).keys()]?.map((item) => (
                  <CallSystemSkeleton key={item} />
                ))
              : profiles?.map((provider) => (
                  <CallProviderItem
                    pageInfo='call-system'
                    key={provider.name}
                    provider={provider}
                  />
                ))
            }
          </Grid>
        </Container>
        {(!isLoading && !profiles?.length) && <NoProvider />}
      </Stack>

      <CreateProfileDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateProfile}
        providers={providers || []}
      />
    </>
  );
};
