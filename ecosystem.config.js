module.exports = {
  apps : [{
    name      : 'MetronAPI',
    script    : 'server-build/app.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }]
};
