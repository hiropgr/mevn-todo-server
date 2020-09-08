const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const compression = require('compression');
const keys = require('./keys');
const router = require('./router');

const PORT  = process.env.PORT || 3000;

const app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());

app.use('/api', router);
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

async function start() {
    try {
        mongoose.set('useCreateIndex', true);
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);        
    }
}
start();