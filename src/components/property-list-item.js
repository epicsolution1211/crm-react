import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { RouterLink } from './router-link';

export const PropertyListItem = (props) => {
  const { align = 'vertical', children, disableGutters, value, label, link, ...other } = props;

  return (
    <ListItem
      sx={{
        px: disableGutters ? 0 : 3,
        py: 1.5
      }}
      {...other}>
      <ListItemText
        disableTypography
        primary={(
          <Typography
            sx={{ minWidth: align === 'vertical' ? 'inherit' : 180 }}
            variant="subtitle2"
          >
            {label}
          </Typography>
        )}
        secondary={(
          <Box
            sx={{
              flex: 1,
              mt: align === 'vertical' ? 0.5 : 0
            }}
          >
            {children ? children : link ? (
              <Link
                color="text.secondary"
                variant="body2"
                component={RouterLink}
                href={link}
                sx={{
                  alignItems: "center",
                  display: "inline-flex",
                }}
                underline="hover"
              >
                {value}
              </Link>
            ) : (
              <Typography
                color="text.secondary"
                variant="body2"
              >
                {value}
              </Typography>
            )}
          </Box>
        )}
        sx={{
          display: 'flex',
          flexDirection: align === 'vertical' ? 'column' : 'row',
          my: 0
        }}
      />
    </ListItem>
  );
};

PropertyListItem.propTypes = {
  align: PropTypes.oneOf(['horizontal', 'vertical']),
  children: PropTypes.node,
  disableGutters: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.string
};
