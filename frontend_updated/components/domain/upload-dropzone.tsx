"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileJson, UploadCloud, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function UploadDropzone({
  onFileText,
  accept = { "application/json": [".json"] },
  hint = "Drag & drop your candidate .json file",
  subHint = "or click to browse · candidate .json file only",
}: {
  onFileText: (text: string, filename: string) => void;
  accept?: Record<string, string[]>;
  hint?: string;
  subHint?: string;
}) {
  const [busy, setBusy] = useState(false);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      setBusy(true);
      const reader = new FileReader();
      reader.onload = () => {
        onFileText(String(reader.result ?? ""), file.name);
        setBusy(false);
      };
      reader.onerror = () => setBusy(false);
      reader.readAsText(file);
    },
    [onFileText]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/40 transition-colors",
        isDragActive && "border-primary bg-primary-muted/40"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex size-11 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground">
        {busy ? (
          <Loader2 className="size-5 animate-spin" />
        ) : isDragActive ? (
          <FileJson className="size-5" />
        ) : (
          <UploadCloud className="size-5" />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">{hint}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{subHint}</p>
      </div>
    </div>
  );
}
