const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const path = require('path');

const app = express();

// using body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Configure Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const filename =
      file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});

// Configure Multer upload options
const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect(
  'mongodb+srv://satya77888narayanpatra:Satya1234@cluster0.mubmhrt.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
  }
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB successfully');
});

// Define file schema
const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  id: { type: String, required: true, unique: true },
});

// Create file model
const File = mongoose.model('File', fileSchema);

// Define route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  const fileSave = () => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded');
      }

      const newFile = new File({
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        id: uuidv4(),
      });

      newFile.save();
      res.send('file uploaded');
    } catch (err) {
      console.log('Error in uploading file', err);
      res.send('No file uploaded');
    }
    fileSave();

    // newFile.save((err) => {
    //   if (err) {
    //     console.error(err);
    //     return res.status(500).send('Internal server error');
    //   }

    //   return res.send('File uploaded successfully');
    // });
  };
});

app.get('/', (req, res) => {
  res.send('Hello');
});

// Define route to get all files
app.get('/files', (req, res) => {
  const getFile = async () => {
    try {
      const files = await File.find();
      res.send(files);
    } catch (err) {
      console.log('Error in getting file');
      console.error(err);
      res.status(404).send('Error in getting file');
    }
  };
  getFile();
});

// Define route to get a particular file using uid
app.get('/file/:id', (req, res) => {
  const id = req.params.id;
  const findOne = async () => {
    try {
      const file = await File.findOne({ id: id });
      res.json(file);
    } catch (err) {
      res.json('Error in getting file');
    }
  };
  findOne();
});

app.delete('/', (req, res) => {
  const id = req.params.id;

  const findAndDelete = async () => {
    try {
      await File.deleteOne({ id: id });
      res.send('File deleted successfully');
    } catch (error) {
      console.log('error in deleting the file');
      res.send('File could not be deleted');
    }
  };

  findAndDelete();
});
// Start the server
app.listen(4500, () => {
  console.log('Server started on port 4500');
});
