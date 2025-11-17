import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { getAPIUrl } from "src/config";
import { generateAvatarColors } from 'src/utils/functions';

export const TodoAvatarGroup = ({ accounts }) => {
  return (
    <Stack
      alignItems="center"
      direction="row"
      flexWrap="wrap"
      gap={0.5}
    >
      {accounts?.map((account, index) => {
        const { bgcolor, color } = generateAvatarColors(account?.name);
        return (
          <Tooltip title={account?.name} key={index}>
            <Avatar src={account?.avatar ? `${getAPIUrl()}/${account?.avatar}` : ""} sx={{ width: 24, height: 24, fontSize: 12, bgcolor: bgcolor, color: color, flexShrink: 0 }}>
              {account?.name?.split(' ').slice(0,2).map(name => name?.charAt(0))?.join('')}
            </Avatar>
          </Tooltip>
        );
      })}
    </Stack>
  )
}

export const AvatarWithName = ({ account, hideName = false }) => {
  const { bgcolor, color } = generateAvatarColors(account?.name);
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Tooltip title={hideName ? account?.name : ''}>
        <Avatar src={account?.avatar ? `${getAPIUrl()}/${account?.avatar}` : ""} sx={{ width: 24, height: 24, fontSize: 12, bgcolor: bgcolor, color: color }}>
          {account?.name?.split(' ').slice(0,2).map(name => name?.charAt(0))?.join('')}
        </Avatar>
      </Tooltip>
      {!hideName && (
        <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
          {account?.name}
        </Typography>
      )}
    </Stack>
  );
};
