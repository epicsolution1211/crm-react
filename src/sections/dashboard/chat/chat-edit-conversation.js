import { useEffect } from 'react'
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector, useDispatch } from 'react-redux';

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Scrollbar } from "src/components/scrollbar";
import { internalChatApi } from 'src/api/internal-chat';
import { thunks as clientThunks } from 'src/thunks/client_chat';
import { thunks } from 'src/thunks/internal_chat';
import { useSearchParams } from "src/hooks/use-search-params";
import { Iconify } from 'src/components/iconify';

const validationSchema = yup.object({
  name: yup.string().required('Conversation name is a required field'),
})

export const ChatEditConversation = ({ onClose, open, conversationId, ...other }) => {
  const dispatch = useDispatch();
  const chats = useSelector(state => state.internal_chat.chats);
  const agentIds = useSelector(state => state.contact_list.ids);
  const tickets = useSelector(state => state.client_chat.tickets);
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customer") || "";

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = async (data) => {
    try {
      await internalChatApi.updateConversation(conversationId, data);
      if (customerId) {
        dispatch(clientThunks.getClientChat({ client_ids: [customerId] }));
      } else {
        dispatch(thunks.getInternalChat({ account_ids: agentIds ?? [] }));
      }
      toast('Conversation name successfully updated!');
      onClose();
    } catch (error) {
      console.error('error: ', error);
    }
  };

  useEffect(() => {
    if (customerId) {
      const current = tickets?.find(({ ticket }) => ticket?.conversation_id?.toString() === conversationId);
      setValue('name', current?.ticket?.conversation?.name);
    } else {
      const current = chats?.find((item) => item?.id?.toString() === conversationId);
      setValue('name', current?.name);
    }
  }, [chats, tickets, conversationId, customerId])

  return (
    <Drawer
      disableScrollLock
      anchor="right"
      onClose={onClose}
      open={open}
      ModalProps={{
        BackdropProps: {
          invisible: true,
        },
        sx: { zIndex: 1400 },
      }}
      PaperProps={{
        elevation: 24,
        sx: {
          maxWidth: "100%",
          width: 440,
        },
      }}
      {...other}
    >
      <Scrollbar
        sx={{
          height: "100%",
          "& .simplebar-content": {
            height: "100%",
          },
          "& .simplebar-scrollbar:before": {
            background: "var(--nav-scrollbar-color)",
          },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            spacing={3}
            sx={{
              px: 3,
              pt: 2,
            }}
          >
            <Typography variant="h5">Edit Conversation</Typography>
            <Stack
              alignItems="center"
              direction="row"
              spacing={0.5}>
              <IconButton
                color="inherit"
                onClick={onClose}>
                <Iconify icon="iconamoon:close" width={24} />
              </IconButton>
            </Stack>
          </Stack>
          <Stack
            spacing={5}
            sx={{ p: 3, mt: 5 }}>
            <Stack
              spacing={2}>
              <Typography
                variant="h6">Conversation Name</Typography>
              <Box
                sx={{ flexGrow: 1 }}>
                <TextField
                  fullWidth
                  label={'Conversation name'}
                  {...register('name')}
                  error={!!errors?.name?.message}
                  helperText={errors?.name?.message}
                />
              </Box>
            </Stack>
            <Button
              type='submit'
              variant="contained"
            >
              Update
            </Button>
          </Stack>
        </form>
      </Scrollbar>
    </Drawer>
  );
};

ChatEditConversation.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  conversationId: PropTypes.string,
  participants: PropTypes.array,
  onParticipantsGet: PropTypes.func,
};
