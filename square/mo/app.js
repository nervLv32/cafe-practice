const express = require('express')
const app = express()

app.set('html', __dirname + '/dist/mo/html/')
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', express.static(__dirname + '/dist/mo/html/'))
app.get('/', (req, res) => {
  res.render('index' , {})
})

const server = app.listen(8300, () => {
  console.log( 'Express listening on port : ' + server.address().port )
})