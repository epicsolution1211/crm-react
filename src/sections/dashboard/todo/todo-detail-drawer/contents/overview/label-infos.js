import { useCallback, useMemo, useState } from 'react';

import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { useGetTodoLabels } from 'src/hooks/swr/use-todo';
import { Iconify } from 'src/components/iconify';
import { todoApi } from "src/api/todo";

export const LabelInfos = ({ todo, onUpdateTodos, mutate, canManage = false }) => {
  const { labels: availableLabels } = useGetTodoLabels();
  const labels = useMemo(() => todo?.labels || [], [todo?.labels]);

  const [selectedLabelIds, setSelectedLabelIds] = useState([]);

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isAssignLoading, setIsAssignLoading] = useState(false);

  const availableOptions = useMemo(() => {
    if (!Array.isArray(availableLabels)) return [];
    return availableLabels.filter((label) => 
      !Array.isArray(labels) || !labels.some(taskLabel => 
        typeof taskLabel === 'object' ? taskLabel.id === label.id : taskLabel === label.id || taskLabel === label.name
      )
    );
  }, [availableLabels, labels]);

  const handleAssignLabels = useCallback(async () => {
    try {
      setIsAssignLoading(true);
      const currentLabelIds = Array.isArray(labels) ? labels.map(label => 
        typeof label === 'object' ? label.id : label
      ).filter(Boolean) : [];
      
      const newLabelIds = [...currentLabelIds, ...selectedLabelIds];

      await todoApi.updateToDo(todo.id, { label_ids: newLabelIds });
      await mutate();
      onUpdateTodos(todo.id, { label_ids: newLabelIds });

      setIsOpenDialog(false);
      setSelectedLabelIds([]);
    } catch (error) {
      console.error('Error assigning labels:', error);
    } finally {
      setIsAssignLoading(false);
    }
  }, [labels, selectedLabelIds, onUpdateTodos, mutate, todo.id]);

  const handleRemoveLabel = useCallback(async (label) => {
    try {
      await todoApi.updateToDo(todo.id, { non_label_ids : [label.id] });
      await mutate();
      onUpdateTodos(todo.id, { label_ids: labels.filter((item) => item.id !== label.id) });
    } catch (error) {
      console.error('Error removing label:', error);
    }
  }, [labels, onUpdateTodos, mutate, todo.id]);

  const onSelectLabels = useCallback((labelId) => {
    setSelectedLabelIds(prev => 
      prev.includes(labelId) 
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  }, []);

  const getLabelData = useCallback((label) => {
    if (typeof label === 'object') {
      return label;
    }
    
    // If label is just an ID, find the full label data from availableLabels
    const fullLabel = availableLabels?.find(l => l.id === label || l.name === label);
    return fullLabel || { id: label, name: label, color: '#1976d2' };
  }, [availableLabels]);

  const renderLabelChip = (label) => {
    const labelData = getLabelData(label);
    
    return (
      <Chip
        key={labelData.id || labelData.name}
        label={labelData.name}
        onDelete={canManage ? () => handleRemoveLabel(label) : undefined}
        size="small"
        sx={{
          backgroundColor: labelData.color,
          color: '#fff',
          '& .MuiChip-label': {
            color: '#fff',
            fontWeight: 500
          },
          '&:hover': {
            opacity: 0.8
          }
        }}
      />
    );
  };

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={1}
      >
        {Array.isArray(labels) && labels.map((label) => renderLabelChip(label))}
        <Stack direction="row" spacing={0.5}>
          {canManage && <Tooltip title="Add label">
            <IconButton
              onClick={()=>{
                if (canManage) {
                  setSelectedLabelIds([]);
                  setIsOpenDialog(true);
                }
              }}
              size="small"
              disabled={availableOptions.length === 0}
              sx={{
                p: 0.5, 
                m: 0,
                '&:hover': { 
                  bgcolor: 'action.hover', 
                  color: 'text.secondary' 
                } 
              }}
            >
              <Iconify icon="zondicons:add-outline" width={16} />
            </IconButton>
          </Tooltip>}
        </Stack>
      </Stack>

      <Dialog open={isOpenDialog} onClose={() => setIsOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ mt: 1 }}>Assign Labels</DialogTitle>
        <DialogContent>
          {availableOptions?.length > 0 ? (
            <Stack spacing={1}>
              {availableOptions.map((label) => (
                <Stack
                  key={label.id}
                  onClick={() => onSelectLabels(label.id)}
                  sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    p: 1,
                    border: '1px solid',
                    borderColor: selectedLabelIds.includes(label.id) ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    cursor: 'pointer',
                    backgroundColor: selectedLabelIds.includes(label.id) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: selectedLabelIds.includes(label.id) ? 'rgba(25, 118, 210, 0.12)' : 'action.hover'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: label.color,
                        border: '1px solid #ccc'
                      }}
                    />
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                      {label.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {label?.description}
                    </Typography>
                  </Stack>
                  {selectedLabelIds.includes(label.id) && (
                    <Iconify icon="solar:check-circle-bold" color="primary.main" width={20} />
                  )}
                </Stack>
              ))}
            </Stack>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No available labels
              </Typography>
            </Box>
          )}
        </DialogContent>
        <Stack direction="row" spacing={1} sx={{ px: 3, pb: 2, justifyContent: 'flex-end' }}>
          <Button size="small" onClick={() => setIsOpenDialog(false)}>
            Cancel
          </Button>
          <LoadingButton 
            onClick={handleAssignLabels}
            variant="contained"
            disabled={selectedLabelIds.length === 0 || isAssignLoading}
            size="small"
            loading={isAssignLoading}
          >
            Assign Labels ({selectedLabelIds.length})
          </LoadingButton>
        </Stack>
      </Dialog>
    </>
  );
};
