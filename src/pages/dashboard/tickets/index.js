import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { ConfirmDialog } from "src/components/confirm-dialog-2";
import { CreateTaskDialog } from "src/sections/dashboard/todo/todo-create-dialog";
import { Iconify } from "src/components/iconify";
import { PayWallLayout } from "src/layouts/dashboard/paywall-layout";
import { Seo } from "src/components/seo";
import { SimpleTaskDrawer } from "src/sections/dashboard/todo/todo-detail-drawer";
import { TicketsTable } from "src/sections/dashboard/todo/tickets-table";
import { TodoLabelsDialog } from "src/sections/dashboard/todo/todo-labels-dialog";
import { ticketsActions } from "src/slices/tickets";
import { todoApi } from "src/api/todo";
import { useGetTodoList } from "src/hooks/swr/use-todo";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";

const Page = () => {
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const dispatch = useDispatch();

  const { user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_tickets === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  const selectedDeleteTicketId = useSelector((state) => state.tickets.selectedDeleteTicketId);
  const selectedTicketId = useSelector((state) => state.tickets.selectedTicketId);
  const filters = useSelector((state) => state.tickets.filters);
  const pagination = useSelector((state) => state.tickets.pagination);  

  const filterParams = useMemo(() => {
    const { participants, watchers, labels, teams, desks, ...restFilters } = filters;
    return {
      ticket_system: true,
      participant_ids: participants?.map((p) => p.id),
      watcher_ids: watchers?.map((w) => w.id), 
      label_ids: labels?.map((l) => l.id),
      team_ids: teams?.map((t) => t.id),
      desk_ids: desks?.map((d) => d.id),
      ...pagination,
      ...restFilters,
    };
  }, [pagination, filters]);

  const [labelsDialogOpen, setLabelsDialogOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { todos: todoList, totalCount, isLoading, isValidating, mutate } = useGetTodoList(filterParams, { dedupingInterval: 10000 });

  const onResetFilters = () => {
    dispatch(ticketsActions.resetFilters());
  };

  const onCloseTicketDrawer = () => {
    dispatch(ticketsActions.onSelectTicketId(null));
  };

  const onCloseDeleteDialog = () => {
    dispatch(ticketsActions.onSelectDeleteTicketId(null));
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await todoApi.deleteToDo(selectedDeleteTicketId);
      mutate();
      setTimeout(() => {
        toast.success('Task deleted successfully');
        onCloseDeleteDialog();
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateTodos = (todoId, data, refresh = true) => {
    setTimeout(() => {
      if(refresh) {
        mutate();
      } else {
        mutate({ todos: todoList.map((todo) => todo.id === todoId ? data : todo) }, false);
      }
    }, refresh ? 1000 : 0);
  };

  useEffect(() => {
    return () => {
      onResetFilters();
    };
  }, []);

  return (
  <>
    <Seo title={`Dashboard: Tickets`} />
    <Box component="main" sx={{ flexGrow: 1, pt: { xs: 2, sm: 4 }, pb: 2, flex: "1 1 auto", position: "relative" }}>
      <PayWallLayout>
        <Container maxWidth="xxl">
          <Stack sx={{ gap: { xs: 1.5, md: 3 } }}>
            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 1 }}>
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography variant="h4">Tickets</Typography>
              </Stack>
              <Stack 
                sx={{
                  gap: 1.5,
                  width: 1,
                  flexDirection: 'row',
                  justifyContent: 'end',
                }}
              >
                <Button
                  onClick={() => setIsAddTaskOpen(true)}
                  variant="contained"
                  startIcon={<Iconify icon="lucide:plus" width={20} />}
                  sx={{ px: { whiteSpace: 'nowrap' } }}
                  size={mdDown ? "small" : "medium"}
                >
                  {mdDown ? 'Add' : 'Add Ticket'}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="solar:tag-linear" width={20} />}
                  onClick={() => setLabelsDialogOpen(true)}
                  size={mdDown ? "small" : "medium"}
                >
                  Labels
                </Button>
              </Stack>
            </Stack>

            <TicketsTable
              todoList={todoList}
              totalCount={totalCount}
              isLoading={isLoading}
              isValidating={isValidating}
              onUpdateTodos={handleUpdateTodos}
            />
          </Stack>
        </Container>
      </PayWallLayout>
    </Box>
    
    {labelsDialogOpen && (
      <TodoLabelsDialog
        open={labelsDialogOpen}
        onClose={() => setLabelsDialogOpen(false)}
      />
    )}

    {selectedTicketId && (
      <SimpleTaskDrawer
        isTicket
        open={!!selectedTicketId}
        taskId={selectedTicketId}
        onClose={onCloseTicketDrawer}
        onUpdateTodos={handleUpdateTodos}
      />
    )}

    {isAddTaskOpen && (
      <CreateTaskDialog
        isTicket
        open={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSuccess={() => mutate()}
      />
    )}

    {selectedDeleteTicketId && (
      <ConfirmDialog
        open={!!selectedDeleteTicketId}
        onClose={onCloseDeleteDialog}
        title="Delete Ticket"
        description="Are you sure want to delete this ticket? This action cannot be undone."
        confirmAction={handleDelete}
        isLoading={isDeleting}
      />
    )}
  </>
  )
};

export default Page;