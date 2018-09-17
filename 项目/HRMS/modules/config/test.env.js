const interfaces = require('os').networkInterfaces()
let LOCAL_IP = ''
for(let devName in interfaces) {
  interfaces[devName].forEach((alias) => {
    if (
      alias.family === 'IPv4'
      && alias.address !== '127.0.0.1'
      && !alias.internal
    ) {
      LOCAL_IP = alias.address
    }
  })
}

module.exports = {
  NODE_ENV: '"testing"',
  LOCAL_IP: '"' + LOCAL_IP + '"'
}
