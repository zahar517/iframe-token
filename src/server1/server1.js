const express = require('express');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const { SERVER1_PORT: PORT, ACCESS_TOKEN_SECRET } = process.env;

const app = express();

const helmetMiddleware = helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            scriptSrcElem: ["'self'"],
            frameSrc: ["http://server2:3402"],
            connectSrc: ["http://auth:4001"],
            upgradeInsecureRequests: null,
        }
    }
});
app.use(helmetMiddleware);

app.use((req, res, next) => {
    console.log('server1:', req.headers.cookie);
    res.setHeader('Set-Cookie', 'sid=server1; httpOnly=true; sameSite=Strict;');
    next();
});

app.use(express.static(__dirname + '/public'));

app.use((req, res) => {
    res.sendStatus(404);
});

app.listen(PORT, () => console.log(`Listen on port ${PORT}`));
