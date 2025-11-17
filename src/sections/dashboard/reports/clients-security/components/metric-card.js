import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

const MetricCard = ({ title, value, icon, color = 'primary', subtitle }) => (
  <Card sx={{ height: '100%', border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" color={color}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ color: `${color}.main` }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default MetricCard;