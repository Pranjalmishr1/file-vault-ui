"use client";

import { useEffect, useState } from "react";

export default function FileVaultDashboard() {

  // ---------- state ----------

  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [selectedPreview, setSelectedPreview] = useState(null);


  // ---------- load saved files from localStorage ----------

  useEffect(() => {
    const savedFiles = localStorage.getItem("vaultFiles");

    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    }
  }, []);


  // ---------- persist files ----------

  useEffect(() => {
    localStorage.setItem("vaultFiles", JSON.stringify(files));
  }, [files]);


  // ---------- helper: show toast ----------

  const showToast = (message) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage("");
    }, 1800);
  };


  // ---------- helper: format size ----------

  const formatFileSize = (bytes) => {

    if (bytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];

    const index = Math.floor(Math.log(bytes) / Math.log(1024));

    return (
      (bytes / Math.pow(1024, index)).toFixed(2) +
      " " +
      units[index]
    );
  };


  // ---------- helper: label file type ----------

  const getFileLabel = (type) => {

    if (type.includes("image")) return "IMAGE";
    if (type.includes("pdf")) return "PDF";
    if (type.includes("zip")) return "ZIP";
    if (type.includes("word")) return "DOC";

    return "FILE";
  };


  // ---------- upload logic ----------

  const handleFiles = (selectedFiles) => {

    const uploadedFiles = selectedFiles.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      preview:
        file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null
    }));


    // newest files appear first

    setFiles((prev) => [...uploadedFiles, ...prev]);

    showToast("File uploaded successfully");
  };


  const handleFileInput = (event) => {
    handleFiles(Array.from(event.target.files));
  };


  const handleDropUpload = (event) => {

    event.preventDefault();

    handleFiles(Array.from(event.dataTransfer.files));
  };


  // ---------- delete logic ----------

  const handleDelete = (id) => {

    const updatedFiles = files.filter(
      (file) => file.id !== id
    );

    setFiles(updatedFiles);

    localStorage.setItem(
      "vaultFiles",
      JSON.stringify(updatedFiles)
    );

    showToast("File deleted");
  };


  // ---------- search filter ----------

  const filteredFiles = files.filter((file) =>
    file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );


  return (

    <div className="min-h-screen bg-black flex justify-center items-center p-6">


      {/* preview modal */}

      {selectedPreview && (

        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setSelectedPreview(null)}
        >

          <img
            src={selectedPreview}
            alt="preview"
            className="max-h-[80vh] rounded-lg shadow-lg"
          />

        </div>

      )}


      {/* main container */}

      <div
        className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-8"
        onDrop={handleDropUpload}
        onDragOver={(e) => e.preventDefault()}
      >

        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          File Vault Dashboard
        </h1>


        {/* upload section */}

        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center mb-6">

          <p className="text-gray-300 mb-2">
            Drag & drop files here or choose manually
          </p>

          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="
              block mx-auto text-sm
              file:px-4 file:py-2
              file:rounded-md
              file:border-none
              file:bg-indigo-600
              file:text-white
              hover:file:bg-indigo-700
            "
          />

        </div>


        {/* search input */}

        <input
          type="text"
          placeholder="Search uploaded files..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="w-full mb-4 px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white outline-none"
        />


        {/* toast message */}

        {toastMessage && (

          <p className="text-center text-green-400 mb-4">
            {toastMessage}
          </p>

        )}


        {/* file list */}

        <div className="space-y-4">

          {filteredFiles.length === 0 ? (

            <p className="text-gray-400 text-center">
              No files uploaded yet
            </p>

          ) : (

            filteredFiles.map((file) => (

              <div
                key={file.id}
                className="flex justify-between items-center bg-gray-800 border border-gray-700 rounded-lg p-4"
              >

                <div>

                  <span className="inline-block text-xs px-2 py-1 bg-indigo-600 text-white rounded mr-2">
                    {getFileLabel(file.type)}
                  </span>

                  <p className="text-white font-medium">
                    {file.name}
                  </p>

                  <p className="text-gray-400 text-sm">
                    Size: {formatFileSize(file.size)}
                  </p>

                  <p className="text-gray-400 text-sm">
                    Type: {file.type}
                  </p>

                </div>


                {/* preview thumbnail */}

                {file.preview && (

                  <img
                    src={file.preview}
                    alt="preview"
                    onClick={() =>
                      setSelectedPreview(file.preview)
                    }
                    className="w-24 h-24 rounded-lg object-cover cursor-pointer"
                  />

                )}


                {/* delete button */}

                <button
                  onClick={() =>
                    handleDelete(file.id)
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >

                  Delete

                </button>

              </div>

            ))

          )}

        </div>

      </div>

    </div>

  );

}