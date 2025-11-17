import { useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { GameStudioProviderCreateDialog } from './create-provider-dialog';
import toast from "react-hot-toast";
import { getAssetPath } from "src/utils/asset-path";

const getProviderLogo = (provider) => {
  
  const logoMap = {
    booming_games: getAssetPath("/assets/icons/gaming/booming_games.jpg"),
    evolution: getAssetPath("/assets/icons/gaming/evolution.png"),
    netent: getAssetPath("/assets/icons/gaming/netent.png"),
    pragmatic_play: getAssetPath("/assets/icons/gaming/pragmatic_play.png"),
  };
  
  return logoMap[provider.type] || null;
};

export const GameStudioProviderInfoDialog = ({ open, onClose, provider, internalBrandId }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  if (!provider) return null;

  const logoPath = getProviderLogo(provider);

  const handleCreateProvider = async (data) => {
    try {
      const { integrationApi } = await import("src/api/integration");
      await integrationApi.createGameStudioProvider(data);
      setIsCreateDialogOpen(false);
      onClose();
      toast.success('Game studio provider created successfully');
    } catch (error) {
      console.error('Failed to create game studio provider:', error);
      toast.error('Failed to create game studio provider');
      throw error;
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            {logoPath && (
              <Box
                component="img"
                src={logoPath}
                alt={provider.name}
                sx={{
                  width: 40,
                  height: 40,
                  objectFit: 'contain'
                }}
              />
            )}
            <Box>
              <Typography variant="h6">{provider.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {provider.description}
              </Typography>
              {provider.website && (
                <Typography variant="caption" color="primary" sx={{ textDecoration: 'underline' }}>
                  {provider.website}
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Game Types:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {provider.game_types?.map((gameType, index) => (
                  <Typography key={index} variant="caption" sx={{ 
                    bgcolor: 'primary.100', 
                    color: 'primary.main',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    textTransform: 'capitalize'
                  }}>
                    {gameType.replace('_', ' ')}
                  </Typography>
                ))}
              </Box>
            </Box>

            {provider.supported_features && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Supported Features:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {provider.supported_features.map((feature, index) => (
                    <Typography key={index} variant="caption" sx={{ 
                      bgcolor: 'success.100', 
                      color: 'success.main',
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      textTransform: 'capitalize'
                    }}>
                      {feature.replace('_', ' ')}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            {provider.supported_currencies && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Supported Currencies:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {provider.supported_currencies.join(', ')}
                </Typography>
              </Box>
            )}

            {provider.supported_languages && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Supported Languages:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {provider.supported_languages.filter(lang => lang).join(', ')}
                </Typography>
              </Box>
            )}

            {provider.technical_specs && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Technical Specifications:
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Max Concurrent Sessions:</strong> {provider.technical_specs.max_concurrent_sessions?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Session Timeout:</strong> {provider.technical_specs.session_timeout_minutes} minutes
                  </Typography>
                  <Typography variant="body2">
                    <strong>HTTPS Support:</strong> {provider.technical_specs.supports_https ? 'Yes' : 'No'}
                  </Typography>
                  {provider.technical_specs.ip_whitelist_required && (
                    <Typography variant="body2" color="warning.main">
                      <strong>IP Whitelist Required:</strong> Yes
                    </Typography>
                  )}
                </Stack>
              </Box>
            )}

            {provider.required_credentials && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Required Credentials:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {provider.required_credentials.map((credential, index) => (
                    <Typography key={index} component="li" variant="body2">
                      {credential.replace('_', ' ').toUpperCase()}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Existing Instances:</strong> {provider.existing_count || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Can Add More:</strong> {provider.can_add_more ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Has Engine:</strong> {provider.has_engine ? 'Yes' : 'No'}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>
            Close
          </Button>
          <Button variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
            Create Provider
          </Button>
        </DialogActions>
      </Dialog>
      
      <GameStudioProviderCreateDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateProvider}
        preselectedProvider={provider}
        internalBrandId={internalBrandId}
      />
    </>
  );
};

GameStudioProviderInfoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  provider: PropTypes.object,
  internalBrandId: PropTypes.string,
};
