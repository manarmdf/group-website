const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// اتصال بقاعدة البيانات
mongoose.connect('mongodb://localhost:27017/ToDo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// تعريف الـ Schema و Model
const schema = new mongoose.Schema({
  title: String,
  month: String // إضافة الشهر لكل مهمة
});
const Task = mongoose.model('Task', schema);

// الصفحة الرئيسية - عرض المهام حسب الأشهر
app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({}); // جلب جميع المهام

    // ترتيب المهام حسب الأشهر
    const months = ["January", "February", "March", "April", "May", "June"];
    const tasksByMonth = {};
    months.forEach(month => tasksByMonth[month] = []);

    tasks.forEach(task => {
      if (months.includes(task.month)) {
        tasksByMonth[task.month].push(task);
      }
    });

    res.render('todo', { months, tasksByMonth });
  } catch (error) {
    console.error(`Error fetching tasks: ${error}`);
    res.status(500).send('Error fetching tasks.');
  }
});

// إضافة مهمة جديدة
app.post('/create', async (req, res) => {
  try {
    const newTask = new Task({ 
      title: req.body.title, 
      month: req.body.month 
    });
    await newTask.save();
    res.redirect('/');
  } catch (error) {
    console.error(`Error creating task: ${error}`);
    res.status(500).send('Error creating task.');
  }
});

// تعديل مهمة
app.post('/update/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const newTitle = req.body.newTitle;

    const updatedTask = await Task.updateOne({ _id: taskId }, { title: newTitle });

    if (updatedTask.modifiedCount === 0) {
      return res.status(404).send('Task not found or no changes made');
    }

    console.log('One task is updated!');
    res.redirect('/');
  } catch (error) {
    console.error(`Error updating task: ${error}`);
    res.status(500).send('Error updating task.');
  }
});

// حذف مهمة
app.post('/delete/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    await Task.deleteOne({ _id: taskId });
    console.log('One task is deleted');
    res.redirect('/');
  } catch (error) {
    console.error(`Error deleting task: ${error}`);
    res.status(500).send('Error deleting task.');
  }
});

// تشغيل السيرفر
app.listen(3000, () => console.log('Server started on http://localhost:3000'));