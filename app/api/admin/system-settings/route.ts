import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    let settings;
    if (category) {
      settings = await storage.getSystemSettingsByCategory(category);
    } else {
      settings = await storage.getAllSystemSettings();
    }

    // Group by category and mask sensitive values
    const groupedSettings: Record<string, any[]> = {};
    settings.forEach((setting: any) => {
      if (!groupedSettings[setting.category]) {
        groupedSettings[setting.category] = [];
      }
      if (setting.is_sensitive && setting.setting_value) {
        setting.setting_value = '***';
      }
      groupedSettings[setting.category].push(setting);
    });

    return NextResponse.json(groupedSettings);
  } catch (error: any) {
    console.error('GET /api/admin/system-settings error:', error);
    return NextResponse.json({ message: 'Failed to fetch system settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json({ message: 'Invalid settings data' }, { status: 400 });
    }

    const updatedSettings = [];

    for (const setting of settings) {
      const { setting_key, setting_value } = setting;
      if (!setting_key) continue;

      const existingSetting = await storage.getSystemSetting(setting_key);
      if (existingSetting) {
        if (existingSetting.validation_pattern) {
          const pattern = new RegExp(existingSetting.validation_pattern);
          if (!pattern.test(setting_value)) {
            return NextResponse.json({
              message: `Invalid value for ${existingSetting.display_name}. Please check the format.`,
            }, { status: 400 });
          }
        }

        const updated = await storage.updateSystemSetting(setting_key, setting_value);
        if (updated) updatedSettings.push(updated);
      }
    }

    return NextResponse.json({ message: 'Settings updated successfully', updatedSettings });
  } catch (error: any) {
    console.error('POST /api/admin/system-settings error:', error);
    return NextResponse.json({ message: 'Failed to update system settings' }, { status: 500 });
  }
}
