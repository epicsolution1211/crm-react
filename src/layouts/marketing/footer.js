import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Logo } from 'src/components/logos/logo';
import { RouterLink } from 'src/components/router-link';
import { getAPIUrl } from 'src/config';
import { paths } from 'src/paths';
import { useSettings } from "src/hooks/use-settings";

const sections = [
  {
    title: 'Menu',
    items: [
      {
        title: 'Home',
        internal: true,
        path: '/',
        id: 'home'
      },
      {
        title: 'FAQ',
        internal: true,
        path: '/',
        id: 'faq'
      }
    ]
  },
  {
    title: 'Legal',
    items: [
      {
        title: 'Terms & Conditions',
        path: '/terms'
      },
      {
        title: 'Contact',
        path: '/contact'
      }
    ]
  },
  {
    title: 'Social',
    items: [
      {
        title: 'Twitter',
        path: 'https://twitter.com/OctolitCRM',
        external: true,
      },
      {
        title: 'LinkedIn',
        path: 'https://www.linkedin.com/company/loriamdev',
        external: true,
      }
    ]
  }
];

export const Footer = (props) => {
  const avatar = useSelector(state => state.companies.avatar);
  const settings = useSettings();
  const navigate = useNavigate();

  const handleNavigate = (id, path) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(path, { state: id });
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.mode === 'dark'
          ? 'neutral.800'
          : 'neutral.50',
        borderTopColor: 'divider',
        borderTopStyle: 'solid',
        borderTopWidth: 1,
        pb: 6,
        pt: {
          md: 15,
          xs: 6
        }
      }}
      {...props}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            sm={4}
            md={3}
            sx={{
              order: {
                xs: 4,
                md: 1
              }
            }}
          >
            <Stack spacing={1}>
              <Stack
                alignItems="center"
                component={RouterLink}
                direction="row"
                display="inline-flex"
                href={paths.index}
                spacing={1}
                sx={{ textDecoration: 'none' }}
              >
                {avatar ?
                  <img
                    src={avatar ? `${getAPIUrl()}/${avatar}` : ""}
                    alt="Company logo"
                    loading="lazy"
                    style={{ height: 24, width: 24, objectFit: "fill", backgroundColor: "9BA4B5" }}
                  />
                  :
                    <Logo color={settings?.colorPreset} />
                }
                <Box
                  sx={{
                    color: 'text.primary',
                    fontFamily: '\'Plus Jakarta Sans\', sans-serif',
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: '0.3px',
                    lineHeight: 2.5,
                    '& span': {
                      color: 'primary.main'
                    }
                  }}
                >
                  Octolit
                </Box>
              </Stack>
              <Typography
                color="text.secondary"
                variant="caption"
              >
                © 2023 Octolit
              </Typography>
            </Stack>
          </Grid>
          {sections.map((section, index) => (
            <Grid
              key={section.title}
              xs={12}
              sm={4}
              md={3}
              sx={{
                order: {
                  md: index + 2,
                  xs: index + 1
                }
              }}
            >
              <Typography
                color="text.secondary"
                variant="overline"
              >
                {section.title}
              </Typography>
              <Stack
                component="ul"
                spacing={1}
                sx={{
                  listStyle: 'none',
                  m: 0,
                  p: 0
                }}
              >
                {section.items.map((item) => {
                  const linkProps = item.path
                    ? item.external
                      ? {
                        component: 'a',
                        href: item.path,
                        target: '_blank'
                      }
                      : item.internal ? {
                        component: 'button',
                        href: item.path
                      } : {
                        component: RouterLink,
                        href: item.path
                      }
                    : {};
                  return (
                    <Stack
                      alignItems="center"
                      direction="row"
                      key={item.title}
                      spacing={2}
                    >
                      <Box
                        sx={{
                          backgroundColor: 'primary.main',
                          height: 2,
                          width: 12
                        }} />
                      <Link
                        color="text.primary"
                        variant="subtitle2"
                        {...linkProps}
                        onClick={() => {
                          if (item.internal) {
                            handleNavigate(item.id, item.path);
                          }
                        }}
                      >
                        {item.title}
                      </Link>
                    </Stack>
                  );
                })}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 6 }} />
        <Typography
          color="text.secondary"
          variant="caption"
        >
          All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};
