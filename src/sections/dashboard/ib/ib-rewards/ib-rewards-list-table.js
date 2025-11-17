import { useState } from "react";
import { ibsApi } from "src/api/ibs";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { PageNumberSelect } from "src/components/pagination/page-selector";
import { Scrollbar } from "src/components/scrollbar";
import { TableNoData } from "src/components/table-empty";
import { TableSkeleton } from 'src/components/table-skeleton';
import { SeverityPill } from "src/components/severity-pill";
import { DeleteModal } from "src/components/customize/delete-modal";

import { IBRewardsEditModal } from "./ib-rewards-edit-modal";
import { paths } from "src/paths";

export const IbRewardsListTable = ({
  isLoading,
  tableData = [],
  brands,
  currentBrandId,
  currentBrandInfo,
  setCurrentBrandId,
  handleGetIbRewards,
}) => {
  const navigate = useNavigate();

  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const [selectedReward, setSelectedReward] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);  
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteReward = async () => {
    setIsDeleting(true);
    try {
      await ibsApi.deleteIbReward(selectedReward?.id);
      handleGetIbRewards();
      setOpenDeleteModal(false);
      toast.success("Reward deleted successfully");
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  }

  const defaultColumn = [
    {
      id: "id", 
      label: "ID",
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Typography 
            onClick={() => navigate(`${paths.dashboard.ib.ibRewards.index}/${row?.id}`, {
              state: {
                id: row?.id,
                name: row?.name,
                brand: currentBrandInfo,
              }
            })}
            sx={{
              alignItems: "center", 
              display: "inline-flex",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline"
              }
            }}
          >
            {row?.id}
          </Typography>
        </Stack>
      ),
    },
    {
      id: "name", 
      label: "Name",
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Typography 
            onClick={() => navigate(`${paths.dashboard.ib.ibRewards.index}/${row?.id}`, {
              state: {
                id: row?.id,
                name: row?.name,
                brand: currentBrandInfo,
              }
            })}
            sx={{
              alignItems: "center", 
              display: "inline-flex",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline"
              }
            }}
          >
            {row?.name}
          </Typography>
        </Stack>
      ),
    },
    {
      id: "description",
      label: "Description",
    },
    {
      id: "enabled",
      label: "Status",
      render: (row) => (
        row?.enabled ? <SeverityPill color="success">Enabled</SeverityPill> : <SeverityPill color="error">Disabled</SeverityPill>
      ),
    },
    {
      id: "default",
      label: "Default",
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          {row?.default ? <Iconify icon="gg:check-o" width={20} color="success.main"/> : <Iconify icon="fe:disabled" width={20} color="warning.main"/>}
        </Stack>
      ),
    },
    {
      id: "auto_transaction",
      label: "Auto Transaction Approval",
      render: (row) => (
        <Stack direction="row" gap={1} alignItems="center">
          {row?.auto_transaction ? <Iconify icon="gg:check-o" width={20} color="success.main"/> : <Iconify icon="fe:disabled" width={20} color="warning.main"/>}
        </Stack>
      ),
    },
    {
      id: "start_date",
      label: "Start Date",
    },
    {
      id: "end_date", 
      label: "End Date",
    },
    {
      id: "action",
      label: "Actions",
      enabled: true,
      render: (reward) =>
        <Stack direction='row' gap={1}>
          <Tooltip title="Update">
            <IconButton
              size="small"
              sx={{
                '&:hover': {
                  color: 'primary.dark'
                },
                color: 'primary.main'
              }}
              onClick={() => {
                setOpenEditModal(true);
                setSelectedReward(reward);
              }}
            >
              <Iconify icon="mage:edit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              sx={{
                '&:hover': {
                  color: 'error.dark'
                },
                color: 'error.main'
              }}
              onClick={() => {
                setOpenDeleteModal(true);
                setSelectedReward(reward);
              }}
            >
              <Iconify icon="heroicons:trash" />
            </IconButton>
          </Tooltip>
        </Stack>
    },
  ];

  return (
    <>
      <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} pl={1}>
          <Typography>Internal Brand :</Typography>
            <Select
              fullWidth
              size="small"
              value={currentBrandId ?? ""}
              onChange={(event) => setCurrentBrandId(event?.target?.value)}
              sx={{ width: 200 }}
            >
              {brands?.map((item) => (
                <MenuItem
                  key={item?.id}
                  value={item?.id}
                >
                  {item?.company_name ?? ""}
                </MenuItem>
              ))}
          </Select>
        </Stack>
        {isLoading && (
          <Iconify
            icon='svg-spinners:8-dots-rotate'
            width={24}
            sx={{ color: 'white' }}
          />
        )}
        <Tooltip title="Reload Table">
          <IconButton
            onClick={handleGetIbRewards}
            sx={{ '&:hover': { color: 'primary.main', transform: 'rotate(180deg)', }, transition: 'transform 0.3s' }}
          >
            <Iconify icon="ion:reload-sharp" width={24}/>
          </IconButton>
        </Tooltip>
      </Stack>
      <Divider />
      <Box sx={{ position: "relative" }}>
        <Scrollbar>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                {defaultColumn?.map((item) => (
                    <TableCell sx={{ whiteSpace: "nowrap" }} key={item.id}>
                      {item?.label}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(isLoading && !tableData?.length > 0) ? (
                <TableSkeleton rowCount={perPage > 15 ? 15 : 10} cellCount={defaultColumn?.length} />
              ) : (
                tableData?.slice(currentPage * perPage, (currentPage + 1) * perPage)?.map((reward, index) => (
                  <TableRow hover key={index}>
                    {defaultColumn
                      ?.map((column, index) => (
                        <TableCell key={reward?.id + index}>
                          {column?.render
                            ? column?.render(reward)
                            : reward[column?.id]}
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Scrollbar>
        {tableData?.length === 0 && !isLoading && <TableNoData />}
        <Divider />
        <Stack sx={{  flexDirection: { md: 'row', xs: 'column' }, gap: 0, justifyContent: 'flex-end', alignItems: { md: 'center', xs: 'start' } }}>
          <PageNumberSelect 
            currentPage={currentPage} 
            totalPage={tableData?.length ? Math.ceil(tableData?.length/perPage) : 0}
            onUpdate={setCurrentPage}
          />
          <TablePagination
            component="div"
            labelRowsPerPage="Per page"
            count={tableData?.length ?? 0}
            onPageChange={(event, index) => setCurrentPage(index)}
            onRowsPerPageChange={(event) => setPerPage(event?.target?.value)}
            page={currentPage}
            rowsPerPage={perPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
          />
        </Stack>
      </Box>

      <IBRewardsEditModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        reward={selectedReward}
        handleGetIbRewards={handleGetIbRewards}
      />

      <DeleteModal
        isOpen={openDeleteModal}
        setIsOpen={() => setOpenDeleteModal(false)}
        onDelete={() => handleDeleteReward()}
        isLoading={isDeleting}
        title={'Delete Reward'}
        description={'Are you sure you want to delete this Reward?'}
      />
    </>
  );
};
