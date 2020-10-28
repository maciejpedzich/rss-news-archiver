# rss-news-archiver

## Project setup
```
npm install
```

### Environment variables

Backend:

Create `.env` file in project's root directory. It should have the following variables:

```env
NODE_ENV= either development or production
PORT= port on which Express app will be served
API_URL= full URL of Express app (for adding proper news image path)
DB_URL= PostgreSQL database URL
FEED_URL= RSS feed's URL
```

Frontend:

Go to `src/environment/index.ts`, and replace `API_URL` with the same URL as in `.env`'s `API_URL` 

### Compiles and hot-reloads for development
```
npm run serve
```

For backend:

```
npm run serve:backend
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
