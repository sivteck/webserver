const App = require('./server.js')

let app = App()

app.use(function (req, res, next) {
  next()
})

app.use(function (req, res, next) {
  next()
})

app.get('/momos', (req, res) => {
  res.send('no momos, only memes')
})

app.post('/handleForms', (req, res) => {
  console.log('form handler route has been hit')
  res.send('Form successfully submitted: ' + JSON.stringify(req.body))
})

app.get('/handleFormsGET', (req, res) => {
  console.log('form handler GET route has been hit')
  res.send('Form successfully submitted GET: ' + JSON.stringify(req.body))
})

app.post('/handleFormsJSON', (req, res) => {
  console.log('form handler POST JSON route has been hit')
  res.send('keeee')
})

app.listen(80, () => console.log('server running in port 80'))


/* 
 * /user/1/login  -- > set Session Cookie
 * /user/1/secret -- > respond only if Session Cookie for 1 is present
 * /user/2/login -- > ensure only one user can be logged in at a time
 * /user/2/secret -- > do not show secret for both user 1 and user 2
 */
