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
import Rating from '@mui/material/Rating';
import { useSettings } from "src/hooks/use-settings";
import { PaymentProviderCreateDialog } from './create-provider-dialog';
import toast from "react-hot-toast";
import { getAssetPath } from "src/utils/asset-path";

const NAME_TO_LOGO_LIGHT = {
  payretailers:  getAssetPath("/assets/icons/payment/payretailers.png"),
  pay_pros: getAssetPath("/assets/icons/payment/pay-pros.png"),
  awesomepayments: getAssetPath("/assets/icons/payment/awp.png"),
  fintech_pay: getAssetPath("/assets/icons/payment/fintech-pay.webp"),
  gateway_pay: getAssetPath("/assets/icons/payment/gateway-pay.jpeg"),
  paycashio: getAssetPath("/assets/icons/payment/paycashio-pay.png"),
  sky_chain: getAssetPath("/assets/icons/payment/skychain-pay.jpeg"),
  simple_psp: getAssetPath("/assets/icons/payment/visa-mastercard.png"),
  atlas24: getAssetPath("/assets/icons/payment/visa-mastercard.png"),
  interio: getAssetPath("/assets/icons/payment/visa-mastercard.png"),
};

const NAME_TO_LOGO_DARK = {
  payretailers: getAssetPath("/assets/icons/payment/payretailers.png"),
  pay_pros: getAssetPath("/assets/icons/payment/pay-pros.png"),
  awesomepayments: getAssetPath("/assets/icons/payment/awp.png"),
  fintech_pay: getAssetPath("/assets/icons/payment/fintech-pay.webp"),
  gateway_pay: getAssetPath("/assets/icons/payment/gateway-pay.jpeg"),
  paycashio: getAssetPath("/assets/icons/payment/paycashio-pay.png"),
  sky_chain: getAssetPath("/assets/icons/payment/skychain-pay.jpeg"),
  simple_psp: getAssetPath("/assets/icons/payment/visa-mastercard.png"),
  atlas24: getAssetPath("/assets/icons/payment/visa-mastercard.png"),
  interio: getAssetPath("/assets/icons/payment/visa-mastercard.png"),
};


const PROVIDER_FEATURES = {
  payretailers: [
    "Multiple payment methods support",
    "Global currency support",
    "Advanced fraud protection",
    "Real-time transaction monitoring",
    "Comprehensive reporting dashboard",
    "24/7 customer support"
  ],
  pay_pros: [
    "High-risk merchant processing",
    "Advanced fraud detection",
    "Detailed analytics and reporting",
    "Competitive processing rates",
    "Dedicated account manager",
    "PCI DSS compliance"
  ],
  awesomepayments: [
    "Fast payment processing",
    "Real-time transaction monitoring",
    "Multiple payment methods",
    "Easy API integration",
    "Competitive rates",
    "Excellent customer support"
  ],
  fintech_pay: [
    "Cutting-edge technology",
    "Advanced security features",
    "Multi-currency support",
    "Innovative payment solutions",
    "Comprehensive analytics",
    "Fraud prevention tools"
  ],
  gateway_pay: [
    "Multi-currency support",
    "Global payment processing",
    "Flexible integration options",
    "Detailed reporting",
    "Reliable transaction processing",
    "Regional compliance support"
  ],
  paycashio: [
    "Cryptocurrency support",
    "Traditional payment methods",
    "Unified payment platform",
    "Digital wallet integration",
    "Cross-border payments",
    "Real-time conversion"
  ],
  sky_chain: [
    "Blockchain technology",
    "Instant settlements",
    "Low transaction fees",
    "Decentralized processing",
    "Smart contract support",
    "Transparent transactions"
  ],
  simple_psp: [
    "Easy integration",
    "Transparent pricing",
    "Simple setup process",
    "Reliable processing",
    "Basic reporting",
    "User-friendly interface"
  ],
  atlas24: [
    "24/7 processing",
    "Round-the-clock support",
    "Global coverage",
    "Dedicated monitoring",
    "Comprehensive solutions",
    "Reliable uptime"
  ],
  interio: [
    "Customizable features",
    "Detailed reporting",
    "Enterprise solutions",
    "Tailored configurations",
    "Advanced analytics",
    "Dedicated support"
  ]
};

export const PaymentProviderInfoDialog = ({ open, onClose, provider, internalBrandId }) => {
  const settings = useSettings();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  if (!provider) return null;

  const logoMap = settings?.paletteMode === 'light' ? NAME_TO_LOGO_LIGHT : NAME_TO_LOGO_DARK;
  const logoPath = logoMap[provider.provider_type];

  const handleCreateProvider = async (data) => {
    try {
      const { integrationApi } = await import("src/api/integration");
      await integrationApi.createPaymentProvider(data);
      setIsCreateDialogOpen(false);
      onClose();
      toast.success('Payment provider created successfully');
    } catch (error) {
      console.error('Failed to create payment provider:', error);
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
                alt={provider.display_name}
                sx={{
                  width: 40,
                  height: 40,
                  objectFit: 'contain'
                }}
              />
            )}
            <Box>
              <Typography variant="h6">{provider.display_name}</Typography>
              <Rating 
                name="provider-rating"
                value={provider.rating || 0}
                precision={0.5}
                size="small"
                readOnly 
                sx={{ 
                  '& .MuiRating-iconFilled': {
                    color: 'primary.main'
                  }
                }}
              />
            </Box>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={2}>
            {provider.description && (
              <Typography variant="body1" color="text.secondary">
                {provider.description}
              </Typography>
            )}
            
            {PROVIDER_FEATURES[provider.provider_type] && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Features:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {PROVIDER_FEATURES[provider.provider_type].map((feature, index) => (
                    <Typography key={index} component="li" variant="body2">
                      {feature}
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
            Create Provider
          </Button>
        </DialogActions>
      </Dialog>
      
      <PaymentProviderCreateDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateProvider}
        preselectedProvider={provider}
        internalBrandId={internalBrandId}
      />
    </>
  );
};

PaymentProviderInfoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  provider: PropTypes.object,
  providers: PropTypes.array,
  internalBrandId: PropTypes.string,
};
