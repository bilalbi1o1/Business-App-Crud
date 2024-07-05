import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
    TableBody, TableContainer, TableHead, Paper, Table, TableCell, Button,
    TableRow, Dialog, DialogTitle, DialogContent, Stack, TextField,
    TablePagination
} from "@mui/material";
import './project.css';
import { Link,useNavigate } from 'react-router-dom';

const Project = () => {
    const columns = [
        { id: 'ref', name: 'Ref #' },
        { id: 'date', name: 'Date' },
        { id: 'firstName', name: 'First Name' },
        { id: 'lastName', name: 'Last Name' },
        { id: 'product', name: 'Product' },
        { id: 'issue', name: 'Issue' },
        { id: 'imeiSn', name: 'IMEI' },
        { id: 'notes', name: 'Notes' },
        { id: 'price', name: 'Price' },
        { id: 'email', name: 'Email' },
        { id: 'phoneCell', name: 'Phone Cell' },
        { id: 'phoneHome', name: 'Phone Home' },
        { id: 'employeeName', name: 'Employ Name' },
        { id: 'pickupDate', name: 'PickUp Time' },
        { id: 'remarks', name: 'Remarks' },
    ]

    const [open, openChange] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        try {
            const loginData = localStorage.getItem('login');
            if (!loginData) {
                throw new Error('No login data found in localStorage');
            }
    
            const { token } = JSON.parse(loginData);
            console.log('Retrieved token:', token); // Log the token to see if it's being retrieved
    
            const response = await axios.get('http://localhost:8000/api/users', {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
    
            setUsers(response.data);
        } catch (error) {            
            navigate('/error');
            // console.error('Error fetching data:', error);
        }
    };
    
    

    const [users, setUsers] = useState([]);
    const [editedUser, setEditedUser] = useState();

    const [ref, refChange] = useState(0);
    const [firstName, firstNameChange] = useState('');
    const [lastName, lastNameChange] = useState('');
    const [date, dateChange] = useState('');
    const [product, productChange] = useState('');
    const [issue, issueChange] = useState('');
    const [imeiSn, imeiChange] = useState(0);
    const [notes, notesChange] = useState('');
    const [price, priceChange] = useState(0);
    const [email, emailChange] = useState('');
    const [phoneCell, phoneCellChange] = useState('');
    const [phoneHome, phoneHomeChange] = useState('');
    const [employeeName, employNameChange] = useState('');
    const [pickupDate, pickupDateChange] = useState('');
    const [remarks, remarksChange] = useState('');
    const [rowPerPage, rowPerPageChange] = useState(4);
    const [page, pageChange] = useState(0);

    const handlePageChange = (event, newpage) => {
        pageChange(newpage);
    }

    const handleRowPerPageChange = (event) => {
        handleRowPerPageChange(event.target.value);
        pageChange(0);
    }

    const handleDateChange = event => {
        dateChange(event.target.value);
    };
    const handlePickupDateChange = event => {
        pickupDateChange(event.target.value);
    };

    const closePopUp = () => {
        openChange(false);
        setEditedUser(null);

        //Reset Form Fields
        refChange(0);
        firstNameChange('');
        lastNameChange('');
        dateChange('');
        productChange('');
        issueChange('');
        imeiChange(0);
        notesChange('');
        priceChange(0);
        emailChange('');
        phoneCellChange('');
        phoneHomeChange('');
        employNameChange('');
        pickupDateChange('');
        remarksChange('');
    }

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const _obj = { ref, firstName, lastName, date: formatDate(date), notes, issue, imeiSn, product, price, remarks, email, phoneCell, phoneHome, pickupDate: formatDate(pickupDate), employeeName };
        console.log(_obj);

        try {
            const response = await axios.patch(`http://localhost:8000/api/users/${editedUser.ref}`, _obj, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Record updated:', response.data);
            await fetchData();
            closePopUp();
        } catch (error) {
            console.error('Error updating record:', error);
        }
    };

    const deleteUser = (ref) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                axios.delete(`http://localhost:8000/api/users/${ref}`);
                console.log('Record deleted:', ref);
                setUsers(users.filter(user => user.ref !== ref));
            } catch (error) {
                console.error('Error deleting record:', error);
            }
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    const openEditDialog = () => {
        // Open the dialog box
        openChange(true);
    };

    const editRecord = (ref) => {
        // Find the user object with the provided userId
        const userToEdit = users.find(user => user.ref === ref);

        // Update state to store the user being edited
        setEditedUser(userToEdit);

        // Prefill the form fields with the user data
        refChange(userToEdit.ref);
        firstNameChange(userToEdit.firstName);
        lastNameChange(userToEdit.lastName);
        dateChange(userToEdit.date.split("T")[0]); // Extract date part from ISO 8601 string
        productChange(userToEdit.product);
        issueChange(userToEdit.issue);
        imeiChange(userToEdit.imeiSn);
        notesChange(userToEdit.notes);
        priceChange(userToEdit.price);
        emailChange(userToEdit.email);
        phoneCellChange(userToEdit.phoneCell);
        phoneHomeChange(userToEdit.phoneHome);
        employNameChange(userToEdit.employeeName);
        pickupDateChange(userToEdit.pickupDate.split("T")[0]); // Extract date part from ISO 8601 string
        remarksChange(userToEdit.remarks);

        openEditDialog();
    };

    return (
        <div>
            <Paper sx={{ margin: "1%" }}>
                <div style={{ margin: "1%" }} >
                    <Link to="/addRecord" style={{ color: '#fff', backgroundColor: 'midnightBlue', borderRadius: '10px', padding: '10px', textDecoration: 'none' }}>
                        Add New (+)
                    </Link>
                </div>
                <div style={{ margin: "1%" }} >
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: "midnightBLue", textAlign: "center" }} >
                                    {columns.map((column) =>
                                        <TableCell style={{ color: "#fff" }} key={column.id}> {column.name} </TableCell>
                                    )}
                                    <TableCell style={{ color: "#fff" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users
                                    .slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                                    .map((user) => (
                                        <TableRow key={user.ref}>
                                            <TableCell>{user.ref}</TableCell>
                                            <TableCell>{user.date}</TableCell>
                                            <TableCell>{user.firstName}</TableCell>
                                            <TableCell>{user.lastName}</TableCell>
                                            <TableCell>{user.product}</TableCell>
                                            <TableCell>{user.issue}</TableCell>
                                            <TableCell>{user.imeiSn}</TableCell>
                                            <TableCell>{user.notes}</TableCell>
                                            <TableCell>{user.price}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.phoneCell}</TableCell>
                                            <TableCell>{user.phoneHome}</TableCell>
                                            <TableCell>{user.employeeName}</TableCell>
                                            <TableCell>{user.pickupDate}</TableCell>
                                            <TableCell>{user.remarks}</TableCell>
                                            <TableCell style={{ display: "flex" }} >
                                                <Button color='primary' variant="contained" onClick={() => editRecord(user.ref)}>Edit</Button>
                                                <Button color='error' variant="contained" style={{ margin: "2px" }} onClick={() => deleteUser(user.ref)}>Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination rowsPerPageOptions={[4]}
                        rowsPerPage={rowPerPage}
                        page={page}
                        count={users.length}
                        component={'div'}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowPerPageChange}>
                    </TablePagination>
                </div>
            </Paper>

            <Dialog open={open} onClose={closePopUp} fullWidth maxWidth="sm">
                <DialogTitle>
                    <span>{'Edit Record'}</span>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmitEdit} >
                        <Stack spacing={2} margin={2} >
                            <TextField value={editedUser ? editedUser.ref : ref} onChange={e => { refChange(e.target.value) }} variant="outlined" label="ref#" disabled={!!editedUser} ></TextField>
                            <TextField value={firstName} onChange={e => { firstNameChange(e.target.value) }} variant="outlined" label="First Name" ></TextField>
                            <TextField value={lastName} onChange={e => { lastNameChange(e.target.value) }} variant="outlined" label="Last Name" ></TextField>
                            <TextField
                                label="Date"
                                type="date"
                                variant="outlined"
                                value={date}
                                onChange={handleDateChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: "yyyy-MM-dd",
                                    },
                                }}
                            />
                            <TextField value={product} onChange={e => { productChange(e.target.value) }} variant="outlined" label="Product" ></TextField>
                            <TextField value={issue} onChange={e => { issueChange(e.target.value) }} variant="outlined" label="Issue" ></TextField>
                            <TextField value={imeiSn} onChange={e => { imeiChange(e.target.value) }} variant="outlined" label="IMEI" ></TextField>
                            <TextField multiline maxRows={2} minRows={2} value={notes} onChange={e => { notesChange(e.target.value) }} variant="outlined" label="Notes" ></TextField>
                            <TextField value={price} onChange={e => { priceChange(e.target.value) }} variant="outlined" label="Price" ></TextField>
                            <TextField value={email} onChange={e => { emailChange(e.target.value) }} variant="outlined" label="Email" ></TextField>
                            <TextField value={phoneCell} onChange={e => { phoneCellChange(e.target.value) }} variant="outlined" label="Cell Number" ></TextField>
                            <TextField value={phoneHome} onChange={e => { phoneHomeChange(e.target.value) }} variant="outlined" label="Phone Number" ></TextField>
                            <TextField value={employeeName} onChange={e => { employNameChange(e.target.value) }} variant="outlined" label="Employ Name" ></TextField>
                            <TextField
                                label="PickUp Date"
                                type="date"
                                variant="outlined"
                                value={pickupDate}
                                onChange={handlePickupDateChange}
                                InputLabelProps={{
                                    shrink: true,
                                }} />
                            <TextField multiline maxRows={2} minRows={2} value={remarks} onChange={e => { remarksChange(e.target.value) }} variant="outlined" label="Remarks" ></TextField>
                            <Button variant='contained' type="submit">
                                {'Update'}
                            </Button>
                        </Stack>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Project;

