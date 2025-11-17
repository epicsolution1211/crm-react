import { useEffect, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from "@mui/material/Stack";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ChipSet } from "src/components/customize/chipset";
import { LabelsDialog } from 'src/components/labels-dialog';
import { Iconify } from 'src/components/iconify';

const ITEM_HEIGHT = 60;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 1,
    },
  },
};

export const CustomerLabelStep = ({ onBack, onNext, labels, labelList, teamList, onGetLabels = () => { } }) => {
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [openLabelModal, setOpenLabelModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredLabels, setFilteredLabels] = useState([]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedLabels(Array.isArray(value) ? value : []);
  };

  const handleRemoveChip = (value) => {
    setSelectedLabels(prev => prev.filter(item => item !== value));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const searchValue = event.target.value;
    setSearch(searchValue);
    
    const filtered = labelList?.filter(label => 
      label?.label?.toLowerCase().includes(searchValue.toLowerCase())
    ) || [];
    setFilteredLabels(filtered);
  };

  const handleSubmit = () => {
    onNext({ label_ids: selectedLabels });
  };

  const currentChip = useMemo(() => {
    if (!selectedLabels || !labelList) return [];
    
    return selectedLabels.map((selected) => {
      const chip = labelList.find((item) => selected === item?.value);
      return ({
        displayValue: chip?.label || '',
        value: selected,
        label: "Label"
      });
    });
  }, [selectedLabels, labelList]);

  useEffect(() => {
    if (labels?.label_ids) {
      setSelectedLabels(labels.label_ids);
    } else {
      setSelectedLabels([]);
    }
  }, [labels]);

  useEffect(() => {
    setFilteredLabels(labelList || []);
  }, [labelList]);

  return (
    <>
      <Stack>
        <Stack spacing={3}>
          <Stack sx={{ width: 1 }} spacing={1}>
            <Typography px={1}>Add Labels</Typography>
            <Select
              multiple
              value={selectedLabels || []}
              onChange={handleChange}
              renderValue={(selected) => {
                if (!selected || !labelList) return '';
                
                const selectedItems = labelList.filter(item => 
                  selected.includes(item?.value)
                );
                return selectedItems.map(item => item?.label || '').join(', ');
              }}
              MenuProps={MenuProps}
            >
              <TextField
                size='small'
                type="search"
                placeholder="Search label"
                onChange={handleSearch}
                value={search}
                hiddenLabel
                sx={{ px: 3, py: 1, width: 1 }}
                onKeyDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              />
              
              {filteredLabels.map((item, index) => (
                <MenuItem key={`${item?.label}-${index}`} value={item?.value} sx={{ py: 0 }}>
                  <Checkbox 
                    checked={selectedLabels?.includes(item?.value) || false}
                  />
                  {item?.color && (
                    <Box
                      sx={{
                        backgroundColor: item.color,
                        maxWidth: 1,
                        height: 1,
                        padding: 1,
                        borderRadius: 20,
                        marginRight: 1
                      }}
                    />
                  )}
                  <ListItemText primary={item?.label || ''} />
                </MenuItem>
              ))}
              
              <Stack direction='row' sx={{ px: 2 }} justifyContent='center'>
                <Button
                  sx={{ px: 0 }}
                  onClick={() => setOpenLabelModal(true)}
                >
                  Edit Labels
                </Button>
              </Stack>
            </Select>
          </Stack>
        </Stack>

        {currentChip?.length > 0 && (
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            gap={2}
            sx={{ px: 3, mt: 2 }}
          >
            <ChipSet 
              chips={currentChip}
              handleRemoveChip={handleRemoveChip} 
            />
          </Stack>
        )}

        <Stack 
          alignItems="center"
          direction="row"
          sx={{ mt: 3 }}
          spacing={2}
        >
          <Button
            color="inherit"
            onClick={() => onBack({ label_ids: selectedLabels })}
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            endIcon={<Iconify icon="octicon:arrow-right-16" width={22} />}
            disabled={!(selectedLabels?.length > 0)}
            variant="contained"
          >
            Continue
          </Button>
        </Stack>
      </Stack>

      <LabelsDialog
        title="Edit Label"
        teams={teamList}
        open={openLabelModal}
        onClose={() => setOpenLabelModal(false)}
        getLabelList={onGetLabels}
      />
    </>
  );
};
