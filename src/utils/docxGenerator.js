import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export const generateDocxFromText = async (text, filename = 'Generated_Resume.docx') => {
  const lines = text.split('\n');
  const doc = new Document({
    sections: [
      {
        children: lines.map(line =>
          new Paragraph({
            children: [new TextRun(line)],
          })
        ),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};
