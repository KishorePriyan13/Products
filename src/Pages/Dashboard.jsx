import React from 'react'
import Navbar from '../Components/Navbar';
import { Box, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import ProductData from './ProductData';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Orders from './Orders';

const Dashboard = () => {

    const navigate = useNavigate();
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const handleOut = () => {
        navigate("/");
        localStorage.setItem("token", "");
      };

  return (
    <div>
       <Navbar Header={
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          columnGap: "1rem"
        }}>
          Sales Data
          <Button variant="contained" size='Large' style={{
            backgroundColor: "teal",
            fontSize: "16px",
            fontWeight: "600"
          }} startIcon={<LogoutIcon />} onClick={handleOut}>Logout</Button>
        </Box>
      } />
      <Box sx={{ padding: "90px 40px 60px 40px", textAlign: "left" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
            <Tab label="Products" value="1" />
            <Tab label="Orders" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
            <ProductData />
        </TabPanel>
        <TabPanel value="2">
            <Orders />
        </TabPanel>
        {/* <TabPanel value="3">Item Three</TabPanel> */}
      </TabContext>
    </Box>
    </div>
  )
}

export default Dashboard