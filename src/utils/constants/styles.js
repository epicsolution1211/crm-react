export const TableContainerStyle = {
  borderRadius: 0,
  '&::-webkit-scrollbar': {
    width: '6px',
    height: '6px', 
    cursor: 'grab',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'background.default',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'divider',
    borderRadius: '4px',
    cursor: 'grab',
    '&:hover': {
      backgroundColor: 'divider',
    },
    '&:active': {
      cursor: 'grabbing'
    }
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 50,
    right: 0,
    height: 8,
    width: 8,
    bgcolor: 'background.default'
  }
}