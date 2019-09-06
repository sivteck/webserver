const App = require('./server.js')

let app = App()

app.use(function (req, res, next) {
  console.log('middle ware ran')
  console.log(req.body)
  next()
})

app.use(function (req, res, next) {
  console.log('second middlew are ran')
  next()
})

app.get('/momos', (req, res) => {
  res.send('no momos, only memes')
})

app.post('/handleForms', (req, res) => {
  console.log('form handler route has been hit, mayday! mayday!')
  res.send('mememe')
})

app.listen(80, () => console.log('server running in port 80'))
