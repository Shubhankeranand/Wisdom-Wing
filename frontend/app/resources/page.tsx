"use client";

import { FileText, FolderTree, Upload } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DefaultRightRail } from "@/components/right-rail";
import { Card } from "@/components/ui/card";

const resources = [
  { title: "DBMS PYQ Bank", type: "PDF", size: "12 MB", uploader: "Siddharth" },
  { title: "OS Short Notes", type: "Doc", size: "2 MB", uploader: "Aanya" },
  { title: "CN Viva Questions", type: "Link", size: "Web", uploader: "Mohit" }
];

export default function ResourcesPage() {
  return (
    <AppShell
      title="Resource Hub"
      subtitle="A fast academic vault for PYQs, notes, links, and crowd-ranked study material."
      rightRail={<DefaultRightRail />}
    >
      <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
        <Card className="space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <FolderTree className="h-4 w-4 text-primary" />
            Directory
          </div>
          {["CSE", "Year 1", "Year 2", "DBMS", "Operating Systems", "Networks"].map((folder) => (
            <div key={folder} className="rounded-lg border border-border px-3 py-2 text-sm text-textMuted">
              {folder}
            </div>
          ))}
        </Card>
        <div className="space-y-4">
          <Card className="flex items-center gap-3 border-dashed">
            <Upload className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Upload resources</p>
              <p className="text-sm text-textMuted">Drag PDFs, notes, and links here for your community.</p>
            </div>
          </Card>
          {resources.map((resource) => (
            <Card key={resource.title} className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{resource.title}</h3>
                  <p className="text-sm text-textMuted">
                    {resource.type} • {resource.size} • Uploaded by {resource.uploader}
                  </p>
                </div>
              </div>
              <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium">Preview</button>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
