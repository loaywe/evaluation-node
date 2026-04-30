const express = require('express');
const router = express.Router();
const { User, Question, Evaluation, EmployeeEvaluation } = require('../Schema/models');
const jwt = require('jsonwebtoken');

// =====================
// Middleware للتحقق من التوكن
// =====================
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'غير مصرح، التوكن مفقود' });
  }

  const token = authHeader.split(' ')[1]; // هذا هو التوكن فقط

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ error: 'توكن غير صالح' });
  }
};

// =====================
// Middleware للتحقق من الدور
// =====================
const checkRole = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];

  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: 'ليس لديك صلاحية للقيام بهذا الإجراء' });
    }
    next();
  };
};

// =====================
// إضافة تقييم داخلي لموظف
// POST /api/evaluations/self
// =====================
router.post('/self', authMiddleware, checkRole(['employee']), async (req, res) => {
  try {
    const { answers, period } = req.body;

    // تحقق من المدخلات
    if (!answers || answers.length !== 8) {
      return res.status(400).json({ error: 'يجب الإجابة على 8 أسئلة بالضبط' });
    }

    // الموظف الحالي من التوكن
    const employeeId = req.user._id;

    const employee = await User.findById(employeeId);
    if (!employee) return res.status(404).json({ error: 'الموظف غير موجود' });
if(period!==new Date().getFullYear()){
      return  res.status(400).json({ error: 'الفترة غير صحيحة. يجب أن تكون السنة الحالية.' });
    }
    // إنشاء التقييم الداخلي
    const evaluation = new Evaluation({ answers });
    await evaluation.save();

    // إنشاء سجل EmployeeEvaluation
    const employeeEvaluation = new EmployeeEvaluation({
      employee: employeeId,
      selfEvaluation: evaluation._id,
      managerEvaluation: null,
      manager: null, // تقييم ذاتي، لا يوجد مدير بعد
      period: period 
    });

    await employeeEvaluation.save();

    res.status(201).json({
      message: 'تم إضافة التقييم الذاتي بنجاح',
      employeeEvaluation
    });

  } catch (err) {
    console.error('Error adding self-evaluation:', err.message);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة التقييم' });
  }
});
// =====================
router.get('/my-evaluations', authMiddleware, async (req, res) => {
  try {
    const employeeId = req.user._id; // الموظف الحالي من التوكن

    const evaluations = await EmployeeEvaluation.find({ employee: employeeId })
      .populate({
        path: 'selfEvaluation',
        populate: { path: 'answers.question', model: 'Question' }
      })
      .populate({
        path: 'managerEvaluation',
        populate: { path: 'answers.question', model: 'Question' }
      })
      .populate('manager', 'fullName'); // جلب اسم المدير إذا موجود
console.log(evaluations);
    res.json({ evaluations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب التقييمات' });
  } 
});

// جلب جميع أسئلة التقييم
router.get('/questions' , async (req, res) => {
  try {
    const questions = await Question.find(); // جلب النص و _id
    
    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الأسئلة' });
  }
});

router.post('/manager', authMiddleware, checkRole('manager'), async (req, res) => {
  try {
    const { employeeEvaluationId, answers } = req.body;

    if (!employeeEvaluationId || !answers || answers.length === 0) {
      return res.status(400).json({ error: 'يجب تقديم employeeEvaluationId و إجابات' });
    }

    // جلب سجل EmployeeEvaluation
    const empEval = await EmployeeEvaluation.findById(employeeEvaluationId)
      .populate('selfEvaluation')
      .populate('employee');

    if (!empEval) return res.status(404).json({ error: 'سجل تقييم الموظف غير موجود' });

    // منع المدير من تقييم نفسه
    if (empEval.employee._id.equals(req.user._id)) {
      return res.status(403).json({ error: 'لا يمكنك تقييم نفسك' });
    }

    // إنشاء تقييم المدير
    const managerEvaluation = new Evaluation({ answers });
    // حساب الدرجة النهائية (مثلاً متوسط جميع الأسئلة)
    const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
    managerEvaluation.finalScore = totalScore;
    await managerEvaluation.save();

    // تحديث سجل EmployeeEvaluation
    empEval.managerEvaluation = managerEvaluation._id;
    empEval.manager = req.user._id; // مدير التقييم
    await empEval.save();

    res.status(201).json({
      message: 'تم إضافة تقييم المدير بنجاح',
      employeeEvaluation: empEval
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة تقييم المدير' });
  }
});
router.get('/department', authMiddleware, checkRole(['manager']), async (req, res) => {
  try {
    const managerId = req.user._id;

    // جلب المدير الحالي
    const manager = await User.findById(managerId);
    if (!manager) return res.status(404).json({ error: 'المدير غير موجود' });

    // جلب جميع الموظفين في نفس القسم
    const employees = await User.find({ department: manager.department, role: 'employee' })
      .select('_id fullName email');

    // معالجة كل موظف للحصول على تقييمه أو تركه فارغ
    const evaluations = await Promise.all(
      employees.map(async (emp) => {
        const ev = await EmployeeEvaluation.findOne({ employee: emp._id })
          .populate({
            path: 'selfEvaluation',
            populate: {
              path: 'answers.question',
              model: 'Question',
              select: 'text'
            }
          })
          .populate({
            path: 'managerEvaluation',
            populate: {
              path: 'answers.question',
              model: 'Question',
              select: 'text'
            }
          })
          .populate('manager', 'fullName');

        return {
          evaluationId: ev?._id || null,
          period: ev?.period || new Date().getFullYear(),
          employeeName: emp.fullName,
          employeeEmail: emp.email,
          selfScore: ev?.selfEvaluation?.finalScore || null,
          managerScore: ev?.managerEvaluation?.finalScore || null,
          selfAnswers: ev?.selfEvaluation?.answers?.map(a => ({
            questionText: a.question?.text || a.questionText || '-',
            score: a.score || 0
          })) || [],
          managerAnswers: ev?.managerEvaluation?.answers?.map(a => ({
            questionText: a.question?.text || a.questionText || '-',
            score: a.score || 0
          })) || []
        };
      })
    );

    res.json({ evaluations });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب التقييمات' });
  }
});
// إضافة تقييم موظف بواسطة المدير
router.post('/add-evaluation', authMiddleware, checkRole('manager'), async (req, res) => {
  try {
    const { employeeEvaluationId, answers } = req.body;

    console.log('Request body:', req.body);

    if (!employeeEvaluationId || !answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ 
        error: 'يجب تقديم سجل التقييم والإجابات بشكل صحيح'
      });
    }

    // جلب سجل EmployeeEvaluation مباشرة بالـ ID
    const empEval = await EmployeeEvaluation.findById(employeeEvaluationId)
      .populate('selfEvaluation');

    if (!empEval) {
      return res.status(404).json({ error: 'سجل التقييم للموظف غير موجود' });
    }

    // منع إعادة التقييم إذا كان موجودًا
    if (empEval.managerEvaluation) {
      return res.status(400).json({ error: 'تم تقييم هذا الموظف بالفعل من قبل المدير' });
    }

    // إنشاء تقييم المدير
    const managerEvaluation = new Evaluation({ answers });

    // حساب الدرجة النهائية
    const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
    managerEvaluation.finalScore = totalScore;
    await managerEvaluation.save();

    // تحديث سجل EmployeeEvaluation
    empEval.managerEvaluation = managerEvaluation._id;
    empEval.manager = req.user._id; // المدير الحالي
    await empEval.save();

    res.status(201).json({
      message: 'تم إضافة تقييم المدير بنجاح',
      employeeEvaluation: empEval
    });

  } catch (err) {
    console.error('Error adding manager evaluation:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة تقييم المدير' });
  }
});



// جلب تقييم محدد مع الأسئلة والموظف
router.get('/evaluation/:id',  async (req, res) => {
  try {
    const { id } = req.params;
console.log("Fetching evaluation with ID:", id);
    // جلب سجل EmployeeEvaluation مع ربط التقييمات والموظف
    const empEval = await EmployeeEvaluation.findById(id)
      .populate({
        path: 'selfEvaluation',
        populate: { path: 'answers.question', model: 'Question', select: 'text' }
      })
      .populate({
        path: 'managerEvaluation',
        populate: { path: 'answers.question', model: 'Question', select: 'text' }
      })
      .populate('employee', 'fullName email');

    if (!empEval) return res.status(404).json({ error: 'التقييم غير موجود' });

    res.json({ employeeEvaluation: empEval });
  } catch (err) {
    console.error('حدث خطأ أثناء جلب التقييم:', err.message);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب التقييم' });
  }
});


router.get("/apphome", async (req, res) => {
  try {
    // جلب كل التقييمات المكتملة (ذاتية + مدير)
    const evaluations = await EmployeeEvaluation.find()
      .populate("employee", "fullName email imge") // بيانات الموظف
      .populate("selfEvaluation")
      .populate("managerEvaluation");

    // حساب المتوسط لكل موظف
    const scored = evaluations
      .filter(ev => ev.selfEvaluation && ev.managerEvaluation) // فقط المكتملة
      .map(ev => {
        const selfScore = ev.selfEvaluation.finalScore || 0;
        const managerScore = ev.managerEvaluation.finalScore || 0;
        const avgScore = Math.round((selfScore + managerScore) / 2);
        return {
          employee_name: ev.employee.fullName,
          employee_image: ev.employee.imge,
          avg_score: avgScore
        };
      });

    // ترتيب تنازلي حسب avg_score
    scored.sort((a, b) => b.avg_score - a.avg_score);
console.log("Scored Employees:", scored);
    // أفضل 5 موظفين
    const top5 = scored.slice(0, 5);

    // بيانات إعلانات (افتراضي)
    const ads = []; // هنا ضع بيانات الإعلانات من قاعدة البيانات إذا موجودة

    res.json({
   
      bestEmployees: top5
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "حدث خطأ أثناء جلب البيانات" });
  }
});


module.exports = router;
