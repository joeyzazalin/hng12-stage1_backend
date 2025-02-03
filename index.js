const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// Helper Functions
const isPrime = (num) => {
    const absNum = Math.abs(num);
    if (absNum < 2) return false;
    for (let i = 2; i <= Math.sqrt(absNum); i++) {
        if (absNum % i === 0) return false;
    }
    return true;
};

const isPerfect = (num) => {
    const absNum = Math.abs(num);
    if (absNum < 1) return false;
    let sum = 0;
    for (let i = 1; i < absNum; i++) {
        if (absNum % i === 0) sum += i;
    }
    return sum === absNum;
};

const isArmstrong = (num) => {
    const absNum = Math.abs(num);
    const digits = String(absNum).split('');
    const power = digits.length;
    
    const sum = digits.reduce((acc, digit) => 
        acc + Math.pow(parseInt(digit), power), 0);
    
    return sum === absNum;
};

const getDigitSum = (num) => {
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

const createArmstrongFunFact = (num) => {
    const absNum = Math.abs(num);
    const digits = String(absNum).split('');
    const power = digits.length;
    
    const powerTerms = digits.map(digit => 
        `${digit}^${power}`
    ).join(' + ');
    
    return `${absNum} is an Armstrong number because ${powerTerms} = ${absNum}`;
};

// Main API Endpoint
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
        const absNumber = Math.abs(number);

        // Custom fun fact generation
        let funFact = '';
        if (isArmstrong(absNumber)) {
            funFact = createArmstrongFunFact(absNumber);
        } else {
            // Fallback to Numbers API if not Armstrong
            try {
                const funFactResponse = await axios.get(`http://numbersapi.com/${absNumber}/math`);
                funFact = funFactResponse.data;
            } catch (apiError) {
                funFact = `Interesting fact about ${absNumber} could not be retrieved.`;
            }
        }

        const response = {
            number,
            is_prime: isPrime(number),
            is_perfect: isPerfect(number),
            properties: getProperties(number),
            digit_sum: getDigitSum(number), // sum of its digits
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