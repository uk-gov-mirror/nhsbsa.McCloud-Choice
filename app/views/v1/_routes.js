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

    const memberChoice = req.session.data['membership-number']
    const sdNumber = req.session.data['sdNumber']

    if (memberChoice === 'Yes, I know my membership number') {

        // If empty or just spaces
        if (!sdNumber || sdNumber.trim() === '') {
            return res.redirect('/v1/membership-number-error')
        }

        // If a value entered
        return res.redirect('/v1/enter-date-of-birth')

    } else if (memberChoice === "No, I do not know my membership number") {
        return res.redirect('/v1/enter-your-national-insurance-number')

    } else if (memberChoice === "I'm not sure") {
        return res.redirect('/v1/enter-your-national-insurance-number')

    } else {
        return res.redirect('/v1/membership-number')
    }
});

// MEMBER - What is your national insurance number?

router.post('/enter-your-national-insurance-number', function (req, res) {
    
    let nino = req.session.data['nationalInsuranceNumber'];

    // Remove spaces + uppercase
    nino = (nino || '').replace(/\s+/g, '').toUpperCase();

    const regex = /^(?!BG|GB|KN|NK|NT|TN|ZZ)[A-CEGHJ-PR-TW-Z]{2}\d{6}[A-D]$/;

    if (!nino) {
        return res.redirect('enter-your-national-insurance-number'); // empty field
    }

    if (
        regex.test(nino) ||
        nino === 'QQ252366C' ||
        nino === 'AB123456D' ||
        nino === 'AC234578B' ||
        nino === 'AZ124578A'
    ) {
        return res.redirect('enter-date-of-birth'); // valid
    } else {
        return res.redirect('national-insurance-error'); // invalid
    }

});

// Member not found page
router.post('/member-not-found', (req, res) => {
    res.redirect('start')
});

// Member not due an RSS yet page
router.post('/not-due-rss-yet', (req, res) => {
    res.redirect('start')
});

//Date of birth page
router.post('/enter-date-of-birth', (req, res) => {
    const day = Number(req.session.data['birthDay']);
    const month = Number(req.session.data['birthMonth']);
    const year = Number(req.session.data['birthYear']);
    const sdNumber = req.session.data['sdNumber']
    const nino = req.session.data['nationalInsuranceNumber']

  
    if (day === 10 && month === 10 && year === 1980 && sdNumber === '11867897') {
      res.redirect('/v1/not-due-rss-yet');
    } else if (day === 20 && month === 12 && year === 1970) {
        res.redirect('/v1/rss-already-sent');
    } else if (day === 10 && month === 11 && year === 1975 && sdNumber === '11255371') {
        res.redirect('/v1/member-not-found'); 
    } else if (day === 10 && month === 11 && year === 1975 && nino === 'QQ252366C') {
        res.redirect('/v1/member-not-found-NI');  
    } else if (day === 12 && month === 11 && year === 1965 && sdNumber ==='67092299') {
        res.redirect('/v1/result-later-date'); 
    } else if (day === 22 && month === 10 && year === 1965 && sdNumber === '67239155') {
        res.redirect('/v1/not-affected-by-mccloud'); 
    } else if (day === 25 && month === 12 && year === 1960) {
        res.redirect('/v1/will-not-send-rss'); 
    } else if (day === 15 && month === 10 && year === 1960) {
        res.redirect('/v1/not-send-rss-yet'); 
    } else {
      res.redirect('/v1/result-earlier-date');
    }
  });

module.exports = router;
