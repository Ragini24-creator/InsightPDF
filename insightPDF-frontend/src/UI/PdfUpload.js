import { useState,useEffect} from "react";

export default function PdfUpload({onUpload, onSuccessfulUpload}){

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed!");
      setFile(null);
      onUpload(null)
    } else {
      setFile(selectedFile);
      setError("");
      onUpload(selectedFile);
      onSuccessfulUpload(true)
    }
  };

  useEffect(()=> {

  const uploadToBackend = async() =>{
    if (!file) return ; 

    const formData = new FormData()
    formData.append("pdf",file);

    try{
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/upload-pdf`,{
      method: "POST",
      body: formData
    })

   const data = await res.json()

  }catch(error){
     console.error(error)
  }
}

  uploadToBackend();

  },[file])


  return (
    <div className="upload-container">
      <label className="upload-box">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <span className="upload-text">
          <span className="arrow">&#8679;</span> Click or Drag PDF here
        </span>
      </label>
      {error && <p className="error-text">{error}</p>}
      {file && <p className="file-text">Selected File: {file.name}</p>}
    </div>
  );
};

