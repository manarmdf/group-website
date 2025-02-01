const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 4000;

// إعداد المجلدات ومحركات العرض
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// التأكد من وجود مجلد 'uploads' وإذا لم يكن موجودًا يتم إنشاؤه
const uploadDir = './public/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// إتاحة الوصول إلى مجلد الصور
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// إعداد التخزين باستخدام Multer
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// بيانات المهام لكل شهر
let tasksByMonth = {
    "January": [], "February": [], "March": [], "April": [], "May": [], "June": [],

};

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.render('home');
});



// صفحة الأهداف
app.get('/todo', (req, res) => {
    res.render('todo', { months: Object.keys(tasksByMonth), tasksByMonth });
});



// إضافة مهمة جديدة
app.post('/create', (req, res) => {
    const { month, title } = req.body;
    if (month && title) {
        tasksByMonth[month].push({ _id: Date.now(), title });
    }
    res.redirect('/todo');
});

// تحديث مهمة
app.post('/update/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const newTitle = req.body.newTitle;
    for (let month in tasksByMonth) {
        tasksByMonth[month] = tasksByMonth[month].map(task =>
            task._id === taskId ? { ...task, title: newTitle } : task
        );
    }
    res.redirect('/todo');
});
app.get('/index', (req, res) => {
    const uploadPath = path.join(__dirname, 'public/uploads');
    const images = fs.existsSync(uploadPath) ? fs.readdirSync(uploadPath) : [];
    res.render('index', { images });
});
// حذف مهمة
app.post('/delete/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    for (let month in tasksByMonth) {
        tasksByMonth[month] = tasksByMonth[month].filter(task => task._id !== taskId);
    }
    res.redirect('/todo');
});

// رفع الصور
app.post('/upload', upload.single('image'), (req, res) => {
    const index = req.body.index;
    const uploadPath = path.join(__dirname, 'public/uploads');

    let images = fs.existsSync(uploadPath) ? fs.readdirSync(uploadPath) : [];
    images[index] = req.file.filename; // تخزين الصورة في المصفوفة بنفس الترتيب

    res.redirect('/index');
});

app.delete('/delete-image/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const uploadPath = path.join(__dirname, 'public/uploads');
    let images = fs.existsSync(uploadPath) ? fs.readdirSync(uploadPath) : [];

    if (images[index]) {
        const imagePath = path.join(uploadPath, images[index]);
        fs.unlinkSync(imagePath);
    }

    res.sendStatus(200);
});



app.listen(port, () => {
    console.log(`🚀 السيرفر يعمل على: http://localhost:${port}`);
});



