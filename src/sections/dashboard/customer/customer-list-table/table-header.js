import { memo } from "react";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { CustomerTableHeaderColumn } from "./table-header-column";

export const _CustomerTableHeader = ({
  isLoading,
  selectedSome,
  onDeselectPage,
  onSelectPage,
  selected,
  onSortingSet = () => { },
  sortingState = {},
  columnSettings,
  tableIds,
  tableColumn,
  rule,
}) => {

  const selectedPage = tableIds?.every((item) => selected?.includes(item));
  return (
    <>
      <TableHead sx={{ position: "sticky", top: 0 }}>
        {
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                sx={{ p: 0 }}
                checked={selectedPage && !isLoading}
                indeterminate={selectedSome}
                onChange={(event) => {
                  if (event.target.checked) {
                    if (selectedSome) {
                      onDeselectPage(tableIds);
                    } else {
                      onSelectPage(tableIds);
                    }
                  } else {
                    onDeselectPage(tableIds);
                  }
                }}
              />
            </TableCell>
            {tableColumn
              ?.filter((item) => item.enabled)
              ?.map((item, index) => {
                const sort = sortingState?.[item?.custom ? "c_" + item?.label : item?.label];
                return (
                  <CustomerTableHeaderColumn
                    key={index}
                    sort={sort}
                    item={item}
                    rule={rule}
                    onSortingSet={onSortingSet}
                    columnSettings={columnSettings}
                  />
                );
              })}
          </TableRow>
        }
      </TableHead>
    </>
  );
};

export const CustomerTableHeader = memo(_CustomerTableHeader);
