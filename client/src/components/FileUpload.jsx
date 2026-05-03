import React, { useState } from "react";
import { motion } from "framer-motion";

const FileUpload = ({ onFilesSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) onFilesSelect(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) onFilesSelect(files);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById("fileSelector").click()}
      className="w-full mt-2 cursor-pointer"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .upload-zone {
          padding: 24px;
          border-radius: 14px;
          border: 1.5px dashed rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.02);
          text-align: center;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .upload-zone:hover, .upload-zone.dragging {
          border-color: rgba(245,200,66,0.35);
          background: rgba(245,200,66,0.03);
        }
        .upload-zone::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(245,200,66,0.04) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .upload-zone:hover::before, .upload-zone.dragging::before { opacity: 1; }
        .upload-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(245,200,66,0.08);
          border: 1px solid rgba(245,200,66,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          font-size: 16px;
          transition: all 0.25s ease;
        }
        .upload-zone:hover .upload-icon, .upload-zone.dragging .upload-icon {
          background: rgba(245,200,66,0.14);
          border-color: rgba(245,200,66,0.3);
          transform: scale(1.05);
        }
      `}</style>

      <input id="fileSelector" type="file" multiple className="hidden" onChange={handleFiles} accept=".pdf,.txt,.doc,.docx" />

      <div className={`upload-zone${isDragging ? " dragging" : ""}`}>
        <div className="upload-icon">⬆</div>

        <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Drop files here or{" "}
          <span style={{ color: '#F5C842' }}>browse</span>
        </p>
        <p className="text-[11px] font-light" style={{ color: 'rgba(255,255,255,0.3)' }}>
          PDF, TXT, DOC supported · Multiple files allowed
        </p>
      </div>
    </motion.div>
  );
};

export default FileUpload;
