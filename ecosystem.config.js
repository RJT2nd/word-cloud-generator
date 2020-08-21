module.exports = {
  apps : [
    {
      name: 'backend',
      script: 'npm',
      interpreter: 'none',
      args: 'start',
      env_production: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'frontend',
      script: 'npm',
      interpreter: 'none',
      args: 'run frontend',
      env_production: {
        NODE_ENV: 'production'
      }
    },
  ],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};