import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import { Box, Button, Card, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import Body from '../Components/Body';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const RegistrationPage = () => {

    const Formvalues = { username: "", password: "", confirmPassword: "", email: "", gender: "", city: "Select" };
    const URL = "https://localhost:7094/api/Credential/register";
    const [formData, setFormData] = useState(Formvalues);
    const [formErrors, setFormErrors] = useState({});
    const [clear, setClear] = useState(true);
    const [submit, setSubmit] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validation(formData));
        setClear(false);
        setSubmit(true);
    };

    const handleClear = () => {
        setFormData(Formvalues);
        setClear(true);
    };

    useEffect(() => {
        console.log(formErrors);
        if (Object.keys(formErrors).length === 0 && submit === true) {
            const data = {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                gender: formData.gender,
                city: formData.city
            }
            axios.post(URL,data).then((result) => {
                window.alert(result.data);
                navigate("/");
            }).catch((error) => {
                window.alert(error);
            })
            console.log(formData);           
        }
    }, [formErrors]);

    const validation = (values) => {
        const error = {};
        const regex = /[a-zA-Z][a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;

        if (!values.username) {
            error.username = "Username is required!";
        }
        if (!values.password) {
            error.password = "Password is required!";
        }
        if (!values.confirmPassword) {
            error.confirmpassword = "Confirm Password is required!";
        } else if (values.password !== values.confirmPassword) {
            error.confirmpassword = "password mismatch!";
        }
        if (!values.email) {
            error.email = "Email is required!";
        } else if (!regex.test(values.email)) {
            error.email = "Invalid email format";
        }
        if (!values.gender) {
            error.gender = "Gender is required!";
        }
        if (values.city === "Select") {
            error.city = "City is required!";
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
                    <PersonAddAlt1Icon sx={{ fontSize: "50px" }} />
                    Registration Page
                </Box>
            } />
            <Body content={
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 500, backgroundColor:"#5D6D7E" }}>
                    <Card sx={{
                        maxWidth: 675,
                        backgroundColor: "#FBFCFC",
                        color: "black",
                        fontSize: "22px",
                        fontWeight: 500,
                        padding: "40px 20px 0px 20px",

                    }}>
                        <Grid container spacing={4} sx={{ display: "flex", alignItem: "center", justifyContent: "center", textAlign: "left" }}>
                            <Grid item xs={6}>
                                <div>User name</div>
                                <TextField id="outlined-basic" variant="outlined" size="small" sx={{
                                    minWidth: 250,
                                    maxWidth: '100%',
                                    marginTop: "10px"
                                }} value={formData.username} name="username" onChange={handleChange} />
                                {clear === true ? "" : <p style={{
                                    color: "red",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}>{formErrors.username}</p>}

                            </Grid>
                            <Grid item xs={6}>
                                <div>Password</div>
                                <TextField id="outlined-basic" type="password" variant="outlined" size="small" sx={{
                                    minWidth: 250,
                                    maxWidth: '100%',
                                    marginTop: "10px"
                                }} value={formData.password} name="password" onChange={handleChange} />
                                {clear === true ? "" :
                                    <p style={{
                                        color: "red",
                                        fontSize: "14px",
                                        fontWeight: "500"
                                    }}>{formErrors.password}</p>
                                }
                            </Grid>
                            <Grid item xs={6}>
                                <div>Confirm password</div>
                                <TextField id="outlined-basic" type="password" variant="outlined" size="small" sx={{
                                    minWidth: 250,
                                    maxWidth: '100%',
                                    marginTop: "10px"
                                }} value={formData.confirmPassword} name="confirmPassword" onChange={handleChange} />
                                {clear === true ? "" :
                                    <p style={{
                                        color: "red",
                                        fontSize: "14px",
                                        fontWeight: "500"
                                    }}>{formErrors.confirmpassword}</p>
                                }
                            </Grid>
                            <Grid item xs={6}>
                                <div>Email</div>
                                <TextField id="outlined-basic" type="text" variant="outlined" size="small" sx={{
                                    minWidth: 250,
                                    maxWidth: '100%',
                                    marginTop: "10px"
                                }} value={formData.email} name="email" onChange={handleChange} />
                                {clear === true ? "" :
                                    <p style={{
                                        color: "red",
                                        fontSize: "14px",
                                        fontWeight: "500"
                                    }}>{formErrors.email}</p>
                                }
                            </Grid>
                            <Grid item xs={6}>
                                <div>Gender</div>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={formData.gender}
                                    name="gender"
                                    onChange={handleChange}
                                >
                                    <Box sx={{ display: "flex", minWidth: 250, maxWidth: '100%', marginTop: "10px" }}>
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                                    </Box>
                                </RadioGroup>
                                {clear === true ? "" :
                                    <p style={{
                                        color: "red",
                                        fontSize: "14px",
                                        fontWeight: "500"
                                    }}>{formErrors.gender}</p>
                                }
                            </Grid>
                            <Grid item xs={6}>
                                <div>City</div>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    size="small"
                                    value={formData.city}
                                    onChange={handleChange}
                                    name="city"
                                    sx={{
                                        minWidth: 250,
                                        maxWidth: '100%',
                                        marginTop: "10px"
                                    }}
                                >
                                    <MenuItem value={"Select"}>Select City</MenuItem>
                                    <MenuItem value={"Chennai"}>Chennai</MenuItem>
                                    <MenuItem value={"Mumbai"}>Mumbai</MenuItem>
                                    <MenuItem value={"Delhi"}>Delhi</MenuItem>
                                    <MenuItem value={"Kolkata"}>Kolkata</MenuItem>
                                    <MenuItem value={"Banglore"}>Banglore</MenuItem>
                                </Select>
                                {clear === true ? "" :
                                    <p style={{
                                        color: "red",
                                        fontSize: "14px",
                                        fontWeight: "500"
                                    }}>{formErrors.city}</p>
                                }
                            </Grid>
                        </Grid>
                        <hr style={{
                            border: "none",
                            height: "2px",
                            background: "#2E4053",
                            margin: "40px 0px"
                        }} />
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0px 0px 20px 0px" }}>
                            <Button variant="contained" size="large" onClick={handleSubmit}>Submit</Button>
                            <Button variant="contained" color="error" size="large" onClick={handleClear}>Clear</Button>
                        </Box>
                    </Card>
                </Box>
            } />
        </div>
    );
};

export default RegistrationPage;