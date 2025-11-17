import { useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { usePopover } from "src/hooks/use-popover";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";

export const FilterSelect = ({
  label,
  options,
  placeholder,
  value,
  setValue,
  withSearch,
  withApiSearch = false,
  searchValue = "",
  onSetSearchValue = () => { },
  isExclude,
  smallText,
  nonValue,
  setNonValue,
}) => {
  const [values, setValues] = useState([]);
  const [search, setSearch] = useState("");

  const popover = usePopover();

  useEffect(() => {
    setValues([...options]);
  }, [options]);

  useEffect(() => {
    const filteredValues = values?.filter((val) =>
      val?.label?.toLowerCase().includes(search?.toLowerCase())
    );
    if (search) {
      setValues(filteredValues);
    } else {
      setValues([...options]);
    }
  }, [search, options]);

  const handleSearch = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setSearch(event.target.value);
  }, []);

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
          fontSize={smallText ? 13 : 14}
          fontWeight="600"
          sx={{ whiteSpace: "nowrap", textTransform: "uppercase" }}
        >
          {label}
        </Typography>
      </Button>
      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{ style: { width: 200 } }}
      >
        {withSearch && (
          <Stack sx={{ px: 1, py: 1 }}>
            <TextField
              type="search"
              placeholder={placeholder}
              onChange={handleSearch}
              hiddenLabel
              size="small"
              value={search}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </Stack>
        )}
        {withApiSearch && (
          <Stack sx={{ px: 1, py: 1 }}>
            <TextField
              type="search"
              placeholder={placeholder}
              onChange={(e) => onSetSearchValue(e?.target?.value)}
              hiddenLabel
              size="small"
              value={searchValue}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </Stack>
        )}
        <Scrollbar style={{ maxHeight: 200 }}>
          {values?.map((option) => (
            <MenuItem
              key={option.label}
              sx={{ w: 1 }}
              selected={value === option?.value}
            >
              <Stack direction={"row"} sx={{ width: "100%" }}>
                <Typography
                  onClick={() => setValue(option?.value)}
                  sx={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    flexGrow: 1,
                  }}
                >
                  {option.label}
                </Typography>
                {isExclude && (
                  <IconButton
                    onClick={() => setNonValue(option.value)}
                    sx={{ p: 0 }}
                  >
                    <Iconify icon="lets-icons:remove" width={20} sx={{ color: nonValue?.includes(option?.option) ? "error.main" : "action.disabled" }} />
                  </IconButton>
                )}
              </Stack>
            </MenuItem>
          ))}
        </Scrollbar>
      </Menu>
    </>
  );
};
