const array = []

const addConnection = (hash, socket) => {
    const address = socket.handshake.address.split(':')[3]
    const id = socket.id

    array.push({
        name: hash,
        ip: address,
        id
    })

    console.log(`Address ${address} has been inserted as a client`)
}

const removeConnection = (id) => {
    const user = array.find(el => el.id === id)

    console.log(`Address ${user.ip} disconnected from network`)

    const aux = array.filter(el => el.id !== id)

    while(array.length) {
        array.pop()
    }

    array.concat(aux)
}

module.exports = { addConnection, removeConnection, array }
