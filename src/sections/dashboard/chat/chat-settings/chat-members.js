import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";

import { Iconify } from 'src/components/iconify';
import { useSettings } from "src/hooks/use-settings";
import { getAPIUrl } from "src/config";

export const ChatMembers = ({
  members: participants,
  handleOpenInviteDrawer = () => { },
  handleOpenAdminAccessDrawer = () => { },
  adminAccess,
  inviteAccess,
}) => {
  const settings = useSettings();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setMembers(participants);
  }, [participants]);

  const filteredMembers = useMemo(() => {
    if (!search) return members;
    return members?.filter(member => member?.full_name?.toLowerCase().includes(search.toLowerCase()));
  }, [search, members]);


  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 4 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Iconify icon="nimbus:user-group" />
          <Typography variant="h6">{members?.length ?? "0"} MEMBERS</Typography>
        </Stack>

        {inviteAccess ? (
          <IconButton onClick={handleOpenInviteDrawer}>
            <Iconify icon="lucide:user-plus" />
          </IconButton>
        ) : null}
      </Stack>

      <Box sx={{ flexGrow: 1, px: 4 }}>
        <OutlinedInput
          disableUnderline
          fullWidth
          startAdornment={
            <Iconify icon="iconamoon:search" sx={{ mr : 0.5}}/>
          }
          sx={{
            height: '45px',
          }}
          onChange={(event) => {
            setSearch(event?.target?.value);
          }}
          placeholder="Enter a keyword"
        />
      </Box>

      <Stack>
        {filteredMembers?.map((member) => (
          <Stack
            key={member?.id}
            onClick={() => adminAccess && handleOpenAdminAccessDrawer(member?.id)}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              py: 1,
              px: 4,
              "&:hover": {
                cursor: adminAccess ? "pointer" : "",
                backgroundColor:
                  settings?.paletteMode === "dark" ? "#232E3C" : "#ebebeb",
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                src={member?.avatar ? member?.avatar?.includes('http') ? member?.avatar : `${getAPIUrl()}/${member?.avatar}` : ""}
              />
              <Stack>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {member?.full_name}
                </Typography>
                <Typography variant="subtitle2" sx={{ opacity: "0.7" }}>
                  last seen 5 minutes ago
                </Typography>
              </Stack>
            </Stack>

            {member?.owner && (
              <Typography variant="subtitle1" sx={{ color: "#699df0" }}>
                owner
              </Typography>
            )}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
