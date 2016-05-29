var express = require('express')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var app = express()
var request = require('request')
var keyword = {
  hi: {
    ans: 'hi'
  }
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('public'))

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'bot_messenger_page') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong validation token')
})

app.get('/data', function (req, res) {
  res.send(keyword)
})

app.post('/data', jsonParser, function (req, res) {
  var data = req.body
  if (!keyword[data.key]) {
    keyword[data.key] = {
      ans: data.ans
    }
  }
  res.send(keyword)
})

app.post('/data/edit', jsonParser, function (req, res) {
  var data = req.body
  console.log(data)
  keyword[data.key].ans = data.ans
  rename(keyword, data.key, data.newkey)
  console.log(keyword)
  res.send(keyword)
})

app.post('/data/delete', jsonParser, function (req, res) {
  var data = req.body
  delete keyword[data.key]
  console.log(keyword)
  res.send(keyword)
})

function rename (obj, oldName, newName) {
  if (!obj.hasOwnProperty(oldName)) {
    return false
  }

  obj[newName] = obj[oldName]
  delete obj[oldName]
  return true
}

app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i]
    var sender = event.sender.id
    if (event.message && event.message.text) {
      var text = event.message.text.split(' ')

      if (text[0] === 'sum') {
        var ans = parseInt(text[1], 0) + parseInt(text[2], 0)
        sendTextMessage(sender, ans)
      } else if (text[0] === 'max') {
        ans = parseInt(text[1], 0) > parseInt(text[2], 0) ? parseInt(text[1], 0) : parseInt(text[2], 0)
        sendTextMessage(sender, ans)
      } else if (text[0] === 'min') {
        ans = parseInt(text[1], 0) < parseInt(text[2], 0) ? parseInt(text[1], 0) : parseInt(text[2], 0)
        sendTextMessage(sender, ans)
      } else if (text[0] === 'avg') {
        text.splice(0, 1)
        var sum = text.reduce((prev, curr) => prev + parseInt(curr, 0), 0)
        console.log(sum)
        ans = sum / text.length
        sendTextMessage(sender, ans)
      }

      text.forEach((element, index, array) => {
        if (keyword[element]) {
          sendTextMessage(sender, keyword[element].ans)
        }
      })
    }
  }
  res.sendStatus(200)
})

var token = 'EAAIZB28TH0MIBAFtg7VvDt8RtuFj3ZCIaxwuPpbcU4Jk72SIdjD1Nhv5psMV842UOdnwtR5PoEWU9Iu9Qba8Ify1ysPGGPtZCVQ89ZANmHuzMHfrbiA9kaDrLbb2TE9Bx6JGsGUc2QMERZBsaZAAmyktFug8ZCT2Egy4RZAoCkctSAZDZD'

function sendTextMessage (sender, text) {
  var messageData = {
    text: text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: token},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: messageData
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

app.set('port', (process.env.PORT || 3000))

app.listen(app.get('port'), function () {
  console.log('Server Start at port ', app.get('port'))
})
