require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');

const {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
} = process.env;

const PORT = 4001;

const app = express();

const helmetMiddleware = helmet();
app.use(helmetMiddleware);

let refreshTokens = [];

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://server1:3401');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;

    if (!refreshToken) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        const accessToken = generateAccessToken({ email: user.email });
        
        res.json({ accessToken });
    });
});

app.delete('/logout', (req, res) => {
    const refreshToken = req.body.token;

    refreshTokens = refreshTokens.filter(token => token !== refreshToken);

    res.sendStatus(204);
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const user = { email };

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken });
});

function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
}

function generateRefreshToken(user) {
    return jwt.sign(user, REFRESH_TOKEN_SECRET);
}

app.listen(PORT, () => console.log(`Listen on port ${PORT}`));
