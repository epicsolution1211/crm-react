import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";

import { Iconify } from 'src/components/iconify';
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { Scrollbar } from "src/components/scrollbar";
import { getAPIUrl } from "src/config";
import { useAuth } from "src/hooks/use-auth";
import { TableSkeleton } from "src/components/table-skeleton";

export const SettingsSkillTeamTable = ({
  items = [],
  isLoading,
  openDrawer,
  openRemoveSkillTeams,
  openEditSkillTeam,
}) => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(5);

  return (
    <Box sx={{ position: "relative" }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Team Name</TableCell>
              <TableCell>Members</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? 
              <TableSkeleton
                rowCount={5}
                cellCount={4}
                padding={"1px"}
              /> :
              items?.slice(currentPage * perPage, (currentPage * perPage) + perPage)?.map((item) => {
              return (
                <TableRow hover key={item?.team?.id}>
                  <TableCell>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      {item?.team?.id}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      {item?.team?.name}
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ flexDirection: "row", display: "flex" }}>
                    {!!item?.team?.accounts && (
                      <AvatarGroup max={3}>
                        {item.team.accounts.map((acc) => (
                          <Tooltip title={acc.first_name + " " + acc.last_name} key={acc.id}>
                            <Avatar
                              src={acc.avatar ? acc.avatar?.includes('http') ? acc.avatar : `${getAPIUrl()}/${acc.avatar}` : ""}
                            />
                          </Tooltip>
                        ))}
                      </AvatarGroup>
                    )}
                    <IconButton onClick={() => openDrawer(item?.team?.id)}>
                      <Iconify icon="si:add-fill" width={24} />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => openEditSkillTeam(item?.team?.id)}
                      sx={{ '&:hover': { color: 'primary.main' } }}
                    >
                      <Iconify icon="mage:edit" />
                    </IconButton>
                    {user?.acc?.acc_e_delete_team === undefined ||
                      user?.acc?.acc_e_delete_team ? (
                      <IconButton
                        onClick={() => openRemoveSkillTeams(item?.team?.id)}
                        sx={{ '&:hover': { color: 'error.main' } }}
                      >
                        <Iconify icon="heroicons:trash" />
                      </IconButton>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <Divider />
      <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
        <PageNumberSelect
          currentPage={currentPage}
          totalPage={items?.length ? Math.ceil(items?.length / perPage) : 0}
          onUpdate={setCurrentPage}
        />
        <TablePagination
          component="div"
          labelRowsPerPage="Per page"
          count={items?.length ?? 0}
          page={currentPage ?? 0}
          rowsPerPage={perPage ?? 10}
          onPageChange={(event, index) => setCurrentPage(index)}
          onRowsPerPageChange={(event) =>
            setPerPage(event?.target?.value)
          }
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Stack>
    </Box>
  );
};

