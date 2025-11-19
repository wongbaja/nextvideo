import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";

// Tambahkan tipe ': NextRequest' di sini
export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public/videos");

  if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const filename = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
  const filepath = path.join(uploadDir, filename);

  try {
    await writeFile(filepath, buffer);
    return NextResponse.json({ 
      success: true, 
      message: "Video berhasil diupload!",
      path: `/videos/${filename}` 
    });
  } catch (error) {
    console.error("Error saving file:", error);
    return NextResponse.json({ success: false, message: "Gagal menyimpan file" }, { status: 500 });
  }
}