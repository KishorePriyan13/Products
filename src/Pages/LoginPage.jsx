import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Body from '../Components/Body';
import { Box, Button, Card, TextField } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const LoginPage = () => {

    const [hover, setHover] = useState(false);
    const Initial = {username: "", password: ""}
    const [credentials, setCredentials] = useState(Initial);
    const [formErrors, setFormErrors] = useState({});
    const [clear, setClear] = useState(true);
    const [submit, setSubmit] = useState(false);
    const navigate = useNavigate();
    const URL = "https://localhost:7094/api/Credential/Login";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleClear = () => {
        setClear(true);
        setCredentials(Initial);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
       setClear(false);
       setFormErrors(validation(credentials));
       setSubmit(true);    
    }

    useEffect(() => {
        console.log(formErrors);
        if (Object.keys(formErrors).length === 0 && submit === true) {
            console.log(credentials);
            const data = {
                username: credentials.username,
                password: credentials.password,
            }
            axios.post(URL,data).then((result) => {
                if(result.data === "Login successful"){
                    navigate("/Dashboard");
                    localStorage.setItem("token", credentials.username);
                }
                
            }).catch((error) => {
                window.alert(error);
            })
        }
    }, [formErrors]);

    const validation = (values) => {
        const error = {};
        if (!values.username) {
            error.username = "Username is required!";
        }
        if (!values.password) {
            error.password = "Password is required!";
        } 

        return error;
    };

    return (
        <div>
            <Navbar Header={
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    columnGap: "1rem"
                }}>
                    <AccountCircleIcon sx={{ fontSize: "50px" }} />
                    <Box>Login Page</Box>

                </Box>
            } />
            <Body content={
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 500, backgroundColor:"#5D6D7E" }}>
                    <Card sx={{
                        minWidth: 525,
                        backgroundColor: "#FBFCFC",
                        color: "black",
                        fontSize: "22px",
                        fontWeight: 500,
                        padding: "40px 20px 0px 20px"
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", columnGap: "4rem", paddingBottom:"40px"}}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", columnGap: "8px" }}>
                                <PersonIcon fontSize='large' />
                                <Box>Username</Box>
                            </Box>
                            <Box>
                                <TextField id="outlined-basic" variant="outlined" size="small" sx={{
                                width: 250,
                                maxWidth: '100%',
                            }} value={credentials.username} name="username" onChange={handleChange}/>
                                {clear === true ? "" : <p style={{
                                        color: "red",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        textAlign:"left"
                                    }}>{formErrors.username}</p>}
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", columnGap: "4rem", paddingBottom:"40px"}}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", columnGap: "8px" }}>
                                <LockIcon fontSize='large' />
                                <Box>Password</Box>
                            </Box>
                            <Box>
                                <TextField id="outlined-basic" variant="outlined" type='password' size="small" sx={{
                                width: 250,
                                maxWidth: '100%',
                            }} name="password" value={credentials.password} onChange={handleChange}/>
                                {clear === true ? "" : <p style={{
                                    color: "red",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    textAlign:"left"
                                }}>{formErrors.password}</p>}
                            </Box>
                        </Box>
                        <hr style={{
                            border: "none",
                            height: "5px",
                            background: "#2E4053",
                            marginBottom: "40px"
                        }}/>
                        <Box>
                            <p style={{
                                cursor:"pointer",
                                color: hover === true ? "#5499C7" : "#1A5276",
                            }} onClick={() => navigate("/Registration")} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                                New user? Click here to Sign up!
                            </p>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding:"20px 40px"}}>
                            <Button variant="contained" size="large" onClick={handleSubmit}>Submit</Button>
                            <Button variant="contained" color="error" size="large" onClick={handleClear}>Clear</Button>
                        </Box>
                    </Card>

                </Box>
            } />
        </div>
    );
};

export default LoginPage;