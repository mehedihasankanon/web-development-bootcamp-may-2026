"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";

const ENDPOINT = "fileUploader";

export function UploadModal({
  open,
  onOpenChange,
  onUploadComplete,
  onToast,
  folderId,
}) {
  const [progress, setProgress] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setProgress(null);
      setStatus("idle");
      setError("");
    }
  }, [open]);

  const handleComplete = () => {
    setStatus("success");
    setProgress(100);
    onToast?.("File stashed successfully.");
    onUploadComplete?.();
    setTimeout(() => onOpenChange?.(false), 900);
  };

  const handleError = (err) => {
    const message = err?.message || "Upload failed.";
    setError(message);
    setStatus("error");
    onToast?.(message, "error");
  };

  const buildHeaders = () => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (folderId) headers["x-folder-id"] = folderId;
    return headers;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="relative mx-auto w-full max-w-md border border-zinc-800 bg-black p-8 shadow-none">
        <DialogClose className="absolute right-4 top-4 text-zinc-500 transition hover:text-white">
          <X className="h-4 w-4" />
        </DialogClose>

        <DialogHeader>
          <DialogTitle>Stash new file</DialogTitle>
          <DialogDescription>
            Drop a file to upload to your stash.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
          <UploadDropzone
            endpoint={ENDPOINT}
            headers={buildHeaders}
            onUploadBegin={() => {
              setError("");
              setStatus("uploading");
              setProgress(0);
            }}
            onUploadProgress={(value) => {
              setStatus("uploading");
              setProgress(value);
            }}
            onClientUploadComplete={handleComplete}
            onUploadError={handleError}
            appearance={{
              container:
                "rounded-xl border border-dashed border-zinc-800 bg-black/40 px-6 py-10 text-zinc-200",
              uploadIcon: "text-white/80",
              label: "text-sm font-semibold text-white",
              allowedContent: "text-xs text-zinc-500",
              button:
                "mt-4 h-10 w-full rounded-none border border-white bg-white text-sm font-semibold text-black transition hover:shadow-[0_0_18px_4px_rgba(255,255,255,0.35)]",
            }}
            content={{
              label: "Choose a file or drop it here",
              button: "Upload file",
            }}
          />
        </div>

        <div className="mt-4">
          <UploadButton
            endpoint={ENDPOINT}
            headers={buildHeaders}
            onUploadBegin={() => {
              setError("");
              setStatus("uploading");
              setProgress(0);
            }}
            onUploadProgress={(value) => {
              setStatus("uploading");
              setProgress(value);
            }}
            onClientUploadComplete={handleComplete}
            onUploadError={handleError}
            appearance={{
              button:
                "w-full rounded-none border border-white bg-white px-4 py-2 text-sm font-semibold text-black transition hover:shadow-[0_0_18px_4px_rgba(255,255,255,0.35)]",
            }}
            content={{
              button: "Choose from device",
            }}
          />
        </div>

        <div className="mt-4 space-y-2">
          {status === "uploading" && (
            <>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full bg-white transition-all duration-200"
                  style={{ width: `${progress ?? 0}%` }}
                />
              </div>
              <p className="text-xs text-zinc-400">
                Uploading... {Math.round(progress ?? 0)}%
              </p>
            </>
          )}
          {status === "success" && (
            <p className="text-xs text-white">Upload complete.</p>
          )}
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
