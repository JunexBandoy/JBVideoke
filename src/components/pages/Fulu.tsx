import JsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';
import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';

export const Fulu: React.FC = () => {
  const [prefix, setPrefix] = useState<string>('');
  const [start, setStart] = useState<number>(1);
  const [end, setEnd] = useState<number>(10);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Page setup (in inches)
  const pageWidth = 8.27; // A4 width portrait
  const pageHeight = 11.69; // A4 height portrait

  const cols = 5;
  const rows = 10;

  // Add margins between cells (0.1 inches ≈ 7.2 pixels)
  const cellMargin = 0.1; // Space between borders

  // Calculate cell size accounting for margins
  const cellWidth = (pageWidth - cellMargin * (cols + 1)) / cols;
  const cellHeight = (pageHeight - cellMargin * (rows + 1)) / rows;

  // Very small internal spacing
  const qrPadding = 0.02; // Small space between QR and border
  const labelHeight = 0.12; // Space for label

  // Handle logo image upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove logo
  const handleRemoveLogo = () => {
    setLogoImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Generate QR code with logo
  const generateQR = (text: string): Promise<string> => {
    return new Promise((resolve) => {
      const tempDiv = document.createElement('div');
      document.body.appendChild(tempDiv);

      // Create QR code
      const qrNode = <QRCodeCanvas value={text} size={400} level="H" />;

      ReactDOM.render(qrNode, tempDiv);
      setTimeout(() => {
        const qrCanvas = tempDiv.querySelector('canvas');
        if (!qrCanvas) {
          resolve('');
          return;
        }

        // Create a new canvas to combine QR code and logo
        const combinedCanvas = document.createElement('canvas');
        const ctx = combinedCanvas.getContext('2d');
        const qrSize = 400;
        combinedCanvas.width = qrSize;
        combinedCanvas.height = qrSize;

        if (ctx) {
          // Draw QR code
          ctx.drawImage(qrCanvas, 0, 0, qrSize, qrSize);

          // Add logo if exists
          if (logoImage) {
            const logoImg = new Image();
            logoImg.onload = () => {
              // Logo size - 200px
              const logoSize = 200;
              const logoX = (qrSize - logoSize) / 2;
              const logoY = (qrSize - logoSize) / 2;

              // Draw logo directly without white background (transparent PNG)
              ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

              const dataUrl = combinedCanvas.toDataURL('image/png');
              ReactDOM.unmountComponentAtNode(tempDiv);
              document.body.removeChild(tempDiv);
              resolve(dataUrl);
            };
            logoImg.src = logoImage;
          } else {
            const dataUrl = combinedCanvas.toDataURL('image/png');
            ReactDOM.unmountComponentAtNode(tempDiv);
            document.body.removeChild(tempDiv);
            resolve(dataUrl);
          }
        } else {
          const dataUrl = qrCanvas.toDataURL('image/png');
          ReactDOM.unmountComponentAtNode(tempDiv);
          document.body.removeChild(tempDiv);
          resolve(dataUrl);
        }
      }, 200);
    });
  };

  const handleDownload = async (): Promise<void> => {
    setIsGenerating(true);
    setProgress(0);

    const doc = new JsPDF({ unit: 'in', format: [pageWidth, pageHeight] });

    let index = 0;
    const total = end - start + 1;

    for (let i = 0; i < total; i++) {
      const number = start + i;
      const code = `${prefix}${number}`;
      const imgUri = await generateQR(code);

      const col = index % cols;
      const row = Math.floor(index / cols);

      // Calculate position with margins
      const x = cellMargin + col * (cellWidth + cellMargin);
      const y = cellMargin + row * (cellHeight + cellMargin);

      // Calculate QR size to fit with minimal spacing
      const qrSize =
        Math.min(cellWidth, cellHeight - labelHeight) - qrPadding * 2;

      // Center QR in the cell (horizontally and vertically above the label)
      const qrX = x + (cellWidth - qrSize) / 2;
      const qrY = y + qrPadding;

      // Draw border that closely fits around QR and label
      const borderHeight = qrSize + qrPadding * 2 + labelHeight;
      doc.setDrawColor(0); // Black color
      doc.setLineWidth(0.015); // Slightly thinner border
      doc.rect(x, y, cellWidth, borderHeight);

      // Add QR (square to prevent stretching)
      doc.addImage(imgUri, 'PNG', qrX, qrY, qrSize, qrSize);

      // Label inside border, centered under QR
      const labelY = y + borderHeight - labelHeight / 2;
      doc.setFontSize(6); // Very small font size
      doc.setTextColor(0, 0, 0);
      doc.text(code, x + cellWidth / 2, labelY, {
        align: 'center',
        baseline: 'middle',
      });

      // Update progress
      const currentProgress = Math.round(((i + 1) / total) * 100);
      setProgress(currentProgress);

      index++;
      if (index >= cols * rows && i < total - 1) {
        doc.addPage([pageWidth, pageHeight], 'in');
        index = 0;
      }
    }

    // Final progress update
    setProgress(100);

    // Small delay to show 100% before saving
    setTimeout(() => {
      doc.save('qrcodes.pdf');
      setIsGenerating(false);
      setProgress(0);
    }, 500);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-xl mb-4 font-bold text-center">
        QR Code Batch Generator
      </h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Logo Image (PNG)
        </label>
        <div className="flex items-center space-x-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png"
            onChange={handleLogoUpload}
            className="border border-gray-300 p-2 rounded flex-1"
          />
          {logoImage && (
            <button
              onClick={handleRemoveLogo}
              className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
            >
              Remove Logo
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Upload a transparent PNG. The logo will be centered on each QR code
          and resized to 200px (5.3cm)
        </p>

        {logoImage && (
          <div className="mt-2">
            <p className="text-sm text-green-600">
              ✓ Transparent logo uploaded successfully
            </p>
            <div className="mt-2 p-2 border border-gray-200 rounded inline-block bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={logoImage}
                alt="Logo preview"
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mb-2">
        <label className="block text-xs font-small mb-1">Prefix</label>
        <input
          type="text"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="e.g. R13-SDS-BIS-25-10-"
        />
      </div>

      <div className="mb-2 flex space-x-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Start</label>
          <input
            type="number"
            value={start}
            min={1}
            onChange={(e) => setStart(Number(e.target.value))}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">End</label>
          <input
            type="number"
            value={end}
            min={start}
            onChange={(e) => setEnd(Number(e.target.value))}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Progress Bar */}
      {isGenerating && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Generating PDF...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className={`mt-4 px-4 py-2 rounded w-full ${
          isGenerating
            ? 'bg-gray-400 cursor-not-allowed text-gray-200'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isGenerating ? 'Generating...' : 'Generate & Download PDF'}
      </button>
    </div>
  );
};
