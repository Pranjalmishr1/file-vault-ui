"use client";

import { useState, useEffect } from "react";

export default function FileVaultDashboard() {

  const [files, setFiles] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // load saved files

  useEffect(() => {
    const saved = localStorage.getItem("files");

    if (saved) {
      setFiles(JSON.parse(saved));
    }
  }, []);

  // save files

  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
  }, [files]);

  // upload files

  const handleUpload = (e) => {

    const selected = Array.from(e.target.files);

    const newFiles = selected.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null
    }));

    setFiles((prev) => [...newFiles, ...prev]);
  };

  // delete file

  const handleDelete = (id) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  // format size

  const formatSize = (bytes) => {

    const sizes = ["Bytes", "KB", "MB"];

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  return (

    <div className="min-h-screen bg-black flex justify-center items-center p-6">

      <div className="bg-gray-900 w-full max-w-2xl rounded-lg p-6 shadow-lg">

        <h1 className="text-white text-2xl text-center mb-5">
          File Vault Dashboard
        </h1>

        {/* custom upload button */}

        <label className="block text-center cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded mb-5">

          Select Files

          <input
            type="file"
            multiple
            onChange={handleUpload}
            className="hidden"
          />

        </label>

        {/* empty state */}

        {files.length === 0 ? (

          <p className="text-gray-400 text-center">
            No files uploaded yet
          </p>

        ) : (

          files.map((file) => (

            <div
              key={file.id}
              className="flex justify-between items-center bg-gray-800 rounded p-3 mb-3"
            >

              <div>

                <p className="text-white">
                  {file.name}
                </p>

                <p className="text-gray-400 text-sm">
                  Size: {formatSize(file.size)}
                </p>

                <p className="text-gray-400 text-sm">
                  Type: {file.type}
                </p>

              </div>

              {/* preview image */}

              {file.preview && (

                <img
                  src={file.preview}
                  alt="preview"
                  onClick={() => setPreviewImage(file.preview)}
                  className="w-14 h-14 object-cover rounded cursor-pointer"
                />

              )}

              <button
                onClick={() => handleDelete(file.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>

          ))

        )}

      </div>


      {/* image modal preview */}

      {previewImage && (

        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center"
          onClick={() => setPreviewImage(null)}
        >

          <img
            src={previewImage}
            className="max-h-[80%] rounded"
          />

        </div>

      )}

    </div>

  );
}