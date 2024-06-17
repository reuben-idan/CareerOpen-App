import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ResumePreview = () => {
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get('/api/resumes');
        setResumes(response.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    };
    fetchResumes();
  }, []);

  const handleResumeSelect = (resume) => {
    setCurrentResume(resume);
  };

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages);
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div>
        <h2>Resumes</h2>
        {resumes.map((resume) => (
          <div
            key={resume.id}
            onClick={() => handleResumeSelect(resume)}
            style={{
              backgroundColor: currentResume === resume ? '#f0f0f0' : 'transparent',
              cursor: 'pointer',
            }}
          >
            {resume.fileName}
          </div>
        ))}
      </div>
      <div>
        {currentResume && (
          <Document
            file={`/api/resumes/${currentResume.id}`}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;