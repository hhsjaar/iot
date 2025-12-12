import { pgTable, serial, text, integer, timestamp, boolean, decimal, varchar } from 'drizzle-orm/pg-core';

// Irrigation devices table
export const devices = pgTable('devices', {
  id: serial('id').primaryKey(),
  deviceId: varchar('device_id', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  location: varchar('location', { length: 500 }),
  active: boolean('active').default(true),
  lastHeartbeat: timestamp('last_heartbeat'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Sensor readings table
export const sensorReadings = pgTable('sensor_readings', {
  id: serial('id').primaryKey(),
  deviceId: varchar('device_id', { length: 255 }).notNull(),
  soilMoisture: decimal('soil_moisture', { precision: 5, scale: 2 }), // percentage (0-100)
  waterLevel: decimal('water_level', { precision: 6, scale: 2 }), // in cm
  turbidity: decimal('turbidity', { precision: 6, scale: 2 }), // NTU
  temperature: decimal('temperature', { precision: 5, scale: 2 }), // Celsius
  batteryLevel: decimal('battery_level', { precision: 5, scale: 2 }), // percentage (0-100)
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  isValid: boolean('is_valid').default(true),
});

// Pump operations table
export const pumpOperations = pgTable('pump_operations', {
  id: serial('id').primaryKey(),
  deviceId: varchar('device_id', { length: 255 }).notNull(),
  pumpStatus: boolean('pump_status').notNull(), // true = ON, false = OFF
  operationMode: varchar('operation_mode', { length: 50 }).default('AUTO'), // AUTO, MANUAL
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  duration: integer('duration'), // in seconds
  reason: varchar('reason', { length: 255 }), // e.g., "AUTO_THRESHOLD", "MANUAL_OVERRIDE"
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// System configuration table
export const systemConfig = pgTable('system_config', {
  id: serial('id').primaryKey(),
  deviceId: varchar('device_id', { length: 255 }).notNull().unique(),
  soilMoistureThreshold: decimal('soil_moisture_threshold', { precision: 5, scale: 2 }).default('30.00'), // percentage
  waterLevelMinimum: decimal('water_level_minimum', { precision: 6, scale: 2 }).default('20.00'), // in cm
  turbidityMaximum: decimal('turbidity_maximum', { precision: 6, scale: 2 }).default('100.00'), // NTU
  pumpAutoDurationLimit: integer('pump_auto_duration_limit').default(3600), // in seconds (1 hour)
  dataInterval: integer('data_interval').default(2000), // in milliseconds
  pumpActivationDelay: integer('pump_activation_delay').default(300), // in seconds (5 min)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Alerts and notifications table
export const alerts = pgTable('alerts', {
  id: serial('id').primaryKey(),
  deviceId: varchar('device_id', { length: 255 }).notNull(),
  alertType: varchar('alert_type', { length: 100 }).notNull(), // 'WARNING', 'CRITICAL', 'INFO'
  message: text('message').notNull(),
  value: decimal('value', { precision: 8, scale: 2 }), // the value that triggered the alert
  threshold: decimal('threshold', { precision: 8, scale: 2 }), // the threshold value
  resolved: boolean('resolved').default(false),
  resolvedAt: timestamp('resolved_at'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Create indexes for better query performance
export const idxDeviceId = sensorReadings.deviceId;
export const idxTimestamp = sensorReadings.timestamp;
export const idxDeviceTimestamp = sensorReadings.deviceId;