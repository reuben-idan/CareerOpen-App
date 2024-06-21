import React, { useState } from 'react';
import ResumeUploader from './ResumeUploader';
import ResumePreview from './ResumePreview';

const ResumeManagement = () => {
  const [resumeFile, setResumeFile] = useState(null);

  return (
    <div>
      <ResumeUploader setResumeFile={setResumeFile} />
      <ResumePreview resumeFile={resumeFile} />
    </div>
  );
};

export default ResumeManagement;