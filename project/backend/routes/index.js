var express = require('express');
var router = express.Router();
const user = require("../routes/users");


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/check', function(req, res) {
  res.send('i m working damn it');
});

router.post('/register', async (req, res) => {
  try {
      const { ref, firstName, lastName, date, notes, issue, imeiSn, product, price, remarks, email, phoneCell, phoneHome, pickUpTime, employeeName } = req.body;

      // Create new document in database
      const newObj = new user({
          ref,
          firstName,
          lastName,
          pickupTime:date,
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
          date:new Date(),
          dateTime:new Date(),
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
