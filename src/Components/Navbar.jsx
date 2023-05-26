import { AppBar, Box } from "@mui/material";
import React from "react";

const Navbar = ({Header}) => {
  return (
    <div>
        <AppBar>
        <Box sx={{
            padding:"10px",
            fontSize:"38px",
            fontWeight:"600"
        }}>
            {Header}
        </Box>
        </AppBar>
    </div>
        


    
  )
}

export default Navbar