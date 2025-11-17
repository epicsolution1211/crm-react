import { useContext } from 'react';
import { NotificationsContext } from 'src/contexts/notifications-context';

export const useNotifications = () => useContext(NotificationsContext);
