const App = require('./server.js')

let app = App()

app.get('/momos', (req, res) => {
  res.send('no momos, only memes')
})

app.listen(80, () => console.log('server running in port 80'))
