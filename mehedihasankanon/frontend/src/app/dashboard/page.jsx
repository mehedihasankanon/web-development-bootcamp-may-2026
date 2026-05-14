"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FolderOpen,
  Settings,
  LogOut,
  Search,
  Plus,
  Inbox,
} from "lucide-react";

import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { UploadModal } from "@/components/upload-modal";
import { FileTable } from "@/components/file-table";

const FILES_API_BASE = "/upload";

export default function DashboardPage() {
  const { logout } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const fetchFiles = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`${FILES_API_BASE}/files`);
      setFiles(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not load your files. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const filteredFiles = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return files;
    return files.filter((file) =>
      (file.name || "").toLowerCase().includes(term),
    );
  }, [files, search]);

  const handleCopyLink = async (file) => {
    const link = `${window.location.origin}/s/${file.id}`;

    try {
      await navigator.clipboard.writeText(link);
      showToast("Share link copied.");
    } catch (err) {
      showToast("Could not copy link.", "error");
    }
  };

  const handleToggleAccess = async (file) => {
    const previous = files;
    const nextAccess = file.access === "PUBLIC" ? "PRIVATE" : "PUBLIC";

    setFiles((prev) =>
      prev.map((item) =>
        item.id === file.id ? { ...item, access: nextAccess } : item,
      ),
    );

    try {
      const response = await api.patch(`${FILES_API_BASE}/${file.id}/access`);
      const updatedAccess = response?.data?.access || nextAccess;
      setFiles((prev) =>
        prev.map((item) =>
          item.id === file.id ? { ...item, access: updatedAccess } : item,
        ),
      );
      showToast("Access updated.");
    } catch (err) {
      setFiles(previous);
      showToast("Failed to update access.", "error");
    }
  };

  const handleDelete = async (file) => {
    const previous = files;

    setFiles((prev) => prev.filter((item) => item.id !== file.id));

    try {
      await api.delete(`${FILES_API_BASE}/${file.id}`);
      showToast("File deleted.");
    } catch (err) {
      setFiles(previous);
      showToast("Failed to delete file.", "error");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="flex w-64 flex-col border-r border-zinc-800 bg-black/40 px-6 py-8">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Fylestash
            </p>
            <h1 className="text-xl font-semibold text-white">My Vault</h1>
          </div>

          <nav className="mt-10 space-y-2 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-white"
            >
              <FolderOpen className="h-4 w-4 text-primary" />
              My Stash
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition hover:text-white"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>

          <button
            type="button"
            onClick={logout}
            className="mt-auto flex items-center gap-3 rounded-lg border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </aside>

        <section className="flex flex-1 flex-col">
          <div className="border-b border-zinc-800 bg-black/20 px-8 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search files"
                  className="w-full rounded-lg border border-zinc-800 bg-black/50 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-primary"
                />
              </div>

              <button
                type="button"
                onClick={() => setUploadOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-semibold text-black transition hover:shadow-[0_0_18px_rgba(0,217,255,0.35)]"
              >
                <Plus className="h-4 w-4" />
                Stash New File
              </button>
            </div>
          </div>

          <div className="flex-1 px-8 py-8">
            {loading && (
              <div className="rounded-xl border border-zinc-800 bg-black/30 p-8 text-sm text-zinc-400">
                Loading your stash...
              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl border border-red-500/40 bg-black/30 p-6 text-sm text-red-400">
                {error}
              </div>
            )}

            {!loading && !error && filteredFiles.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-black/30 px-6 py-14 text-center">
                <Inbox className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {files.length === 0
                      ? "Your stash is empty"
                      : "No files match your search"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {files.length === 0
                      ? "Upload your first file to get started."
                      : "Try a different keyword."}
                  </p>
                </div>
                {files.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setUploadOpen(true)}
                    className="mt-2 inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-xs font-semibold text-black"
                  >
                    <Plus className="h-4 w-4" />
                    Stash a file
                  </button>
                )}
              </div>
            )}

            {!loading && !error && filteredFiles.length > 0 && (
              <FileTable
                files={filteredFiles}
                onCopyLink={handleCopyLink}
                onToggleAccess={handleToggleAccess}
                onDelete={handleDelete}
              />
            )}
          </div>
        </section>
      </div>

      <UploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploadComplete={fetchFiles}
        onToast={showToast}
      />

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur-sm transition ${
            toast.tone === "error"
              ? "border-red-500/50 bg-black/80 text-red-200"
              : "border-primary/40 bg-black/80 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}
