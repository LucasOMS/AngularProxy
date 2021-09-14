const axios = require('axios');
const express = require('express');
const {proxyToAngularDevServer} = require("./angular-proxy-utils");
const app = express();
const PROXY_PORT = 3000;

// Requisites : have baseHref for all angular project matching the endpoint you want to assign to

// serveProductionBuild(app, express, '/frontend/prod', '/build-angular')
proxyToAngularDevServer(app, axios, '/frontend', 'http://localhost:4200')
proxyToAngularDevServer(app, axios, '/frontend2', 'http://localhost:4201')

// Proxy to API to serve API at localhost:PROXY_PORT/api
app.all('/api/*', async (req, res) => {
    const wantedPath = req.path.replace(/^.*\/api/, '');
    const proxiedResult = await axios.request({
        url: 'http://localhost:8080' + wantedPath,
        method: req.method,
    })
    res.send(proxiedResult.data);
})


app.listen(PROXY_PORT, () => {
    console.log(`Example app listening at http://localhost:${PROXY_PORT}`)
})
