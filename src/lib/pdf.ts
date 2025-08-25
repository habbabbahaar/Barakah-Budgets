import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { UserOptions } from 'jspdf-autotable';
import type { Transaction } from './types';

// Extend the jsPDF interface to include the autoTable method
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

export const generatePdf = (transactions: Transaction[]) => {
    const doc = new jsPDF();
    doc.text("Transaction History", 14, 16);

    const tableData = transactions.map(t => [
        t.date.toLocaleDateString(),
        t.description,
        t.category,
        t.type,
        t.amount.toFixed(2),
        t.account === 'wife' ? 'Pamii' : 'Habba'
    ]);

    doc.autoTable({
        head: [['Date', 'Description', 'Category', 'Type', 'Amount', 'Account']],
        body: tableData,
        startY: 20,
    });

    doc.save('transactions.pdf');
};
