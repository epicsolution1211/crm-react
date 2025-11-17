const { TableRow, TableCell, Checkbox } = require("@mui/material");
const { memo } = require("react");

const _CustomerTableRow = ({
  isSelected,
  client,
  index,
  onSelectOne,
  onDeselectOne,
  tableColumn,
  customFilters,
  rule,
  exchange,
  customer,
  selectAll = false,
}) => {
  return (
    <TableRow hover selected={isSelected} key={`${client.id}-client=${index}`}>
      <TableCell padding="checkbox">
        <Checkbox
          sx={{ p: 0 }}
          checked={isSelected}
          disabled={selectAll}
          onChange={(event) => {
            if (event.target.checked) {
              onSelectOne(client.id);
            } else {
              onDeselectOne(client.id);
            }
          }}
          value={isSelected}
        />
      </TableCell>
      {}
      {tableColumn
        ?.filter((item) => item.enabled)
        ?.map((column, index) => (
          <TableCell
            key={`${client?.id + index}-row-${index}`}
            sx={{ 
              whiteSpace: "nowrap",
              ...((column.custom && column.editAccess) && {
                '&:hover': {
                  cursor: 'pointer',
                  transition: '0.4s',
                  '& .custom-field-edit': {
                    visibility: 'visible',
                  },
                }
              })
            }}
          >
            {column?.render
              ? column?.render(customer, customFilters, rule, exchange)
              : customer[column?.id]}
          </TableCell>
        ))}
    </TableRow>
  );
};

export const CustomerTableRow = memo(_CustomerTableRow);
