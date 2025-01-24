"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

type SocialMediaSettings = {
  facebook: boolean;
  instagram: boolean;
  twitter: boolean;
  tiktok: boolean;
};

export default function SettingsPage() {
  const [socialSettings, setSocialSettings] = useState<SocialMediaSettings>({
    facebook: true,
    instagram: true,
    twitter: true,
    tiktok: true
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('socialMediaSettings');
    if (savedSettings) {
      setSocialSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage when changed
  const updateSetting = (platform: keyof SocialMediaSettings) => {
    const newSettings = {
      ...socialSettings,
      [platform]: !socialSettings[platform]
    };
    setSocialSettings(newSettings);
    localStorage.setItem('socialMediaSettings', JSON.stringify(newSettings));
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Display Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Switch 
              id="facebook"
              checked={socialSettings.facebook}
              onCheckedChange={() => updateSetting('facebook')}
            />
            <Label htmlFor="facebook">Show Facebook Stats</Label>
          </div>

          <div className="flex items-center space-x-4">
            <Switch 
              id="instagram"
              checked={socialSettings.instagram}
              onCheckedChange={() => updateSetting('instagram')}
            />
            <Label htmlFor="instagram">Show Instagram Stats</Label>
          </div>

          <div className="flex items-center space-x-4">
            <Switch 
              id="twitter"
              checked={socialSettings.twitter}
              onCheckedChange={() => updateSetting('twitter')}
            />
            <Label htmlFor="twitter">Show X (Twitter) Stats</Label>
          </div>

          <div className="flex items-center space-x-4">
            <Switch 
              id="tiktok"
              checked={socialSettings.tiktok}
              onCheckedChange={() => updateSetting('tiktok')}
            />
            <Label htmlFor="tiktok">Show TikTok Stats</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}