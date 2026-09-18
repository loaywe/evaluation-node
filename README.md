# 📊 Evaluation Node

> Employee evaluation platform with a React frontend and a Node.js/Express backend backed by MongoDB.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📌 Overview

**Evaluation Node** is a full-stack employee evaluation system that supports **two evaluation flows**:

1. **Self-Assessment (Internal)** — the employee rates themselves.
2. **Manager Review (External)** — the direct manager rates the employee.

Both evaluations are stored separately and linked together, allowing comparison between self-perception and managerial assessment. The system includes role-based access (admin, manager, employee), JWT authentication, and a clean MongoDB schema with automatic score computation.

---

## 🎯 Problem It Solves

Traditional performance reviews are often:

- Manual — scattered across spreadsheets and emails
- Biased — no structured comparison between self and manager views
- Slow — weeks of back-and-forth before results are ready
- Untrackable — no history, no audit trail

**Evaluation Node** delivers:

- ⚡ Structured evaluation cycles
- ⚖️ Separate self + manager assessments for comparison
- 🎯 Automatic score computation (0–100 scale)
- 🔒 JWT-based authentication with role-based access
- 📜 Full history per employee per period

---

## 👥 Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access: manage users, questions, and evaluations |
| **Manager** | Evaluate direct reports, view team results |
| **Employee** | Complete self-assessment, view own results |

---

## 🏗️ Project Structure
