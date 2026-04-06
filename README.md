# Finance Dashboard

A clean, interactive finance dashboard interface built as a frontend development assignment evaluation. 
This project has been implemented showcasing how to build a production-level React application in Next.js from zero to full state consistency.

## Overview & Approach
The application aims to deliver an intuitive and clean user interface for managing personal finances. Leveraging Next.js App Router and Zustand for state management. Below is an overview addressing key evaluation criteria:

### 1. Design & Creativity
- Designed with user comfort in mind using Shadcn UI mixed with TailwindCSS for beautiful and clean components.
- Integrated interactive Recharts for area charts and pie charts, helping visualize income paths and distribution without overwhelming the user.
- Emphasized whitespace, clear typography, and subtle animations using ramer-motion for a pleasant feel.

### 2. Responsiveness
- Entire layout relies on Tailwind’s mobile-first responsive utility classes.
- Used CSS grids and Flexbox rigorously to adapt the top-level cards, visualizations, and table columns gracefully across screens (e.g., stacking side-by-side elements on smaller viewport widths).

### 3. Functionality & RBAC
- Built a functional dynamic dashboard where changes in transaction data recalculate summaries in real-time.
- **Role-Based Access Control (RBAC)** implemented via the top-right header RoleSwitcher:
  - **Viewer:** Read-only access to view charts, insights, and transactions.
  - **Admin:** Has Write-access to add, edit, and delete transactions. Forms and Actions column dynamically adapt based on this active role.
- Included full local sorting and filtering of transactions.

### 4. User Experience
- Includes dark mode and light mode support integrated with 
ext-themes.
- Features smooth loading states, localized currency toggles, skeleton-like transitions, and feedback/empty states when filters hide all table rows.

### 5. Technical Quality
- Separated concerns into modular files: Layouts, Dashboard, Transactions, Store, and Hooks.
- Custom Hooks (useCurrencyFormatter) extract repeated logic.
- Built-in CSV export logic.
- Fixed common SSR Recharts warnings locally.

### 6. State Management Approach
- State managed through **Zustand**. Kept lightweight, avoiding prop-drilling, yet persisted beautifully with persist middleware to localStorage.
- Includes a mock asynchronous etchData step mimicking real API behavior.

### 7. Attention to Detail
- Handled edge-cases: limiting latest transactions on the dashboard via limit props, hiding specific UI controls when nested. 
- Graceful empty states with icons when clearing out all transactions or filtering out matches.

## Technical Stack

*   **Framework:** React / Next.js (App Router)
*   **Styling:** Tailwind CSS + shadcn/ui components
*   **State Management:** Zustand (Persisted)
*   **Charts:** Recharts
*   **Animation:** Framer Motion
*   **Icons:** Lucide-React

## How to Run Locally

First, install the required dependencies:

`bash
npm install
`

Then, run the development server:

`bash
npm run dev
`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
