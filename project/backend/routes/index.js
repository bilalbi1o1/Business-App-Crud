var express = require('express');
var router = express.Router();
const user = require("../routes/users");
const moment = require('moment-timezone'); // Import moment-timezone


/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/check', function (req, res) {
  res.send('i m working damn it');
});

router.post('/register', async (req, res) => {
  try {
    const { ref, firstName, lastName, date, notes, issue, imeiSn, product, price, remarks, email, phoneCell, phoneHome, pickupDate, employeeName } = req.body;

    // Create new document in database
    const newObj = new user({
      ref,
      firstName,
      lastName,
      pickupDate: new Date(),
      notes,
      issue,
      imeiSn,
      product,
      price,
      remarks,
      email,
      phoneCell,
      phoneHome,
      employeeName,
      date: new Date(),
      dateTime: new Date()
    });

    // Save document to database
    await newObj.save();
    console.log('Saved object:', newObj);

    res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/edit/:ref', async (req, res) => {
  const ref = req.params.ref;
  const updatedData = req.body;

  try {
    // Find the user by ref and update with the new data
    const updatedUser = await user.findOneAndUpdate({ ref: ref }, updatedData, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.send(`Record with ref ${ref} has been updated`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating the record');
  }
});

router.delete('/delete/:ref', async (req, res) => {
  const ref = req.params.ref;

  try {
    // Find the user by ref and delete it
    const deletedUser = await user.findOneAndDelete({ ref: ref });

    if (!deletedUser) {
      return res.status(404).send('User not found');
    }

    res.send(`Record with ref ${ref} has been deleted`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting the record');
  }
});


router.get('/users', async (req, res) => {
  try {
    const users = await user.find();

    // Convert the date to Pakistan timezone
    users.forEach(user => {
      user.date = moment(user.date).tz('Asia/Karachi').format(); // Adjust timezone as needed
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
