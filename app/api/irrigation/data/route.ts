import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { sensorReadings, pumpOperations, systemConfig } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Get the most recent sensor reading
    const latestReading = await db
      .select()
      .from(sensorReadings)
      .orderBy(desc(sensorReadings.timestamp))
      .limit(1)
      .execute();

    // Get pump status
    const latestPumpOperation = await db
      .select()
      .from(pumpOperations)
      .orderBy(desc(pumpOperations.startTime))
      .limit(1)
      .execute();

    // Get system configuration
    const config = await db
      .select()
      .from(systemConfig)
      .limit(1)
      .execute();

    // Get recent readings for chart
    const recentReadings = await db
      .select({
        soilMoisture: sensorReadings.soilMoisture,
        waterLevel: sensorReadings.waterLevel,
        turbidity: sensorReadings.turbidity,
        timestamp: sensorReadings.timestamp,
      })
      .from(sensorReadings)
      .orderBy(desc(sensorReadings.timestamp))
      .limit(24)
      .execute();

    return Response.json({
      sensorData: latestReading[0] || {
        soilMoisture: 45,
        waterLevel: 65,
        turbidity: 42,
        timestamp: new Date().toISOString(),
      },
      pumpStatus: latestPumpOperation[0]?.pumpStatus || false,
      mode: latestPumpOperation[0]?.operationMode || 'AUTO',
      config: config[0],
      recentReadings: recentReadings.reverse(), // Reverse to show oldest first for the chart
    });
  } catch (error) {
    console.error('Error fetching irrigation data:', error);
    return Response.json({
      error: 'Failed to fetch irrigation data',
      sensorData: {
        soilMoisture: 45,
        waterLevel: 65,
        turbidity: 42,
        timestamp: new Date().toISOString(),
      },
      pumpStatus: false,
      mode: 'AUTO',
      recentReadings: []
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { pumpStatus, operationMode, deviceId = 'ESP32_001' } = await req.json();

    if (pumpStatus !== undefined) {
      // Record pump operation
      const [operation] = await db
        .insert(pumpOperations)
        .values({
          deviceId,
          pumpStatus,
          operationMode: operationMode || 'MANUAL',
          startTime: new Date(),
          reason: operationMode === 'MANUAL' ? 'MANUAL_OVERRIDE' : 'AUTO_THRESHOLD',
        })
        .returning();

      return Response.json({ success: true, operation });
    }

    return Response.json({ success: false, error: 'Invalid request body' });
  } catch (error) {
    console.error('Error updating pump status:', error);
    return Response.json({ success: false, error: 'Failed to update pump status' });
  }
}