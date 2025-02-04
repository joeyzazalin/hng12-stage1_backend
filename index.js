const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// Helper Functions (remain the same)
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
    if (num < 0) return false;
    
    const digits = String(num).split('');
    const power = digits.length;
    
    const sum = digits.reduce((acc, digit) => 
        acc + Math.pow(parseInt(digit), power), 0);
    
    return sum === num;
};

const getDigitSum = (num) => {
    const absNum = Math.abs(num);
    return String(absNum)
        .split('')
        .reduce((acc, digit) => acc + parseInt(digit), 0);
};

const getProperties = (num) => {
    const properties = [];
    
    if (num > 0 && isArmstrong(num)) {
        properties.push('armstrong');
    }
    
    properties.push(Math.abs(num) % 2 === 0 ? 'even' : 'odd');
    
    return properties;
};

const createArmstrongFunFact = (num) => {
    if (num < 0) return `${num} is not an Armstrong number as negative numbers cannot be Armstrong numbers`;
    
    const digits = String(num).split('');
    const power = digits.length;
    
    const powerTerms = digits.map(digit => 
        `${digit}^${power}`
    ).join(' + ');
    
    return `${num} is an Armstrong number because ${powerTerms} = ${num}`;
};

// Input validation helper
const validateNumber = (numberParam) => {
    // Check if parameter is missing or not a number
    if (!numberParam || isNaN(numberParam)) {
        return {
            isValid: false,
            value: numberParam || "undefined"
        };
    }

    // Convert to number for detailed checking
    const num = Number(numberParam);

    // Check for decimal/floating point
    if (!Number.isInteger(num)) {
        return {
            isValid: false,
            value: numberParam
        };
    }

    return {
        isValid: true,
        value: num
    };
};

// Main API Endpoint
app.get('/api/classify-number', async (req, res) => {
    try {
        const numberParam = req.query.number;
        
        // Enhanced input validation
        const validation = validateNumber(numberParam);
        if (!validation.isValid) {
            return res.status(400).json({
                "number": validation.value,
                "error": true
            });
        }

        const number = validation.value;
        const absNumber = Math.abs(number);

        // Custom fun fact generation
        let funFact = '';
        if (number > 0 && isArmstrong(number)) {
            funFact = createArmstrongFunFact(number);
        } else {
            try {
                const funFactResponse = await axios.get(`http://numbersapi.com/${absNumber}/math`);
                funFact = funFactResponse.data;
            } catch (apiError) {
                funFact = `Interesting fact about ${number} could not be retrieved.`;
            }
        }

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
        res.status(400).json({
            "number": req.query.number,
            "error": true
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});