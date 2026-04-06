import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { LoyaltySettings } from "@/services/queries/refer-and-earn/get/get-loyalty-settings";
import { updateLoyaltySettings } from "@/services/queries/refer-and-earn/put/put-update-loyality-settings";

interface EditLoyaltySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: LoyaltySettings | null;
  onSuccess: () => void;
}

export function EditLoyaltySettingsDialog({ open, onOpenChange, settings, onSuccess }: EditLoyaltySettingsDialogProps) {
  const [formData, setFormData] = useState({
    pointsPerReferral: 0,
    isReferralEnabled: false,
    isRedemptionEnabled: false,
  });

  useEffect(() => {
    if (settings && open) {
      setFormData({
        pointsPerReferral: settings.pointsPerReferral,
        isReferralEnabled: settings.isReferralEnabled,
        isRedemptionEnabled: settings.isRedemptionEnabled,
      });
    }
  }, [settings, open]);

  const handleSave = async () => {
    const resLoyalty = await updateLoyaltySettings({
      pointsPerReferral: formData.pointsPerReferral,
      signupDiscountPercent: settings?.signupDiscountPercent ?? 0,
      isReferralEnabled: formData.isReferralEnabled,
      isRedemptionEnabled: formData.isRedemptionEnabled
    });

    if (resLoyalty.success) {
      toast.success("Settings updated successfully");
      onSuccess();
      onOpenChange(false);
    } else {
      toast.error(resLoyalty.message);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Loyalty Settings</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-4">
            <Label htmlFor="points" className="col-span-2 text-natural-text">
              Points Per Referral
            </Label>
            <Input
              id="points"
              type="number"
              value={formData.pointsPerReferral}
              onChange={(e) => setFormData({ ...formData, pointsPerReferral: Number(e.target.value) })}
              className="col-span-2"
              min={0}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Label htmlFor="referral" className="cursor-pointer text-natural-text">Enable Referral System</Label>
            <Checkbox
              id="referral"
              checked={formData.isReferralEnabled}
              onCheckedChange={(checked) => setFormData({ ...formData, isReferralEnabled: !!checked })}
              className="w-5 h-5 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="redemption" className="cursor-pointer text-natural-text">Enable Point Redemption</Label>
            <Checkbox
              id="redemption"
              checked={formData.isRedemptionEnabled}
              onCheckedChange={(checked) => setFormData({ ...formData, isRedemptionEnabled: !!checked })}
              className="w-5 h-5 rounded"
            />
          </div>
        </div>
        <AlertDialogFooter className="flex flex-row gap-3">
          <Button onClick={handleSave} className="w-full bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg px-6">
            Save
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full rounded-lg">
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
