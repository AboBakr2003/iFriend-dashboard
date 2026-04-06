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
import { toast } from "sonner";
import { LoyaltySettings } from "@/services/queries/refer-and-earn/get/get-loyalty-settings";
import { updateSignupDiscount } from "@/services/queries/refer-and-earn/patch/patch-update-signup-discount";

interface EditSignupDiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: LoyaltySettings | null;
  onSuccess: () => void;
}

export function EditSignupDiscountDialog({ open, onOpenChange, settings, onSuccess }: EditSignupDiscountDialogProps) {
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (settings && open) {
      setDiscount(settings.signupDiscountPercent);
    }
  }, [settings, open]);

  const handleDiscountSave = async () => {
    const resDiscount = await updateSignupDiscount({
      signupDiscountPercent: discount
    });

    if (resDiscount.success) {
      toast.success("Signup discount updated successfully");
      onSuccess();
      onOpenChange(false);
    } else {
      toast.error(resDiscount.message);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Signup Discount</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-4">
            <Label htmlFor="discount" className="col-span-2 text-natural-text">
              Signup Discount (%)
            </Label>
            <Input
              id="discount"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="col-span-2"
              min={0}
              max={100}
            />
          </div>
        </div>
        <AlertDialogFooter className="flex flex-row gap-3">
          <Button onClick={handleDiscountSave} className="w-full bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg px-6">
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
