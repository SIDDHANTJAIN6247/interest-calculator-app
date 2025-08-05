<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Interest Calculator Web App - Copilot Instructions

This is a React web application built with Vite for calculating interest rates with advanced features including PDF export.

## Project Overview
- **Framework**: React 18 with Vite
- **UI Library**: Lucide React for icons
- **PDF Generation**: jsPDF with jspdf-autotable for professional PDF reports
- **Styling**: Custom CSS with gradient backgrounds and modern design
- **Features**: Calculator interface, data management, PDF/CSV export

## Key Features
1. **Setup Screen**: Configure broker name, ROI, and final date using built-in calculator
2. **Data Sheet**: Interactive table for managing transactions with inline editing
3. **Calculator Interface**: Physical calculator-style input for all numeric fields
4. **PDF Export**: Generate professional PDF reports with company branding
5. **CSV Export**: Data export functionality for external analysis
6. **Keyboard Support**: Full keyboard navigation and shortcuts

## Architecture Notes
- **No Local Storage**: Data is session-based only (not persisted)
- **State Management**: Uses React useState hooks exclusively
- **Date Format**: DD/MM/YY format for all dates (e.g., 15/12/24)
- **Interest Calculation**: Formula = (Principal × Days × ROI) / 3000
- **Day Calculation**: 30-day months with minimum 30-day periods

## Component Structure
- Single component architecture (InterestCalculatorApp)
- Calculator component with number pad interface
- Responsive design with mobile support
- Dark theme with gradient backgrounds
- Professional styling for PDF exports

## Development Guidelines
- Use functional components with hooks
- Maintain clean separation between UI and business logic
- Follow React best practices for state management
- Ensure accessibility with proper ARIA labels
- Use semantic HTML elements
- Keep PDF export formatting professional and clean
