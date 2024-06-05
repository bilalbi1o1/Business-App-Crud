var express = require('express');
var router = express.Router();
const userModel = require("../routes/users");


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/check', function(req, res) {
  res.send('i m working damn it');
});

router.post('/register', async (req, res) => {
  try {
      const { ref, firstName, lastName, date, notes, issue, imei, product, price, remarks, email, phoneCell, phoneHome, pickUpTime, employName } = req.body;

      // Create new document in database
      const newObj = new YourModel({
          ref,
          firstName,
          lastName,
          date,
          notes,
          issue,
          imei,
          product,
          price,
          remarks,
          email,
          phoneCell,
          phoneHome,
          pickUpTime,
          employName
      });

      // Save document to database
      await newObj.save();

      res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
