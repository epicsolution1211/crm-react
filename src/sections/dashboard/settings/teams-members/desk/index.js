import { useState, useCallback, useMemo } from "react";
import useSWR from "swr";

import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { AddDeskModal } from "./add-desk-modal";
import { DeskTable } from "./desk-table";
import { fetcher } from "src/utils/request";

export const useGetDesks = (params) => {
  const URL = params ? ['/client/desks', { params }] : '/client/desks';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      desks: data?.desks?.length > 0 ? data?.desks : [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.desks?.length,
      mutate,
    }),
    [error, isLoading, isValidating, data]
  );

  return memoizedValue;
}

export const useGetMembers = (params) => {
  const URL = params ? ['/account/info', { params }] : '/account/info';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, 
    { 
      revalidateOnFocus: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      members: data?.accounts?.length > 0 ? data?.accounts : [],
      isLoading: isLoading,
      error: error,
      isValidating: isValidating,
      empty: !isLoading && !data?.desks?.length,
      mutate,
    }),
    [error, isLoading, isValidating, data]
  );

  return memoizedValue;
}

export const SettingsDesk = () => {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const { desks, mutate: mutateDesks, isLoading: isLoadingDesks } = useGetDesks();
  const { members, mutate: mutateMembers, isLoading: isLoadingMembers } = useGetMembers();

  const handleDeskSearch = useCallback(
    (e) => {
      setSearch(e.target.value);
    },
    [setSearch]
  );

  const desksWithMembers = useMemo(() => {
    if (!desks || !members) return [];
    
    return desks.map(desk => ({
      ...desk,
      members: members.filter(member => member.desk_ids?.includes(desk.id))
    }));
  }, [desks, members]);

  const filteredDesks = useMemo(() => {
    if (!search) return desksWithMembers;
    
    const searchLower = search.toLowerCase();
    return desksWithMembers.filter(desk => {
      const nameMatch = desk.name?.toLowerCase().includes(searchLower);
      const idMatch = desk.id?.toString().includes(searchLower);
      const memberMatch = desk.members?.some(member => 
        `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchLower)
      );
      return nameMatch || idMatch || memberMatch;
    });
  }, [desksWithMembers, search]);

  return (
    <Stack flexDirection='column' sx={{ px: { xs: 0, md: 2 }, py: 2, gap: { xs: 2, md: 4 } }}>
      <Typography variant="h5">Desk</Typography>
      <Stack spacing={2}>
        <Stack
          sx={{
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: { xs: 'center', md: 'space-between' },
            gap: { xs: 2, md: 3 },
          }}
        >
          <Stack direction="row" alignItems="center" gap={2}>
            <Iconify icon="material-symbols:info-outline" size={13} sx={{ flexShrink: 0, display: { xs: 'none', md: 'block' } }}/>
            <Stack>
              <Typography
                mb={1}
                sx={{ fontSize: { xs: 12, md: 14 } }}
              >
                Desk members have restricted access to clients within the desk. Members can only see and manage the clients specifically assigned to them, except in the following cases:
              </Typography>
              <Typography sx={{ fontSize: { xs: 12, md: 14 } }}>
                1. <strong>Can view all clients:</strong> This permission grants access to all clients in the CRM, regardless of desk assignments.
              </Typography>
              <Typography sx={{ fontSize: { xs: 12, md: 14 } }}>
                2. <strong>Can see all clients of assigned desk:</strong> This permission allows members to access all clients within their assigned desk, not just the ones individually assigned to them.
              </Typography>
            </Stack>
          </Stack>
          <Stack
            alignItems="center"
            justifyContent="flex-end"
            direction="row"
            spacing={2}
          >
            <Button
              startIcon={
                <Iconify icon="lucide:plus" width={22} />
              }
              sx={{ whiteSpace : 'nowrap' }}
              variant="contained"
              onClick={() => setAddOpen(true)}
            >
              Add Desk
            </Button>
          </Stack>
        </Stack>
        <TextField
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="lucide:search" width={24} />
              </InputAdornment>
            ),
          }}
          hiddenLabel
          onChange={handleDeskSearch}
          placeholder="Search desks..."
          value={search}
        />
        <DeskTable
          desks={filteredDesks}
          members={members}
          count={10}
          page={1}
          isLoading={isLoadingDesks || isLoadingMembers}
          rowsPerPage={1000}
          onGetDesks={mutateDesks}
          onGetDeskMember={mutateMembers}
        />
      </Stack>

      <AddDeskModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onGetDesks={mutateDesks}
      />
    </Stack>
  );
};
