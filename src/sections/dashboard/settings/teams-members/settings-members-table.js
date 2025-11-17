import { useMemo } from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { RouterLink } from "src/components/router-link";
import { Scrollbar } from "src/components/scrollbar";
import { TableSkeleton } from "src/components/table-skeleton";
import { getAPIUrl } from "src/config";
import { paths } from "src/paths";

export const SettingsMembersTable = ({
  count = 0,
  items,
  onPageChange = () => { },
  onRowsPerPageChange = () => { },
  rowsPerPageOptions = [],
  page = 0,
  rowsPerPage,
  noPagination = false,
  isLoading
}) => {

  const renderMemberCell = (account) => (
    <Stack alignItems="center" direction="row" spacing={2}>
      <Badge
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom'
        }}
        color={account?.on_duty ? "success" : 'warning'}
        variant="dot"
      >
        <Avatar
          src={account?.avatar ? account?.avatar?.includes('http') ? account?.avatar : `${getAPIUrl()}/${account?.avatar}` : ""}
          sx={{
            height: 42,
            width: 42,
          }}
        />
      </Badge>
      <Typography sx={{ fontSize: 14 }}>
        {account?.first_name ? (
          <Typography variant="subtitle2">{account?.first_name} {account?.last_name}</Typography>
        ) : (
          <Typography variant="subtitle2">{account?.email}</Typography>
        )}
      </Typography>
    </Stack>
  );

  const renderDesksCell = (account) => 
    account?.desk_names?.length > 2 
      ? account?.desk_names?.filter((d, idx) => idx !== 2)?.join(", ") + ` + ${account?.desk_names?.length - 2}` 
      : account?.desk_names?.join(", ");

  const columns = useMemo(() => [
    {
      id: "id",
      label: "ID",
      align: "left",
      render: (account) => account?.id
    },
    {
      id: "member",
      label: "Member",
      align: "left",
      render: renderMemberCell
    },
    {
      id: "email",
      label: "Email",
      align: "left",
      render: (account) => account?.email
    },
    {
      id: "desks",
      label: "Desks",
      align: "left",
      render: renderDesksCell
    },
    {
      id: "role",
      label: "Role",
      align: "left",
      render: (account) => account?.role_name ?? ""
    },
    {
      id: "access",
      label: "Access",
      align: "right",
      render: (account) => (
        <IconButton
          component={RouterLink}
          href={paths.dashboard.members.access.replace(
            ":memberId",
            account.id
          )}
          sx={{ '&:hover': { color: 'primary.main' } }}
        >
          <Iconify icon="mage:edit" />
        </IconButton>
      )
    }
  ], []);

  return (
    <Box sx={{ position: "relative" }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton
                rowCount={5}
                cellCount={columns.length}
                padding={"1px"}
              />
            ) : (
              items?.map((account) => (
                <TableRow hover key={account.id}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.render(account)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Scrollbar>
      {isLoading && <Divider/>}
      {!noPagination && (
        <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
          <PageNumberSelect 
            currentPage={page} 
            totalPage={count? Math.ceil(count/rowsPerPage) : 0}
            onUpdate={onPageChange}
          />
          <TablePagination
            component="div"
            labelRowsPerPage="Per page"
            count={count}
            onPageChange={(event, index)=> onPageChange(index)}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </Stack>
      )}
    </Box>
  );
};
