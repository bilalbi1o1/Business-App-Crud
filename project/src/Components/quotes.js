import React, { useState, useEffect, useRef } from "react";
import handleDuplicateRecord from "./duplicateRecord";
import axios from 'axios';
import {
    TableBody, TableContainer, TableHead, Paper, Table, TableCell, Button,
    TableRow, Dialog, DialogTitle, DialogContent, Stack, TextField,
    TablePagination, Autocomplete
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
    const [newQuote, setNewQuote] = useState({ phoneNumber: "", quote: "", operator: "", product: "", description: "" });
    const operators = ["Omer", "Chand", "Nadeem", "Jason", "Ali"];

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
            console.log("Logined");
            const { token } = JSON.parse(loginData);
            console.log("before res");
            const response = await axios.get(`${Backend}/api/quotes`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            console.log("after res");
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
    const handleSaveQuote = async () => {
        const loginData = localStorage.getItem('login');
        const { token } = JSON.parse(loginData);

        try {
            if (editedQuote) {
                // Edit Quote (PUT)
                await axios.put(`${Backend}/api/quotes/${editedQuote.id}`, newQuote, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
            } else {
                // Add New Quote (POST)
                await axios.post(`${Backend}/api/quotes`, newQuote, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
            }

            fetchData(); // Refresh the quotes from backend
            setOpen(false);
        } catch (error) {
            console.error('Error saving quote:', error);
            navigate('/error');
        }
    };


    // Handle Delete
    const handleDeleteQuote = async (id) => {
        const loginData = localStorage.getItem('login');
        const { token } = JSON.parse(loginData);

        try {
            await axios.delete(`${Backend}/api/quotes/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });

            fetchData(); // Refresh quotes
        } catch (error) {
            console.error('Error deleting quote:', error);
            navigate('/error');
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
                                <TableCell sx={{ color: "#fff", textAlign: "center" }} align="center">Product</TableCell>
                                <TableCell sx={{ color: "#fff", textAlign: "center" }} align="center">Description</TableCell>
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
                                        <TableCell align="center">{quote.product}</TableCell>
                                        <TableCell align="center">{quote.description}</TableCell>
                                        <TableCell align="center">{quote.quote}</TableCell>
                                        <TableCell align="center">{quote.operator}</TableCell>
                                        <TableCell align="center" style={{ display: "flex", justifyContent: "center" }}>
                                            <Button color="info" size="small" variant="contained" style={{ margin: "5px" }} onClick={() => handleDuplicateRecord(quote, navigate)}>Copy</Button>
                                            <Button color="primary" size="small" variant="contained" style={{ margin: "5px" }} onClick={() => handleEditQuote(quote)}>Edit</Button>
                                            <Button color="error" size="small" variant="contained" style={{ margin: "5px" }} onClick={() => {
                                                if (window.confirm("Are you sure you want to delete this quote?")) {
                                                    handleDeleteQuote(quote.id);
                                                }
                                            }}
                                            >Delete</Button>
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
                        />
                        <TextField label="Product" variant="outlined" fullWidth
                            value={newQuote.product}
                            onChange={(e) => setNewQuote({ ...newQuote, product: e.target.value })}
                        />

                        <TextField label="Description" variant="outlined" fullWidth
                            value={newQuote.description}
                            onChange={(e) => setNewQuote({ ...newQuote, description: e.target.value })}
                        />
                        <TextField label="Quote" variant="outlined" fullWidth
                            value={newQuote.quote}
                            onChange={(e) => setNewQuote({ ...newQuote, quote: e.target.value })}
                        />
                        <Autocomplete
                            options={operators}
                            value={newQuote.operator}
                            onChange={(event, newValue) => {
                                setNewQuote({ ...newQuote, operator: newValue });
                            }}
                            freeSolo
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Operator"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
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