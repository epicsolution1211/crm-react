import { memo } from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { useAuth } from "src/hooks/use-auth";
import { userApi } from "src/api/user";

export const _CustomerTableHeaderColumn = ({
  onSortingSet = () => { },
  sortingState = {},
  columnSettings,
  rule,
  sort,
  item,
}) => {

  const { refreshUser } = useAuth();

  const accountId = localStorage.getItem("account_id");

  const handleSortingChange = async (field, direction, custom = false) => {
    if (columnSettings) {
      const directions = {
        true: false,
        false: undefined,
        undefined: true,
      };
      const newSorting = {
        ...sortingState,
        [custom ? "c_" + field : field]: directions[direction],
      };
      onSortingSet(newSorting);
      const updateSetting = {
        ...columnSettings,
        iBRequestTable: rule,
        iBRequestsSorting: newSorting,
      };
      await userApi.updateUser(accountId, {
        column_setting: JSON.stringify(updateSetting),
      });
      await refreshUser();
    }
  };

  return (
    <TableCell sx={{ width: item?.width }}>
      {item?.headerRender ? (
        <Stack
          sx={{ width: item?.width }}
          direction="row"
          alignItems="center"
          spacing={1}
        >
          {item?.sortingDisabled ? null : (
            <>
              {item?.hasSort !== false ? (
                sort === true ? (
                  <Tooltip title="Sorted by ascend">
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleSortingChange(
                          item?.label,
                          sort,
                          item?.custom
                        )
                      }
                    >
                      <Iconify icon="fa6-solid:sort-up" color="primary.main" />
                    </IconButton>
                  </Tooltip>
                ) : sort === false ? (
                  <Tooltip title="Sorted by descend">
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleSortingChange(
                          item?.label,
                          sort,
                          item?.custom
                        )
                      }
                    >
                      <Iconify icon="fa6-solid:sort-down" color="primary.main" />
                    </IconButton>
                  </Tooltip>
                ) : sort === undefined ? (
                  <Tooltip title="Disabled">
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleSortingChange(
                          item?.label,
                          sort,
                          item?.custom
                        )
                      }
                      sx={{ opacity: ".5" }}
                    >
                      <Iconify icon="bxs:sort-alt" />
                    </IconButton>
                  </Tooltip>
                ) : null
              ) : null}
            </>
          )}
          {item.headerRender()}
        </Stack>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ width: item?.width }}
        >
          {item?.hasSort !== false ? (
            sort === true ? (
              <Tooltip title="Sorted by ascend">
                <IconButton
                  onClick={() =>
                    handleSortingChange(
                      item?.label,
                      sort,
                      item?.custom
                    )
                  }
                >
                  <Iconify icon="fa6-solid:sort-up" color="primary.main" />
                </IconButton>
              </Tooltip>
            ) : sort === false ? (
              <Tooltip title="Sorted by descend">
                <IconButton
                  onClick={() =>
                    handleSortingChange(
                      item?.label,
                      sort,
                      item?.custom
                    )
                  }
                >
                  <Iconify icon="fa6-solid:sort-down" color="primary.main" />
                </IconButton>
              </Tooltip>
            ) : sort === undefined ? (
              <Tooltip title="Disabled">
                <IconButton
                  size="small"
                  onClick={() =>
                    handleSortingChange(
                      item?.label,
                      sort,
                      item?.custom
                    )
                  }
                  sx={{ opacity: ".5" }}
                >
                  <Iconify icon="bxs:sort-alt" />
                </IconButton>
              </Tooltip>
            ) : null
          ) : null}
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: "600",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </Typography>
        </Stack>
      )}
    </TableCell>
  );
};

export const CustomerTableHeaderColumn = memo(_CustomerTableHeaderColumn);
