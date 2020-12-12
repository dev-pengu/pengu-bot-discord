const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
};

const amongUsCatSchema = mongoose.Schema({
    // Guild ID
    _id: reqString,
    categoryId: reqString
});

module.exports = mongoose.model('among-us-cat', amongUsCatSchema);