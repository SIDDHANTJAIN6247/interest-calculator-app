import React, { useState, useEffect } from 'react';
import { Calculator, Plus, Minus, X, Save, Download, Edit2, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InterestCalculatorApp = () => {
  const [currentScreen, setCurrentScreen] = useState('setup');
  const [setupData, setSetupData] = useState({
    finalDate: '',
    roi: '',
    brokerName: ''
  });
  const [dataSheet, setDataSheet] = useState([]);
  const [activeInput, setActiveInput] = useState(null);
  const [calculatorValue, setCalculatorValue] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);
  const [isCalculatorFocused, setIsCalculatorFocused] = useState(false);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isCalculatorFocused) {
        e.preventDefault();
        
        if (e.key >= '0' && e.key <= '9') {
          handleCalculatorNumber(e.key);
        } else if (e.key === '.' && (activeInput === 'roi' || editingColumn === 'PA')) {
          handleCalculatorNumber('.');
        } else if (e.key === 'Backspace') {
          handleCalculatorBackspace();
        } else if (e.key === 'Delete' || e.key === 'c' || e.key === 'C') {
          handleCalculatorClear();
        } else if (e.key === 'Enter') {
          handleCalculatorEnter();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCalculatorFocused, calculatorValue, activeInput, editingRow, editingColumn]);

  // Focus calculator when inputs are active
  useEffect(() => {
    if (activeInput || (editingRow !== null && editingColumn)) {
      setIsCalculatorFocused(true);
    } else {
      setIsCalculatorFocused(false);
    }
  }, [activeInput, editingRow, editingColumn]);

  // Auto-save calculator value when switching inputs
  useEffect(() => {
    if (calculatorValue && activeInput) {
      if (activeInput === 'roi') {
        setSetupData(prev => ({ ...prev, roi: calculatorValue }));
      } else if (activeInput === 'finalDate') {
        handleSetupDateInput(calculatorValue);
      }
    }
  }, [activeInput, calculatorValue]);

  // PDF Export functionality
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text('Interest Rate Calculator Report', 20, 30);
    
    doc.setFontSize(14);
    doc.text(`Broker: ${setupData.brokerName}`, 20, 45);
    doc.text(`Rate of Interest: ${setupData.roi}%`, 20, 55);
    doc.text(`Final Date: ${setupData.finalDate}`, 20, 65);
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 75);

    // Table data
    const tableHeaders = ['Bill No.', 'Principal Amount', 'Start Date', 'End Date', 'Interest Earned', 'Total Amount'];
    const tableData = dataSheet.map((row, index) => [
      row.BILLNO || `Row ${index + 1}`,
      `₹${parseFloat(row.PA || 0).toLocaleString()}`,
      row.SD,
      row.ED,
      `₹${parseFloat(row.interest || 0).toLocaleString()}`,
      `₹${parseFloat(row.total || 0).toLocaleString()}`
    ]);

    // Add the main table
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 85,
      theme: 'striped',
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { halign: 'left' },   // Bill No
        1: { halign: 'right' },  // Principal Amount
        2: { halign: 'center' }, // Start Date
        3: { halign: 'center' }, // End Date
        4: { halign: 'right' },  // Interest
        5: { halign: 'right' }   // Total
      }
    });

    // Summary section
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text('Financial Summary', 20, finalY);

    const totalPrincipal = dataSheet.reduce((sum, row) => sum + (parseFloat(row.PA) || 0), 0);
    const totalInterest = dataSheet.reduce((sum, row) => sum + (parseFloat(row.interest) || 0), 0);
    const grandTotal = dataSheet.reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0);

    const summaryData = [
      ['Total Principal', `₹${totalPrincipal.toLocaleString()}`],
      ['Total Interest', `₹${totalInterest.toLocaleString()}`],
      ['Grand Total', `₹${grandTotal.toLocaleString()}`]
    ];

    doc.autoTable({
      body: summaryData,
      startY: finalY + 10,
      theme: 'plain',
      styles: { 
        fontSize: 12,
        cellPadding: 5
      },
      columnStyles: {
        0: { fontStyle: 'bold', halign: 'left' },
        1: { fontStyle: 'bold', halign: 'right' }
      }
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text('Generated by Interest Rate Calculator App', 20, pageHeight - 20);

    // Save the PDF
    const fileName = `${setupData.brokerName}_Interest_Report_${new Date().toLocaleDateString().replace(/\//g, '_')}.pdf`;
    doc.save(fileName);
  };

  // Calculator component
  const CalculatorComponent = ({ onNumber, onClear, onBackspace, onEnter, value, isDate = false, isROI = false, isBillNo = false }) => {
    const buttons = [
      ['7', '8', '9'],
      ['4', '5', '6'],
      ['1', '2', '3'],
      ['0', '00', 'C']
    ];

    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border-2 border-gray-700 shadow-2xl w-72">
        <div className={`bg-black text-green-400 p-3 rounded-lg mb-4 text-right text-2xl font-mono border border-gray-600 ${isCalculatorFocused ? 'ring-2 ring-green-500 shadow-lg shadow-green-500/50' : ''}`}>
          <div className="text-green-300 text-xs mb-1">Current Input:</div>
          <div className="text-green-400 text-2xl font-bold">{value || '0'}</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {buttons.flat().map((btn, index) => (
            <button
              key={index}
              onClick={() => {
                if (btn === 'C') onClear();
                else if (btn === '00') onNumber('00');
                else onNumber(btn);
              }}
              className={`bg-gradient-to-br from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white p-4 rounded-lg text-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                btn === '00' ? 'from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400' : ''
              } ${
                btn === 'C' ? 'from-red-600 to-red-500 hover:from-red-500 hover:to-red-400' : ''
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
        {(isROI || editingColumn === 'PA') && (
          <button
            onClick={() => onNumber('.')}
            className="w-full mt-3 bg-gradient-to-br from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white p-4 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            . (Decimal)
          </button>
        )}
        <button
          onClick={onBackspace}
          className="w-full mt-3 bg-gradient-to-br from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white p-4 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          ⌫ Delete
        </button>
        <button
          onClick={onEnter}
          className="w-full mt-3 bg-gradient-to-br from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white p-4 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          ✓ Enter
        </button>
        {isCalculatorFocused && (
          <div className="mt-3 text-xs text-gray-400 text-center bg-gray-800 p-2 rounded">
            <p>Keyboard: Numbers (0-9), Backspace, Delete/C (clear), Enter{(isROI || editingColumn === 'PA') ? ', . (decimal)' : ''}</p>
          </div>
        )}
      </div>
    );
  };

  // Calculate days difference (30 days per month, minimum 30 days)
  const calculateDays = (startDate, endDate) => {
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('/').map(Number);
      // Convert day 31 to 30 for calculation purposes
      const adjustedDay = day === 31 ? 30 : day;
      return { day: adjustedDay, month, year: 2000 + year };
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    const startTotalDays = (start.year * 360) + (start.month * 30) + start.day;
    const endTotalDays = (end.year * 360) + (end.month * 30) + end.day;

    const daysDifference = endTotalDays - startTotalDays;
    
    // If the difference is less than 30 days, return 30 days (1 month minimum)
    return daysDifference < 30 ? 30 : daysDifference;
  };

  // Calculate interest
  const calculateInterest = (pa, days, roi) => {
    return (pa * days * roi) / 3000;
  };

  // Calculator handlers
  const handleCalculatorNumber = (num) => {
    setCalculatorValue(prev => prev + num);
  };

  const handleCalculatorClear = () => {
    setCalculatorValue('');
  };

  const handleCalculatorBackspace = () => {
    setCalculatorValue(prev => prev.slice(0, -1));
  };

  const handleCalculatorEnter = () => {
    if (activeInput === 'finalDate') {
      handleSetupDateInput(calculatorValue);
    } else if (activeInput === 'roi') {
      setSetupData(prev => ({ ...prev, roi: calculatorValue }));
    } else if (editingRow !== null && editingColumn) {
      const newData = [...dataSheet];
      if (editingColumn === 'BILLNO') {
        newData[editingRow].BILLNO = calculatorValue;
        setDataSheet(newData);
        // Move to PA field after Bill No.
        setEditingColumn('PA');
        setCalculatorValue('');
        return;
      } else if (editingColumn === 'PA') {
        newData[editingRow].PA = calculatorValue;
        setDataSheet(newData);
        updateRowCalculations(editingRow);
        // Move to next field (SD)
        setEditingColumn('SD');
        setCalculatorValue('');
        return; // Don't clear editing state yet
      } else if (editingColumn === 'SD') {
        const dateValue = calculatorValue;
        if (dateValue.length === 6) {
          const day = parseInt(dateValue.substring(0, 2));
          const month = parseInt(dateValue.substring(2, 4));
          const year = parseInt(dateValue.substring(4, 6));
          
          if (day <= 31 && month <= 12 && year <= 99) {
            newData[editingRow].SD = `${dateValue.substring(0, 2)}/${dateValue.substring(2, 4)}/${dateValue.substring(4, 6)}`;
            setDataSheet(newData);
            updateRowCalculations(editingRow);
            // Move to next row if available, otherwise finish editing
            if (editingRow + 1 < dataSheet.length) {
              setEditingRow(editingRow + 1);
              setEditingColumn('BILLNO');
              setCalculatorValue('');
              return;
            }
          }
        }
      }
      setEditingRow(null);
      setEditingColumn(null);
    }
    setActiveInput(null);
    setCalculatorValue('');
  };

  // Setup form handlers
  const handleSetupDateInput = (value) => {
    if (value.length === 6) {
      const day = parseInt(value.substring(0, 2));
      const month = parseInt(value.substring(2, 4));
      const year = parseInt(value.substring(4, 6));
      
      if (day <= 31 && month <= 12 && year <= 99) {
        setSetupData(prev => ({ 
          ...prev, 
          finalDate: `${value.substring(0, 2)}/${value.substring(2, 4)}/${value.substring(4, 6)}` 
        }));
      }
    }
  };

  const handleSetupSubmit = () => {
    if (setupData.finalDate && setupData.roi && setupData.brokerName) {
      setCurrentScreen('datasheet');
    }
  };

  // Add new row
  const addRow = () => {
    setDataSheet(prev => [...prev, {
      BILLNO: '',
      PA: '',
      SD: '',
      ED: setupData.finalDate,
      interest: 0,
      total: 0
    }]);
    setEditingRow(dataSheet.length);
    setEditingColumn('BILLNO');
    setCalculatorValue('');
  };

  // Delete row
  const deleteRow = (index) => {
    if (confirm('Are you sure you want to delete this row?')) {
      setDataSheet(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Update row calculations
  const updateRowCalculations = (rowIndex) => {
    const newData = [...dataSheet];
    const row = newData[rowIndex];
    
    if (row.PA && row.SD && row.ED) {
      const days = calculateDays(row.SD, row.ED);
      const interest = calculateInterest(parseFloat(row.PA), days, parseFloat(setupData.roi));
      const total = parseFloat(row.PA) + interest;
      
      newData[rowIndex] = {
        ...row,
        interest: interest.toFixed(2),
        total: total.toFixed(2)
      };
      setDataSheet(newData);
    }
  };

  // Export functionality
  const exportData = () => {
    const csvContent = [
      ['Bill No.', 'PA', 'SD', 'ED', 'Interest', 'Total'],
      ...dataSheet.map(row => [row.BILLNO, row.PA, row.SD, row.ED, row.interest, row.total])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${setupData.brokerName}_ROI_${setupData.roi}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (currentScreen === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-3">
              💰 Interest Rate Calculator
            </h1>
            <p className="text-gray-400 text-lg">Setup your calculation parameters</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl mb-6 shadow-2xl border border-gray-700">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-lg border border-gray-600">
                <h3 className="text-xl font-bold mb-6 text-white">⚙ Configuration</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">🏢 Broker Name:</label>
                    <input
                      type="text"
                      value={setupData.brokerName}
                      onChange={(e) => setSetupData(prev => ({ ...prev, brokerName: e.target.value }))}
                      className="w-full p-4 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-gray-400 transition-all"
                      placeholder="Enter broker name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">📈 Rate of Interest (ROI):</label>
                    <button
                      onClick={() => {
                        // Auto-save current value if switching from finalDate
                        if (activeInput === 'finalDate' && calculatorValue) {
                          handleSetupDateInput(calculatorValue);
                        }
                        setActiveInput('roi');
                        setCalculatorValue(setupData.roi || '');
                      }}
                      className="w-full p-4 bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 text-left text-white transition-all hover:border-green-500"
                    >
                      {setupData.roi ? `${setupData.roi}%` : 'Click to enter ROI'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">📅 Final Date (DD/MM/YY):</label>
                    <button
                      onClick={() => {
                        // Auto-save current value if switching from ROI
                        if (activeInput === 'roi' && calculatorValue) {
                          setSetupData(prev => ({ ...prev, roi: calculatorValue }));
                        }
                        setActiveInput('finalDate');
                        setCalculatorValue('');
                      }}
                      className="w-full p-4 bg-gray-900 border border-gray-600 rounded-lg hover:bg-gray-800 text-left text-white transition-all hover:border-green-500"
                    >
                      {setupData.finalDate || 'Click to enter final date'}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSetupSubmit}
                  disabled={!setupData.finalDate || !setupData.roi || !setupData.brokerName}
                  className="w-full mt-8 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-500 text-white p-4 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  🚀 Create Data Sheet
                </button>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-lg border border-gray-600">
                <h3 className="text-xl font-bold mb-6 text-white">
                  🔢 {activeInput === 'roi' ? 'Enter ROI' : 'Enter Final Date'}
                </h3>
                {(activeInput === 'roi' || activeInput === 'finalDate') && (
                  <div>
                    <CalculatorComponent 
                      onNumber={handleCalculatorNumber}
                      onClear={handleCalculatorClear}
                      onBackspace={handleCalculatorBackspace}
                      onEnter={handleCalculatorEnter}
                      value={calculatorValue}
                      isDate={activeInput === 'finalDate'}
                      isROI={activeInput === 'roi'}
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      {activeInput === 'finalDate' 
                        ? 'Enter date as DDMMYY (e.g., 151224 for 15/12/24)'
                        : 'Enter ROI as a number (e.g., 12 for 12%). Use 00 button for large numbers!'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              💼 {setupData.brokerName} - ROI {setupData.roi}%
            </h1>
            <p className="text-gray-400 text-lg">📅 Final Date: {setupData.finalDate}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentScreen('setup')}
              className="bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Edit2 size={18} />
              Edit Setup
            </button>
            <button
              onClick={exportToPDF}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FileText size={18} />
              Save as PDF
            </button>
            <button
              onClick={exportData}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-2xl border border-gray-600">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">📊 Data Sheet</h2>
                <button
                  onClick={addRow}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus size={16} />
                  Add Row
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-gray-600 text-sm rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-700 to-gray-600">
                      <th className="border border-gray-600 p-3 text-left text-white font-bold">📄 BILL NO.</th>
                      <th className="border border-gray-600 p-3 text-left text-white font-bold">💰 PA</th>
                      <th className="border border-gray-600 p-3 text-left text-white font-bold">📅 SD</th>
                      <th className="border border-gray-600 p-3 text-left text-white font-bold">🏁 ED</th>
                      <th className="border border-gray-600 p-3 text-left text-white font-bold">📈 Interest</th>
                      <th className="border border-gray-600 p-3 text-left text-white font-bold">💎 Total</th>
                      <th className="border border-gray-600 p-3 text-left text-white font-bold">❌ Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataSheet.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-700 transition-colors">
                        <td className="border border-gray-600 p-3 bg-gray-800">
                          <div
                            onClick={() => {
                              setEditingRow(index);
                              setEditingColumn('BILLNO');
                              setCalculatorValue('');
                            }}
                            className={`cursor-pointer p-2 transition-colors ${
                              editingRow === index && editingColumn === 'BILLNO' 
                                ? 'bg-yellow-600 text-black font-bold rounded' 
                                : row.BILLNO 
                                  ? 'text-white hover:text-yellow-300' 
                                  : 'text-red-400 hover:text-red-300'
                            }`}
                          >
                            {editingRow === index && editingColumn === 'BILLNO' 
                              ? `Editing: ${calculatorValue || 'Enter bill number...'}` 
                              : (row.BILLNO || 'Optional')
                            }
                          </div>
                        </td>
                        <td className="border border-gray-600 p-3 bg-gray-800">
                          <div
                            onClick={() => {
                              setEditingRow(index);
                              setEditingColumn('PA');
                              setCalculatorValue('');
                            }}
                            className={`cursor-pointer p-2 transition-colors ${
                              editingRow === index && editingColumn === 'PA' 
                                ? 'bg-blue-600 text-black font-bold rounded' 
                                : row.PA 
                                  ? 'text-white hover:text-blue-300' 
                                  : 'text-red-400 hover:text-red-300'
                            }`}
                          >
                            {editingRow === index && editingColumn === 'PA' 
                              ? `Editing: ${calculatorValue || 'Enter amount...'}` 
                              : (row.PA || 'Click to edit')
                            }
                          </div>
                        </td>
                        <td className="border border-gray-600 p-3 bg-gray-800">
                          <div
                            onClick={() => {
                              setEditingRow(index);
                              setEditingColumn('SD');
                              setCalculatorValue('');
                            }}
                            className={`cursor-pointer p-2 transition-colors ${
                              editingRow === index && editingColumn === 'SD' 
                                ? 'bg-green-600 text-black font-bold rounded' 
                                : row.SD 
                                  ? 'text-white hover:text-green-300' 
                                  : 'text-red-400 hover:text-red-300'
                            }`}
                          >
                            {editingRow === index && editingColumn === 'SD' 
                              ? `Editing: ${calculatorValue || 'Enter date...'}` 
                              : (row.SD || 'Click to edit')
                            }
                          </div>
                        </td>
                        <td className="border border-gray-600 p-3 bg-gray-900 text-gray-300">
                          {row.ED}
                        </td>
                        <td className="border border-gray-600 p-3 bg-gray-900 text-green-400 font-semibold">
                          ₹{row.interest}
                        </td>
                        <td className="border border-gray-600 p-3 bg-gray-900 text-blue-400 font-bold">
                          ₹{row.total}
                        </td>
                        <td className="border border-gray-600 p-3 bg-gray-900">
                          <button
                            onClick={() => deleteRow(index)}
                            className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-xs transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            {(editingRow !== null && editingColumn) && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-2xl border border-gray-600">
                <h3 className="text-xl font-bold mb-6 text-white">
                  ✏ Editing {editingColumn === 'BILLNO' ? '📄 Bill Number' : editingColumn === 'PA' ? '💰 Principal Amount' : '📅 Start Date'} for Row {editingRow + 1}
                </h3>
                <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-600">
                  <p className="text-green-400 font-bold">Current Value: {calculatorValue || 'Not entered yet'}</p>
                </div>
                <CalculatorComponent 
                  onNumber={handleCalculatorNumber}
                  onClear={handleCalculatorClear}
                  onBackspace={handleCalculatorBackspace}
                  onEnter={handleCalculatorEnter}
                  value={calculatorValue}
                  isDate={editingColumn === 'SD'}
                  isROI={editingColumn === 'PA'}
                  isBillNo={editingColumn === 'BILLNO'}
                />
                {editingColumn === 'SD' ? (
                  <p className="text-sm text-gray-400 mt-3 bg-gray-800 p-2 rounded">
                    Enter date as DDMMYY (e.g., 151224 for 15/12/24)
                  </p>
                ) : editingColumn === 'BILLNO' ? (
                  <p className="text-sm text-gray-400 mt-3 bg-gray-800 p-2 rounded">
                    Enter bill number (optional field). Use "00" for large numbers!
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 mt-3 bg-gray-800 p-2 rounded">
                    Enter principal amount. Use "00" for large numbers and decimal for precision!
                  </p>
                )}
                <button
                  onClick={() => {
                    setEditingRow(null);
                    setEditingColumn(null);
                    setCalculatorValue('');
                  }}
                  className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white p-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {dataSheet.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-xl shadow-2xl border border-blue-600">
            <h3 className="text-2xl font-bold mb-4 text-white">📊 Summary</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-4 rounded-lg border border-gray-600">
                <p className="text-sm text-gray-300 mb-2">💰 Total Principal</p>
                <p className="text-2xl font-bold text-white">
                  ₹{dataSheet.reduce((sum, row) => sum + (parseFloat(row.PA) || 0), 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-800 to-green-700 p-4 rounded-lg border border-green-600">
                <p className="text-sm text-green-200 mb-2">📈 Total Interest</p>
                <p className="text-2xl font-bold text-green-400">
                  ₹{dataSheet.reduce((sum, row) => sum + (parseFloat(row.interest) || 0), 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-800 to-purple-700 p-4 rounded-lg border border-purple-500 shadow-lg shadow-purple-500/50">
                <p className="text-sm text-purple-200 mb-2">💎 Grand Total</p>
                <p className="text-2xl font-bold text-purple-300">
                  ₹{dataSheet.reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                📄 Total Transactions: {dataSheet.length} | 
                📊 Average Interest per Transaction: ₹{dataSheet.length > 0 ? (dataSheet.reduce((sum, row) => sum + (parseFloat(row.interest) || 0), 0) / dataSheet.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterestCalculatorApp;
