import { useState, useCallback, useEffect } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { todoApi } from 'src/api/todo';
import { useTimezone } from "src/hooks/use-timezone";

export const AiInsightInfo = ({ todo, mutate, canManage = false, isTicket = false }) => {
  const [summary, setSummary] = useState(todo?.ai_summary || null);
  const [generatedAt, setGeneratedAt] = useState(todo?.ai_summary_generated_at || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toLocalTime } = useTimezone();

  const handleGenerateSummary = useCallback(async () => {
    if (!todo?.id) return;

    try {
      setIsGenerating(true);
      const response = await todoApi.generateAiSummary(todo.id, { ticket_system: isTicket });
      const newSummary = response?.summary?.summary ?? "";
      
      if (newSummary) {
        await todoApi.updateToDo(todo.id, { ai_summary: newSummary, ai_summary_generated_at: response?.summary?.generated_at });
        await mutate({ todo: { ...todo, ai_summary: newSummary } }, false);
        setSummary(newSummary);
        setGeneratedAt(response?.summary?.generated_at);
      } 
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }, [todo?.id]);

  useEffect(() => {
    if (todo?.ai_summary) {
      setSummary(todo?.ai_summary);
      setGeneratedAt(todo?.ai_summary_generated_at);
    }
    return () => {
      setSummary(null);
      setGeneratedAt(null);
    };
  }, [todo?.ai_summary, handleGenerateSummary]);

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mt: 2, 
        backgroundColor: 'background.neutral',
        borderColor: 'divider',
        borderRadius: 1,
        '&:hover': {
          borderColor: 'primary.main',
        },
        position: 'relative',
      }}
    >
      <CardContent sx={{ p: 2, position: 'relative' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="solar:magic-stick-linear" width={20} />
            <Typography variant="subtitle2">AI Insight</Typography>
          </Stack>
          {summary && <IconButton 
            onClick={handleGenerateSummary} 
            disabled={isGenerating || !canManage} 
            sx={{ 
              color: 'primary.main', 
              p: 0.5,
              position: 'absolute',
              right: 12,
              top: 12,
            }}>
            {isGenerating ? <CircularProgress size={16} /> : <Iconify icon="solar:refresh-linear" width={20} />}
          </IconButton>}
        </Stack>

        {summary ? (
          <Stack pb={1.5}>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {summary }
            </Typography>
            {generatedAt && <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 20,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {`Generated at ${toLocalTime(generatedAt, "MMM d, yyyy h:mm a")}`}
            </Typography>}
          </Stack>
        ) : 
        (
          <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mt: 2, mb: 2 }}>
            <LoadingButton
              variant="t"
              color="primary" 
              onClick={handleGenerateSummary}
              disabled={isGenerating || !canManage}
              size="small"
              sx={{
                borderStyle: 'solid',
                borderColor: 'primary.main',
                position: 'relative',
                fontSize: 12,
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  opacity: 0.3,
                  borderRadius: '50% 20% / 10% 40%',
                  animation: 'wavyBorder 4s infinite linear'
                },
                '@keyframes wavyBorder': {
                  '0%': {
                    borderRadius: '50% 20% / 10% 40%'
                  },
                  '50%': {
                    borderRadius: '20% 50% / 40% 10%'  
                  },
                  '100%': {
                    borderRadius: '50% 20% / 10% 40%'
                  }
                },
                '&:hover': {
                  '&:before': {
                    opacity: 0.5
                  }
                }
              }}
            >
              Generate Now
            </LoadingButton>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
