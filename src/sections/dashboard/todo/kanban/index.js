import React, { useState, useCallback } from "react";
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CreateTaskDialog } from "../todo-create-dialog";
import { Iconify } from "src/components/iconify";
import { SimpleTaskDrawer } from 'src/sections/dashboard/todo/todo-detail-drawer';
import { TaskCard } from './task-card';
import { TaskCardSkeleton } from './task-card-skeleton';
import { todoApi } from "src/api/todo";

const statuses = ["todo", "in_progress", "done"];

const statusLabels = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done"
};

const groupByStatus = (list) => {
  return statuses.reduce((acc, status) => {
    acc[status] = list.filter(item => item.status === status);
    return acc;
  }, {});
}

export const KanbanView = ({ 
  todoList,
  mutate,
  isListLoading,
}) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // ADD Task dialog
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const columns = groupByStatus(todoList);

  const onDragEnd = useCallback(async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;

    // Optimistic update - immediately update the UI
    const optimisticUpdate = (currentData) => {
      if (!currentData?.todos) return currentData;
      
      const updatedTodos = currentData.todos.map(todo => 
        todo.id === taskId 
          ? { ...todo, status: newStatus, updated_at: new Date().toISOString() }
          : todo
      );
      
      return {
        ...currentData,
        todos: updatedTodos
      };
    };

    // Apply optimistic update
    mutate(optimisticUpdate, false);

    try {
      // Make API call to update the todo status
      await todoApi.updateToDo(taskId, { status: newStatus });
      
      // Revalidate the data to ensure consistency
      mutate();
      
      toast.success('Task status updated successfully');
    } catch (error) {
      console.error('Error updating task status:', error);
      
      // Revert optimistic update on error
      mutate();
      
      toast.error('Failed to update task status. Please try again.');
    }
  }, [mutate]);

  const handleUpdateTodos = useCallback(async (taskId, updates) => {
    // Optimistic update
    const optimisticUpdate = (currentData) => {
      if (!currentData?.todos) return currentData;
      
      const updatedTodos = currentData.todos.map(todo => 
        todo.id === taskId 
          ? { ...todo, ...updates, updated_at: new Date().toISOString() }
          : todo
      );
      
      return {
        ...currentData,
        todos: updatedTodos
      };
    };
    mutate(optimisticUpdate, false);

    try {
      mutate();
    } catch (error) {
      console.error('Error updating task:', error);
      mutate();
    }

  }, [mutate]);

  return (
    <>
      <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', py: 1 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    flex: 1,
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    boxShadow: 4,
                    border: '1px dashed',
                    borderColor: 'divider',
                    height: {
                      xs: `calc(100vh - 270px)`,
                      sm: `calc(100vh - 195px)`
                    },
                    minWidth: {
                      xs: 1,
                      sm: 380
                    },
                    maxWidth: {
                      xs: 300,
                      sm: 380
                    }
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: 1, minHeight: 42, mb: 1 }}>
                    <Typography variant="h6">{statusLabels[status]}</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
                      <Typography variant="caption" color="text.secondary" px={0.5}>
                        {isListLoading ? '...' : `${columns[status].length} ${columns[status].length === 1 ? 'task' : 'tasks'}`}
                      </Typography>
                      {status === "todo" && (
                        <Button
                          startIcon={<Iconify icon="fluent:add-12-regular" width={18} />}
                          size="small" 
                          variant="contained" 
                          color="primary" 
                          onClick={() => setIsAddTaskOpen(true)}
                          disabled={status === "done" || isListLoading}
                          sx={{
                            '& .css-cstir9-MuiButton-startIcon': {
                              marginRight: 0.6
                            }
                          }}
                        >
                          Add Task
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                  <Stack 
                    spacing={2}
                    sx={{
                      overflowY: 'auto',
                      maxHeight: `calc(100vh - 240px)`,
                      '&::-webkit-scrollbar': {
                        display: 'none'
                      },
                      msOverflowStyle: 'none',
                      scrollbarWidth: 'none'
                    }}
                  >
                    {isListLoading && !todoList?.length ? (
                      <>
                        {[...Array(3)].map((_, i) => (
                          <TaskCardSkeleton key={i} />
                        ))}
                      </>
                    ) : (
                      <>
                        {columns[status]?.sort((a, b) => a.order_position - b.order_position)?.map((item, idx) => {
                          return (
                            <Draggable draggableId={item.id.toString()} index={idx} key={item.id}>
                              {(provided, snapshot) => (
                                <TaskCard
                                  item={item}
                                  provided={provided}
                                  snapshot={snapshot}
                                  onClick={() => handleTaskClick(item)}
                                />
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </>
                    )}
                  </Stack>
                </Box>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </Box>
      {isAddTaskOpen && (
        <CreateTaskDialog
          open={isAddTaskOpen}
          onClose={() => setIsAddTaskOpen(false)}
          onSuccess={() => mutate()}
        />
      )}
      {isModalOpen && (
        <SimpleTaskDrawer
          open={isModalOpen}
          taskId={selectedTask?.id}
          onClose={handleCloseModal}
          onUpdateTodos={handleUpdateTodos}
        />
      )}
    </>
  );
};
