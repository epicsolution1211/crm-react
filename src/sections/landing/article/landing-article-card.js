import { format } from 'date-fns';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/components/router-link';
import { getInitials } from 'src/utils/get-initials';

export const LandingPostCard = (props) => {
  const {
    authorAvatar,
    authorName,
    category,
    cover,
    publishedAt,
    readTime,
    shortDescription,
    title,
    ...other
  } = props;

  const formattedPublishedAt = format(publishedAt, 'MMM d, yyyy');

  return (
    <Card {...other}>
      <CardMedia
        component={RouterLink}
        href="#"
        image={cover}
        sx={{ height: 280 }}
      />
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Chip label={category} />
        </Box>
        <Link
          color="text.primary"
          component={RouterLink}
          href="#"
          variant="h5"
        >
          {title}
        </Link>
        <Typography
          color="text.secondary"
          sx={{
            height: 48,
            mt: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2
          }}
          variant="body1"
        >
          {shortDescription}
        </Typography>
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Avatar src={authorAvatar}>
              {getInitials(authorName)}
            </Avatar>
            <Typography variant="subtitle2">
              By
              {' '}
              {authorName}
              {' '}
              •
              {' '}
              {formattedPublishedAt}
            </Typography>
          </Stack>
          <Typography
            align="right"
            color="text.secondary"
            sx={{ flexGrow: 1 }}
            variant="body2"
          >
            {readTime} read
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

