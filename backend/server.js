const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}));
app.use(express.json());

//routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/problems', require('./routes/problems'));

//health check
app.get("/api/health", (req, res) => res.json({ status: 'ok', timestamp: new Date()  }));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log(" ✅ Mongodb Connected")
        app.listen(PORT, () => console.log(`👍 Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err))

