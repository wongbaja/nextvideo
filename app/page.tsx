"use client";

import { useState, ChangeEvent, FormEvent } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Tambahkan tipe event untuk input file
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Tambahkan tipe event untuk form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Pilih video dulu!");

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert("Upload Berhasil!");
        setVideoUrl(data.path);
      } else {
        alert("Upload Gagal: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Upload Video Sederhana</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <input 
            type="file" 
            accept="video/*"
            onChange={handleFileChange}
            style={{ padding: "10px", border: "1px solid #ccc", width: "100%" }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={!file || uploading}
          style={{
            padding: "10px 20px",
            backgroundColor: uploading ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px"
          }}
        >
          {uploading ? "Sedang Mengupload..." : "Upload Video"}
        </button>
      </form>

      {videoUrl && (
        <div>
          <h3>Video Anda:</h3>
          <video width="100%" controls>
            <source src={videoUrl} type="video/mp4" />
            Browser Anda tidak mendukung tag video.
          </video>
          <p>Link: <a href={videoUrl} target="_blank" rel="noopener noreferrer">{videoUrl}</a></p>
        </div>
      )}
    </main>
  );
}