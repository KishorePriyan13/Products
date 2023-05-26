import { Box } from '@mui/material';
import React from 'react'

const Body = ({content}) => {
  return (
    <Box sx={{padding:"120px 40px 60px 40px", backgroundColor:"#5D6D7E"}}>
        {content}
    </Box>
  )
}

export default Body