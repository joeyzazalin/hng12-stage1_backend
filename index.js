// index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// Helper functions
const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const isPerfect = (num) => {
    if (num < 1) return false;
    let sum = 0;
    for (let i = 1; i < num; i++) {
        if (num % i === 0) sum += i;
    }
    return sum === num;
};

const isArmstrong = (num) => {
    const digits = String(num).split('');
    const power = digits.length;
    const sum = digits.reduce((acc, digit) => acc + Math.pow(parseInt(digit), power), 0);
    return sum === num;
};

const getDigitSum = (num) => {
    return String(num)
        .split('')
        .reduce((acc, digit) => acc + parseInt(digit), 0);
};

const getProperties = (num) => {
    const properties = [];
    
    if (isArmstrong(num)) {
        properties.push('armstrong');
    }
    
    properties.push(num % 2 === 0 ? 'even' : 'odd');
    
    return properties;
};

// Main API endpoint
app.get('/api/classify-number', async (req, res) => {
    try {
        const numberParam = req.query.number;
        
        // Input validation
        if (!numberParam || isNaN(numberParam)) {
            return res.status(400).json({
                number: numberParam,
                error: true
            });
        }

        const number = parseInt(numberParam);

        // Fetch fun fact from Numbers API
        const funFactResponse = await axios.get(`http://numbersapi.com/${number}/math`);
        const funFact = funFactResponse.data;

        const response = {
            number,
            is_prime: isPrime(number),
            is_perfect: isPerfect(number),
            properties: getProperties(number),
            digit_sum: getDigitSum(number),
            fun_fact: funFact
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: true,
            message: 'Internal server error'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});