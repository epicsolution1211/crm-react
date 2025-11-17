import { useMemo } from 'react';
import Grid from '@mui/material/Unstable_Grid2';

import { ClientInfo } from './client-info';
import { ContentInfoItemWrapper } from '../common';
import { CreatorInfo } from './creator-info';
import { DeskInfo } from './desk-info';
import { DueDateInfo } from './due-date-info';
import { Iconify } from 'src/components/iconify';
import { LabelInfos } from './label-infos';
import { ParticipantsInfo } from './participants-info';
import { PriorityInfo } from './priority-info';
import { ReminderInfo } from './reminder-info';
import { StalesInfo } from './stales-info';
import { TeamInfo } from './team-info';
import { TimeStampInfo } from './time-stamp-info';
import { TimeTrackingInfo } from './time-traking-info';
import { TransactionInfo } from './transaction-info';
import { WatchersInfo } from './watchers-info';
import { useAuth } from 'src/hooks/use-auth';

export const TaskContentOverview = ({ todo, onUpdateTodos, mutate, isTicket = false }) => {
  const { user } = useAuth();
  
  const canManage = useMemo(() => {
    return (todo?.creator?.id === user.id || (Array.isArray(todo?.participants) && todo?.participants.some(participant => participant.id === user.id)));
  }, [todo?.creator?.id, todo?.participants, user.id]);

  const contentItems = useMemo(() => [
    {
      title: 'Priority',
      icon: 'gravity-ui:flag',
      iconWidth: 16,
      component: <PriorityInfo todo={todo} onUpdateTodos={onUpdateTodos} mutate={mutate} canManage={canManage} />
    },
    {
      title: 'Transaction',
      icon: 'solar:round-transfer-horizontal-linear',
      iconWidth: 18,
      component: <TransactionInfo todo={todo} onUpdateTodos={onUpdateTodos} mutate={mutate} canManage={canManage}/>
    },
    {
      title: 'Client',
      icon: 'la:user-tie',
      iconWidth: 18,
      component: <ClientInfo todo={todo} onUpdateTodos={onUpdateTodos} mutate={mutate} canManage={canManage}/>
    },
    {
      title: 'Created by',
      icon: 'ant-design:user-outlined',
      iconWidth: 16,
      component: todo?.creator && <CreatorInfo todo={todo} />,
      skipIfNoComponent: true
    },
    {
      title: 'Participants',
      icon: 'mynaui:users',
      iconWidth: 18,
      component: <ParticipantsInfo todo={todo} onUpdateTodos={onUpdateTodos} mutate={mutate} canManage={canManage} />
    },
    {
      title: 'Watchers',
      icon: 'mynaui:users',
      iconWidth: 18,
      component: <WatchersInfo todo={todo} onUpdateTodos={onUpdateTodos} mutate={mutate} canManage={canManage} />
    },
    {
      title: 'Team',
      icon: 'mynaui:users',
      iconWidth: 18,
      component: <TeamInfo todo={todo} onUpdateTodos={onUpdateTodos} mutate={mutate} canManage={canManage} />,
      condition: isTicket
    },
    {
      title: 'Desk',
      icon: 'mynaui:users',
      iconWidth: 18,
      component: <DeskInfo todo={todo} onUpdateTodos={onUpdateTodos} mutate={mutate} canManage={canManage} />,
      condition: isTicket
    },
    {
      title: 'Labels',
      icon: 'pepicons-print:label',
      iconWidth: 18,
      component: <LabelInfos todo={todo} onUpdateTodos={onUpdateTodos} mutate={mutate} canManage={canManage} />
    },
    {
      title: 'Due date',
      icon: 'material-symbols:date-range-outline-rounded',
      iconWidth: 18,
      component: <DueDateInfo todo={todo} onUpdateTodos={onUpdateTodos} mutate={mutate} canManage={canManage} />
    },
    {
      title: 'Reminder',
      icon: 'flowbite:bell-ring-outline',
      iconWidth: 18,
      component: <ReminderInfo todo={todo} onUpdateTodos={onUpdateTodos} mutate={mutate} canManage={canManage} />
    },
    {
      title: 'Stales',
      icon: 'hugeicons:status',
      iconWidth: 14,
      component: <StalesInfo todo={todo} />,
      condition: todo?.stale_info?.is_stale
    },
    {
      title: 'Tracking',
      icon: 'fluent:clock-alarm-24-regular',
      iconWidth: 16,
      component: <TimeTrackingInfo 
        timeData={todo?.time_in_stages} 
        totalTimeData={todo?.total_time_in_stages} 
        currentStatus={todo?.total_time_in_stages?.current_status} 
      />
    }
  ], [todo, onUpdateTodos, mutate, canManage, isTicket]);

  return (
    <Grid container columnSpacing={2} rowSpacing={2.5} alignItems="start">
      {contentItems.map((item, index) => {
        if (item.condition === false) return null;
        if (item.skipIfNoComponent && !item.component) return null;
        
        return (
          <ContentInfoItemWrapper 
            key={index}
            title={item.title} 
            startIcon={
              <Iconify 
                icon={item.icon} 
                sx={{ width: item.iconWidth, flexShrink: 0, color: 'text.secondary' }} 
              />
            }
          >
            {item.component}
          </ContentInfoItemWrapper>
        );
      })}
      <TimeStampInfo todo={todo} />
    </Grid>
  );
};