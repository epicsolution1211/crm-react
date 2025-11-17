import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSearchParams } from 'src/hooks/use-search-params';
import { useDispatch } from 'src/store';
import { thunks } from 'src/thunks/chat';
import { LandingChatThread } from 'src/sections/landing/chat/chat-thread';
import { LandingChatBlank } from 'src/sections/landing/chat/chat-blank';
import { LandingChatContainer } from 'src/sections/landing/chat/chat-container';
import { LandingChatSidebar } from 'src/sections/landing/chat/chat-sidebar';
import { Iconify } from 'src/components/iconify';

const useThreads = () => {
  const dispatch = useDispatch();

  const handleThreadsGet = useCallback(() => {
    dispatch(thunks.getThreads());
  }, [dispatch]);

  useEffect(() => {
    handleThreadsGet();
  },
    []);
};

const useSidebar = () => {
  const searchParams = useSearchParams();
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [open, setOpen] = useState(mdUp);

  const handleScreenResize = useCallback(() => {
    if (!mdUp) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [mdUp]);

  useEffect(() => {
    handleScreenResize();
  },
    [mdUp]);

  const handeParamsUpdate = useCallback(() => {
    if (!mdUp) {
      setOpen(false);
    }
  }, [mdUp]);

  useEffect(() => {
    handeParamsUpdate();
  },
    [searchParams]);

  const handleToggle = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    handleToggle,
    handleClose,
    open
  };
};

const Page = () => {
  const rootRef = useRef(null);
  const searchParams = useSearchParams();
  const compose = searchParams.get('compose') === 'true';
  const threadKey = searchParams.get('threadKey') || undefined;
  const sidebar = useSidebar();

  usePageView();

  useThreads();

  const view = threadKey
    ? 'thread'
    : compose
      ? 'compose'
      : 'blank';

  return (
    <>
      <Seo title="Internal Chat" />
      <Divider />
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          ref={rootRef}
          sx={{
            bottom: 48,
            display: 'flex',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0
          }}
        >
          <LandingChatSidebar
            container={rootRef.current}
            onClose={sidebar.handleClose}
            open={sidebar.open}
          />
          <LandingChatContainer open={sidebar.open}>
            <Box sx={{ p: 2 }}>
              <IconButton onClick={sidebar.handleToggle}>
                <Iconify icon="lucide:menu" width={24} height={24} />
              </IconButton>
            </Box>
            <Divider />
            {view === 'thread' && <LandingChatThread threadKey={threadKey} />}
            {view === 'blank' && <LandingChatBlank />}
          </LandingChatContainer>
        </Box>
      </Box>
    </>
  );
};

export default Page;
