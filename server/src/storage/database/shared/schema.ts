import { pgTable, serial, timestamp, text, integer, jsonb, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod"

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const timeRecords = pgTable(
	"time_records",
	{
		id: text("id").primaryKey().default(sql`gen_random_uuid()`),
		date: text("date").notNull(),
		startTime: text("start_time").notNull(),
		endTime: text("end_time"),
		duration: integer("duration"), // 时长（分钟）
		project: text("project"),
		task: text("task"),
		notes: text("notes"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	},
	(table) => [
		index("time_records_date_idx").on(table.date),
	]
);

export const analysisResults = pgTable(
	"analysis_results",
	{
		id: text("id").primaryKey().default(sql`gen_random_uuid()`),
		recordsData: jsonb("records_data").notNull(),
		analysisContent: text("analysis_content").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	},
	(table) => [
		index("analysis_results_created_at_idx").on(table.createdAt),
	]
);

// Zod schemas for validation
const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({
	coerce: { date: true },
});

export const insertTimeRecordSchema = createCoercedInsertSchema(timeRecords).pick({
	date: true,
	startTime: true,
	endTime: true,
	duration: true,
	project: true,
	task: true,
	notes: true,
});

export const updateTimeRecordSchema = createCoercedInsertSchema(timeRecords)
	.pick({
		date: true,
		startTime: true,
		endTime: true,
		duration: true,
		project: true,
		task: true,
		notes: true,
	})
	.partial();

export const insertAnalysisResultSchema = createCoercedInsertSchema(analysisResults).pick({
	recordsData: true,
	analysisContent: true,
});

// TypeScript types
export type TimeRecord = typeof timeRecords.$inferSelect;
export type InsertTimeRecord = z.infer<typeof insertTimeRecordSchema>;
export type UpdateTimeRecord = z.infer<typeof updateTimeRecordSchema>;
export type AnalysisResult = typeof analysisResults.$inferSelect;
export type InsertAnalysisResult = z.infer<typeof insertAnalysisResultSchema>;
