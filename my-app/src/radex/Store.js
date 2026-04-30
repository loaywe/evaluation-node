import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./Employees"; // استدعاء الـ slice الجديد

const store = configureStore({
  reducer: {
    employee: employeeReducer, // تحديث الاسم ليتوافق مع slice الجديد
  },
});

export default store;
