import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from 'react-redux';

let initialEmployee = {
  username: "",
  userType: "visitor",
  imge: "",
  email: "",
  phone: "",
  address: "",
  age: 20,
  gender: "",
};

try {
  const stored = localStorage.getItem("employee");
  if (stored && stored !== 'undefined' && stored !== 'null') {
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed === 'object') {
      initialEmployee = parsed;
    }
  }
} catch (error) {
  console.error('Error parsing employee data from localStorage:', error);
  localStorage.removeItem("employee");
}

const employeeSlice = createSlice({
  name: "employees",
  initialState: { employee: initialEmployee },
  reducers: {
    updateEmployee: (state, action) => {
      try {
        state.employee = action.payload;
        localStorage.setItem("employee", JSON.stringify(action.payload));
      } catch (error) {
        console.error('Error updating employee state:', error);
      }
    },
    clearEmployee: (state) => {
      state.employee = {
        username: "",
        userType: "visitor",
        imge: "",
        email: "",
        phone: "",
        address: "",
        age: 20,
        gender: "",
      };
      localStorage.removeItem("employee");
      localStorage.removeItem("token");
    },
  },
});

export const { updateEmployee, clearEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
