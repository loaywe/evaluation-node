const connectDB = require('./Schema/dataconection'); // استدعاء الدالة للاتصال بقاعدة البيانات
const { User, Question, Evaluation, EmployeeEvaluation } = require('./Schema/models');
const mongoose = require('mongoose');
 
async function run() {
  try {
    connectDB();

    await new Promise((resolve, reject) => {
      mongoose.connection.once('open', resolve);
      mongoose.connection.on('error', reject);
    });

    const seedsColl = mongoose.connection.collection('seeds');
    const existing = await seedsColl.findOne({ name: 'initial-seed' });
    if (existing) {
      console.log('nodeseed: initial-seed already applied. No action taken.');
      return;
    }

    console.log('nodeseed: Starting idempotent seeding...');

    // Do not remove existing data; only add if not present
    const managersData = [
      { firstName: 'Amina', lastName: 'Hassan', email: 'amina.hassan@example.com', gender: 'female', age: 38, department: 'HR', role: 'manager' },
      { firstName: 'Omar', lastName: 'Saleh', email: 'omar.saleh@example.com', gender: 'male', age: 42, department: 'Sales', role: 'manager' },
      { firstName: 'Layla', lastName: 'Nasser', email: 'layla.nasser@example.com', gender: 'female', age: 45, department: 'Engineering', role: 'manager' }
    ];

    const employeesData = [
      { firstName: 'Hassan', lastName: 'Khaled', email: 'hassan.khaled@example.com', gender: 'male', age: 29, department: 'HR' },
      { firstName: 'Fatima', lastName: 'Yousef', email: 'fatima.yousef@example.com', gender: 'female', age: 31, department: 'HR' },
      { firstName: 'Rami', lastName: 'Mahmoud', email: 'rami.mahmoud@example.com', gender: 'male', age: 26, department: 'HR' },

      { firstName: 'Sara', lastName: 'Adel', email: 'sara.adel@example.com', gender: 'female', age: 28, department: 'Sales' },
      { firstName: 'Khalid', lastName: 'Amin', email: 'khalid.amin@example.com', gender: 'male', age: 34, department: 'Sales' },
      { firstName: 'Mona', lastName: 'Fahmy', email: 'mona.fahmy@example.com', gender: 'female', age: 27, department: 'Sales' },
      { firstName: 'Youssef', lastName: 'Ibrahim', email: 'youssef.ibrahim@example.com', gender: 'male', age: 30, department: 'Sales' },

      { firstName: 'Nadia', lastName: 'Sami', email: 'nadia.sami@example.com', gender: 'female', age: 33, department: 'Engineering' },
      { firstName: 'Adel', lastName: 'Tarek', email: 'adel.tarek@example.com', gender: 'male', age: 35, department: 'Engineering' },
      { firstName: 'Iman', lastName: 'Hussein', email: 'iman.hussein@example.com', gender: 'female', age: 29, department: 'Engineering' }
    ];

    // Create managers if they don't exist (based on email)
    const managers = [];
    for (const m of managersData) {
      const found = await User.findOne({ email: m.email });
      if (found) {
        managers.push(found);
        continue;
      }
      const doc = new User(m);
      await doc.save();
      managers.push(doc);
    }

    // Create employees if they don't exist
    const employees = [];
    for (const e of employeesData) {
      let found = await User.findOne({ email: e.email });
      if (found) {
        employees.push(found);
        continue;
      }
      const doc = new User(e);
      await doc.save();
      employees.push(doc);
    }

    // Ensure there are 8 questions to reference in evaluations
    let questions = await Question.find().limit(8);
    const defaultQuestions = [
      'التعاون والعمل الجماعي',
      'الالتزام بالمواعيد والمهنية',
      'جودة العمل والدقة',
      'الابتكار والمبادرة',
      'التواصل مع الزملاء والعملاء',
      'القدرة على حل المشكلات',
      'الالتزام بسياسات الشركة',
      'القدرة على التعلم والتطور'
    ];

    if (questions.length < 8) {
      const toCreate = defaultQuestions.slice(questions.length).map(text => ({ text }));
      if (toCreate.length) await Question.insertMany(toCreate);
      questions = await Question.find().limit(8);
    }

    function makeAnswers(questionsList) {
      const answers = [];
      for (let i = 0; i < 8; i++) {
        answers.push({ question: questionsList[i]._id, score: Math.floor(Math.random() * 5) + 1 });
      }
      return answers;
    }

    const period = '2025-Q1';

    for (const emp of employees) {
      // skip if EmployeeEvaluation for this employee & period already exists
      const existingEE = await EmployeeEvaluation.findOne({ employee: emp._id, period });
      if (existingEE) continue;

      const manager = managers.find(m => m.department === emp.department);

      const selfEval = new Evaluation({ answers: makeAnswers(questions), notes: 'Self evaluation' });
      await selfEval.save();

      const managerEval = new Evaluation({ answers: makeAnswers(questions), notes: 'Manager evaluation' });
      await managerEval.save();

      const ee = new EmployeeEvaluation({
        employee: emp._id,
        selfEvaluation: selfEval._id,
        managerEvaluation: managerEval._id,
        manager: manager ? manager._id : null,
        period
      });

      await ee.save();
    }

    await seedsColl.insertOne({ name: 'initial-seed', runAt: new Date() });

    console.log('nodeseed: Seeding completed.');
  } catch (err) {
    console.error('nodeseed: Error while seeding:', err);
    throw err;
  }
}


run();