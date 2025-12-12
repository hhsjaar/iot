import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { systemConfig } from '@/lib/db/schema';

export async function GET() {
  try {
    const configs = await db
      .select()
      .from(systemConfig)
      .execute();

    return Response.json({ configs });
  } catch (error) {
    console.error('Error fetching system config:', error);
    return Response.json({ 
      error: 'Failed to fetch system config',
      configs: [{
        deviceId: 'ESP32_001',
        soilMoistureThreshold: '30.00',
        waterLevelMinimum: '20.00',
        turbidityMaximum: '100.00',
        pumpAutoDurationLimit: 3600,
        dataInterval: 2000,
        pumpActivationDelay: 300,
      }]
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const configData = await request.json();

    const [updatedConfig] = await db
      .insert(systemConfig)
      .values(configData)
      .onConflictDoUpdate({
        target: systemConfig.deviceId,
        set: configData,
      })
      .returning();

    return Response.json({ success: true, config: updatedConfig });
  } catch (error) {
    console.error('Error updating system config:', error);
    return Response.json({ success: false, error: 'Failed to update system config' });
  }
}