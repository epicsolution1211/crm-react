import Stack from "@mui/material/Stack";
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";

import { AvatarWithName } from '../common';

export const CreatorInfo = ({ todo }) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`${paths.dashboard.settings}/${todo?.creator?.id}/access`);
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center" onClick={handleNavigate} sx={{ cursor: 'pointer' }}>
      {todo?.creator && <AvatarWithName account={todo?.creator} />}
    </Stack>
  );
};
