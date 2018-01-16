# simple_web_auth_app

  node app using passport with mysql and redis

setup mysql db: use schema in `database/initdb.sql`

copy local config sample file `config/local.settings.sample.js` to `config/local.settings.js`
edit and add correct config for mysql db

Run the following:
```
npm install
npm install -g webpack
npm install -g pm2
webpack --config webpack.config.js -p
pm2 start server.js
```

Create new user: `node bin/createUser`

Need to have a redis server running at `redis://localhost:6379`
