import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { v4 as uuid4 } from "uuid";
import { usePopover } from "src/hooks/use-popover";
import { useAuth } from "src/hooks/use-auth";
import { Scrollbar } from "../scrollbar";
import { Iconify } from "src/components/iconify";

export const RenderItem = ({
  option,
  handleValueChange,
  value,
  isExclude,
  nonValue,
  handleNonValueChange,
}) => {
  return (
    <MenuItem key={option?.label} sx={{ px: 4 }}>
      <Stack
        direction="row"
        width={1}
        alignItems="center"
        justifyContent="space-between"
        gap={1}
      >
        <FormControlLabel
          control={<Checkbox
            checked={value?.some((item) => item == option?.option)}
            onChange={handleValueChange}
            value={option?.option}
            sx={{ p: 0, mr: 1 }} />}
          label={<Stack direction='row' alignItems='center' gap={1}>
            {option?.label !=='Empty' && <Box sx={{ backgroundColor: option?.color ?? 'primary.main', maxWidth: 1, height: 1, padding: 1, borderRadius: 20 }}></Box>}
            <Typography sx={{ whiteSpace: "nowrap", flexGrow: 1 }}>
              {option?.label ?? option?.option}
            </Typography>
          </Stack>}
          sx={{
            flexGrow: 1,
            mr: 0,
            fontSize: 14,
          }} />
        {isExclude && (
          <IconButton
            onClick={() => { handleNonValueChange(option?.option) }}
            sx={{ p: 0 }}
          >
            <Iconify icon="lets-icons:remove" width={20} sx={{ color: nonValue?.includes(option?.option) ? "error.main" : "action.disabled" }} />
          </IconButton>
        )}
      </Stack>
    </MenuItem>
  );
};

export const CustomFilterMultiRadio = ({
  label,
  setting = {},
  field = {},
  onSetField = () => { },
}) => {
  const [multiValue, setMultiValue] = useState([]);
  const [nonMultiValue, setNonMultiValue] = useState([]);
  const { user } = useAuth();
  const popover = usePopover();

  const [search, setSearch] = useState("");
  const [values, setValues] = useState([]);

  useEffect(() => {
    if (field?.filter) {
      setMultiValue(field?.filter?.query);
      setNonMultiValue(field?.filter?.non_query);
    } else {
      setMultiValue([]);
      setNonMultiValue([]);
    }
  }, [field]);


  const handleValueChange = useCallback(
    (e) => {
      if (multiValue?.includes(e?.target?.value)) {
        setMultiValue(multiValue?.filter((mv) => mv !== e?.target?.value));
      } else {
        if(e?.target?.value == '_empty') {
          setMultiValue([e?.target?.value]);
        } else {
          setMultiValue(multiValue?.filter((mv) => mv !== '_empty').concat([e?.target?.value]));
        }
      }

      if (nonMultiValue?.includes(e?.target.value)) {
        setNonMultiValue(nonMultiValue?.filter((nv) => nv!== e?.target.value));
      }      
      onSetField((prev) => {
        return prev?.map((item) => {
          if (item?.custom_id === field?.id) {
            return {
              ...item,
              filter: {
                field_id: field?.id,
                field_type: field?.field_type,
                query: multiValue?.includes(e?.target?.value)
                  ? multiValue?.filter((mv) => mv !== e?.target?.value)
                  : e?.target?.value == '_empty' 
                    ? [e?.target?.value]
                    : multiValue?.filter((mv) => mv !== '_empty').concat([e?.target?.value]),
                non_query: nonMultiValue?.includes(e?.target.value)
                  ? nonMultiValue?.filter((nv) => nv!== e?.target.value) 
                  : nonMultiValue,
              },
            };
          } else {
            return item;
          }
        });
      });
    },
    [multiValue, nonMultiValue, onSetField]
  );

  const handleNonValueChange = useCallback(
    (val) => {
      if (nonMultiValue?.includes(val)) {
        setNonMultiValue(nonMultiValue?.filter((mv) => mv !== val));
      } else {
        setNonMultiValue(nonMultiValue.concat([val]));
      }

      if (multiValue?.includes(val)) {
        setMultiValue(multiValue?.filter((mv) => mv!== val));
      }

      onSetField((prev) => {
        return prev?.map((item) => {
          if (item?.custom_id === field?.id) {
            return {
              ...item,
              filter: {
                field_id: field?.id,
                field_type: field?.field_type,
                query: multiValue?.includes(val)
                  ? multiValue?.filter((mv) => mv!== val)
                  : multiValue,
                non_query: nonMultiValue?.includes(val)
                  ? nonMultiValue?.filter((mv) => mv !== val)
                  : nonMultiValue.concat([val]),

              },
            };
          } else {
            return item;
          }
        });
      });
    },
    [nonMultiValue, multiValue, onSetField]
  );

  const options = useMemo(() => {
    if (setting) {
      const parsedSettings = JSON.parse(setting);
      return parsedSettings?.map((s) => {
        const accessOptionKey = `acc_custom_v_${field?.value
          }_${s?.option?.replace(/\s+/g, "_")}`;
        const viewOptionAccess = user?.acc && user?.acc[accessOptionKey];

        if (!viewOptionAccess && viewOptionAccess !== undefined) return null;

        return s;
      });
    } else {
      return [];
    }
  }, [setting]);

  const handleSearch = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setSearch(event.target.value);
  }, []);

  useEffect(() => {
    setValues([{ id: uuid4(), option: "_empty", label: "Empty" }, ...options]);
  }, [options]);

  useEffect(() => {
    const filteredValues = values?.filter((val) =>
      val?.option?.toLowerCase()?.includes(search?.toLowerCase())
    );
    if (search) {
      setValues(filteredValues);
    } else {
      setValues([{ id: uuid4(), option: "_empty", label: "Empty" }, ...options]);
    }
  }, [search, options]);

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
          fontSize={14}
          fontWeight="600"
          sx={{ whiteSpace: "nowrap" }}
        >
          {label}
        </Typography>
      </Button>
      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{ style: { px: 2, minWidth: 270 } }}
      >

        <Stack sx={{ px: 2, py: 1 }}>
          <TextField
            type="search"
            placeholder={label ?? ''}
            onChange={handleSearch}
            hiddenLabel
            size="small"
            value={search}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </Stack>
        <Scrollbar style={{ maxHeight: 300, minWidth: 150 }}>
          {[...values]?.filter((item) => !!item?.option)?.sort((a, b) => a?.option?.localeCompare(b?.option))?.map((option, index) => (
            <RenderItem
              option={option}
              key={index}
              handleValueChange={handleValueChange}
              value={multiValue}
              nonValue={nonMultiValue}
              handleNonValueChange={handleNonValueChange}
              isExclude={true}
            />
          ))}
        </Scrollbar>
      </Menu>
    </>
  );
};
