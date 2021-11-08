const crypto = require('crypto');

const express = require('express');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');

require('dotenv').config();

const { SERVER2_PORT: PORT, ACCESS_TOKEN_SECRET } = process.env;

const app = express();

const helmetMiddleware = helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            scriptSrcElem: ["'self'"],
            frameAncestors: ["http://server1:3401"],
            upgradeInsecureRequests: null,
        }
    }
});
app.use(helmetMiddleware);

app.use((req, res, next) => {
    console.log('server2:', req.headers.cookie);
    res.setHeader('Set-Cookie', 'sid=server2; httpOnly=true; sameSite=Strict;');
    next();
});

app.use(express.static(__dirname + '/public'));

app.get('/getUser', authenticateToken, (req, res) => {
    res.json({ ...req.user });
});

app.get('/action', authenticateToken, (req, res) => {
    res.json({ key: crypto.randomUUID(), value: 'very hard and security calculations '});
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.sendStatus(401);

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.use((req, res) => {
    res.sendStatus(404);
});

app.listen(PORT, () => console.log(`Listen on port ${PORT}`));
