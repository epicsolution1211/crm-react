import React from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { Groups } from '@mui/icons-material';
import { getActivityColor, getRiskColor } from './helper';

const ClientCard = ({ client }) => {
  return (
    <Card 
      sx={{
        border: '1px dashed',
        borderColor: 'divider',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" mb={2}>
          <Groups sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
          <Typography variant="subtitle1" color="text.primary">
            Client {client.client_id}
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
          <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.neutral', borderRadius: 1 }}>
            <Typography variant="h4" color="primary">{client.unique_agents}</Typography>
            <Typography variant="caption">Unique Agents</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.neutral', borderRadius: 1 }}>
            <Typography variant="h4" color="success.main">{client.total_accesses}</Typography>
            <Typography variant="caption">Total Accesses</Typography>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Most Active Agent
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight="medium">
              {client.most_active_agent.agent_name}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Agent Access Count
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight="medium">
              {client.most_active_agent.access_count}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Activity Level
            </Typography>
            <Chip 
              label={client.activity_level}
              color={getActivityColor(client.activity_level)}
              size="small"
              sx={{ minWidth: 90 }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Risk Level
            </Typography>
            <Chip 
              label={client.risk_level}
              color={getRiskColor(client.risk_level)}
              size="small"
              sx={{ minWidth: 90 }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Health Score
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight="medium">
              {client.health_score ?? 0}%
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Recent Activity Agents
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight="medium">
              {client.recent_activity_agents}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Engagement Pattern
            </Typography>
            <Chip 
              label={client.engagement_pattern.split(' - ')[0]}
              color="primary"
              size="small"
              sx={{ minWidth: 90 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ClientCard;