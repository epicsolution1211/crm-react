import { useCallback, useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";
import { Icon } from "@iconify/react";

import { Iconify } from 'src/components/iconify';
import { SeverityPill } from "src/components/severity-pill";
import { useTimezone } from "src/hooks/use-timezone";
import { currencyOption } from "src/utils/constants";

export const SelectMenu = ({
  list,
  control,
  name,
  label,
  isSearch = false,
  isApiSearch = false,
  apiSearch = "",
  setApiSearch = () => { },
  isLabel = false,
  editLabel = "Edit brand status",
  openModal = () => { },
  clearable = false,
  access = {},
  isDesk = false,
  disabled = false,
  selfDesks = [],
  isIcon = false,
  isTransaction = false,
  isSenderEmail = false,
  isLoading = false,
  searchPlaceholder = "Search",
  emptyMessage = undefined,
  onSelect = () => { },
  ...other
}) => {
  const { toLocalTime } = useTimezone();

  const ITEM_HEIGHT = 60;
  const ITEM_PADDING_TOP = 20;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 1,
        marginTop: 10,
        position: 'relative',
      },
    },
  };

  const [search, setSearch] = useState("");
  const [values, setValues] = useState([]);

  const handleSearch = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setSearch(event.target.value);
  }, []);

  useEffect(() => {
    setValues(list);
  }, [list]);

  useEffect(() => {
    const filteredValues = values?.filter((val) => {
      return val?.label?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
    });
    if (search) {
      setValues(filteredValues);
    } else {
      setValues(list);
    }
  }, [search, list]);

  return (
    <Box
      sx={{ width: 1, display: "flex", gap: 1, flexDirection: "column" }}
      {...other}
    >
      {label && <Typography px={1} variant="subtitle2">{label}</Typography>}
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <Select
              fullWidth
              disabled={disabled}
              error={!!error?.message}
              value={
                value instanceof Array && value?.length === 1
                  ? value[0]
                  : value instanceof Array && value?.length > 1
                    ? 0
                    : isDesk && access?.acc_v_client_desk
                      ? value + ""
                      : isDesk &&
                        (access?.acc_v_client_self_desk === undefined ||
                          access?.acc_v_client_self_desk) &&
                        selfDesks?.includes(value)
                        ? value
                        : !isDesk
                          ? value + ""
                          : isDesk
                            ? "hidden"
                            : "" ?? ""
              }
              onChange={(event) => {
                onChange(event?.target?.value);
                onSelect(event?.target?.value);
              }}
              MenuProps={MenuProps}
              endAdornment={
                clearable && value ? (
                  <IconButton 
                    sx={{ 
                      mr: 1.5, 
                      p: 0.5, 
                      '&:hover': { backgroundColor: 'action.hover', color: 'primary.main' },
                      cursor: "pointer"
                    }}
                    disabled={disabled}
                    onClick={() => onChange("")}
                  >
                    <Iconify icon="iconoir:xmark" width={22}/>
                  </IconButton>
                ) : null
              }
            >
              {(isSearch || isApiSearch) ? (
                  <TextField
                    size="small"
                    type="search"
                    sx={{
                      '& .MuiFormHelperText-root': {
                        marginTop: 2,
                      },
                      width: '100%',
                      px: 1.5,
                      pb: 1,
                      position: 'sticky',
                      top: 4,
                      backgroundColor: 'background.paper',
                      zIndex: 1000,
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        width: '100%',
                        top: -10,
                        left: 0,
                        right: 0,
                        height: 10,
                        backgroundColor: 'background.paper',
                      }
                    }}
                    placeholder={searchPlaceholder}
                    onChange={isApiSearch ? setApiSearch : handleSearch}
                    hiddenLabel
                    value={isApiSearch ? apiSearch : search}
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    InputProps={{
                      endAdornment: isLoading ? (
                        <InputAdornment position="end">
                          <CircularProgress size={20} sx={{ ml: 0.5 }}/>
                        </InputAdornment>
                      ) : null
                    }}
                    helperText={values?.length === 0 && emptyMessage && !isLoading ? emptyMessage : null}
                  />
              ) : null}
              {isDesk ? (
                <MenuItem value={"hidden"} sx={{ display: "none" }}>
                  **********
                </MenuItem>
              ) : null}
              {values?.map((item) => (
                <MenuItem
                  key={item?.value}
                  value={item?.value}
                  sx={{ 
                    display: item?.isHidden ? "none" : "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    fontSize: 14,
                  }}
                >
                  {isIcon ? (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Icon icon={item?.icon ?? item?.label} width={24} />
                      <Typography>{item?.title ?? item?.label}</Typography>
                    </Stack>
                  ) : !isTransaction ? (
                    item.title ?? item?.label
                  ) : null}

                  {item?.default && (
                    <SeverityPill color="info" sx={{ ml: 2, fontSize: 10 }}>
                      Default
                    </SeverityPill>
                  )}


                  {isTransaction && (
                    <Stack direction="row" alignItems="center" gap={1} pl={1} sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}>
                      <Chip size="small" variant="outlined" label={`ID: ${item?.id}`} sx={{ cursor: "pointer" }}/>
                      <Chip size="small" variant="outlined" label={`${currencyOption?.find(currency => currency?.value === item?.currency)?.symbol}${item?.amount ?? 0}`} sx={{ cursor: "pointer" }}/>
                      <Chip
                        icon={<Iconify icon="weui:time-outlined" width={16} />}
                        sx={{ cursor: "pointer" }}
                        size="small" variant="outlined" label={`${toLocalTime(item?.created_at)}`} />
                      {item?.transaction_type && <Chip size="small" variant="outlined" label={`${item?.transaction_type}`} sx={{ cursor: "pointer" }}/>}
                    </Stack>
                  )}

                  {isSenderEmail && (
                    <Chip
                      size="small"
                      variant="outlined" 
                      label={`${item?.type}`} 
                      sx={{ cursor: "pointer", ml: 1, fontSize: 11, color: 'text.secondary' }}/>
                  )}
                </MenuItem>
              ))}
              {!!value &&
                (value instanceof Number || value instanceof String) &&
                !values?.map((v) => v?.value)?.includes(value) && (
                  <MenuItem value={value}>{value}</MenuItem>
                )}
              {isLabel ? (
                <Stack direction="row" sx={{ px: 2 }} justifyContent="center">
                  <Button sx={{ px: 0 }} onClick={() => openModal()}>
                    {editLabel}
                  </Button>
                </Stack>
              ) : null}
            </Select>
            {!!error?.message && <FormHelperText sx={{ px: 2, mt: '-2px' }} error={!!error?.message}>
              {error?.message}
            </FormHelperText>}
          </>
        )}
      />
    </Box>
  );
};
