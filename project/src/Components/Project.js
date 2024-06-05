import {
    TableBody, TableContainer, TableHead, Paper, Table, TableCell, Button
    , TableRow, Dialog, DialogTitle, DialogContent, Stack, TextField
} from "@mui/material"
import axios from 'axios';
import { useState } from "react"

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
        { id: 'pickUpTime', name: 'PickUp Time' },
        { id: 'remarks', name: 'Remarks' },
    ]

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
    const [pickUpTime, pickUpTimeChange] = useState('');
    const [remarks, remarksChange] = useState('');

    const [open, openChange] = useState(false);

    const openPopUp = () => {
        openChange(true);
    }
    const closePopUp = () => {
        openChange(false);
    }
    const add = () => {
        openPopUp();
    }

    const handleDateChange = event => {
        dateChange(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const _obj = { ref, firstName, lastName, date, notes, issue, imeiSn, product, price, remarks, email, phoneCell, phoneHome, pickUpTime, employeeName };
        console.log(_obj);


        const response = fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(_obj)

        
        });




    }
    return (
        <div>
            <Paper sx={{ margin: "1%" }}>
                <div style={{ margin: "1%" }} >
                    <Button onClick={add} variant="contained" >Add New (+)</Button>
                </div>
                <div style={{ margin: "1%" }} >
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: "midnightBLue" }} >
                                    {columns.map((column) =>
                                        <TableCell style={{ color: "#fff" }} key={column.id}> {column.name} </TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>

                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Paper>

            <Dialog open={open} onClose={closePopUp} fullWidth maxWidth="sm">
                <DialogTitle>
                    <span>Add Record</span>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit} >
                        <Stack spacing={2} margin={2} >
                            <TextField value={ref} onChange={e => { refChange(e.target.value) }} variant="outlined" label="ref#" ></TextField>
                            <TextField value={firstName} onChange={e => { firstNameChange(e.target.value) }} variant="outlined" label="First Name" ></TextField>
                            <TextField value={lastName} onChange={e => { lastNameChange(e.target.value) }} variant="outlined" label="Last Name" ></TextField>
                            <TextField
                                label="Select a Date"
                                type="date"
                                variant="outlined"
                                value={date}
                                onChange={handleDateChange}
                                InputLabelProps={{
                                    shrink: true,
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
                            <TextField value={pickUpTime} onChange={e => { pickUpTimeChange(e.target.value) }} variant="outlined" label="PickUp Time" ></TextField>
                            <TextField multiline maxRows={2} minRows={2} value={remarks} onChange={e => { remarksChange(e.target.value) }} variant="outlined" label="Remarks" ></TextField>
                            <Button variant='contained' type="submit">
                                Submit
                            </Button>
                        </Stack>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Project;