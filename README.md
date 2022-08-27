# NodeBackend

Node Backend with some basic endpoints, a database connection and some configs

## Commands

### `npm run dev`

To run the server locally

### `npm run lint`

To search for code format issues

### `npm run test`

To run tests

## How to run it locally

- Install all the dependencies by using `npm install`
- Install postgres
- (Optional) Create a new postgres user, otherwise just use the default postgres user
- Fill the fields of the "config/config.json" file
- Create the environment files (development.env/test.env/etc) following the structure from api/config/.env.example (Fields must match with the content of the config.json file from the the previous step)

#### `The following commands must be executed for each environment (These have to be executed while standing on src/api)`

### Create an environment database

```
npx sequelize-cli db:create --env <env_from_config.json>
```

### Run migrations

```
npx sequelize-cli db:migrate --env <env_from_config.json>
```
