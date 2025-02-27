import React, { useState, useEffect, useRef } from "react";
import { ReactToPrint } from 'react-to-print';
import axios from 'axios';
import {
    TableBody, TableContainer, TableHead, Paper, Table, TableCell, Button,
    TableRow, Dialog, DialogTitle, DialogContent, Stack, TextField,
    TablePagination
} from "@mui/material";
import './project.css';
import { Link, useNavigate } from 'react-router-dom';

const Backend = process.env.REACT_APP_BACKEND;

const Project = () => {
    const columns = [
        { id: 'ref', name: 'Ref #' },
        { id: 'date', name: 'Date' },
        { id: 'firstName', name: 'First Name' },
        { id: 'lastName', name: 'Last Name' },
        { id: 'product', name: 'Product' },
        { id: 'issue', name: 'Issue' },
        { id: 'imei', name: 'IMEI' },
        { id: 'notes', name: 'Notes' },
        { id: 'price', name: 'Price' },
        { id: 'email', name: 'Email' },
        { id: 'cellNumber', name: 'Phone Cell' },
        { id: 'phoneNumber', name: 'Phone Home' },
        { id: 'employeeName', name: 'Employ Name' },
        { id: 'pickUpTime', name: 'PickUp Time' },
        { id: 'dateTime', name: 'Date & Time' },
        { id: 'remarks', name: 'Remarks' },
    ]

    const [open, openChange] = useState(false);
    const navigate = useNavigate();

    const storedData = localStorage.getItem('login');
    const parsedData = storedData ? JSON.parse(storedData) : null;
    const userName = parsedData ? parsedData.name : "Guest";
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [emailRemarks, setEmailRemarks] = useState('');


    useEffect(() => {
        fetchData();
    }, []);

    const printUser = (user) => {
        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
      <!DOCTYPE html>
<html>
<head>
    <title>Tech Buy</title>
    <style>
        /* Global Styles */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .container-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .container {
            max-width: 900px;
            width: 100%;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 10px; /* Space between duplicates */
        }

        /* Header Styles */
        h2 {
            text-align: center;
            color: #003366;
            font-size: 24px;
            margin: 0 0 10px;
        }

        .contact-info {
            text-align: center;
            margin-bottom: 10px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 5px;
        }

        .contact-info p {
            margin: 2px 0;
            font-size: 12px;
            color: #555;
        }

        /* Print Container */
        .print-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        /* Column Styles */
        .column {
            font-size: 12px;
            color: #333;
            line-height: 1.4;
        }

        .column p {
            margin: 2px 0;
            padding: 2px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .column p:last-child {
            border-bottom: none;
        }

        .column strong {
            color: #003366;
        }

        /* Center Logo */
        .container img {
            display: block;
            margin: 0 auto;
            max-width: 100%;
        }

        /* Print Media Query */
        @media print {
            body {
                margin: 0;
                padding: 0;
                background: none;
                display: block;
            }

            .container-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .container {
                max-width: 100%;
                padding: 10px;
                box-shadow: none;
                border: none;
                page-break-after: avoid; /* Prevents page break */
            }

            h2 {
                font-size: 20px;
                margin-bottom: 5px;
            }

            .contact-info p {
                font-size: 10px;
            }

            .column {
                font-size: 10px;
                line-height: 1.2;
            }
        }
    </style>
</head>
<body>
    <div class="container-wrapper">
        <!-- First Copy -->
        <div class="container">
            <!-- Header and Contact Information -->
            <img src="/techBuy.jpg" alt="Tech Buy Logo" />
            <div class="contact-info">
                <p>17310 Yonge St., Unit 12, Newmarket, Ontario, L3Y 7S1</p>
                <p>Ph: 905-830-4343 | Email: sales@techbuy.ca</p>
            </div>

            <!-- Print Container with User Details -->
            <div class="print-container">
                <div class="column">
                    <p><strong>Ref #:</strong> ${user.ref}</p>
                    <p><strong>Date:</strong> ${user.date}</p>
                    <p><strong>First Name:</strong> ${user.firstName}</p>
                    <p><strong>Last Name:</strong> ${user.lastName}</p>
                    <p><strong>Product:</strong> ${user.product}</p>
                    <p><strong>Issue:</strong> ${user.issue}</p>
                    <p><strong>IMEI S/N:</strong> ${user.imei}</p>
                    <p><strong>Price:</strong> ${user.price}</p>
                </div>

                <div class="column">
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone Cell:</strong> ${user.cellNumber}</p>
                    <p><strong>Phone Home:</strong> ${user.phoneNumber}</p>
                    <p><strong>Employee Name:</strong> ${user.employeeName}</p>
                    <p><strong>Pickup Time:</strong> ${user.pickupTime}</p>
                    <p><strong>Date & Time:</strong> ${user.dateTime}</p>
                    <p><strong>Remarks:</strong> ${user.remarks}</p>
                </div>
            </div>
        </div>

        <!-- Second Copy -->
        <div class="container">
            <img src="/techBuy.jpg" alt="Tech Buy Logo" />
            <div class="contact-info">
                <p>17310 Yonge St., Unit 12, Newmarket, Ontario, L3Y 7S1</p>
                <p>Ph: 905-830-4343 | Email: sales@techbuy.ca</p>
            </div>

            <div class="print-container">
                <div class="column">
                    <p><strong>Ref #:</strong> ${user.ref}</p>
                    <p><strong>Date:</strong> ${user.date}</p>
                    <p><strong>First Name:</strong> ${user.firstName}</p>
                    <p><strong>Last Name:</strong> ${user.lastName}</p>
                    <p><strong>Product:</strong> ${user.product}</p>
                    <p><strong>Issue:</strong> ${user.issue}</p>
                    <p><strong>IMEI S/N:</strong> ${user.imei}</p>
                    <p><strong>Price:</strong> ${user.price}</p>
                </div>

                <div class="column">
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone Cell:</strong> ${user.cellNumber}</p>
                    <p><strong>Phone Home:</strong> ${user.phoneNumber}</p>
                    <p><strong>Employee Name:</strong> ${user.employeeName}</p>
                    <p><strong>Pickup Time:</strong> ${user.pickupTime}</p>
                    <p><strong>Date & Time:</strong> ${user.dateTime}</p>
                    <p><strong>Remarks:</strong> ${user.remarks}</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        window.onload = function() {
            window.print();
            window.close();
        };
    </script>
</body>
</html>
`);

        printWindow.document.close();
    };


    const fetchData = async () => {
        try {
            const loginData = localStorage.getItem('login');
            if (!loginData) {
                throw new Error('No login data found in localStorage');
            }

            const { token } = JSON.parse(loginData);

            const response = await axios.get(`${Backend}/api/users`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            setUsers(response.data);
        } catch (error) {
            navigate('/error');
            // console.error('Error fetching data:', error);
        }
    };

    const handleOpenEmailDialog = (user) => {
        setSelectedUser(user);
        setEmailDialogOpen(true);
    };


    const [users, setUsers] = useState([]);
    const [editedUser, setEditedUser] = useState();
    const [searchQuery, setSearchQuery] = useState('');

    const [ref, refChange] = useState(0);
    const [firstName, firstNameChange] = useState('');
    const [lastName, lastNameChange] = useState('');
    const [date, dateChange] = useState('');
    const [product, productChange] = useState('');
    const [issue, issueChange] = useState('');
    const [imei, imeiChange] = useState(0);
    const [notes, notesChange] = useState('');
    const [price, priceChange] = useState(0);
    const [email, emailChange] = useState('');
    const [cellNumber, cellNumberChange] = useState('');
    const [phoneNumber, phoneNumberChange] = useState('');
    const [employeeName, employNameChange] = useState('');
    const [pickUpTime, pickUpTimeChange] = useState('');
    const [dateTime, dateTimeChange] = useState('');
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
    const handlepickUpTimeChange = event => {
        pickUpTimeChange(event.target.value);
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
        cellNumberChange('');
        phoneNumberChange('');
        employNameChange('');
        pickUpTimeChange('');
        dateTimeChange('');
        remarksChange('');
    }

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const _obj = { ref, firstName, lastName, date: formatDate(date), notes, issue, imei, product, price, remarks, email, cellNumber, phoneNumber, pickUpTime: pickUpTime, dateTime, employeeName };
        console.log(_obj);

        const storedData = localStorage.getItem('login'); // Get stored JSON string
        const parsedData = storedData ? JSON.parse(storedData) : null; // Parse it to an object
        const token = parsedData ? parsedData.token : null;

        try {
            const response = await axios.patch(`${Backend}/api/users/${editedUser.ref}`, _obj, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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

                const storedData = localStorage.getItem('login'); // Get stored JSON string
                const parsedData = storedData ? JSON.parse(storedData) : null; // Parse it to an object
                const token = parsedData ? parsedData.token : null;

                axios.delete(`${Backend}/api/users/${ref}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
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
        // Find the user object with the provided ref
        const userToEdit = users.find(user => user.ref === ref);
        // Check if userToEdit exists
        if (!userToEdit) {
            console.error(`User with ref ${ref} not found`);
            return;
        }

        // Check if date exists before calling split
        const formattedDate = userToEdit.date ? userToEdit.date.split("T")[0] : "";

        // Update state to store the user being edited
        setEditedUser(userToEdit);

        // Prefill the form fields with the user data
        refChange(userToEdit.ref);
        firstNameChange(userToEdit.firstName);
        lastNameChange(userToEdit.lastName);
        dateChange(formattedDate);
        productChange(userToEdit.product);
        issueChange(userToEdit.issue);
        imeiChange(userToEdit.imei);
        notesChange(userToEdit.notes);
        priceChange(userToEdit.price);
        emailChange(userToEdit.email);
        cellNumberChange(userToEdit.cellNumber);
        phoneNumberChange(userToEdit.phoneNumber);
        employNameChange(userToEdit.employeeName);
        pickUpTimeChange(userToEdit.pickupTime);
        dateTimeChange(userToEdit.dateTime);
        remarksChange(userToEdit.remarks);

        openEditDialog();
    };

    const handleSendEmail = async () => {
        if (!selectedUser || !emailRemarks.trim()) {
            alert("Please enter remarks before sending.");
            return;
        }
    
        try {
            const loginData = localStorage.getItem("login"); // Get token from localStorage
            if (!loginData) {
                alert("You are not logged in. Please log in first.");
                return;
            }
    
            const { token } = JSON.parse(loginData);
    
            // Log the data before sending
            console.log("Sending request to:", `${Backend}/api/users/send-email`);
            console.log("Request Headers:", {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            });
            console.log("Request Body:", {
                email: selectedUser.email,
                firstName: selectedUser.firstName,
                lastName: selectedUser.lastName,
                remarks: emailRemarks,
            });
    
            const response = await axios.post(
                `${Backend}/api/users/send-email`,
                {
                    email: selectedUser.email,
                    firstName: selectedUser.firstName,
                    lastName: selectedUser.lastName,
                    remarks: emailRemarks,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach token
                        "Content-Type": "application/json",
                    },
                }
            );
    
            alert(response.data.message);
            setEmailDialogOpen(false);
        } catch (error) {
            console.error("Error sending email:", error.response?.data || error.message);
            alert(`Failed to send email: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "midnightBlue", color: "#fff" }}>
                <TextField
                    variant="outlined"
                    placeholder="Search..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                    sx={{ backgroundColor: "#fff", borderRadius: "5px", minWidth: "200px" }}
                />
                {/* Left Section: User Greeting */}
                <div style={{ flex: 1, textAlign: "left", paddingLeft: "10px" }}>
                    <h2 style={{ margin: 0 }}>Hi, {userName}</h2>
                </div>
                <Button color="inherit" variant="outlined" onClick={() => { localStorage.removeItem('login'); navigate('/'); }}>
                    Logout
                </Button>
            </header>


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
                                    .filter(user =>
                                        Object.values(user).some(value =>
                                            String(value).toLowerCase().includes(searchQuery)
                                        )
                                    )
                                    .sort((a, b) => b.ref - a.ref)
                                    .slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                                    .map((user) => (
                                        <TableRow key={user.ref}>
                                            <TableCell>{user.ref}</TableCell>
                                            <TableCell>{user.date}</TableCell>
                                            <TableCell>{user.firstName}</TableCell>
                                            <TableCell>{user.lastName}</TableCell>
                                            <TableCell>{user.product}</TableCell>
                                            <TableCell>{user.issue}</TableCell>
                                            <TableCell>{user.imei}</TableCell>
                                            <TableCell>{user.notes}</TableCell>
                                            <TableCell>{user.price}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.cellNumber}</TableCell>
                                            <TableCell>{user.phoneNumber}</TableCell>
                                            <TableCell>{user.employeeName}</TableCell>
                                            <TableCell>{user.pickupTime}</TableCell>
                                            <TableCell>{user.dateTime}</TableCell>
                                            <TableCell>{user.remarks}</TableCell>
                                            <TableCell style={{ display: "flex" }} >
                                                <Button color='primary' variant="contained" onClick={() => editRecord(user.ref)}>Edit</Button>
                                                <Button color='error' variant="contained" style={{ margin: "2px" }} onClick={() => deleteUser(user.ref)}>Delete</Button>
                                                <Button color='success' variant="contained" style={{ margin: "2px" }} onClick={() => printUser(user)}>Print</Button>
                                                <Button color="secondary" variant="contained" style={{ margin: "2px" }} onClick={() => handleOpenEmailDialog(user)}>Email</Button>
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
                            <TextField value={imei} onChange={e => { imeiChange(e.target.value) }} variant="outlined" label="IMEI" ></TextField>
                            <TextField multiline maxRows={2} minRows={2} value={notes} onChange={e => { notesChange(e.target.value) }} variant="outlined" label="Notes" ></TextField>
                            <TextField value={price} onChange={e => { priceChange(e.target.value) }} variant="outlined" label="Price" ></TextField>
                            <TextField value={email} onChange={e => { emailChange(e.target.value) }} variant="outlined" label="Email" ></TextField>
                            <TextField value={cellNumber} onChange={e => { cellNumberChange(e.target.value) }} variant="outlined" label="Cell Number" ></TextField>
                            <TextField value={phoneNumber} onChange={e => { phoneNumberChange(e.target.value) }} variant="outlined" label="Phone Number" ></TextField>
                            <TextField value={employeeName} onChange={e => { employNameChange(e.target.value) }} variant="outlined" label="Employ Name" ></TextField>
                            <TextField
                                label="PickUp Time"
                                type="time"
                                variant="outlined"
                                value={pickUpTime}
                                onChange={handlepickUpTimeChange}
                                InputLabelProps={{
                                    shrink: true,
                                }} />
                            <TextField
                                label="Date & Time"
                                type="datetime-local"
                                variant="outlined"
                                value={dateTime}
                                onChange={e => dateTimeChange(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />

                            <TextField multiline maxRows={2} minRows={2} value={remarks} onChange={e => { remarksChange(e.target.value) }} variant="outlined" label="Remarks" ></TextField>
                            <Button variant='contained' type="submit">
                                {'Update'}
                            </Button>
                        </Stack>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Send Email</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} margin={2}>
                        <TextField label="Recipient Email" value={selectedUser?.email || ''} disabled fullWidth />
                        <TextField label="Recipient Name" value={`${selectedUser?.firstName} ${selectedUser?.lastName}`} disabled fullWidth />
                        <TextField
                            label="Remarks"
                            multiline
                            minRows={3}
                            value={emailRemarks}
                            onChange={(e) => setEmailRemarks(e.target.value)}
                            fullWidth
                        />
                        <Button variant="contained" color="primary" onClick={handleSendEmail}>
                            Send Email
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default Project;

