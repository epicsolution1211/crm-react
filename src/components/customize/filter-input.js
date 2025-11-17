import { useCallback, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";

import { usePopover } from "src/hooks/use-popover";
import { getAPIUrl } from "src/config";
import { Iconify } from "src/components/iconify";

export const FilterInput = ({
  label,
  type,
  placeholder,
  placeholder2,
  labelFont,
  isRange = false,
  filter,
  setFilter,
  setFilter2,
  isExclude,
  setExcludeFilter,
  setExcludeFilter2,
  isSuggestion = false,
  suggestions = [],
  setSuggestion = () => { },
}) => {
  const popover = usePopover();

  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");

  const handleSearch = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setValue(event.target.value);
  }, []);

  const handleSearch2 = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setValue2(event.target.value);
  }, []);

  const handleKeyDown = (event) => {
    event.stopPropagation();
    if (event.keyCode === 13) {
      setFilter(value ?? "");
      popover.handleClose();
    }
  };
  const handleKeyDown2 = (event) => {
    event.stopPropagation();
    if (event.keyCode === 13) {
      setFilter2(value2 ?? "");
      popover.handleClose();
    }
  };

  useEffect(() => {
    setValue("");
    setValue2("");
  }, [popover.open]);

  return (
    <>
      <Button
        color="inherit"
        endIcon={<Iconify icon="icon-park-outline:down" width={20} />}
        sx={{ p: 0 }}
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
      >
        <Typography
          fontSize={labelFont ?? 14}
          fontWeight="600"
          whiteSpace="nowrap"
          sx={{ whiteSpace: "nowrap" }}
        >
          {label ? label?.toUpperCase() : ""}
        </Typography>
      </Button>
      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{ style: { px: 10, width: 250 } }}
      >
        <Stack sx={{ px: 2, py: 1 }} direction="row">
          <TextField
            size="small"
            type={type ?? "text"}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? ""}
            onChange={handleSearch}
            value={value ?? ""}
            hiddenLabel
            sx={{ width: 1, mr: 1 }}
          />
          <Tooltip title="Default">
            <IconButton
              sx={{ p: isExclude ? 0 : "auto", mr: isExclude ? 1 : 0 }}
              color="primary"
              onClick={() => {
                setFilter(value ?? "");
                if (!isRange) {
                  setValue("");
                  popover.handleClose();
                }
              }}
            >
              <CheckIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {isExclude && (
            <Tooltip title="Exclude">
              <IconButton
                sx={{ p: 0 }}
                onClick={() => {
                  setExcludeFilter(value ?? "");
                  if (!isRange) {
                    setValue("");
                  }
                }}
              >
                <RemoveCircleOutlineIcon fontSize="small" color="gray" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
        {isRange && (
          <Stack sx={{ px: 2, py: 1 }} direction="row">
            <TextField
              size="small"
              type={type ?? "text"}
              onKeyDown={handleKeyDown2}
              placeholder={placeholder2 ?? ""}
              onChange={handleSearch2}
              value={value2 ?? ""}
              hiddenLabel
              sx={{ width: 1 }}
            />
            <IconButton
              sx={{ ml: 1 }}
              color="primary"
              onClick={() => {
                setFilter2(value2 ?? "");
                if (!isRange) {
                  setValue2("");
                }
              }}
            >
              <CheckIcon fontSize="small" />
            </IconButton>
            {isExclude && (
              <Tooltip title="Exclude">
                <IconButton
                  sx={{ p: 0 }}
                  onClick={() => {
                    setExcludeFilter2(value2 ?? "");
                    if (!isRange) {
                      setValue2("");
                    }
                  }}
                >
                  <RemoveCircleOutlineIcon fontSize="small" color="gray" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        )}
        {isSuggestion && (
          <Stack mt={2}>
            {suggestions?.map((suggestion) => (
              <Stack
                direction="row"
                alignItems="center"
                px={2}
                py={2}
                spacing={2}
                key={suggestion?.value}
                onClick={() => {
                  if (filter?.includes(suggestion?.value)) {
                    setSuggestion(filter?.filter(f => f !== suggestion?.value));
                  } else {
                    if (filter) {
                      setSuggestion([...filter, suggestion?.value]);
                    } else {
                      setSuggestion([suggestion?.value]);
                    }
                  }
                }}
                sx={{
                  backgroundColor: filter?.includes(suggestion?.value) ? "#181f37" : "",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#181f37",
                  },
                }}
              >
                <Avatar
                  src={suggestion?.avatar ? suggestion?.avatar?.includes('http') ? suggestion?.avatar : `${getAPIUrl()}/${suggestion?.avatar}` : ""}
                  sx={{ height: 30, width: 30 }}
                />
                <Typography variant="subtitle1">{suggestion?.label}</Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Menu>
    </>
  );
};
