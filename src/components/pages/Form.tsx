import { QRCodeCanvas } from 'qrcode.react';
import { useState, useEffect } from 'react';

type FormData = {
  efmsNo: string;
  species: string;
  conveyance: string;
  implements: string;
  pieces: string;
  place: string;
  dateApprehended: string;
  caseNo: string;
  dateFiled: string;
  suspects: string;
  nature: string;
  officer: string;
  custodian: string;
  depository: string;
  RCO: string;
  RCO_No: string;
};

const initialForm: FormData = {
  efmsNo: '',
  species: '',
  conveyance: '',
  implements: '',
  pieces: '',
  place: '',
  dateApprehended: '',
  caseNo: '',
  dateFiled: '',
  suspects: '',
  nature: '',
  officer: '',
  custodian: '',
  depository: '',
  RCO: '',
  RCO_No: '',
};

export const Form = () => {
  const [form, setForm] = useState<FormData>(initialForm);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Load image from localStorage on mount
  useEffect(() => {
    const savedImage = localStorage.getItem('qr-overlay-image');
    if (savedImage) setImageSrc(savedImage);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // PNG upload and storage
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'image/png') {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImageSrc(result);
        localStorage.setItem('qr-overlay-image', result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a PNG image.');
    }
  };

  const downloadQRCode = (): void => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `qr-code-${form.efmsNo || 'data'}.png`;
    downloadLink.click();
  };

  const formatKey = (key: string): string =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

  const formatData = (): string =>
    Object.entries(form)
      .map(([key, value]) => `${formatKey(key)}: ${value}`)
      .join('\n');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div className="bg-gray-900 p-4 rounded">
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-[#0000FF] via-[#FCFCFF] to-[#50FF50] bg-clip-text text-transparent">
            Enforcement QR Code Generator
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {Object.entries(form).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1 capitalize">
                {formatKey(key)}
              </label>
              <input
                type={key.toLowerCase().includes('date') ? 'date' : 'text'}
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          ))}
        </div>

        {/* Upload PNG overlay area */}
        <div className="mt-6 flex flex-col items-center">
          <label className="mb-2 text-sm font-medium">
            Upload PNG to center on QR code (220px/5.8CM):
          </label>
          <input
            type="file"
            accept="image/png"
            onChange={handleImageUpload}
            className="mb-2"
          />

          {/* QR code and overlayed image */}
          <div
            className="relative flex justify-center items-center"
            style={{ width: 220, height: 220 }}
          >
            <QRCodeCanvas
              id="qr-code"
              value={formatData()}
              size={220}
              level="H"
              includeMargin={true}
            />
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Uploaded Overlay"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 80,
                  height: 80,
                  objectFit: 'contain',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
          <button
            onClick={downloadQRCode}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
};
