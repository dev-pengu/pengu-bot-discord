const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const reqNumber = {
    type: Number,
    required: true
}

const messageCountSchema = mongoose.Schema( {
    _id: reqString,
    messageCount: reqNumber,
})

module.exports = mongoose.model('message-counts', messageCountSchema)