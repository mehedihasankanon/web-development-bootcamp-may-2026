"use client";

import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

const normalizeApiBase = (baseUrl) => {
  if (!baseUrl) return "http://localhost:5001/api";
  const trimmed = baseUrl.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const API_BASE = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL);
const UPLOAD_URL = `${API_BASE}/upload`;

export const UploadButton = generateUploadButton({ url: UPLOAD_URL });
export const UploadDropzone = generateUploadDropzone({ url: UPLOAD_URL });
