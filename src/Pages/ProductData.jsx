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
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 1000,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const ProductData = () => {

  const Inputvalues = { productId: "", ProductName: "", orderId: "", orderStatus: "Active", price: "", sales: "" };
  const URL = "https://localhost:7094/api/Product";
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(dayjs(new Date()));
  const [products, setProducts] = useState(Inputvalues);
  const [formErrors, setFormErrors] = useState({});
  const [clear, setClear] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [update, setUpdate] = useState(false);
  const [updates, setUpdates] = useState(false);
  const [updateValues, setUpdateValues] = useState({});
  const [datas, setDatas] = useState([]);

  const handleCreate = () => {
    setOpen(true);
    setProducts(Inputvalues);
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

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    getData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducts({ ...products, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validation(products));
    setClear(false);
    setSubmit(true);
  };

  const handleEdit = (values) => {
    var Sales = "";
    setUpdateValues(values);
    if (values.orderStatus === "Active") {
      values.orderStatus = "Pending";
    }
    const updateValue = {
      productId: values.productId,
      ProductName: values.productName,
      orderId: values.orderId,
      orderStatus: values.orderStatus,
      price: values.price,
      sales: values.sales
    };
    setProducts(updateValue);
    setOpen(true);
    setUpdate(true);
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && submit === true) {
      console.log(products);
      const data = {        
          "productId": products.productId,
          "productName": products.ProductName,
          "orderId": products.orderId,
          "orderStatus": products.orderStatus,
          "date": date.format("DD-MM-YYYY"),
          "price": products.price,
          "sales": products.sales
      };
      axios.post(URL,data).then(() => {        
        window.alert('Submited Successfully');
        setOpen(false);
        getData();
    }).catch((error) => {
        window.alert(error);
    })
    }
    if (Object.keys(formErrors).length === 0 && updates === true) {
      console.log(products);
      const data = {        
          "productId": products.productId,
          "productName": products.ProductName,
          "orderId": products.orderId,
          "orderStatus": products.orderStatus,
          "date": date.format("DD-MM-YYYY"),
          "price": products.price,
          "sales": products.sales
      };
      axios.put(`${URL}/${products.productId}`,data).then(() => {        
        window.alert('updated Successfully');
        setOpen(false);
        getData();
    }).catch((error) => {
        window.alert(error);
    })
    }
  }, [formErrors]);

  const handleUpdate = (e) => {
    console.log(products);
    setFormErrors(validation(products));
    setUpdates(true);
  };

  const updateClear = () => {
    setClear(true);
    const updateClears = { productId: updateValues.productId, ProductName: "", orderId: "", orderStatus: updateValues.orderStatus, price: "", sales: "" };
    setProducts(updateClears);
  };

  const handleClear = () => {
    setProducts(Inputvalues);
    setClear(true);
  };

  const handleDelete = (i) => {
    if(window.confirm(`Are you sure to delete these Product ${i}`) == true){
      axios.delete(`${URL}/${i}`).then((result) => {
        if(result.status === 200){
          getData();
        }
      }).catch((error) => {
        window.alert(error);
      })
    }
  }

  const validation = (values) => {
    const error = {};

    if (!values.productId) {
      error.productId = "product Id is required!";
    }
    if (!values.ProductName) {
      error.productName = "Product Name is required!";
    }
    if (!values.orderId) {
      error.orderId = "order Id is required!";
    }
    if (!values.price) {
      error.price = "Price is required!";
    }
    if (!values.sales) {
      error.sales = "Sales is required!";
    }

    return error;
  };

  return (
    <div>
      <Box>
        <Box>
          <h2>Product Sales Data</h2>
          <Button variant="contained" size='Large' style={{
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "30px"
          }} startIcon={<AddIcon />} onClick={handleCreate}>Create New</Button>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 600 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ fontSize: "17px", fontWeight: "bold" }}>Product Id</StyledTableCell>
                  <StyledTableCell style={{ fontSize: "17px", fontWeight: "bold" }}>Product Name</StyledTableCell>
                  <StyledTableCell style={{ fontSize: "17px", fontWeight: "bold" }}>Order Id</StyledTableCell>
                  <StyledTableCell style={{ fontSize: "17px", fontWeight: "bold" }}>Order Status</StyledTableCell>
                  <StyledTableCell style={{ fontSize: "17px", fontWeight: "bold" }}>Date</StyledTableCell>
                  <StyledTableCell style={{ fontSize: "17px", fontWeight: "bold" }}>Price</StyledTableCell>
                  <StyledTableCell style={{ fontSize: "17px", fontWeight: "bold" }}>Sales</StyledTableCell>
                  <StyledTableCell style={{ fontSize: "17px", fontWeight: "bold" }}>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datas.map((row) => (
                  <StyledTableRow key={row.productId}>
                    <StyledTableCell><b>{row.productId}</b></StyledTableCell>
                    <StyledTableCell>{row.productName}</StyledTableCell>
                    <StyledTableCell>{row.orderId}</StyledTableCell>
                    <StyledTableCell>{row.orderStatus}</StyledTableCell>
                    <StyledTableCell>{row.date}</StyledTableCell>
                    <StyledTableCell>{row.price}</StyledTableCell>
                    <StyledTableCell>{row.sales}</StyledTableCell>
                    <StyledTableCell style={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "10px"
                    }}>
                      <Button variant="outlined" size='small' onClick={() => { handleEdit(row); }} style={{
                        width: 100
                      }}>Edit</Button>
                      <Button variant="outlined" size='small' color='error' onClick={() => { handleDelete(row.productId); }} style={{
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
            <Box id="header" sx={{ display: "flex", AlignItems: "center", justifyContent: "space-between" }}>
              <div style={{
                fontSize: "28px",
                fontWeight: "500"
              }}>{update === false ? "Create Product Data" : "Update Product Data"}</div>
              <Button variant="contained" size='small' color='error' onClick={handleClose} sx={{ padding: "10px 5px" }}>
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
              <Grid container spacing={4} sx={{ display: "flex", alignItem: "center", textAlign: "left" }}>
                <Grid item xs={4}>
                  <div>Product Id</div>
                  <TextField id="outlined-basic" variant="outlined" size="small" type="number" sx={{
                    minWidth: 250,
                    maxWidth: '100%',
                    marginTop: "10px"
                  }} InputProps={{
                    readOnly: update === false ? false : true,
                  }} name="productId" value={products.productId} onChange={handleChange} />
                  {clear === true ? "" : <p style={{
                    color: "red",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}>{formErrors.productId}</p>}
                </Grid>
                <Grid item xs={4}>
                  <div>Product Name</div>
                  <TextField id="outlined-basic" type="text" variant="outlined" size="small" sx={{
                    minWidth: 250,
                    maxWidth: '100%',
                    marginTop: "10px"
                  }} name="ProductName" value={products.ProductName} onChange={handleChange} />
                  {clear === true ? "" : <p style={{
                    color: "red",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}>{formErrors.productName}</p>}
                </Grid>
                <Grid item xs={4}>
                  <div>Order Id</div>
                  <TextField id="outlined-basic" type="text" variant="outlined" size="small" sx={{
                    minWidth: 250,
                    maxWidth: '100%',
                    marginTop: "10px"
                  }} name="orderId" value={products.orderId} onChange={handleChange} />
                  {clear === true ? "" : <p style={{
                    color: "red",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}>{formErrors.orderId}</p>}
                </Grid>
                <Grid item xs={4}>
                  <div>Order Status</div>
                  {update === false ?
                    <TextField id="outlined-basic" type="text" variant="outlined" size="small" sx={{
                      minWidth: 250,
                      maxWidth: '100%',
                      marginTop: "10px"
                    }} InputProps={{
                      readOnly: true,
                    }} name="orderStatus" value={products.orderStatus} onChange={handleChange} />
                    :
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      size="small"
                      value={products.orderStatus}
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
                <Grid item xs={4}>
                  <div>Price</div>
                  <TextField id="outlined-basic" variant="outlined" type="number" size="small" sx={{
                    maxWidth: '80%',
                    marginTop: "10px"
                  }} InputProps={{
                    endAdornment: <InputAdornment position="end">USD</InputAdornment>,
                  }} name="price" value={products.price} onChange={handleChange} />
                  {clear === true ? "" : <p style={{
                    color: "red",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}>{formErrors.price}</p>}
                </Grid>
                <Grid item xs={4}>
                  <div>Sales</div>
                  <TextField id="outlined-basic" type="text" variant="outlined" size="small" sx={{
                    minWidth: 250,
                    maxWidth: '100%',
                    marginTop: "10px"
                  }} name="sales" value={products.sales} onChange={handleChange} />
                  {clear === true ? "" : <p style={{
                    color: "red",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}>{formErrors.sales}</p>}
                </Grid>
                <Grid item xs={4}>
                  <div>Date</div>
                  <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DatePicker sx={{
                      minWidth: 250,
                      maxWidth: '100%',
                      marginTop: "10px",
                      marginBottom: "1px"
                    }} format="DD-MM-YYYY" autoOk={true} defaultValue={date} onChange={(e) => { setDate(e); }} />
                  </LocalizationProvider>
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

export default ProductData;