export default {
    plugins: [
        {
            name: 'reload-extensionless-html-routes',
            configureServer(server) {
                server.middlewares.use((request, response, next) => {
                    const url = new URL(request.url, 'http://localhost')

                    if (url.pathname === '/dev' || url.pathname === '/lead') {
                        response.statusCode = 302
                        response.setHeader('Location', `${url.pathname}/${url.search}`)
                        response.end()
                        return
                    }

                    next()
                })
            },
            handleHotUpdate({file, server}) {
                if (file.endsWith('.html')) {
                    server.ws.send({
                        type: 'full-reload',
                        path: '*',
                    })
                }
            },
        },
    ],
}
