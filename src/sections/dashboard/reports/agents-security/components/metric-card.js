import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';

const MetricCard = ({ title, value, icon, color = 'primary', subtitle }) => (
  <Card sx={{ height: '100%', border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Stack direction="column" spacing={1}>
          <Typography color="text.primary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" color={color}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
        <Box sx={{ color: `${color}.main` }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default MetricCard; 