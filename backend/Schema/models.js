const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
  firstName: {
    type: String,
    required: [true, 'الاسم الأول مطلوب'],
    trim: true
  },

  lastName: {
    type: String,
    required: [true, 'اسم العائلة مطلوب'],
    trim: true
  },

  fullName: {
    type: String,
    trim: true,

  },
password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
  },



  imge:{type:String },

  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    lowercase: true,
    trim: true,
    validate: {
      validator: async function (value) {
        const User = mongoose.model('User');

        const existing = await User.findOne({
          email: value,
          _id: { $ne: this._id }
        });

        return !existing;
      },
      message: 'البريد الإلكتروني مستخدم مسبقاً'
    }
  },

  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },

  age: {
    type: Number,
    min: [18, 'العمر يجب ألا يقل عن 18'],
    max: [65, 'العمر يجب ألا يزيد عن 65'],
    required: true
  },

  department: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['admin', 'manager', 'employee'],
    default: 'employee'
  }
},
{
  timestamps: true
});

/* توليد الاسم الكامل من قاعدة البيانات */
userSchema.pre('validate', function () {
  this.fullName = `${this.firstName} ${this.lastName}`;
});

/* فهارس للحماية */
userSchema.index({ fullName: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
/* أسئلة التقييم الأساسية */
const questionSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true }
});

const Question = mongoose.model('Question', questionSchema);
const evaluationSchema = new mongoose.Schema(
{
  answers: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
      },
      score: {
        type: Number,
        min: 0,
        max: 10,
        required: true
      }
    }
  ],


  finalScore: {
    type: Number // من 100
  },

  notes: {
    type: String,
    trim: true
  }
},
{
  timestamps: true
});

/* حساب المجموع والتقييم النهائي */
evaluationSchema.pre('save', function () {
const total = this.answers.reduce(
  (sum, ans) => sum + ans.score,
  0
);
  const maxTotal = this.answers.length ;

  this.finalScore = Math.round((total / maxTotal) * 10);
});

/* التأكد من وجود 8 أسئلة */
evaluationSchema.path('answers').validate(function (value) {
  return value.length === 8;
}, 'يجب الإجابة على 8 أسئلة بالضبط');

const Evaluation = mongoose.model('Evaluation', evaluationSchema);
const employeeEvaluationSchema = new mongoose.Schema(
{
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  /* التقييم الداخلي (ينشأ أولاً) */
  selfEvaluation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evaluation',
    required: true
  },

  /* التقييم الخارجي (يُضاف لاحقاً) 
  بعدما يقيم الخموظف نفسه يتم تقييمه من قبل المدير
  
  
  */

  managerEvaluation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evaluation',
    default: null
  },

  /* المدير المقيم */
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  period: {
    type: String, // مثال: 2025-Q1{سنة التقييم}
    required: true
  }
},
{
  timestamps: true
});

/* منع أكثر من تقييم لنفس الموظف في نفس الفترة */
employeeEvaluationSchema.index(
  { employee: 1, period: 1 },
  { unique: true }
);


employeeEvaluationSchema.pre('save', function () {
  // تعيين الفترة الحالية إذا لم تكن محددة
  if (!this.period) {
    const currentYear = new Date().getFullYear(); 
    this.period = currentYear.toString();
  }

  // منع إدخال تقييم المدير بدون مدير
  if (this.managerEvaluation && !this.manager) {
    throw new Error('يجب تحديد المدير المقيم');
  }
});

const EmployeeEvaluation = mongoose.model(
  'EmployeeEvaluation',
  employeeEvaluationSchema
);
module.exports = {
  User,
  Question,
  Evaluation,
  EmployeeEvaluation
};
