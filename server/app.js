import "@babel/polyfill";
import path from 'path';
import app from './config/express';
import routes from './routes/index.route';
import swagger from './config/swagger';
import * as errorHandler from './middlewares/errorHandler';
import joiErrorHandler from './middlewares/joiErrorHandler';
import {connectToQueue, consumeMainQueue, consumeReplyQueue} from './helpers/queue';
import logger from './config/winston';
import {http} from './config/socket';
import './cronjob/cleanup';

// enable webpack hot module replacement in development mode
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack/webpack.config.dev';

if (process.env.NODE_ENV === 'development') {

    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: webpackConfig.output.publicPath}));
    app.use(webpackHotMiddleware(compiler));
}

// Swagger API documentation
// app.get('/swagger.json', (req, res) => {
//     res.json(swagger);
// });

// Router
app.use('/api', routes);

// Landing page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Joi Error Handler
app.use(joiErrorHandler);

// Error Handler
app.use(errorHandler.notFoundErrorHandler);
app.use(errorHandler.errorHandler);

http.listen(app.get('port'), app.get('host'), () => {
    logger.info(`Server running at http://${app.get('host')}:${app.get('port')}`);
});

(async () => {
    try {
        // Connect to RabbitMQ connection
        await connectToQueue();
        await Promise.all([consumeMainQueue(), consumeReplyQueue()]);
    } catch (err) {
        logger.error(err);
        process.exit(0);
    }
})();

export default app;
