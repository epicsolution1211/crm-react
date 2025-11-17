import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { settingsApi } from "src/api/settings";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from '@mui/material/ToggleButton';
import Box from "@mui/material/Box";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Iconify } from 'src/components/iconify';
import { DeleteModal } from "src/components/customize/delete-modal";
import { getAPIUrl } from "src/config";
import { ClientCardFormDialog } from "./client-card-form-dialog";
import { ClientCardTable } from "./client-card-table";
import { brandsApi } from "src/api/lead-management/brand";

const SortableCardItem = ({ card, onDelete, onUpdate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleEdit = () => {
    onUpdate(card);
  };

  const handleDelete = () => {
    onDelete(card?.id);
  };

  return (
    <Grid item xs={12} sm={12} md={12} lg={12} xl={4}>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card 
          sx={{ 
            height: {xs: "280px", md: "300px"}, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundImage: card?.image ? `url("${getAPIUrl()}/${card?.image}")` : "",
            cursor: 'move',
            position: 'relative',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              '& .card-overlay': {
                opacity: 1
              }
            }
          }}
        >
          <Box
            className="card-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.3)',
              opacity: 0,
              transition: 'opacity 0.2s ease-in-out',
              zIndex: 1
            }}
          />
          
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{
              position: 'absolute',
              top: 10,
              right: 8,
              zIndex: 2,
              opacity: isDragging ? 0 : 1,
              transition: 'opacity 0.2s ease-in-out'
            }}
          >
            <Tooltip title="Drag to reorder">
              <IconButton
                sx={{
                  color: "info.main",
                  backgroundColor: "info.alpha8",
                  backdropFilter: 'blur(4px)',
                  cursor: 'move',
                  '&:hover': {
                    backgroundColor: 'info.main',
                    color: 'white'
                  }
                }}
              >
                <Iconify icon="mdi:drag" width={20}/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton 
                onClick={handleEdit}
                onMouseDown={(e) => {e.stopPropagation(); handleEdit()}}
                sx={{
                  color: "primary.main",
                  backgroundColor: "primary.alpha8",
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <Iconify icon="mage:edit" width={20}/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton 
                onClick={handleDelete}
                onMouseDown={(e) => {e.stopPropagation(); handleDelete()}}
                sx={{
                  color: "error.main",
                  backgroundColor: "error.alpha8", 
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'error.main',
                    color: 'white',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <Iconify icon="heroicons:trash" width={20}/>
              </IconButton>
            </Tooltip>
          </Stack>

          <CardContent 
            sx={{ 
              height: 1, 
              position: 'relative', 
              zIndex: 1,
              transition: 'transform 0.2s ease-in-out',
              background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
            }}
          >
            <Stack
              justifyContent="flex-end"
              spacing={1}
              sx={{ 
                height: 1, 
                transition: 'transform 0.2s ease-in-out'
              }}
            >
              <Typography
                sx={{
                  fontStretch: "condensed",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  fontWeight: "600",
                }}
                variant="body2"
              >
                {card?.header}
              </Typography>
              <Typography variant="h5">{card?.title}</Typography>
              <Typography variant="h6">{card?.description}</Typography>
            </Stack>
          </CardContent>
        </Card>
      </div>
    </Grid>
  );
};

export const ClientCards = ({ brandId, brand, getBrands }) => {
  const [cardsList, setCardsList] = useState([]);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [cardToUpdate, setCardToUpdate] = useState(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const getCards = async () => {
    try {
      const res = await settingsApi.getCards({ internal_brand_id: brandId });
      if (res?.cards?.length > 0) {
        setCardsList(res?.cards);
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (brand) {
      const themeSetting = brand?.theme_setting
      if (themeSetting) {
        const client_cards = JSON.parse(themeSetting)?.client_cards;
        if (client_cards?.length > 0) {
          if(cardsList?.length === 0) {
            setCardsList(client_cards);
          }
        } else {
          getCards();
        }
      }
    }
  }, [brand]);

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if(!active || !over) return;

    if (active?.id !== over?.id) {
      setCardsList((items) => {
        const oldIndex = items.findIndex((item) => item?.id === active?.id);
        const newIndex = items.findIndex((item) => item?.id === over?.id);
        
        const updatedCards = arrayMove(items, oldIndex, newIndex);
        handleUpdateBrand(updatedCards);
        return updatedCards;
      });
      setTimeout(() => {
        toast.success("Cards successfully updated!");
      }, 1000);
    }
  };

  const handleCardDelete = async () => {
    try {
      await settingsApi.deleteCard(cardToDelete, {
        internal_brand_id: brandId,
      });
      const updatedCards = cardsList?.filter((card) => card?.id !== cardToDelete);
      setCardsList(updatedCards);
      handleUpdateBrand(updatedCards);
      setDeleteModalOpen(false);
      setTimeout(() => {
        setCardToDelete(null);
        toast.success("Card successfully deleted!");
      }, 1000);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleCardCreate = async (request) => {
    try {
      const res = await settingsApi.createCard(request);
      const updatedCards = [...cardsList, res?.card];
      setCardsList(updatedCards);
      handleUpdateBrand(updatedCards);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleCardUpdate = async (request) => {
    try {
      const res = await settingsApi.updateCard(cardToUpdate?.id, request);
      const updatedCards = cardsList?.map((card) => {
        if (card?.id === res?.card?.id) {
          return {
            ...card,
            ...res?.card,
          };
        }
        return card;
      });

      setCardsList(updatedCards);

      handleUpdateBrand(updatedCards);
      setIsEditDialogOpen(false);
      setCardToUpdate(null);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdateBrand = async (updatedCards) => {
    try {
      const themeSetting = brand?.theme_setting
        ? JSON.parse(brand?.theme_setting)
        : {};

      const request = {
        theme_setting: JSON.stringify({
          ...themeSetting,
          client_cards : updatedCards?.length > 0 ? [...updatedCards] : [],
        }),
      };

      await brandsApi.updateInternalBrand(brandId, request);

      setTimeout(() => {
        getBrands();
      }, 1000);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Stack spacing={3} sx={{ px: 2, width: 1 }}>
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center"
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="view mode"
          size="small"
        >
          <ToggleButton value="card" aria-label="card view">
            <Iconify icon="material-symbols:grid-view" />
          </ToggleButton>
          <ToggleButton value="table" aria-label="table view">
            <Iconify icon="material-symbols:list" />
          </ToggleButton>
        </ToggleButtonGroup>

        <Button
          variant="contained"
          startIcon={<Iconify icon="material-symbols:add" />}
          onClick={() => setIsEditDialogOpen(true)}
        >
          Create Card
        </Button>
      </Stack>

      {viewMode === 'table' ? (
        <ClientCardTable 
          cards={cardsList}
          onDelete={(id) => {
            setDeleteModalOpen(true);
            setCardToDelete(id);
          }}
          onUpdate={(card) => {
            setIsEditDialogOpen(true);
            setCardToUpdate(card);
          }}
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={cardsList.map(card => card.id)}
            strategy={horizontalListSortingStrategy}
          >
            <Grid 
              container 
              spacing={4}
              sx={{ mx: "-16px !important" }}
            >
              {cardsList?.map((card) => (
                <SortableCardItem
                  key={card?.id}
                  card={card}
                  onDelete={(val) => {
                    setDeleteModalOpen(true);
                    setCardToDelete(val);
                  }}
                  onUpdate={(val) => {
                    setIsEditDialogOpen(true);
                    setCardToUpdate(val);
                  }}
                />
              ))}
            </Grid>
          </SortableContext>
        </DndContext>
      )}
      <ClientCardFormDialog
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setCardToUpdate(null);
        }}
        brandId={brandId}
        card={cardToUpdate}
        onSubmit={(request) => {
          if (cardToUpdate) {
            handleCardUpdate(request);
          } else {
            handleCardCreate(request);
          }
        }}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={() => setDeleteModalOpen(false)}
        onDelete={handleCardDelete}
        title={"Delete Card"}
        description={"Are you sure you want to delete this card?"}
      />
    </Stack>
  );
};
