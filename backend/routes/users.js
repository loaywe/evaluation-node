const express = require('express');
const router = express.Router();
const { User } = require('../Schema/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const multer = require('multer');
const path = require('path');
const fs = require('fs');
// خاصية مساعدة للحصول على نوع المستخدم بناءً على البريد الإلكتروني]
// راوت للحصول على جميع المستخدمين
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

//حفظ الصورة

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/idImages';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg'];
    if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error('يجب أن تكون الصورة من نوع JPEG, JPG, PNG'));
    }
    cb(null, true);
  }
});


// راوت لتسجيل الدخول

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
    }

    const cleanEmail = email.trim();

    // البحث عن المستخدم فقط بواسطة البريد
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    // مقارنة كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    // إنشاء JWT
const token = jwt.sign(
  { _id: user._id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);
    res.json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        fullName: user.fullName,
        role: user.role,
         age: user.age,
       gender: user.gender,
imge: user.imge,

      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
//تتسجيل  مستخدم جديد
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role, imge, gender, age, department } = req.body;

  try {
    // 1️⃣ تحقق من المدخلات الأساسية
    if (!firstName || !lastName || !email || !password || !gender || !age || !department) {
      return res.status(400).json({ error: 'جميع الحقول الأساسية مطلوبة' });
    }

    // 2️⃣ التحقق من وجود البريد مسبقًا
    const existingUser = await User.findOne({ email: email.trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'البريد الإلكتروني مستخدم مسبقًا' });
    }

    // 3️⃣ تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4️⃣ إنشاء المستخدم الجديد
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      password: hashedPassword,
      email: email.trim(),
      role: role || 'employee',
      imge: imge || "",
      gender,
      age,
      department
    });

    await newUser.save();

    res.status(201).json({ message: 'تم تسجيل الموظف بنجاح', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



router.post('/register2', upload.single('idImage'), async (req, res) => {
  const { firstName, lastName, email, password, role, gender, age, department } = req.body;

  try {
    if (!firstName || !lastName || !email || !password || !gender || !age || !department) {
      return res.status(400).json({ error: 'جميع الحقول الأساسية مطلوبة' });
    }

    const existingUser = await User.findOne({ email: email.trim() });
    if (existingUser) return res.status(400).json({ error: 'البريد الإلكتروني مستخدم مسبقًا' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // نص الصورة أو رابطها في الحقل imge
    let imageUrl = "";
   if (req.file) {
  imageUrl = `http://localhost:3700/uploads/idImages/${req.file.filename}`;
}


    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      password: hashedPassword,
      email: email.trim(),
      role: role || 'employee',
      gender,
      age,
      department,
      imge: imageUrl // هنا نحفظ رابط الصورة
    });

    await newUser.save();

    res.status(201).json({ message: 'تم تسجيل الموظف بنجاح', user: newUser });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/departments', async (req, res) => {
  
  try {
    // جلب جميع الأقسام الموجودة في قاعدة البيانات بشكل مميز
    const departments = await User.distinct('department');
    res.json({ success: true, departments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'حدث خطأ في جلب الأقسام' });
  }
});
  


// Middleware للتحقق من التوكن
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'غير مصرح، التوكن مفقود' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // سيحتوي على id، email، type
    next();
  } catch (err) {
    return res.status(401).json({ error: 'توكن غير صالح' });
  }
};

// راوت للحصول على ملف المستخدم الشخصي
router.get('/miacuont', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email })
      .select('-password -_id'); // لا نرسل كلمة المرور

    if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });

    res.json({
      message: 'بيانات المستخدم تم جلبها بنجاح',
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});
// راوت لتحديث بيانات المستخدم الحالي
router.put('/update-profile', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    // جلب المستخدم بناءً على البريد الإلكتروني الموجود في التوكن
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    // جلب البيانات من الجسم (body)
    const {
      firstName,
      lastName,
      password,
      age,
      gender,
      department,
      fullName
    } = req.body;

    // تحديث الحقول إذا تم إرسالها
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (department !== undefined) user.department = department;
    if (fullName !== undefined) user.fullName = fullName;

    // تحديث كلمة المرور بعد تشفيرها إذا تم إرسالها
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // تحديث الصورة إذا تم إرسال ملف جديد
    if (req.file) {
      user.imge = `http://localhost:3700/uploads/idImages/${req.file.filename}`;
    }

    await user.save();

    res.json({
      success: true,
      message: 'تم تحديث البيانات بنجاح',
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
        gender: user.gender,
        department: user.department,
        imge: user.imge,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث البيانات' });
  }
});



module.exports = router;
