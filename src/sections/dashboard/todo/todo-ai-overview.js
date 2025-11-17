import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grid from "@mui/system/Unstable_Grid/Grid";
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { todoApi } from 'src/api/todo';

const STATS_CARDS = [
  {
    id: 'todo',
    title: 'To Do',
    value: (stats) => stats?.todo_count ?? 0,
    xs: 12,
    bgcolor : 'info.main',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    value: (stats) => stats?.in_progress_count ?? 0,
    xs: 6,
    bgcolor : 'warning.main',
  },
  {
    id: 'done',
    title: 'Done',
    value: (stats) => stats?.done_count ?? 0,
    xs: 6,
    bgcolor : 'success.main',
  },
  {
    id: 'overdue',
    title: 'Overdue',
    value: (stats) => stats?.overdue_count ?? 0,
    xs: 6,
    bgcolor : 'secondary.main',
  },
  {
    id: 'high_priority',
    title: 'High Priority',
    value: (stats) => stats?.high_priority_count ?? 0,
    xs: 6,
    bgcolor : 'error.main',
  }
];

export const TodoAiOverview = ({ todoList = [] }) => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateSummary = async () => {
    try {
      setIsLoading(true);
      const response = await todoApi.generateBulkAiSummary();
      const newSummary = response?.summary;
      
      if (newSummary) {
        setSummary(newSummary);
      }
    } catch (err) {
      console.error('err: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = () => {
    if (!summary && !isLoading) {
      handleGenerateSummary();
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    if (todoList.length > 0 && !summary) {
      handleGenerateSummary();
    }
  }, [todoList.length]);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={
          <Iconify 
            icon="solar:magic-stick-linear"
            width={mdUp ? 20 : 24}
          />
        }
        onClick={handleOpenDialog}
        disabled={isLoading}
        size={mdUp ? 'small' : 'medium'}
        sx={{ px: { xs: 1.8, md: 2, whiteSpace : 'nowrap' } }}
      >
        AI Insight
      </Button>

      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, md: 2 },
            backgroundColor: 'background.paper'
          }
        }}
        fullScreen={mdUp}
      >
        <DialogTitle sx={{ position: 'relative' }}>
          <IconButton 
            onClick={handleCloseDialog} 
            sx={{ 
              display: { xs: 'flex', md: 'none' },
              position: 'absolute',
              right: 10,
              top: 10,
              color: 'text.primary',
            }}>
            <Iconify icon="mingcute:close-line" width={20} height={20} />
          </IconButton>
          <Stack 
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: { xs: 'start', md: 'space-between' },
              gap: 1,
            }}
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <Iconify icon="solar:magic-stick-linear" width={24}/>
              <Typography variant="h6" fontWeight="600">
                AI Insight
              </Typography>
            </Stack>
            <Tooltip title="Regenerate">
              <IconButton
                size="small"
                onClick={handleGenerateSummary}
                disabled={isLoading}
                sx={{ 
                  color: isLoading ? 'text.secondary' : 'primary.main',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <Iconify icon={isLoading ? "svg-spinners:8-dots-rotate" : "solar:refresh-linear"} width={24} />
              </IconButton>
            </Tooltip>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 0 }}>
          <Card variant="outlined" sx={{ mx: 0, flexShrink: 0, borderRadius: 1.5 }}>
            <Grid container spacing={1.5} sx={{ p: 2 }}>
              {STATS_CARDS.map((card) => (
                <Grid key={card.id} item xs={card.xs} md={2.4}>
                  <Stack 
                    sx={{ 
                    bgcolor: card.bgcolor,
                    textAlign: 'center',
                    borderRadius: { xs: 1.5, md: 1 },
                    py: 1,
                    height: '100%',
                    flexDirection: { xs: 'row-reverse', md: 'column' },
                    justifyContent: { xs: 'space-between', md: 'center' },
                    alignItems: { xs: 'center', md: 'center' },
                    gap: { xs: 1, md: 0 },
                    px: { xs: 1.5, md: 1 }
                  }}>
                    <Typography variant="h5" sx={{ color: 'common.white' }}>
                      {card.value(summary?.todo_stats)}
                    </Typography>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: 'common.white',
                        ...(card.id === 'high_priority' && { whiteSpace: 'nowrap' })
                      }}
                    >
                      {card.title}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Card>

          {isLoading && !summary && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <Stack alignItems="center" spacing={2}>
                <CircularProgress size={32} />
                <Typography variant="body2" color="text.secondary">
                  Generating your AI overview...
                </Typography>
              </Stack>
            </Box>
          )}

          {summary && (
            <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
              <CardContent 
                sx={{ 
                  py: 2, 
                  px: 0.5,
                  '&:last-child': {
                    pb: 2
                  }
                }}>
                <Scrollbar sx={{ height: { xs: 'calc(100vh - 320px)', md: 'auto' }, px: 1.5 }}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.primary"
                    sx={{ 
                      lineHeight: 1.6,
                      fontStyle: 'italic',
                      textAlign: 'justify'
                    }}
                  >
                    {summary?.summary}
                  </Typography>
                </Scrollbar>
              </CardContent>
            </Card>
          )}
        </DialogContent>

        <DialogActions sx={{ display: { xs: 'none', md: 'flex' }, px: 3, pb: 1 }}>
          <Button onClick={handleCloseDialog} >Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
