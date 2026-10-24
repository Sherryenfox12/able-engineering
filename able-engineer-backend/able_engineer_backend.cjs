///node --env-file=.env able_engineer_backend.cjs

const PORT = process.env.PORT || 4450;
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const moment = require('moment-timezone');
require('dotenv').config();

const app = express();

// MongoDB connection
let db;
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;


/////////////////////////////////////////-----SERVER-----////////////////////////////////////////////////

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));