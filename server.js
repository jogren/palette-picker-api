const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';
app.use(express.json());

app.get('/', (request, response) => {
  response.send('Welcome to Palette Picker');
});

app.get('/api/v1/projects', (request, response) => {
  console.log('return all projects')
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on PORT ${app.get('port')}.`)
})