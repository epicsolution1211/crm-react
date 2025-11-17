import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from '@mui/material';

export const TableSkeleton = () => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell><Skeleton variant="text" /></TableCell>
          <TableCell><Skeleton variant="text" /></TableCell>
          <TableCell><Skeleton variant="text" /></TableCell>
          <TableCell><Skeleton variant="text" /></TableCell>
          <TableCell><Skeleton variant="text" /></TableCell>
          <TableCell><Skeleton variant="text" /></TableCell>
          <TableCell><Skeleton variant="text" /></TableCell>
          <TableCell><Skeleton variant="text" /></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Box display="flex" alignItems="center" gap={1}>
                <Skeleton variant="circular" width={32} height={32} />
                <Box>
                  <Skeleton variant="text" width={120} />
                  <Skeleton variant="text" width={80} />
                </Box>
              </Box>
            </TableCell>
            <TableCell><Skeleton variant="text" width={40} /></TableCell>
            <TableCell><Skeleton variant="text" width={60} /></TableCell>
            <TableCell><Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} /></TableCell>
            <TableCell><Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 1 }} /></TableCell>
            <TableCell><Skeleton variant="text" width={80} /></TableCell>
            <TableCell><Skeleton variant="text" width={90} /></TableCell>
            <TableCell><Skeleton variant="text" width={100} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export const ListSkeleton = ({ items = 3 }) => (
  <Box>
    {[...Array(items)].map((_, index) => (
      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" width="80%" />
      </Box>
    ))}
  </Box>
); 