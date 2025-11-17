import { useCallback, useEffect, useState } from "react";
import { alpha } from "@mui/system/colorManipulator";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelector } from "react-redux";

import { useRouter } from "src/hooks/use-router";
import { Logo } from "src/components/logos/logo";
import { RouterLink } from "src/components/router-link";
import { useWindowScroll } from "src/hooks/use-window-scroll";
import { paths } from "src/paths";
import { useSettings } from "src/hooks/use-settings";
import { SeverityPill } from "src/components/severity-pill";
import Typography from "@mui/material/Typography";
import { TopNavItem } from "./top-nav-item";
import { usePathname } from "src/hooks/use-pathname";
import { useSearchParams } from 'src/hooks/use-search-params';
import { getAPIUrl } from "src/config";
import { getAssetPath } from "src/utils/asset-path";

const TOP_NAV_HEIGHT = 64;

const items = [
  {
    title: "Contact Us",
    path: paths.contact,
  },
  {
    title: "Pricing",
    path: paths.pricing,
  },
];

export const TopNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const settings = useSettings();
  const hostname = window?.location?.hostname;
  const avatar = useSelector((state) => state.companies.avatar);
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [elevate, setElevate] = useState(false);
  const offset = 64;
  const delay = 100;
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? "";
  const localRef = localStorage.getItem("ref") ?? "";

  useEffect(() => {
    if (hostname === "octolit.link") {
      settings.handleUpdate({ colorPreset: "blue" });
    }
  }, []);

  const handleWindowScroll = useCallback(() => {
    if (window.scrollY > offset) {
      setElevate(true);
    } else {
      setElevate(false);
    }
  }, []);

  useWindowScroll({
    handler: handleWindowScroll,
    delay,
  });

  const linkRef = ref || localRef;

  return (
    <Box
      component="header"
      sx={{
        left: 0,
        position: "fixed",
        right: 0,
        top: 0,
        pt: 2,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          backdropFilter: "blur(6px)",
          backgroundColor: "transparent",
          borderRadius: 2.5,
          boxShadow: "none",
          transition: (theme) =>
            theme.transitions.create("box-shadow, background-color", {
              easing: theme.transitions.easing.easeInOut,
              duration: 200,
            }),
          ...(elevate && {
            backgroundColor: (theme) =>
              alpha(theme.palette.background.paper, 0.9),
            boxShadow: 8,
          }),
        }}
      >
        <Stack direction="row" spacing={2} sx={{ height: TOP_NAV_HEIGHT }}>
          <Stack
            alignItems="center"
            direction="row"
            spacing={1}
            sx={{ flexGrow: 1 }}
          >
            <Stack
              alignItems="center"
              component={RouterLink}
              direction="row"
              display="inline-flex"
              href={paths.index}
              spacing={1}
              sx={{ textDecoration: "none" }}
            >
              {avatar ? (
                <img
                  src={avatar ? `${getAPIUrl()}/${avatar}` : ""}
                  alt="Company logo"
                  loading="lazy"
                  style={{
                    height: 24,
                    width: 24,
                    objectFit: "fill",
                    backgroundColor: "9BA4B5",
                  }}
                />
              ) : hostname === "octolit.link" ? (
                <img src={getAssetPath("/assets/logos/logo-link.svg")} width={30} />
              ) : hostname === "octolit.com" ? (
                <img src={getAssetPath("/assets/logos/new-logo.svg")} width={30} />
              ) : (
                <SvgIcon sx={{ height: 24, width: 24 }}>
                  <Logo color={settings?.colorPreset} />
                </SvgIcon>
              )}
              <Box
                sx={{
                  color: "text.primary",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: "0.3px",
                  lineHeight: 2.5,
                  "& span": {
                    color: "primary.main",
                  },
                }}
              >
                CRM
              </Box>
              {hostname === "octolit.link" && (
                <SeverityPill color="success">
                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                    .link
                  </Typography>
                </SeverityPill>
              )}
            </Stack>
          </Stack>
          {mdUp && hostname === "octolit.link" && (
            <Stack alignItems="center" direction="row" spacing={2}>
              <Box component="nav" sx={{ height: "100%" }}>
                <Stack
                  component="ul"
                  alignItems="center"
                  justifyContent="center"
                  direction="row"
                  spacing={1}
                  sx={{
                    height: "100%",
                    listStyle: "none",
                    m: 0,
                    p: 0,
                  }}
                >
                  <>
                    {items.map((item) => {
                      const checkPath = !!(item.path && pathname);
                      const partialMatch = checkPath
                        ? pathname.includes(item.path)
                        : false;
                      const exactMatch = checkPath
                        ? pathname === item.path
                        : false;
                      const active = item.popover ? partialMatch : exactMatch;

                      return (
                        <TopNavItem
                          active={active}
                          external={item.external}
                          key={item.title}
                          path={item.path}
                          popover={item.popover}
                          title={item.title}
                        />
                      );
                    })}
                  </>
                </Stack>
              </Box>
            </Stack>
          )}
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            sx={{ flexGrow: 1 }}
          >
            <Button
              size={mdUp ? "medium" : "small"}
              variant="contained"
              color="primary"
              onClick={() => {
                if (hostname === "octolit.link") {
                  window?.open(
                    `https://buy.stripe.com/7sI2afcqq69ocxObIO${linkRef ? `?prefilled_promo_code=${linkRef}` : ''}`
                  );
                } else {
                  router.push("/contact");
                }
              }}
            >
              {hostname === "octolit.link" ? "Purchase now" : "Contact Us"}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
