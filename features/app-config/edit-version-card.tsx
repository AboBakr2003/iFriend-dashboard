"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AppVersion } from "@/services/queries/app-config/get/get-app-version";
import { updateAppVersion } from "@/services/queries/app-config/patch/patch-update-app-version";
import { PlatformBadge } from "./platform-badge";

export interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  version: AppVersion;
  onSaved: () => void;
}

export function EditVersionCard({ open, onClose, version, onSaved }: EditDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    latestVersion: version.latestVersion,
    minVersion: version.minVersion,
    forceUpdate: version.forceUpdate,
    storeUrl: version.storeUrl ?? "",
    releaseNotes: version.releaseNotes,
  });

  // Sync form whenever the selected version changes
  useEffect(() => {
    setFormData({
      latestVersion: version.latestVersion,
      minVersion: version.minVersion,
      forceUpdate: version.forceUpdate,
      storeUrl: version.storeUrl ?? "",
      releaseNotes: version.releaseNotes,
    });
  }, [version]);

  const handleSave = async () => {
    if (!formData.latestVersion || !formData.minVersion) {
      toast.error("Latest version and minimum version are required.");
      return;
    }
    setIsSaving(true);
    const payload = {
      latestVersion: formData.latestVersion,
      minVersion: formData.minVersion,
      forceUpdate: formData.forceUpdate,
      releaseNotes: formData.releaseNotes,
      ...(formData.storeUrl ? { storeUrl: formData.storeUrl } : {}),
    };
    const res = await updateAppVersion(version.platform, payload);
    setIsSaving(false);
    if (res.success) {
      toast.success(res.message);
      onSaved();
      onClose();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(val) => !val && onClose()}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            Edit App Version
            <PlatformBadge platform={version.platform} />
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="grid gap-5 py-2">
          {/* Version fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="latestVersion" className="text-natural-text text-sm">
                Latest Version
              </Label>
              <Input
                id="latestVersion"
                placeholder="e.g. 1.0.1"
                value={formData.latestVersion}
                onChange={(e) =>
                  setFormData({ ...formData, latestVersion: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="minVersion" className="text-natural-text text-sm">
                Minimum Version
              </Label>
              <Input
                id="minVersion"
                placeholder="e.g. 1.0.0"
                value={formData.minVersion}
                onChange={(e) =>
                  setFormData({ ...formData, minVersion: e.target.value })
                }
              />
            </div>
          </div>

          {/* Store URL */}
          <div className="space-y-1.5">
            <Label htmlFor="storeUrl" className="text-natural-text text-sm">
              Store URL{" "}
              <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="storeUrl"
              placeholder="https://play.google.com/..."
              value={formData.storeUrl}
              onChange={(e) =>
                setFormData({ ...formData, storeUrl: e.target.value })
              }
            />
          </div>

          {/* Release Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="releaseNotes" className="text-natural-text text-sm">
              Release Notes
            </Label>
            <Textarea
              id="releaseNotes"
              placeholder="Describe what's new in this version..."
              value={formData.releaseNotes}
              onChange={(e) =>
                setFormData({ ...formData, releaseNotes: e.target.value })
              }
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Force Update toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/30 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Force Update</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Require users to update before continuing
              </p>
            </div>
            <Switch
              id="forceUpdate"
              checked={formData.forceUpdate}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, forceUpdate: checked })
              }
            />
          </div>
        </div>

        <AlertDialogFooter className="flex flex-row gap-3 pt-2">
          <Button
            variant="default"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary-blue w-full hover:bg-primary-blue-hover px-4 py-5"
          >
            {isSaving ? "Updating..." : "Update"}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-5 w-full"
          >
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
