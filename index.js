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

var qustion = ['What Do you have?', 'How much', 'Do you have', 'Add']

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
      ans: data.ans,
    }
  }
  res.send(keyword)
})

app.post('/webhook/', function (req, res) {
  var str = ''
  var messaging_events = req.body.entry[0].messaging
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i]
    var sender = event.sender.id
    if (event.message && event.message.text) {
      var text = event.message.text
      var textSlice = event.message.text.split(' ')
      console.log(textSlice);
      /*
      var textSlice = event.message.text.split(' ')
      var thig = textSlice[textSlice.length - 1].split('?')[0]
      console.log(thig, qustion)
      if (text === qustion[0]) {
        str = 'Have '
        Object.keys(refrigerator).forEach(function (item) {
          str += item + ', '
        })
        sendTextMessage(sender, str)
      }else if (textSlice[0] + ' ' + textSlice[1] === qustion[1]) {
        console.log(thig)
        if (refrigerator[thig]) {
          sendTextMessage(sender, refrigerator[thig].amount + ' ' + refrigerator[thig].unit)
        } else {
          sendTextMessage(sender, "Don't Have")
        }
      }else if (textSlice[0] + ' ' + textSlice[1] + ' ' + textSlice[2] === qustion[2]) {
        console.log(thig)
        if (refrigerator[thig]) {
          sendTextMessage(sender, 'Have ' + refrigerator[thig].amount + ' ' + refrigerator[thig].unit)
        } else {
          sendTextMessage(sender, "Don't Have")
        }
      }else if (textSlice[0] === qustion[3]) {
        console.log(thig)
        if (!refrigerator[textSlice[1]]) {
          refrigerator[textSlice[1]] = {
            amount: textSlice[2],
            unit: textSlice[3]
          }
        } else {
          refrigerator[textSlice[1]].amount = parseInt(refrigerator[textSlice[1]].amount, 0) + parseInt(textSlice[2], 0)
        }
        sendTextMessage(sender, 'Done')
      } else {
        console.log(textSlice[0] + ' ' + textSlice[1])
      }*/



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
