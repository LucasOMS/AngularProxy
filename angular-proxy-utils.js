/**
 * You have to build the app with '--baseHref /endpoint/'
 *
 * @param app {any}
 * @param express {any}
 * @param endpoint {string} to access the build
 * @param dirnameFromProjectRoot {string} where the build is stored
 */
function serveProductionBuild(app, express, endpoint, dirnameFromProjectRoot) {
    app.use('/frontend/prod', express.static(__dirname + dirnameFromProjectRoot));
}

/**
 * You have to start ng serve with '--baseHref /endpoint/'
 * @param app {any}
 * @param axios {any}
 * @param endpoint {string} only the beginning (e.g. '/frontend')
 * @param angularDevServerUrl {string} where the angular dev server is listening, DON'T INCLUDE the baseHref
 */
function proxyToAngularDevServer(app, axios, endpoint, angularDevServerUrl) {
    const angularDevServerUrlWithoutSlash = angularDevServerUrl.replace(/\/$/, '');

    app.all(endpoint, async (req, res) => {
        const proxiedResult = await axios.request({
            url: angularDevServerUrlWithoutSlash + endpoint,
            method: 'GET',
        }).catch(err => console.error(err))
        res.send(proxiedResult.data);
    })

    app.all(endpoint + '/*', async (req, res) => {
        const pattern = new RegExp(`^${endpoint}/`)
        res.redirect(angularDevServerUrlWithoutSlash + endpoint + req.path.replace(pattern, ''));
    })
}

module.exports = {
    serveProductionBuild,
    proxyToAngularDevServer
}
