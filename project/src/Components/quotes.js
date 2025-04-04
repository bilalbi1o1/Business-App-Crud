import React, { useState, useEffect, useRef } from "react";
import handleDuplicateRecord from "./duplicateRecord";
import axios from 'axios';
import {
    TableBody, TableContainer, TableHead, Paper, Table, TableCell, Button,
    TableRow, Dialog, DialogTitle, DialogContent, Stack, TextField,
    TablePagination
} from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Backend = process.env.REACT_APP_BACKEND;

const Quotes = () => {

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const [quotes, setQuotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [editedQuote, setEditedQuote] = useState(null);
    const [newQuote, setNewQuote] = useState({ phoneNumber: "", quote: "", operator: "" });

    const [page, setPage] = useState(0);
    const [rowPerPage, setRowPerPage] = useState(5);

    const handlePageChange = (_, newPage) => setPage(newPage);
    const handleRowPerPageChange = (event) => setRowPerPage(parseInt(event.target.value, 10));

    //Get Quotes from Backend
    const fetchData = async () => {
        try {
            const loginData = localStorage.getItem('login');
            if (!loginData) {
                throw new Error('No login data found in localStorage');
            }

            const { token } = JSON.parse(loginData);

            const response = await axios.get(`${Backend}/api/quotes`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            setQuotes(response.data.quotes); // Store fetched quotes in state
        } catch (error) {
            navigate('/error');
        }
    }

    // Open Dialog for Adding New Quote
    const handleAddQuote = () => {
        setEditedQuote(null);
        setNewQuote({ phoneNumber: "", quote: "", operator: "" });
        setOpen(true);
    };

    // Open Dialog for Editing Quote
    const handleEditQuote = (quote) => {
        setEditedQuote(quote);
        setNewQuote(quote);
        setOpen(true);
    };

    // Handle Save (Add or Edit)
    const handleSaveQuote = () => {
        if (editedQuote) {
            setQuotes(quotes.map(q => (q.phoneNumber === editedQuote.phoneNumber ? newQuote : q)));
        } else {
            setQuotes([...quotes, newQuote]);
        }
        setOpen(false);
    };

    // Handle Delete
    const handleDeleteQuote = (phoneNumber) => {
        setQuotes(quotes.filter(q => q.phoneNumber !== phoneNumber));
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
                <h2 style={{ margin: 0 }}>Quotes Management</h2>
                <Button color="inherit" variant="outlined" onClick={handleAddQuote}>Add Quote</Button>
            </header>

            <Paper sx={{ margin: "1%" }}>
                <div style={{ margin: "1%" }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: 'midnightblue',
                            color: '#fff',
                            borderRadius: '10px',
                            padding: '10px',
                            textDecoration: 'none',
                            marginRight: '10px',
                            '&:hover': {
                                backgroundColor: 'darkblue'
                            }
                        }}
                        onClick={handleAddQuote}
                    >
                        Add New (+)
                    </Button>
                    <Link to="/Records"
                        style={{
                            color: '#fff',
                            backgroundColor: 'midnightBlue',
                            borderRadius: '10px',
                            padding: '10px',
                            textDecoration: 'none'
                        }}>
                        Records
                    </Link>
                </div>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: "midnightblue" }}>
                                <TableCell sx={{ color: "#fff", textAlign: "center" }} align="center">Quote ID</TableCell>
                                <TableCell sx={{ color: "#fff", textAlign: "center" }} align="center">Phone Number</TableCell>
                                <TableCell sx={{ color: "#fff", textAlign: "center" }} align="center">Quote</TableCell>
                                <TableCell sx={{ color: "#fff", textAlign: "center" }} align="center">Operator</TableCell>
                                <TableCell sx={{ color: "#fff", textAlign: "center" }} align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {quotes
                                .filter(q =>
                                    Object.values(q).some(value =>
                                        String(value).toLowerCase().includes(searchQuery)
                                    )
                                )
                                .slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                                .map((quote) => (
                                    <TableRow key={quote.phoneNumber}>
                                        <TableCell align="center">{quote.id}</TableCell>
                                        <TableCell align="center">{quote.phoneNumber}</TableCell>
                                        <TableCell align="center">{quote.quote}</TableCell>
                                        <TableCell align="center">{quote.operator}</TableCell>
                                        <TableCell align="center" style={{ display: "flex", justifyContent: "center" }}>
                                            <Button color="primary" size="small" variant="contained" style={{ margin: "5px" }} onClick={() => handleEditQuote(quote)}>Edit</Button>
                                            <Button color="error" size="small" variant="contained" style={{ margin: "5px" }} onClick={() => handleDeleteQuote(quote.phoneNumber)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5]}
                    rowsPerPage={rowPerPage}
                    page={page}
                    count={quotes.length}
                    component={'div'}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowPerPageChange}
                />
            </Paper>

            {/* Add/Edit Quote Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editedQuote ? "Edit Quote" : "Add Quote"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} margin={2}>
                        <TextField label="Phone Number" variant="outlined" fullWidth
                            value={newQuote.phoneNumber}
                            onChange={(e) => setNewQuote({ ...newQuote, phoneNumber: e.target.value })}
                            disabled={!!editedQuote}
                        />
                        <TextField label="Quote" variant="outlined" fullWidth
                            value={newQuote.quote}
                            onChange={(e) => setNewQuote({ ...newQuote, quote: e.target.value })}
                        />
                        <TextField label="Operator" variant="outlined" fullWidth
                            value={newQuote.operator}
                            onChange={(e) => setNewQuote({ ...newQuote, operator: e.target.value })}
                        />
                        <Button variant="contained" color="primary" onClick={handleSaveQuote}>
                            {editedQuote ? "Update Quote" : "Add Quote"}
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Quotes;