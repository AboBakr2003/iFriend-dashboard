"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppVersion } from "@/services/queries/app-config/get/get-app-version";
import { PlatformBadge } from "./platform-badge";
import EditIcon from "@/public/edit-icon";

export interface VersionCardProps {
  version: AppVersion;
  onEdit: (v: AppVersion) => void;
}

export function VersionCard({ version, onEdit }: VersionCardProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <PlatformBadge platform={version.platform} />
            <CardTitle className="text-base font-medium">
              v{version.latestVersion}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-blue hover:text-primary-blue-hover hover:bg-primary-blue/10 shrink-0"
            onClick={() => onEdit(version)}
            title="Edit version"
          >
            <EditIcon className="w-5! h-5!" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Version info grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Latest Version</p>
            <p className="text-sm font-medium">{version.latestVersion}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Min. Version</p>
            <p className="text-sm font-medium">{version.minVersion}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Force Update</p>
            <Badge
              variant={version.forceUpdate ? "destructive" : "secondary"}
              className={`text-xs font-medium ${version.forceUpdate
                  ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-100"
                  : "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
                }`}
            >
              {version.forceUpdate ? "Required" : "Optional"}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Store URL</p>
            {version.storeUrl ? (
              <a
                href={version.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-blue hover:underline truncate block max-w-[120px]"
              >
                View Store
              </a>
            ) : (
              <p className="text-xs text-muted-foreground">Not set</p>
            )}
          </div>
        </div>

        <hr className="border-border/50" />

        {/* Release notes */}
        <div>
          <p className="text-xs text-natural-text mb-1.5">Release Notes</p>
          <p className="text-sm leading-relaxed">
            {version.releaseNotes || (
              <span className="text-natural-text">No notes</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
