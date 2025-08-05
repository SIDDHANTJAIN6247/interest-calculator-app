# Interest Calculator Web App

A modern, professional React web application for calculating interest rates with built-in calculator interface and PDF export functionality.

## 🚀 Features

### ✨ Core Functionality
- **Calculator Interface**: Physical calculator-style input for all numeric fields
- **Interest Calculation**: Automated calculations using industry-standard formulas
- **Professional Setup**: Configure broker name, ROI, and final dates
- **Data Management**: Add, edit, and delete transaction rows

### 📊 Advanced Features
- **PDF Export**: Generate professional PDF reports with company branding
- **CSV Export**: Export data for external analysis and backup
- **Keyboard Support**: Full keyboard navigation and shortcuts
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🎨 Modern Interface
- **Dark Theme**: Professional gradient-based dark interface
- **Interactive Elements**: Hover effects and smooth transitions
- **Visual Feedback**: Color-coded input fields and status indicators
- **Intuitive Navigation**: Streamlined workflow from setup to export

## 🛠️ Technology Stack

- **Frontend**: React 18 with modern hooks
- **Build Tool**: Vite (lightning-fast development)
- **Icons**: Lucide React
- **PDF Generation**: jsPDF with autoTable
- **Styling**: Custom CSS with professional gradients

## 📦 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation
1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view the app.

### Building for Production
```bash
npm run build
```

## 📖 Usage Guide

### 1. Initial Setup
- Enter your **Broker Name** (e.g., "ABC Financial Services")
- Set your **Rate of Interest** using the calculator (e.g., 12 for 12%)
- Set the **Final Date** in DD/MM/YY format using calculator (e.g., 151224)

### 2. Adding Transactions
- Click **"Add Row"** to create new transactions
- Use the calculator interface to enter:
  - **Bill Number** (optional)
  - **Principal Amount** (supports decimals)
  - **Start Date** in DDMMYY format
- **End Date** is automatically set to your final date
- Interest and totals are calculated automatically

### 3. Calculator Interface
- **Number Pad**: Physical calculator-style interface
- **00 Button**: Quick entry for large numbers
- **Decimal Support**: For precise amounts and ROI
- **Keyboard Support**: Use your keyboard for faster input
- **Auto-progression**: Moves to next field automatically

### 4. Export Options
- **Save as PDF**: Professional reports with company branding
- **Export CSV**: Download data for Excel or other tools
- Both exports include all transaction details and summaries

## 🔢 Calculation Details

### Interest Formula
```
Interest = (Principal × Days × ROI) / 3000
Total Amount = Principal + Interest
```

### Day Calculation
- Uses 30-day months for consistency
- Minimum period: 30 days (1 month)
- Day 31 is treated as day 30 for calculations

### Date Format
- **Input**: DDMMYY (e.g., 151224)
- **Display**: DD/MM/YY (e.g., 15/12/24)
- **Validation**: Ensures valid dates

## 🎯 Key Improvements

### Calculator Interface
- Physical calculator-style number pad for all inputs
- "00" button for quick large number entry
- Decimal support for precise calculations
- Auto-progression between fields

### PDF Export
- Professional company-headed reports
- Formatted tables with proper styling
- Financial summary section
- Date and time stamped

### User Experience
- No data persistence (session-based)
- Intuitive workflow from setup to export
- Visual feedback for all interactions
- Mobile-responsive design

## 🎨 Interface Highlights

- **Setup Screen**: Clean configuration with calculator
- **Data Sheet**: Interactive table with inline editing
- **Calculator**: Always-available number pad interface
- **Summary**: Real-time financial totals
- **Export**: One-click PDF and CSV generation

## 🔧 Technical Details

- **State Management**: React hooks (useState, useEffect)
- **PDF Generation**: jsPDF with professional formatting
- **Responsive**: CSS Grid and Flexbox
- **Accessibility**: Keyboard navigation and ARIA labels
- **Performance**: Optimized calculations and re-renders

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

This project is licensed under the MIT License.
