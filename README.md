# EduPort - Frontend-Only Portfolio & Project Tracker

A responsive, frontend-only web application built with React.js that allows students and admins to interact through mock data and simulated backend logic using localStorage.

## Features

### 🔐 Authentication (Mock)
- Role-based login (student/admin)
- User registration
- Session management with localStorage
- Logout functionality

### 🧰 Student Dashboard
- Create and edit project portfolios
- Upload images/videos (preview only, stored in localStorage)
- Track milestones (Idea → Prototype → Testing → Completed)
- View feedback from admins
- Progress tracking with visual progress bars

### 🧑‍🏫 Admin Dashboard
- View all student portfolios
- Filter portfolios by status
- Add comments and feedback
- Approve/Reject portfolios (UI state changes)
- View detailed project information

### 📁 Public Portfolio Page
- Read-only view of student portfolios
- Media gallery display
- Timeline view of milestones
- Download portfolio as PDF functionality

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Demo Credentials

### Student Account
- **Email:** student1@edu.com
- **Password:** student123

### Admin Account
- **Email:** admin@edu.com
- **Password:** admin123

You can also register new student accounts through the registration page.

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Auth.css
│   ├── Student/
│   │   ├── StudentDashboard.jsx
│   │   ├── PortfolioForm.jsx
│   │   ├── PortfolioCard.jsx
│   │   └── *.css
│   ├── Admin/
│   │   ├── AdminDashboard.jsx
│   │   └── AdminDashboard.css
│   └── Public/
│       ├── PublicPortfolio.jsx
│       └── PublicPortfolio.css
├── utils/
│   └── storage.js
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## Technologies Used

- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **jsPDF** - PDF generation
- **html2canvas** - Screenshot for PDF conversion
- **localStorage** - Data persistence

## Key Features Explained

### Milestone Tracking
Students can track their project progress through four stages:
1. **Idea** - Initial concept
2. **Prototype** - Working prototype
3. **Testing** - Testing phase
4. **Completed** - Final product

### Media Upload
- Supports image and video files
- Files are previewed using base64 encoding
- Stored in localStorage (not uploaded to a server)
- Preview only functionality

### PDF Export
- Generates PDF from portfolio content
- Uses html2canvas to capture the portfolio
- Includes all project details, milestones, and feedback

## Data Storage

All data is stored in the browser's localStorage:
- **Users:** Registered users and credentials
- **Portfolios:** All student projects
- **Feedback:** Admin comments and feedback
- **Current User:** Active session

**Note:** Data persists in the browser but will be cleared if localStorage is cleared or in incognito mode.

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for educational purposes.

"# fedf-project-cursor-2" 
