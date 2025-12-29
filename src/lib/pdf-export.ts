import jsPDF from 'jspdf';

// Colors matching the app theme
const COLORS = {
  amber: { r: 217, g: 119, b: 6 },
  zinc900: { r: 24, g: 24, b: 27 },
  zinc800: { r: 39, g: 39, b: 42 },
  zinc400: { r: 161, g: 161, b: 170 },
  white: { r: 255, g: 255, b: 255 },
  emerald: { r: 16, g: 185, b: 129 },
  red: { r: 239, g: 68, b: 68 },
};

interface PDFSection {
  title: string;
  content: string[];
}

interface PDFExportOptions {
  title: string;
  subtitle?: string;
  mainScore?: {
    value: string;
    label: string;
    color?: 'amber' | 'emerald' | 'red';
  };
  sections: PDFSection[];
  recommendations?: string[];
  metadata?: Record<string, string>;
}

export function generatePDF(options: PDFExportOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Background
  doc.setFillColor(COLORS.zinc900.r, COLORS.zinc900.g, COLORS.zinc900.b);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header bar
  doc.setFillColor(COLORS.zinc800.r, COLORS.zinc800.g, COLORS.zinc800.b);
  doc.rect(0, 0, pageWidth, 25, 'F');

  // Logo/Brand
  doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Hormozi Advisor', margin, 16);

  // Date
  doc.setTextColor(COLORS.zinc400.r, COLORS.zinc400.g, COLORS.zinc400.b);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(date, pageWidth - margin - doc.getTextWidth(date), 16);

  yPos = 40;

  // Title
  doc.setTextColor(COLORS.white.r, COLORS.white.g, COLORS.white.b);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(options.title, margin, yPos);
  yPos += 8;

  // Subtitle
  if (options.subtitle) {
    doc.setTextColor(COLORS.zinc400.r, COLORS.zinc400.g, COLORS.zinc400.b);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(options.subtitle, margin, yPos);
    yPos += 12;
  }

  // Main Score Box
  if (options.mainScore) {
    yPos += 5;
    doc.setFillColor(COLORS.zinc800.r, COLORS.zinc800.g, COLORS.zinc800.b);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 30, 3, 3, 'F');

    // Score Value
    const scoreColor =
      options.mainScore.color === 'emerald'
        ? COLORS.emerald
        : options.mainScore.color === 'red'
        ? COLORS.red
        : COLORS.amber;
    doc.setTextColor(scoreColor.r, scoreColor.g, scoreColor.b);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(options.mainScore.value, margin + 10, yPos + 20);

    // Score Label
    doc.setTextColor(COLORS.zinc400.r, COLORS.zinc400.g, COLORS.zinc400.b);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const labelX = margin + 10 + doc.getTextWidth(options.mainScore.value) + 10;
    doc.text(options.mainScore.label, labelX, yPos + 20);

    yPos += 40;
  }

  // Metadata row
  if (options.metadata && Object.keys(options.metadata).length > 0) {
    yPos += 5;
    const entries = Object.entries(options.metadata);
    const colWidth = (pageWidth - 2 * margin) / Math.min(entries.length, 3);

    entries.slice(0, 3).forEach(([key, value], i) => {
      const x = margin + i * colWidth;

      doc.setTextColor(COLORS.zinc400.r, COLORS.zinc400.g, COLORS.zinc400.b);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(key, x, yPos);

      doc.setTextColor(COLORS.white.r, COLORS.white.g, COLORS.white.b);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(value, x, yPos + 6);
    });

    yPos += 20;
  }

  // Sections
  options.sections.forEach((section) => {
    // Check if we need a new page
    if (yPos > pageHeight - 60) {
      doc.addPage();
      doc.setFillColor(COLORS.zinc900.r, COLORS.zinc900.g, COLORS.zinc900.b);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      yPos = margin;
    }

    yPos += 8;

    // Section title
    doc.setTextColor(COLORS.amber.r, COLORS.amber.g, COLORS.amber.b);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, margin, yPos);
    yPos += 8;

    // Section content
    doc.setTextColor(COLORS.white.r, COLORS.white.g, COLORS.white.b);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    section.content.forEach((line) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        doc.setFillColor(COLORS.zinc900.r, COLORS.zinc900.g, COLORS.zinc900.b);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        yPos = margin;
      }

      // Handle bullet points
      if (line.startsWith('•') || line.startsWith('-')) {
        doc.text(line, margin + 5, yPos);
      } else {
        const lines = doc.splitTextToSize(line, pageWidth - 2 * margin);
        doc.text(lines, margin, yPos);
        yPos += (lines.length - 1) * 5;
      }
      yPos += 6;
    });
  });

  // Recommendations
  if (options.recommendations && options.recommendations.length > 0) {
    if (yPos > pageHeight - 60) {
      doc.addPage();
      doc.setFillColor(COLORS.zinc900.r, COLORS.zinc900.g, COLORS.zinc900.b);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      yPos = margin;
    }

    yPos += 10;

    // Recommendations box
    const recHeight = Math.min(options.recommendations.length * 8 + 15, 60);
    doc.setFillColor(COLORS.zinc800.r, COLORS.zinc800.g, COLORS.zinc800.b);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, recHeight, 3, 3, 'F');

    doc.setTextColor(COLORS.emerald.r, COLORS.emerald.g, COLORS.emerald.b);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommendations', margin + 5, yPos + 8);

    doc.setTextColor(COLORS.white.r, COLORS.white.g, COLORS.white.b);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    options.recommendations.slice(0, 5).forEach((rec, i) => {
      const recText = doc.splitTextToSize(`${i + 1}. ${rec}`, pageWidth - 2 * margin - 15);
      doc.text(recText[0], margin + 5, yPos + 16 + i * 8);
    });

    yPos += recHeight + 10;
  }

  // Footer
  const footerY = pageHeight - 10;
  doc.setTextColor(COLORS.zinc400.r, COLORS.zinc400.g, COLORS.zinc400.b);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Powered by Hormozi Advisor | Based on $100M Offers & $100M Leads by Alex Hormozi', margin, footerY);

  // Generate filename
  const filename = `${options.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
  doc.save(filename);
}

// Helper function to format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
