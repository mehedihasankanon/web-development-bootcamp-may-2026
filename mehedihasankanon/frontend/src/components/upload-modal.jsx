"use client";

import { useEffect, useState } from "react";
import { UploadDropzone } from "@uploadthing/react";
import { X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ENDPOINT = "fileUploader";

export function UploadModal({ open, onOpenChange, onUploadComplete, onToast }) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="relative">
        <DialogClose className="absolute right-4 top-4 text-zinc-500 transition hover:text-white">
          <X className="h-4 w-4" />
        </DialogClose>

        <DialogHeader>
          <DialogTitle>Stash new file</DialogTitle>
          <DialogDescription>
            Drop a file to upload to your stash.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-dashed border-zinc-700 bg-black/40 p-4">
          <UploadDropzone
            endpoint={ENDPOINT}
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
            className="ut-label:text-sm ut-label:text-zinc-300 ut-allowed-content:text-xs ut-allowed-content:text-zinc-500 ut-upload-icon:text-primary"
          />
        </div>

        <div className="mt-4 space-y-2">
          {status === "uploading" && (
            <>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${progress ?? 0}%` }}
                />
              </div>
              <p className="text-xs text-zinc-400">
                Uploading... {Math.round(progress ?? 0)}%
              </p>
            </>
          )}
          {status === "success" && (
            <p className="text-xs text-primary">Upload complete.</p>
          )}
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
