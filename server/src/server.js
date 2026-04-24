const { createApp } = require('./app');

const app = createApp();
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Task manager API listening on port ${port}`);
});
