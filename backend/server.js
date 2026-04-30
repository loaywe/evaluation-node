// استدعاء المكتبات
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/users');
const evaluationRoutes = require('./routes/evaluation');

const connectDB = require('./Schema/dataconection'); // استدعاء الدالة للاتصال بقاعدة البيانات
const { User, Question, Evaluation, EmployeeEvaluation } = require('./Schema/models');
const path = require('path');

// تهيئة التطبيق
const app = express();
const PORT = 3700;

// ميدلوير
app.use(cors());
app.use(express.json());
connectDB();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/users', userRoutes);
app.use('/evaluation', evaluationRoutes);

// راوت تجريبي
app.get('/', (req, res) => {
  res.send('Hello World! Backend is running.');
});
// POST route to add test data
app.post('/add-data', async (req, res) => {
  try {
    // Sample questions
    const questions = [
      { text: 'كيف تقيم أداءك في العمل؟' },
      { text: 'هل تتعاون مع زملائك بشكل فعال؟' },
      { text: 'كيف تتعامل مع الضغوط في العمل؟' },
      { text: 'هل تطور مهاراتك بشكل مستمر؟' },
      { text: 'كيف تقيم إنتاجيتك؟' },
      { text: 'هل تساهم في تحسين العمليات؟' },
      { text: 'كيف تتعامل مع التغييرات؟' },
      { text: 'هل تحقق أهدافك؟' }
    ];

    // Insert questions only if they don't exist
    const insertedQuestions = [];
    for (const q of questions) {
      const exists = await Question.findOne({ text: q.text });
      if (!exists) {
        const newQ = new Question(q);
        await newQ.save();
        insertedQuestions.push(newQ);
      } else {
        insertedQuestions.push(exists);
      }
    }

    // Sample users
    const users = [
      {
        firstName: 'أحمد',
        lastName: 'علي',
        password:"111",
        email: 'ahmed@example.com',
        gender: 'male',
        age: 30,
        department: 'IT',
        role: 'employee',
        imge: 'https://example.com/images/ahmed.jpg'
      },
      {
        firstName: 'فاطمة',
        lastName: 'محمد',
        password:"111",
        email: 'fatima@example.com',
        gender: 'female',
        age: 28,
        department: 'HR',
        role: 'manager',
        imge: 'https://example.com/images/fatima.jpg'
      },
      {
        firstName: 'خالد',
        lastName: 'سعد',
        password:"111",
        email: 'khaled@example.com',
        gender: 'male',
        age: 35,
        department: 'Finance',
        role: 'admin',
        imge: 'https://example.com/images/khaled.jpg'
      }
    ];

    // Insert users only if email not exists
    const insertedUsers = [];
    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        const newUser = new User(u);
        await newUser.save();
        insertedUsers.push(newUser);
      } else {
        insertedUsers.push(exists);
      }
    }

    res.json({
      message: 'تم إضافة البيانات التجريبية بنجاح',
      questions: insertedQuestions,
      users: insertedUsers
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
