import pdfParse from 'pdf-parse/lib/pdf-parse.js';

export async function parseFile(buffer, mimetype, originalname) {
  const ext = originalname.toLowerCase();

  if (mimetype === 'application/pdf' || ext.endsWith('.pdf')) {
    const data = await pdfParse(buffer);
    const text = data.text.replace(/\s+/g, ' ').trim();
    if (!text || text.length < 50) {
      throw new Error('PDF appears to be empty or image-only (scanned). Please use a text-based PDF.');
    }
    return text;
  }

  if (mimetype === 'text/plain' || ext.endsWith('.txt')) {
    return buffer.toString('utf-8').replace(/\r\n/g, '\n').trim();
  }

  throw new Error('Unsupported file type. Upload a .txt or .pdf file.');
}