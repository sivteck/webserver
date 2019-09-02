const App = require('./server.js')
const express = require('express')

let app = App()

// app.use(express.json())


app.use(express.urlencoded({ extended: false }))

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

app.listen(80, () => console.log('server running in port 80'))
