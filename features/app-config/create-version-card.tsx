"use client";

import { useState } from "react";
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
import { updateAppVersion } from "@/services/queries/app-config/patch/patch-update-app-version";

const EMPTY_FORM = {
  platform: "",
  latestVersion: "",
  minVersion: "",
  forceUpdate: false,
  storeUrl: "",
  releaseNotes: "",
};

export interface CreateVersionCardProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function CreateVersionCard({ open, onClose, onSaved }: CreateVersionCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const reset = () => setFormData(EMPTY_FORM);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleCreate = async () => {
    if (!formData.platform.trim()) {
      toast("Platform is required (e.g. android, ios). ❗");
      return;
    }
    if (!formData.latestVersion || !formData.minVersion) {
      toast("Latest version and minimum version are required. ❗");
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
    const res = await updateAppVersion(formData.platform.trim().toLowerCase(), payload);
    setIsSaving(false);

    if (res.success) {
      toast.success(res.message);
      reset();
      onSaved();
      onClose();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Add Platform Version</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="grid gap-5 py-2">
          {/* Platform */}
          <div className="space-y-1.5">
            <Label htmlFor="create-platform" className="text-natural-text text-sm">
              Platform
            </Label>
            <Input
              id="create-platform"
              placeholder="e.g. android, ios"
              value={formData.platform}
              onChange={(e) =>
                setFormData({ ...formData, platform: e.target.value })
              }
            />
          </div>

          {/* Version fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="create-latestVersion" className="text-natural-text text-sm">
                Latest Version
              </Label>
              <Input
                id="create-latestVersion"
                placeholder="e.g. 1.0.0"
                value={formData.latestVersion}
                onChange={(e) =>
                  setFormData({ ...formData, latestVersion: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-minVersion" className="text-natural-text text-sm">
                Minimum Version
              </Label>
              <Input
                id="create-minVersion"
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
            <Label htmlFor="create-storeUrl" className="text-natural-text text-sm">
              Store URL{" "}
              <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="create-storeUrl"
              placeholder="https://play.google.com/..."
              value={formData.storeUrl}
              onChange={(e) =>
                setFormData({ ...formData, storeUrl: e.target.value })
              }
            />
          </div>

          {/* Release Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="create-releaseNotes" className="text-natural-text text-sm">
              Release Notes
            </Label>
            <Textarea
              id="create-releaseNotes"
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
              id="create-forceUpdate"
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
            onClick={handleCreate}
            disabled={isSaving}
            className="bg-primary-blue w-full hover:bg-primary-blue-hover px-4 py-5"
          >
            {isSaving ? "Creating..." : "Create"}
          </Button>
          <Button
            variant="ghost"
            onClick={handleClose}
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
