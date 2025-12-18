import React from "react";
import { motion } from "framer-motion";

const FileUpload = ({ onFilesSelect }) => {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) onFilesSelect(files);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260 }}
      className="w-full p-6 mt-4
                 border-2 border-dashed border-white/30
                 rounded-2xl
                 bg-white/5 backdrop-blur
                 text-center text-gray-300
                 hover:border-orange-500/60
                 transition cursor-pointer"
      onClick={() => document.getElementById("fileSelector").click()}
    >
      <input
        id="fileSelector"
        type="file"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      <p className="text-orange-500 font-semibold text-lg">
        Upload Documents
      </p>
      <p className="text-sm text-gray-400 mt-1">
        PDF files supported • Multiple selection allowed
      </p>
    </motion.div>
  );
};

export default FileUpload;
