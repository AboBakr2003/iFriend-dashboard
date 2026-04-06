"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLoyaltySettings, LoyaltySettings } from "@/services/queries/refer-and-earn/get/get-loyalty-settings";
import EditIcon from "@/public/edit-icon";
import { EditLoyaltySettingsDialog } from "./edit-loyalty-settings-dialog";
import { EditSignupDiscountDialog } from "./edit-signup-discount-dialog";

export function LoyaltySettingsCards() {
  const [settings, setSettings] = useState<LoyaltySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);

  const fetchSettings = async () => {
    setIsLoading(true);
    const res = await getLoyaltySettings();
    if (res.success && res.data) {
      setSettings(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Loyalty Settings</h2>
        <Button onClick={() => setIsEditing(true)} className="bg-primary-blue hover:bg-primary-blue-hover px-4 py-5">
          <EditIcon className="w-5! h-5!" />
          Edit Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg text-natural-text font-normal">Points Per Referral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {isLoading ? "..." : settings?.pointsPerReferral}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0 flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-natural-text font-normal mb-0">Signup Discount</CardTitle>
            <Button variant="ghost" className="h-8 w-8 p-0 text-primary-blue hover:text-primary-blue-hover hover:bg-primary-blue/10" onClick={() => setIsEditingDiscount(true)}>
              <EditIcon className="w-5! h-5!" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {isLoading ? "..." : `${settings?.signupDiscountPercent}%`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg text-natural-text font-normal">Referral System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-semibold ${settings?.isReferralEnabled ? "text-success" : "text-danger"}`}>
              {isLoading ? "..." : (settings?.isReferralEnabled ? "Active" : "Inactive")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg text-natural-text font-normal">Redemption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-semibold ${settings?.isRedemptionEnabled ? "text-success" : "text-danger"}`}>
              {isLoading ? "..." : (settings?.isRedemptionEnabled ? "Active" : "Inactive")}
            </div>
          </CardContent>
        </Card>
      </div>

      <EditLoyaltySettingsDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        settings={settings}
        onSuccess={fetchSettings}
      />

      <EditSignupDiscountDialog
        open={isEditingDiscount}
        onOpenChange={setIsEditingDiscount}
        settings={settings}
        onSuccess={fetchSettings}
      />
    </div>
  );
}
