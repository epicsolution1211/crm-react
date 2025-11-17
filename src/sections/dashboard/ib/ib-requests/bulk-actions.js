// React imports
import { memo, useCallback, useState } from "react";

// Redux imports
import { useSelector } from "react-redux";

// MUI core imports
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

// Component imports
import { Iconify } from 'src/components/iconify';
import { DeleteModal } from "src/components/customize/delete-modal";
import { MultiSelect } from "src/components/multi-select";
import { ConfirmationDialog } from "src/components/confirmation-dialog";

// Dialog imports
import { AnnouncementDialog } from "src/sections/dashboard/customer/customer-list-table/widget/announcement-dialog";
import { BulkUpdateFields } from "src/sections/dashboard/customer/bulk-update-fields";
import { CustomerAssignAgentTeamDialog } from "src/sections/dashboard/customer/customer-assign-agent-team-dialog";
import { CustomerAssignFormDialog } from "src/sections/dashboard/customer/customer-assign-form-dialog";

// Hook imports
import { useAuth } from "src/hooks/use-auth";
import { useGetCustomerLabels } from "src/api-swr/customer";

// API imports
import { announcementsApi } from 'src/api/announcements';

// Utility imports
import toast from "react-hot-toast";

const _CustomerBulkActions = ({
  count = 0,
  handleLabelsDialogOpen,
  handleSelectedLabelsChange,
  onDeselectAll,
  onGetData,
  onSelectAll,
  customFilters,
  selectAll,
  selected = [],
  selectedLabels,
  onPinnedFieldsSet = () => { },
  pinnedFields = [],
  onDeleteCustomers = () => { },
  columnSettings,
  isBulkDeleteLoading,
  isSelectAllLoading,
  deselected = [],
  query,
  perPage = null,
  setPerPage = () => {},
}) => {
  const { user } = useAuth();
  const { labelList } = useGetCustomerLabels();
  const filters = useSelector((state) => state.customers.customerFilters);


  const [assignFormOpen, setAssignFormOpen] = useState(false);
  const [updateFieldsOpen, setUpdateFieldsOpen] = useState(false);
  const [customerToEditFields, setCustomerToEditFields] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [assignAnnouncementOpen, setAssignAnnouncementOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [labelsConfirmationOpen, setLabelsConfirmationOpen] = useState(false);
  const [pendingLabels, setPendingLabels] = useState(null);

  const [assignTeamAndAgentOpen, setAssignTeamAndAgentOpen] = useState(false);

  const handleSelectedLabelsUpdate = useCallback(
    (labels) => {
      setPendingLabels(labels);
      setLabelsConfirmationOpen(true);
    },
    []
  );

  const handleLabelsConfirmation = useCallback(() => {
    if (pendingLabels) {
      handleSelectedLabelsChange(pendingLabels, filters, selected, selectAll);
    }
    setLabelsConfirmationOpen(false);
    setPendingLabels(null);
  }, [pendingLabels, handleSelectedLabelsChange, filters, selected, selectAll]);

  const handleLabelsConfirmationClose = useCallback(() => {
    setLabelsConfirmationOpen(false);
    setPendingLabels(null);
  }, []);

  const handleAssignAnnouncement = async (announcementId) => {
    try {
      const request = {
        announcement_id: announcementId,
        client_ids: selected,
      };

      const params = {
        ...filters,
      };

      if (selectAll) {
        params["select_all"] = true;
      } else {
        params["client_ids"] = selected;
      }

      delete params?.non_ids;
      delete params?.ids;
      delete params?.perPage;
      delete params?.currentPage;
      
      const customFiltersData = customFilters
          ?.filter(
            (filter) =>
              filter?.filter &&
              (
                (filter?.filter?.field_type === "text" && filter?.filter?.query) ||
                (filter?.filter?.field_type === "multi_choice_radio" && (filter?.filter?.non_query?.length > 0 || filter?.filter?.query?.length > 0)) ||
                (filter?.filter?.field_type === "multi_choice" && (filter?.filter?.non_query?.length > 0 || filter?.filter?.query?.length > 0)) ||
                (filter?.filter?.field_type === "boolean" && filter?.filter?.query) ||
                (filter?.filter?.field_type === "number" && (filter?.filter?.query?.gt || filter?.filter?.query?.lt))
          )
        )
        ?.map((filter) => filter?.filter);
      params["custom_field"] = customFiltersData;

      await announcementsApi.assignAnnouncement(params, request);
      setAssignAnnouncementOpen(false);
      toast.success('Announcement assigned successfully');
    } catch (error) {
      console.error('Error assigning announcement:', error);
      toast.error('Error assigning announcement');
    }
  };

  const handleAnnouncementDialogOpen = async () => {
    try {
      const response = await announcementsApi.getAnnouncements();
      setAnnouncements(response?.announcements || []);
      setAssignAnnouncementOpen(true);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      // Optionally show error message
    }
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: "center",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "neutral.800" : "neutral.50",
        display: selected.length > 0 ? "flex" : "none",
        top: 0,
        left: 0,
        width: "100%",
        px: 2,
        py: 1.5,
        zIndex: 50,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <MultiSelect
          withSearch
          withEdit
          noPadding
          withIcon
          editLabel="Edit customer labels"
          labelIcon={
            <Tooltip title="Assign label">
              <Iconify
                icon="mynaui:label"
                sx={{
                  color: "text.disabled",
                  '&:hover': { color: 'primary.main' }
                }}
                width={24}
              />
            </Tooltip>
          }
          options={labelList?.filter((item) => item?.value !== "_empty")}
          onChange={handleSelectedLabelsUpdate}
          onEditClick={handleLabelsDialogOpen}
          value={selectedLabels}
        />

        {(user?.acc?.acc_e_client_team === undefined ||
          user?.acc?.acc_e_client_team) ||
          (user?.acc?.acc_e_client_assign_desks_agents === undefined ||
          user?.acc?.acc_e_client_assign_desks_agents) ||
          (user?.acc?.acc_e_client_assign_multi_desks === undefined ||
          user?.acc?.acc_e_client_assign_multi_desks) ? (
          <Tooltip title="Assign Teams & Agents">
            <IconButton onClick={() => setAssignTeamAndAgentOpen(true)}>
              <Iconify
                icon="tabler:users-plus"
                sx={{
                  color: "text.disabled",
                  '&:hover': { color: 'primary.main' }
                }}
                width={24}
              />
            </IconButton>
          </Tooltip>
        ) : null}

        {user?.acc?.acc_e_client_bulk_delete === true ? (
          <Tooltip title="Bulk delete customers">
            <IconButton onClick={() => setBulkDeleteOpen(true)}>
              <Iconify
                icon="heroicons:trash"
                sx={{
                  color: "text.disabled",
                  '&:hover': { color: 'error.main' }
                }}
                width={24}
              />
            </IconButton>
          </Tooltip>
        ) : null}
        {user?.acc?.acc_e_client_bulk_data == undefined ||
          user?.acc?.acc_e_client_bulk_data ? (
          <Tooltip title="Update custom fields">
            <IconButton onClick={() => setUpdateFieldsOpen(true)}>
              <Iconify
                icon="carbon:gui-management"
                width={24}
                sx={{
                  color: "text.disabled",
                  '&:hover': { color: 'primary.main' }
                }}
              />
            </IconButton>
          </Tooltip>
        ) : null}
        <Tooltip title="Assign form">
          <IconButton onClick={() => setAssignFormOpen(true)}>
            <Iconify
              icon="clarity:form-line"
              width={24}
              sx={{
                color: "text.disabled",
                '&:hover': { color: 'primary.main' }
              }}
            />
          </IconButton>
        </Tooltip>
        {user?.acc?.acc_e_setting_announcements === undefined ||
          user?.acc?.acc_e_setting_announcements ? (
          <Tooltip title="Assign announcement">
            <IconButton onClick={handleAnnouncementDialogOpen}>
              <Iconify
              icon="mdi:announcement"
              sx={{
                color: "text.disabled",
                '&:hover': { color: 'primary.main' }
              }}
              width={24}
            />
            </IconButton>
          </Tooltip>
        ) : null}
      </Stack>
      {selectAll ? (
        <Typography>
          Selected all <strong>{count}</strong> customers
        </Typography>
      ) : (
        <Typography>
          Selected <strong>{selected?.length}</strong> of{" "}
          <strong>{count}</strong>
        </Typography>
      )}
      {selectAll ? (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Select first:
          </Typography>
          <OutlinedInput
            type="number"
            placeholder="All"
            value={perPage || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || value === "0") {
                setPerPage(null);
              } else {
                const numValue = parseInt(value);
                if (numValue > 5000) {
                  setPerPage(5000);
                } else if (numValue > 0) {
                  setPerPage(numValue);
                } else {
                  setPerPage(null);
                }
              }
            }}
            inputProps={{
              min: 1,
              max: Math.min(count, 5000),
              style: { width: '60px', textAlign: 'center' }
            }}
            sx={{ 
              width: '80px',
              height: '32px',
              '& input': {
                padding: '6px 8px',
                fontSize: '14px',
              },
            }}
          />
          <Typography variant="body2" color="text.secondary">
            of {count} items
          </Typography>
        </Stack>
      ) : isSelectAllLoading ? (
        <Button disabled sx={{ width: 120 }}>
          <CircularProgress size={20} />

        </Button>
      ) : (
        <Button onClick={onSelectAll}>
          <Typography>Select All</Typography>
        </Button>
      )}
      {!isSelectAllLoading && 
      <Button onClick={() => onDeselectAll()}>
        <Typography sx={{ whiteSpace: "nowrap" }}>Clear Selection</Typography>
      </Button>}

      <CustomerAssignAgentTeamDialog
        open={assignTeamAndAgentOpen}
        onClose={() => setAssignTeamAndAgentOpen(false)}
        filters={filters}
        customFilters={customFilters}
        selectAll={selectAll}
        selected={selected}
        deselected={deselected}
        onGetData={onGetData}
        onBulkFieldsOpen={() => {
          setUpdateFieldsOpen(true);
          setCustomerToEditFields(selected?.[0]);
        }}
        pinedFields={pinnedFields}
        setPinedFields={onPinnedFieldsSet}
        query={query}
        perPage={perPage}
        onDeselectAll={onDeselectAll}
      />

      <CustomerAssignFormDialog 
        open={assignFormOpen}
        onClose={() => {
          setAssignFormOpen(false);
        }}
        filters={filters}
        customFilters={customFilters}
        selectAll={selectAll}
        selected={selected}
        onDeselectAll={onDeselectAll}
        query={query}
        perPage={perPage}
      />

      <BulkUpdateFields
        open={updateFieldsOpen}
        onClose={() => {
          setUpdateFieldsOpen(false);
          setCustomerToEditFields(null);
        }}
        filters={filters}
        customFilters={customFilters}
        selectAll={selectAll}
        selected={selected}
        deselected={deselected}
        onGetData={onGetData}
        customerId={customerToEditFields}
        pinedFields={pinnedFields}
        setPinedFields={onPinnedFieldsSet}
        columnSettings={columnSettings}
        query={query}
        perPage={perPage}
      />

      <DeleteModal
        isOpen={bulkDeleteOpen}
        setIsOpen={() => setBulkDeleteOpen(false)}
        onDelete={async () => {
          await onDeleteCustomers();
          onDeselectAll();
          setBulkDeleteOpen(false);
        }}
        isLoading={isBulkDeleteLoading}
        title={"Delete Customers"}
        description={"Are you sure you want to delete these customers?"}
      />

      <AnnouncementDialog
        open={assignAnnouncementOpen}
        onClose={() => setAssignAnnouncementOpen(false)}
        announcements={announcements}
        onAssign={handleAssignAnnouncement}
      />

      <ConfirmationDialog
        open={labelsConfirmationOpen}
        onClose={handleLabelsConfirmationClose}
        onConfirm={handleLabelsConfirmation}
        title="Update Customer Labels"
        subtitle={`Are you sure you want to update labels for ${perPage && perPage > 0 ? perPage : selectAll ? count : selected.length} customer${perPage && perPage > 0 ? 's' : selectAll || selected.length > 1 ? 's' : ''}?`}
        confirmTitle="Update Labels"
      />
    </Stack>
  );
};

export default memo(_CustomerBulkActions);
