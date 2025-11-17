import { Suspense, useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

import RefreshIcon from '@mui/icons-material/Refresh';

const LazyComponentWrapper = ({ 
  children, 
  fallback: FallbackComponent, 
  errorFallback: ErrorFallbackComponent,
  height = 300 
}) => {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setHasError(false);
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (hasError) {
    if (ErrorFallbackComponent) {
      return <ErrorFallbackComponent onRetry={handleRetry} />;
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: height,
          width: '100%',
          p: 2
        }}
      >
        <Alert 
          severity="error" 
          sx={{ mb: 2, width: '100%', maxWidth: 400 }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleRetry}
            >
              Retry
            </Button>
          }
        >
          Failed to load component. Please try again.
        </Alert>
      </Box>
    );
  }

  const DefaultFallback = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: height,
        width: '100%'
      }}
    >
      <CircularProgress />
    </Box>
  );

  return (
    <Suspense 
      fallback={FallbackComponent ? <FallbackComponent /> : <DefaultFallback />}
    >
      <ErrorBoundary onError={() => setHasError(true)}>
        {children}
      </ErrorBoundary>
    </Suspense>
  );
};

const ErrorBoundary = ({ children, onError }) => {
  useEffect(() => {
    const handleError = (error) => {
      if (error && error.message && error.message.includes('Loading chunk')) {
        onError();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, [onError]);

  return children;
};

export default LazyComponentWrapper;
