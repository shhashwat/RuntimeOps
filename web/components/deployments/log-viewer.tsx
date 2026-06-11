"use client";

import { useEffect, useRef } from "react";

interface Log {
  id: string;
  level: string;
  message: string;
}

interface LogViewerProps {
  logs: Log[];
}

export function LogViewer({ logs }: LogViewerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [logs]);

  return (
    <div
      className="
        bg-black
        text-green-400
        font-mono
        text-sm
        rounded-md
        p-4
        max-h-[500px]
        overflow-y-auto
      "
    >
      <div className="space-y-1">
        {logs.map((log) => (
          <div key={log.id}>
            [{log.level}] {log.message}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
