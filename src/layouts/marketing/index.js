import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import { Footer } from './footer';
import { TopNav } from './top-nav';

const LayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: '100%'
}));

export const Layout = (props) => {
  const { children } = props;

  return (
    <>
      <TopNav />
      <LayoutRoot>
        {children}
        <Footer />
      </LayoutRoot>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node
};
