import PropTypes from 'prop-types';
import List from '@mui/material/List';

export const PropertyList = (props) => {
  const { children,  ...other } = props;

  return (
    <List disablePadding {...other}>
      {children}
    </List>
  );
};

PropertyList.propTypes = {
  children: PropTypes.node
};
