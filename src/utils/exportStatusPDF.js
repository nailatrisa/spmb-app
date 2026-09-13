import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// 🔥 FIX: Export hanya area informasi dan timeline status ke PDF A4.
export const exportStatusToPDF = async (elementId, registrationNumber) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Area status tidak ditemukan.');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  });
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const imageWidth = pageWidth - margin * 2;
  const imageHeight = (canvas.height * imageWidth) / canvas.width;
  const imageData = canvas.toDataURL('image/png');
  let remainingHeight = imageHeight;
  let offset = 0;

  while (remainingHeight > 0) {
    if (offset > 0) pdf.addPage();
    pdf.addImage(imageData, 'PNG', margin, margin - offset, imageWidth, imageHeight);
    offset += pageHeight - margin * 2;
    remainingHeight -= pageHeight - margin * 2;
  }

  const safeRegistrationNumber = registrationNumber.replace(/[^a-z0-9_-]/gi, '_');
  pdf.save(`Status_SPMB_${safeRegistrationNumber}.pdf`);
};
