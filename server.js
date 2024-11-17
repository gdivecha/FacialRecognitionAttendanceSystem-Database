const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db/connect');
const courseRoutes = require('./routes/courseRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('AITend-Backend API is running');
});
  
app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
