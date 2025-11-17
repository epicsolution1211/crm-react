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
import { useSettings } from "src/hooks/use-settings";
import { CreateProfileDialog } from "src/sections/dashboard/settings/call-system/create-profile-dialog";
import toast from "react-hot-toast";
import { getAssetPath } from "src/utils/asset-path";

const NAME_TO_LOGO_LIGHT = {
  "cyprus bpx": getAssetPath("/assets/call-system/call-pbx.png"),
  coperato: getAssetPath("/assets/call-system/call-coperato.png"),
  nuvei: getAssetPath("/assets/call-system/call-nuvei.png"),
  perfectMoney: getAssetPath("/assets/call-system/call-perfect-money.png"),
  twilio: getAssetPath("/assets/call-system/call-twilio.png"),
  voiso: getAssetPath("/assets/call-system/call-voiso.png"),
  squaretalk: getAssetPath("/assets/call-system/call-squaretalk.png"),
  commpeak: getAssetPath("/assets/call-system/call-commpeak.png"),
  mmdsmart: getAssetPath("/assets/call-system/call-mmdsmart.svg"),
  "prime voip": getAssetPath("/assets/call-system/call-prime-light.png"),
  voicespin: getAssetPath("/assets/call-system/call-voicespin.svg"),
  didglobal: getAssetPath("/assets/call-system/call-didglobal.jpg"),
};

const NAME_TO_LOGO_DARK = {
  "cyprus bpx": getAssetPath("/assets/call-system/call-pbx.png"),
  coperato: getAssetPath("/assets/call-system/call-coperato.png"),
  nuvei: getAssetPath("/assets/call-system/call-nuvei.png"),
  perfectMoney: getAssetPath("/assets/call-system/call-perfect-money.png"),
  twilio: getAssetPath("/assets/call-system/call-twilio.png"),
  voiso: getAssetPath("/assets/call-system/call-voiso.png"),
  squaretalk: getAssetPath("/assets/call-system/call-squaretalk.png"),
  commpeak: getAssetPath("/assets/call-system/call-commpeak.png"),
  mmdsmart: getAssetPath("/assets/call-system/call-mmdsmart-dark.webp"),
  "prime voip": getAssetPath("/assets/call-system/call-prime.png"),
  voicespin: getAssetPath("/assets/call-system/call-voicespin-light.jpg"),
  didglobal: getAssetPath("/assets/call-system/call-didglobal.jpg"),
};

const PROVIDER_DETAILS = {
  coperato: "Coperato is a VoIP provider that supports direct calling, click-to-call functionality, and real-time communication between agents and clients.",
  commpeak: "Commpeak is a VoIP communication provider that facilitates call operations, allowing teams to initiate and manage calls through an integrated interface.",
  "cyprus bpx": "Cyprus P.B.X offers VoIP services for managing and routing client calls across different departments and regions.",
  didglobal: "DID Global provides VoIP solutions using virtual phone numbers (DIDs), enabling international communication and efficient call management.",
  mmdsmart: "MMD Smart delivers global voice and messaging services, supporting both inbound and outbound call traffic through its VoIP infrastructure.",
  "prime voip": "Primecall is a telecommunications provider tailored for high-volume call centers and global outreach, enabling seamless and stable voice connectivity.",
  squaretalk: "Squaretalk is a cloud-based communication platform that offers VoIP capabilities with features such as smart routing, automation, and analytics.",
  twilio: "Twilio is a cloud communications platform that supports voice, messaging, and other channels for business communication needs.",
  voicespin: "VoiceSpin offers VoIP and communication services for sales and support operations, helping teams manage and monitor calls effectively.",
  voiso: "Voiso is a cloud VoIP solution with global calling support and smart routing features designed to streamline communication processes.",
};

export const ProviderInfoDialog = ({ open, onClose, provider, providers = [] }) => {
  const settings = useSettings();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  if (!provider) return null;

  const logoMap = settings?.paletteMode === 'light' ? NAME_TO_LOGO_LIGHT : NAME_TO_LOGO_DARK;
  const logoPath = logoMap[provider.name?.toLowerCase()];

  const handleCreateProfile = async (data) => {
    try {
      const { settingsApi } = await import("src/api/settings");
      await settingsApi.createCallProfile(data);
      setIsCreateDialogOpen(false);
      onClose();
      toast.success('Profile created successfully');
    } catch (error) {
      console.error('Failed to create profile:', error);
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
            <Typography variant="h6">{provider.name}</Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={2}>
            {PROVIDER_DETAILS[provider.name?.toLowerCase()] && (
              <Typography variant="body1" color="text.secondary">
                {PROVIDER_DETAILS[provider.name?.toLowerCase()]}
              </Typography>
            )}
            
            {provider.features && provider.features.length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Features:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {provider.features.map((feature, index) => (
                    <Typography key={index} component="li" variant="body2">
                      {feature}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
            
            {provider.requirements && provider.requirements.length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Requirements:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {provider.requirements.map((requirement, index) => (
                    <Typography key={index} component="li" variant="body2">
                      {requirement}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>
            Close
          </Button>
          <Button variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
            Create Profile
          </Button>
        </DialogActions>
      </Dialog>
      
      <CreateProfileDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateProfile}
        providers={providers}
        preselectedProvider={provider}
      />
    </>
  );
};

ProviderInfoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  provider: PropTypes.object,
  providers: PropTypes.array,
};
