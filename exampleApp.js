const App = require('./server.js')

let app = App()

app.use(function (req, res, next) {
  console.log('----------------- are cookies populated')
  console.log(req.cookies)
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

app.listen(80, () => console.log('server running in port 80'))
