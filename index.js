const { CQWebSocket } = require('cq-websocket')
const { WebsocketType } = CQWebSocket
const bot = new CQWebSocket({
  qq: 2464375668,
  reconnection: true,
  reconnectionAttempts: 10,
})

bot.connect()

bot.on('socket.connecting', function (socketType, attempts) {
  console.log('嘗試第 %d 次連線 _(:з」∠)_', attempts)
}).on('socket.connect', function (socketType, sock, attempts) {
  console.log('第 %d 次連線嘗試成功 ヽ(✿ﾟ▽ﾟ)ノ', attempts)
}).on('socket.failed', function (socketType, attempts) {
  console.log('第 %d 次連線嘗試失敗 。･ﾟ･(つд`ﾟ)･ﾟ･', attempts)
})

bot.on('ready', () => {
  bot('send_private_msg', {
    user_id: 694692391,
    message: 'hello!'
  }, {
    timeout: 2000,
  }).then(res => {
    console.log(res)
  }).catch(e => {
    console.error(e)
  })

  bot.on('message', (evt, context, tags) => {
    console.log(evt, context, tags)
  })
})
