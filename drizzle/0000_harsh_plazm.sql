CREATE TABLE "alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"alert_type" varchar(100) NOT NULL,
	"message" text NOT NULL,
	"value" numeric(8, 2),
	"threshold" numeric(8, 2),
	"resolved" boolean DEFAULT false,
	"resolved_at" timestamp,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devices" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"location" varchar(500),
	"active" boolean DEFAULT true,
	"last_heartbeat" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "devices_device_id_unique" UNIQUE("device_id")
);
--> statement-breakpoint
CREATE TABLE "pump_operations" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"pump_status" boolean NOT NULL,
	"operation_mode" varchar(50) DEFAULT 'AUTO',
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"duration" integer,
	"reason" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sensor_readings" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"soil_moisture" numeric(5, 2),
	"water_level" numeric(6, 2),
	"turbidity" numeric(6, 2),
	"temperature" numeric(5, 2),
	"battery_level" numeric(5, 2),
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"is_valid" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "system_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"soil_moisture_threshold" numeric(5, 2) DEFAULT '30.00',
	"water_level_minimum" numeric(6, 2) DEFAULT '20.00',
	"turbidity_maximum" numeric(6, 2) DEFAULT '100.00',
	"pump_auto_duration_limit" integer DEFAULT 3600,
	"data_interval" integer DEFAULT 2000,
	"pump_activation_delay" integer DEFAULT 300,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "system_config_device_id_unique" UNIQUE("device_id")
);
