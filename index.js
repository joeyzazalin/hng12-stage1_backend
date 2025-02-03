const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// Helper Functions
const isPrime = (num) => {
    // Handle negative numbers
    const absNum = Math.abs(num);
    
    if (absNum < 2) return false;
    for (let i = 2; i <= Math.sqrt(absNum); i++) {
        if (absNum % i === 0) return false;
    }
    return true;
};

const isPerfect = (num) => {
    // Handle negative numbers
    const absNum = Math.abs(num);
    
    if (absNum < 1) return false;
    let sum = 0;
    for (let i = 1; i < absNum; i++) {
        if (absNum % i === 0) sum += i;
    }
    return sum === absNum;
};

const isArmstrong = (num) => {
    // Handle negative numbers by taking absolute value
    const absNum = Math.abs(num);
    const digits = String(absNum).split('');
    const power = digits.length;
    
    const sum = digits.reduce((acc, digit) => 
        acc + Math.pow(parseInt(digit), power), 0);
    
    return sum === absNum;
};

const getDigitSum = (num) => {
    // Handle negative numbers by taking absolute value
    const absNum = Math.abs(num);
    
    return String(absNum)
        .split('')
        .reduce((acc, digit) => acc + parseInt(digit), 0);
};

const getProperties = (num) => {
    const properties = [];
    const absNum = Math.abs(num);
    
    if (isArmstrong(absNum)) {
        properties.push('armstrong');
    }
    
    properties.push(absNum % 2 === 0 ? 'even' : 'odd');
    
    return properties;
};

// Main API Endpoint
app.get('/api/classify-number', async (req, res) => {
    try {
        const numberParam = req.query.number;
        
        // Input validation
        if (!numberParam || isNaN(numberParam)) {
            return res.status(400).json({
                number: numberParam,
                error: true,
                message: 'Invalid_input'
            });
        }

        const number = parseInt(numberParam);

        // Fetch fun fact from Numbers API (consider absolute value)
        const absNumber = Math.abs(number);
        const funFactResponse = await axios.get(`http://numbersapi.com/${absNumber}/math`);
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

// Default route
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to the Number Classification API",
        endpoint: "/api/classify-number?number=X"
    });
});

// Server Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});