import { pgTable, serial, text, timestamp, varchar, date } from "drizzle-orm/pg-core";

export const bookingRequests = pgTable("booking_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  preferredDate: date("preferred_date").notNull(),
  description: text("description"), // "desc" in user request
  status: varchar("status", { length: 20 }).default("pending").notNull(), // Internal logic
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  scheduledDate: date("scheduled_date").notNull(),
  startTime: varchar("start_time", { length: 10 }),
  endTime: varchar("end_time", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
