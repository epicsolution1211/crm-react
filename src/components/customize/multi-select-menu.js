import React, { useEffect, useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const ITEM_HEIGHT = 60;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 1,
    },
  },
  autoFocus: false,
  disableAutoFocusItem: true,
  TransitionProps: {
    onExiting: (node) => {
      node.style.pointerEvents = 'none';
    },
  },
};

const MultiSelectMenu = ({ control, label, name, list, openModal, isLabel, isCurrency, isSmall, disabled, isSearch }) => {
  const [values, setValues] = useState([]);
  const [search, setSearch] = useState("");

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    return (typeof value === 'string' ? value.split(',') : value)
  };

  const handleSearch = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setSearch(event.target.value);
  }, []);

  const handleClose = useCallback(() => {
    setSearch("");
  }, []);


  useEffect(() => {
    if (!list) {
      setValues([]);
    }

    if (search) {
      const filteredValues = list.filter((val) =>
        val?.label?.toLowerCase()?.includes(search?.toLowerCase())
      );
      const result = filteredValues.map((item) => ({ ...item, value: parseInt(item?.value) }));
      setValues(result);
    } else {
      const result = list?.map((item) => ({ ...item, value: parseInt(item?.value) }));
      setValues(result || []);
    }
  }, [search, list]);


  useEffect(() => {
    const result = list?.map((item) => ({ ...item, value: parseInt(item?.value) }));
    setValues(result);
  }, [list]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value = [] }, fieldState: { error } }) => (
        <Stack sx={{ width: 1 }} gap={0.5}>
          {label && <Typography px={1} variant='subtitle2'>{label}</Typography>}
          <Select
            disabled={disabled}
            size={isSmall ? 'small' : 'medium'}
            error={!!error?.message}
            multiple
            value={value ?? placeholder}
            onChange={(event) => {
              if (typeof event?.target?.value[0] == 'number' || event?.target?.value?.length == 0) {
                const fieldValue = handleChange(event);
                onChange(fieldValue);
              }
            } }
            onClose={handleClose}
            sx={{ width: isSmall ? 150 : 1 }}
            renderValue={(selected) => {
              const newArray = list?.filter((item) => (
                selected?.includes(parseInt(item?.value))
              ));
              const showLabel = newArray?.map((item) => (item?.label))?.join(', ');
              return showLabel;
            } }
            MenuProps={MenuProps}
          >
            {(isLabel || isCurrency || isSearch) ? (
              <Stack
                direction='row'
                sx={{ px: 2, py: 1 }}>
                <TextField
                  size='small'
                  sx={{ width: 1 }}
                  type="search"
                  placeholder={isSearch ? 'Search...' : (isCurrency ? 'Search currency' : 'Search label')}
                  onChange={handleSearch}
                  hiddenLabel
                  value={search}
                  onKeyDown={(e) => e.stopPropagation()} />
              </Stack>
            ) : null}
            {values?.map((item, index) => (
              <MenuItem key={item?.label + index}
                sx={(isSmall) => (isSmall ? { px: 1 } : {})}
                value={item?.value}>
                <Checkbox checked={value.includes(item?.value) ? true : false}
                  sx={{ p: isSmall ? "0px" : "3px", mr: "2px" }} />
                {item?.color &&
                  <Box
                    sx={{
                      backgroundColor: item?.color,
                      maxWidth: 1,
                      height: 1,
                      padding: 1,
                      borderRadius: 20,
                      marginRight: 1
                    }}
                  ></Box>}
                <ListItemText primary={item?.label} />
              </MenuItem>
            ))}
            {(isLabel || isCurrency) ? (
              <Stack
                direction='row'
                sx={{ px: 2 }}
                justifyContent='center'>
                <Button
                  sx={{ px: 0 }}
                  onClick={() => openModal()}
                >
                  {isCurrency ? 'Edit Currency' : 'Edit Labels'}
                </Button>
              </Stack>
            ) : null}
          </Select>
          {!!error?.message && <FormHelperText sx={{ px: 2 }}
            error={!!error?.message}>{error?.message}
          </FormHelperText>}
        </Stack>
      )}
    />
  );
}

export default MultiSelectMenu