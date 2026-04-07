// External dependencies
const e = require('express');
const express = require('express');
const router = express.Router();

// Add your routes here - above the module.exports line

// ========================================================================
// MAIN MCCLOUD CHOICE JOURNEY
// ========================================================================


// Start page
router.post('/start', (req, res) => {
    res.redirect('membership-number')
});

// Do you know your membership number?
router.post('/membership-number', (req, res) => {

    var memberNumber = req.session.data['membership-number']

    if (memberNumber == 'Yes, I know my membership number') {
        res.redirect('enter-date-of-birth')
    } else if (memberNumber == "No, I do not know my membership number") {
        res.redirect('enter-your-national-insurance-number');
    } else if (memberNumber == "I'm not sure") {
        res.redirect('enter-your-national-insurance-number');
    }else {
        res.redirect('membership-number')
    }
});

// MEMBER - What is your national insurance number?

router.post('/enter-your-national-insurance-number', function (req, res) {
    
    let nino = req.session.data['nationalInsuranceNumber'];

    // Remove all spaces and normalize to uppercase
    nino = (nino || '').replace(/\s+/g, '').toUpperCase();

    const regex = new RegExp('^(?!BG|GB|KN|NK|NT|TN|ZZ)[A-CEGHJ-PR-TW-Z]{2}\\d{6}[A-D]$');

    if (nino) {
        if (regex.test(nino)|| nino === 'QQ123456C'& 'AB123456D'& 'AC234578B'& 'AZ124578A') { 
            res.redirect('enter-date-of-birth');  // Valid National Insurance Number
        } else {
            res.redirect('enter-your-national-insurance-number');  // Invalid format
        }
    } else {
        res.redirect('enter-your-national-insurance-number');  // Field is empty
    }

});

// Member not found page
router.post('/member-not-found', (req, res) => {
    res.redirect('start')
});

//Date of birth page
router.post('/enter-date-of-birth', (req, res) => {
    const day = Number(req.session.data['birthDay']);
    const month = Number(req.session.data['birthMonth']);
    const year = Number(req.session.data['birthYear']);
  
    if (day === 10 && month === 10 && year === 1980) {
      res.redirect('/v1/not-due-rss-yet');
    } else if (day === 20 && month === 12 && year === 1970) {
        res.redirect('/v1/rss-already-sent');
    } else if (day === 10 && month === 11 && year === 1975) {
        res.redirect('/v1/member-not-found');  
    } else {
      res.redirect('/v1/result');
    }
  });

module.exports = router;
