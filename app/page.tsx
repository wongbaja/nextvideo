"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios"; // Import axios

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // State untuk menyimpan % progres
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setVideoUrl(null); // Reset preview jika ganti file
      setProgress(0); // Reset progress
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Pilih video dulu!");

    setUploading(true);
    setProgress(0); // Mulai dari 0

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Menggunakan AXIOS menggantikan FETCH
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // Fitur ajaib Axios untuk melacak progress
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      const data = response.data; // Di axios, data langsung ada di .data

      if (data.success) {
        alert("Upload Berhasil!");
        setVideoUrl(data.path);
      } else {
        alert("Upload Gagal: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Upload Video dengan Progress</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <input 
            type="file" 
            accept="video/*"
            onChange={handleFileChange}
            style={{ padding: "10px", border: "1px solid #ccc", width: "100%", borderRadius: "5px" }}
          />
        </div>

        {/* TAMPILAN PROGRESS BAR */}
        {uploading && (
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ 
              width: "100%", 
              height: "20px", 
              backgroundColor: "#e0e0e0", 
              borderRadius: "10px", 
              overflow: "hidden" 
            }}>
              <div style={{ 
                width: `${progress}%`, 
                height: "100%", 
                backgroundColor: "#0070f3", 
                transition: "width 0.3s ease-in-out",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
              </div>
            </div>
            <p style={{ textAlign: "center", fontSize: "14px", marginTop: "5px" }}>
              Mengupload: {progress}%
            </p>
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={!file || uploading}
          style={{
            padding: "12px 24px",
            backgroundColor: uploading ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            cursor: uploading ? "not-allowed" : "pointer",
            borderRadius: "5px",
            fontWeight: "bold",
            width: "100%"
          }}
        >
          {uploading ? "Sedang Memproses..." : "Mulai Upload"}
        </button>
      </form>

      {videoUrl && (
        <div style={{ marginTop: "20px", border: "1px solid #ddd", padding: "10px", borderRadius: "8px" }}>
          <h3>Video Berhasil Diupload:</h3>
          <video width="100%" controls autoPlay>
            <source src={videoUrl} type="video/mp4" />
            Browser Anda tidak mendukung tag video.
          </video>
          <p style={{ wordBreak: "break-all", fontSize: "0.9rem", color: "#555" }}>
            Link: <a href={videoUrl} target="_blank" rel="noopener noreferrer">{videoUrl}</a>
          </p>
        </div>
      )}
    </main>
  );
}