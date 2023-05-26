import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 16,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const style = {
    position: 'absolute',
    top: '50%',
    right: '50%',
    transform: 'translate(100%, -50%)',
    minWidth: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: 600,
    overflow: "scroll"
};

const Orders = () => {

    const Inputvalues = { orderId: "", orderType: "", orderDesc: "", orderStatus: "Active", quantity: "" };
    const URL = "https://localhost:7094/api/Order";
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(dayjs(new Date()));
    const [orders, setOrders] = useState(Inputvalues);
    const [formErrors, setFormErrors] = useState({});
    const [clear, setClear] = useState(true);
    const [submit, setSubmit] = useState(false);
    const [update, setUpdate] = useState(false);
    const [updates, setUpdates] = useState(false);
    const [search, setSearch] = useState("");
    const [updateValues, setUpdateValues] = useState({});
    const [datas, setDatas] = useState([]);
    const [id, setId] = useState();

    const handleCreate = () => {
        setOpen(true);
        setOrders(Inputvalues);
        setUpdate(false);
    };
    const handleClose = () => setOpen(false);

    const getData = () => {
        axios.get(URL).then((result) => {
            setDatas(result.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    const handleSearch = () => {
        if (search === "") {
            window.alert("Search field is empty");
            getData();
        } else {
            axios.get(`${URL}/${search}`).then((result) => {
                console.log(result.data);
                setDatas([result.data]);
            }).catch((error) => {
                window.alert("Order Id not found");
                getData();
                setSearch("");
            });
        }
        console.log(search);
    };

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/");
        }
        getData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrders({ ...orders, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validation(orders));
        setClear(false);
        setSubmit(true);
        setUpdate(false);
    };

    const handleEdit = (values) => {
        setUpdateValues(values);
        if (values.orderStatus === "Active") {
            values.orderStatus = "Pending";
        }
        const updateValue = {
            orderType: values.orderType,
            orderDesc: values.orderDesc,
            orderId: values.orderId,
            orderStatus: values.orderStatus,
            quantity: values.quantity,
        };
        setId(values.nId)
        setOrders(updateValue);
        setOpen(true);
        setUpdate(true);
        setSubmit(false);
    };

    useEffect(() => {
        console.log(formErrors);
        if (Object.keys(formErrors).length === 0 && submit === true) {
            console.log(orders);
            const data = {
                "orderId": orders.orderId,
                "orderStatus": orders.orderStatus,
                "quantity": orders.quantity,
                "orderType": orders.orderType,
                "orderDesc": orders.orderDesc,
                "createdDate": date.format("DD-MM-YYYY")
            };
            axios.post(URL, data).then(() => {
                window.alert('Submited Successfully');
                setOpen(false);
                getData();
            }).catch((error) => {
                window.alert(error);
            });
        }
        if (Object.keys(formErrors).length === 0 && updates === true) {
            console.log(orders);
            const data = {
                "nId": id,
                "orderId": orders.orderId,
                "orderStatus": orders.orderStatus,
                "quantity": orders.quantity,
                "orderType": orders.orderType,
                "orderDesc": orders.orderDesc,
                "createdDate": date.format("DD-MM-YYYY")
            };
            axios.put(`${URL}/${id}`, data).then(() => {
                window.alert('updated Successfully');
                setOpen(false);
                getData();
            }).catch((error) => {
                window.alert(error);
            });
        }
    }, [formErrors, submit, update]);

    const handleUpdate = (e) => {
        console.log(orders);
        setFormErrors(validation(orders));
        setUpdates(true);
    };

    const updateClear = () => {
        setClear(true);
        const updateClears = { orderId: updateValues.orderId, orderType: "", orderDesc: "", orderStatus: updateValues.orderStatus, quantity: "" };
        setOrders(updateClears);
    };

    const handleClear = () => {
        setOrders(Inputvalues);
        setClear(true);
    };

    const handleDelete = (i) => {
        if (window.confirm(`Are you sure to delete these Order ${i}`) == true) {
            axios.delete(`${URL}/${i}`).then((result) => {
                if (result.status === 200) {
                    getData();
                }
            }).catch((error) => {
                window.alert(error);
            });
        }
    };

    const validation = (values) => {
        const error = {};

        if (!values.orderId) {
            error.orderId = "Order Id is required!";
        }
        if (!values.orderType) {
            error.orderType = "Order Type is required!";
        }
        if (!values.orderDesc) {
            error.orderDesc = "Order Desc is required!";
        }
        if (!values.quantity) {
            error.quantity = "quantity is required!";
        }

        return error;
    };

    return (
        <div>
            <Box>
                <Box>
                    <h2>Orders Data</h2>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Button variant="contained" size='Large' style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            marginBottom: "30px"
                        }} startIcon={<AddIcon />} onClick={handleCreate}>Create New</Button>
                        <Paper
                            component="form"
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300, marginBottom: "30px" }}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Search Order NId"
                                inputProps={{ 'aria-label': 'search order Id' }}
                                type="number"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Box>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 600 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell style={{ fontSize: "17px", fontWeight: "bold" }}>NId</StyledTableCell>
                                    <StyledTableCell style={{ fontSize: "17px", fontWeight: "bold" }}>Order Id</StyledTableCell>
                                    <StyledTableCell style={{ fontSize: "17px", fontWeight: "bold" }}>Order Status</StyledTableCell>
                                    <StyledTableCell style={{ fontSize: "17px", fontWeight: "bold" }}>quantity</StyledTableCell>
                                    <StyledTableCell style={{ fontSize: "17px", fontWeight: "bold" }}>Order Type</StyledTableCell>
                                    <StyledTableCell style={{ fontSize: "17px", fontWeight: "bold" }}>Order Desc</StyledTableCell>
                                    <StyledTableCell style={{ fontSize: "17px", fontWeight: "bold" }}>CreatedAt</StyledTableCell>
                                    <StyledTableCell style={{ fontSize: "17px", fontWeight: "bold" }}>Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {datas.map((row) => (
                                    <StyledTableRow key={row.nId}>
                                        <StyledTableCell><b>{row.nId}</b></StyledTableCell>
                                        <StyledTableCell>{row.orderId}</StyledTableCell>
                                        <StyledTableCell>{row.orderStatus}</StyledTableCell>
                                        <StyledTableCell>{row.quantity}</StyledTableCell>
                                        <StyledTableCell>{row.orderType}</StyledTableCell>
                                        <StyledTableCell>{row.orderDesc}</StyledTableCell>
                                        <StyledTableCell>{row.createdDate}</StyledTableCell>
                                        <StyledTableCell style={{
                                            display: "flex",
                                            alignItems: "center",
                                            columnGap: "10px"
                                        }}>
                                            <Button variant="outlined" size='small' onClick={() => { handleEdit(row); }} style={{
                                                width: 100
                                            }}>Edit</Button>
                                            <Button variant="outlined" size='small' color='error' onClick={() => { handleDelete(row.nId); }} style={{
                                                width: 100
                                            }}>Delete</Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Modal
                    open={open}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Box id="header" sx={{ display: "flex", AlignItems: "center", justifyContent: "space-between", marginTop: "15px" }}>
                            <div style={{
                                fontSize: "28px",
                                fontWeight: "500"
                            }}>{update === false ? "Create Order Data" : "Update Order Data"}</div>
                            <Button variant="contained" size='small' color='error' onClick={handleClose} sx={{ padding: "2px 2px" }}>
                                <CloseIcon fontSize='large' />
                            </Button>
                        </Box>
                        <hr style={{
                            border: "none",
                            height: "2px",
                            background: "#2E4053",
                            margin: "20px 0px"
                        }} />
                        <Box id="body">
                            <Grid container spacing={2} sx={{ display: "flex", alignItem: "center", textAlign: "left" }}>
                                <Grid item xs={6}>
                                    <div>Order Id</div>
                                    <TextField id="outlined-basic" variant="outlined" size="small" type="number" sx={{
                                        minWidth: 250,
                                        maxWidth: '100%',
                                        marginTop: "10px"
                                    }} InputProps={{
                                        readOnly: update === false ? false : true,
                                    }} name="orderId" value={orders.orderId} onChange={handleChange} />
                                    {clear === true ? "" : <p style={{
                                        color: "red",
                                        fontSize: "14px",
                                        fontWeight: "500"
                                    }}>{formErrors.orderId}</p>}
                                </Grid>
                                <Grid item xs={6}>
                                    <div>Order Status</div>
                                    {update === false ?
                                        <TextField id="outlined-basic" type="text" variant="outlined" size="small" sx={{
                                            minWidth: 250,
                                            maxWidth: '100%',
                                            marginTop: "10px"
                                        }} InputProps={{
                                            readOnly: true,
                                        }} name="orderStatus" value={orders.orderStatus} onChange={handleChange} />
                                        :
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            size="small"
                                            value={orders.orderStatus}
                                            onChange={handleChange}
                                            name="orderStatus"
                                            sx={{
                                                minWidth: 250,
                                                maxWidth: '100%',
                                                marginTop: "10px"
                                            }}
                                        >
                                            <MenuItem value={"Pending"}>Pending</MenuItem>
                                            <MenuItem value={"Completed"}>Completed</MenuItem>
                                        </Select>
                                    }
                                </Grid>
                                <Grid item xs={6}>
                                    <div>Order Type</div>
                                    <TextField id="outlined-basic" type="text" variant="outlined" size="small" sx={{
                                        minWidth: 250,
                                        maxWidth: '100%',
                                        marginTop: "10px"
                                    }} name="orderType" value={orders.orderType} onChange={handleChange} />
                                    {clear === true ? "" : <p style={{
                                        color: "red",
                                        fontSize: "14px",
                                        fontWeight: "500"
                                    }}>{formErrors.orderType}</p>}
                                </Grid>
                                <Grid item xs={6}>
                                    <div>Quantity</div>
                                    <TextField id="outlined-basic" type="text" variant="outlined" size="small" sx={{
                                        minWidth: 250,
                                        maxWidth: '100%',
                                        marginTop: "10px"
                                    }} name="quantity" value={orders.quantity} onChange={handleChange} />
                                    {clear === true ? "" : <p style={{
                                        color: "red",
                                        fontSize: "14px",
                                        fontWeight: "500"
                                    }}>{formErrors.quantity}</p>}
                                </Grid>
                                <Grid item xs={6}>
                                    <div>Date</div>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <DatePicker sx={{
                                            minWidth: 250,
                                            maxWidth: '100%',
                                            marginTop: "10px",
                                            marginBottom: "1px"
                                        }} format="DD-MM-YYYY" autoOk={true} defaultValue={date} readOnly={true} onChange={(e) => { setDate(e); }} />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={6}>
                                    <div>Order Desc</div>
                                    <TextField id="outlined-basic" type="text" variant="outlined" size="small" sx={{
                                        minWidth: 250,
                                        maxWidth: '100%',
                                        marginTop: "10px"
                                    }} name="orderDesc" value={orders.orderDesc} onChange={handleChange} 
                                    multiline
                                    minRows={4}/>
                                    {clear === true ? "" : <p style={{
                                        color: "red",
                                        fontSize: "14px",
                                        fontWeight: "500"
                                    }}>{formErrors.orderDesc}</p>}
                                </Grid>
                            </Grid>
                        </Box>
                        <hr style={{
                            border: "none",
                            height: "2px",
                            background: "#2E4053",
                            margin: "40px 0px"
                        }} />
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0px 0px 20px 0px" }}>
                            <Button variant="contained" size="large" onClick={update === false ? handleSubmit : handleUpdate}>{update === false ? "Submit" : "Update"}</Button>
                            <Button variant="contained" color="error" size="large" onClick={update === false ? handleClear : updateClear}>Clear</Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </div>
    );
};

export default Orders;