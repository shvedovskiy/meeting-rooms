module.exports = {
  apps: [
    {
      name: 'meeting-rooms',
      script: './dist/index.js',
      node_args: '--optimize_for_size --max_old_space_size=460 --gc_interval=100',
      instances: 'max',
      exec_mod: 'cluster',
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
