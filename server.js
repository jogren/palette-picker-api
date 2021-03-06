const app = require('./app/app');

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on PORT ${app.get('port')}.`)
})