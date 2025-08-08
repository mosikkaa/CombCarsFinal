const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const multer = require('multer');


const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const filePath=path.join(__dirname, 'car-list.json')
const postFilePath=path.join(__dirname, 'user.json')

app.get('/api-back', (req, res) => {
    const staticCars = JSON.parse(fs.readFileSync(filePath));
    const userData = fs.readFileSync(postFilePath, 'utf-8');
    const userCars = userData.trim() === '' ? [] : JSON.parse(userData);

    res.json([...staticCars,...userCars]);
});

app.post('/api-back-user', (req, res) =>{
      const newCar = {
      manufacturer: req.body.manufacturer,
      model: req.body.model,
      year: req.body.year,
      price: req.body.price,
      fuel_type: req.body.fuel_type,
      location: req.body.location,
      image: req.body.image
    };
    const cars = JSON.parse(fs.readFileSync(postFilePath));

    cars.push(newCar);

    fs.writeFileSync(postFilePath, JSON.stringify(cars, null, 2));
    res.status(200).json({ message: 'Car added', car: newCar});
})




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });


app.post('/upload', upload.single('carphoto'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});




app.listen(3000);





