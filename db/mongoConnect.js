const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Chen:CG130186@cluster0.22ir7.mongodb.net/bnb?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("mongo is connected")
});