import { useEffect, useMemo, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Seo } from "src/components/seo";
import { Iconify } from "src/components/iconify";
import { KanbanView } from "src/sections/dashboard/todo/kanban";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { TodoAiOverview } from "src/sections/dashboard/todo/todo-ai-overview";
import { TodoAnalyticsDialog } from "src/sections/dashboard/todo/todo-analytics-dialog";
import { TodoFilterDrawer } from "src/sections/dashboard/todo/todo-filter-drawer";
import { TodoLabelsDialog } from "src/sections/dashboard/todo/todo-labels-dialog";
import { ticketsActions } from "src/slices/tickets";
import { useGetTodoList } from "src/hooks/swr/use-todo";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";

const ActionButtons = memo(({ 
  sx = {}, 
  isLoading, 
  isValidating, 
  hasFilters, 
  onMutate, 
  onToggleFilter 
}) => {
  return (
    <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1, ...sx }}>
      <Tooltip title="Reload">
        <IconButton
          onClick={onMutate}
          disabled={isLoading || isValidating}
          size="small"
          sx={{
            "&:hover": {
              color: isValidating ? "text.primary" : "primary.main",
              transform: "rotate(180deg)",
            },
            color: isValidating ? "text.primary" : "primary.main",
            transition: "transform 0.3s",
            width: 36,
          }}
        >
          {(!isLoading && isValidating) ? (
            <Iconify icon="svg-spinners:8-dots-rotate" width={28} />
          ) : (
            <Iconify icon="solar:refresh-line-duotone" width={28} />
          )}
        </IconButton>
      </Tooltip>

      <Tooltip title="Filter">
        <Badge
          color="error"
          variant="dot"
          invisible={!hasFilters}
          overlap="circular"
        >
          <IconButton
            onClick={onToggleFilter}
            size="small"
            sx={{
              "&:hover": {
                color: "primary.main",
                backgroundColor: "action.hover",
              },
              color: "primary.main",
              transition: "transform 0.3s",
              width: 36,
            }}
          >
            <Iconify icon="quill:filter" width={28} />
          </IconButton>
        </Badge>
      </Tooltip>
    </Stack>
  );
});

const Page = () => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const dispatch = useDispatch();

  const { user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_tasks === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  const [labelsDialogOpen, setLabelsDialogOpen] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);

  const filters = useSelector((state) => state.tickets.filters);
  const isOpenFilterDrawer = useSelector((state) => state.tickets.isOpenFilterDrawer);

  const filterParams = useMemo(() => {
    const { participants, watchers, labels, ...restFilters } = filters;
    return {
      participant_ids: participants?.map((p) => p.id),
      watcher_ids: watchers?.map((w) => w.id), 
      label_ids: labels?.map((l) => l.id),
      ...restFilters,
    };
  }, [filters]);

  const { todos: todoList, isLoading, isValidating, mutate } = useGetTodoList(filterParams, { dedupingInterval: 10000 });
  
  const hasFilters = useMemo(() => {
    return Object.values(filters).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== null;
    });
  }, [filters]);

  const onToggleFilterDrawer = () => {
    dispatch(ticketsActions.toggleFilterDrawer(!isOpenFilterDrawer));
  };

  const onResetFilters = () => {
    dispatch(ticketsActions.resetFilters());
  };
  
  useEffect(() => {
    return () => {
      onResetFilters();
    };
  }, []);

  return (
  <>
    <Seo title={`Dashboard: Tasks`} />
    <Box component="main" sx={{ flexGrow: 1, pt: { xs: 2, md: 4 }, pb: 2, flex: "1 1 auto", position: "relative" }}>
      <PayWallLayout>
        <Container maxWidth="xxl">
          <Stack sx={{ gap: { xs: 0, md: 0.5 } }}>
            <Stack sx={{ flexDirection: { xs: "column", md: "row" }, justifyContent: { xs: "center", md: "space-between" }, alignItems: { xs: "start", md: "center" }, gap: { xs: 1.5, md: 2 }, mb: 1 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Typography variant="h4">Tasks</Typography>
                <ActionButtons
                  sx={{ display: { xs: 'flex', md: 'none' } }}
                  isLoading={isLoading}
                  isValidating={isValidating}
                  hasFilters={hasFilters}
                  onMutate={mutate}
                  onToggleFilter={onToggleFilterDrawer}
                />
              </Stack>
              <TextField
                hiddenLabel
                placeholder="Enter a keyword"
                fullWidth
                type="search"
                size="small"
                value={filters.q ?? ''}
                onChange={(e) => dispatch(ticketsActions.setFilterParams({ ...filters, q: e.target.value }))}
                inputProps={{
                  sx: {
                    height: 24,
                  },
                }}
              />
              <Stack 
                sx={{
                  flexDirection: 'row',
                  gap: 1.5,
                  display: { xs: 'grid', md: 'flex' },
                  gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'auto' },
                  width: { xs: '100%', md: 'auto' }
                }}
              >
                <ActionButtons 
                  sx={{ display: { xs: 'none', md: 'flex' } }}
                  isLoading={isLoading}
                  isValidating={isValidating}
                  hasFilters={hasFilters}
                  onMutate={mutate}
                  onToggleFilter={onToggleFilterDrawer}
                />
                <TodoAiOverview todoList={todoList} />
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="solar:chart-2-linear" width={mdUp ? 20 : 24} />}
                  onClick={() => setAnalyticsDialogOpen(true)}
                  size={mdUp ? 'small' : 'medium'}
                  sx={{ px: { xs: 1.8, md: 2 } }}
                >
                  Analytics
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="solar:tag-linear" width={mdUp ? 20 : 24} />}
                  onClick={() => setLabelsDialogOpen(true)}
                  size={mdUp ? 'small' : 'medium'}
                  sx={{ px: { xs: 1.8, md: 2 } }}
                >
                  Labels
                </Button>
              </Stack>
            </Stack>
            <KanbanView 
              todoList={todoList}
              isListLoading={isLoading}
              mutate={mutate}
            />
          </Stack>
        </Container>
      </PayWallLayout>
    </Box>
    
    {analyticsDialogOpen && (
      <TodoAnalyticsDialog
        open={analyticsDialogOpen}
        onClose={() => setAnalyticsDialogOpen(false)}
      />
    )}

    {labelsDialogOpen && (
      <TodoLabelsDialog
        open={labelsDialogOpen}
        onClose={() => setLabelsDialogOpen(false)}
      />
    )}

    {isOpenFilterDrawer && (
      <TodoFilterDrawer
        open={isOpenFilterDrawer}
        onClose={onToggleFilterDrawer}
      />
    )}
  </>
  )
};

export default Page;