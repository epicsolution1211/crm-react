import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import RefreshIcon from '@mui/icons-material/Refresh';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      isChunkError: false 
    };
  }

  static getDerivedStateFromError(error) {
    // Check if this is a chunk loading error
    const isChunkError = error && (
      error.name === 'ChunkLoadError' || 
      error.message.includes('Loading chunk') ||
      error.message.includes('Unexpected token')
    );

    return { 
      hasError: true, 
      isChunkError 
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log the error
    console.error('Error caught by boundary:', error, errorInfo);

    // If it's a chunk error, try to clear cache and reload
    if (this.state.isChunkError) {
      this.handleChunkError();
    }
  }

  handleChunkError = () => {
    console.warn('Chunk loading error detected, attempting recovery...');
    
    // Clear caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }

    // Clear service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
        });
      });
    }

    // Clear localStorage items that might be causing issues
    const keysToClear = ['last_page', 'last_beat_time'];
    keysToClear.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });
  }

  handleReload = () => {
    window.location.reload();
  }

  handleClearCacheAndReload = () => {
    this.handleChunkError();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  render() {
    if (this.state.hasError) {
      if (this.state.isChunkError) {
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              p: 3,
              textAlign: 'center'
            }}
          >
            <Alert 
              severity="warning" 
              sx={{ mb: 3, maxWidth: 600 }}
            >
              <Typography variant="h6" gutterBottom>
                Application Update Required
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                A new version of the application is available. Please refresh to get the latest version.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReload}
                >
                  Refresh Page
                </Button>
                <Button
                  variant="outlined"
                  onClick={this.handleClearCacheAndReload}
                >
                  Clear Cache & Refresh
                </Button>
              </Box>
            </Alert>
          </Box>
        );
      }

      // Generic error fallback
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
            textAlign: 'center'
          }}
        >
          <Alert severity="error" sx={{ mb: 3, maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              An unexpected error occurred. Please try refreshing the page.
            </Typography>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleReload}
            >
              Refresh Page
            </Button>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary; 