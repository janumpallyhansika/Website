import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  serial,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core"

// Enums
export const roleEnum = pgEnum("role", [
  "member",
  "founder",
  "investor",
  "journalist",
  "admin",
])
export const statusEnum = pgEnum("status", [
  "pending",
  "approved",
  "rejected",
])

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password"),
  college: varchar("college", { length: 255 }),
  role: roleEnum("role").default("member").notNull(),
  xp: integer("xp").default(0).notNull(),
  streak: integer("streak").default(0).notNull(),
  lastActiveDate: timestamp("last_active_date"),
  linkedinUrl: text("linkedin_url"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// NextAuth required tables
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
})

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
})

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
})

// Articles
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  authorName: varchar("author_name", { length: 255 }),
  authorId: integer("author_id").references(() => users.id, {
    onDelete: "set null",
  }),
  category: varchar("category", { length: 100 }),
  tags: text("tags").array(),
  imageUrl: text("image_url"),
  published: boolean("published").default(false).notNull(),
  featured: boolean("featured").default(false).notNull(),
  readCount: integer("read_count").default(0).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Submissions
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  authorName: varchar("author_name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  college: varchar("college", { length: 255 }),
  linkedinUrl: text("linkedin_url"),
  category: varchar("category", { length: 100 }),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  status: statusEnum("status").default("pending").notNull(),
  reviewNote: text("review_note"),
  reviewedBy: integer("reviewed_by").references(() => users.id, {
    onDelete: "set null",
  }),
  reviewedAt: timestamp("reviewed_at"),
  articleId: integer("article_id").references(() => articles.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Founders
export const founders = pgTable("founders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  headline: text("headline"),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  linkedinUrl: text("linkedin_url"),
  email: varchar("email", { length: 255 }),
  status: statusEnum("status").default("pending").notNull(),
  strikeRate: integer("strike_rate").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Magazines
export const magazines = pgTable("magazines", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  issueNo: integer("issue_no"),
  description: text("description"),
  coverUrl: text("cover_url"),
  pdfUrl: text("pdf_url"),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Research Papers
export const researchPapers = pgTable("research_papers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  authors: text("authors"),
  abstract: text("abstract"),
  domain: varchar("domain", { length: 100 }),
  college: varchar("college", { length: 255 }),
  citationText: text("citation_text"),
  pdfUrl: text("pdf_url"),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// College Applications
export const collegeApplications = pgTable("college_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  collegeName: varchar("college_name", { length: 255 }).notNull(),
  contactName: varchar("contact_name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  websiteUrl: text("website_url"),
  proposal: text("proposal"),
  status: statusEnum("status").default("pending").notNull(),
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Investor Requests
export const investorRequests = pgTable("investor_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  investorName: varchar("investor_name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  company: varchar("company", { length: 255 }),
  startupName: varchar("startup_name", { length: 255 }),
  stage: varchar("stage", { length: 100 }),
  ask: text("ask"),
  pitch: text("pitch"),
  status: statusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Newsletter Subscribers
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Activity Events
export const activityEvents = pgTable("activity_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  entityId: integer("entity_id"),
  xpDelta: integer("xp_delta").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Badges
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  minXp: integer("min_xp").default(0).notNull(),
  icon: text("icon"),
})

// User Badges (join table)
export const userBadges = pgTable("user_badges", {
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  badgeId: integer("badge_id")
    .notNull()
    .references(() => badges.id, { onDelete: "cascade" }),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
})

// Type exports
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Article = typeof articles.$inferSelect
export type NewArticle = typeof articles.$inferInsert
export type Submission = typeof submissions.$inferSelect
export type NewSubmission = typeof submissions.$inferInsert
export type Founder = typeof founders.$inferSelect
export type NewFounder = typeof founders.$inferInsert
export type Magazine = typeof magazines.$inferSelect
export type ResearchPaper = typeof researchPapers.$inferSelect
export type CollegeApplication = typeof collegeApplications.$inferSelect
export type InvestorRequest = typeof investorRequests.$inferSelect
export type Badge = typeof badges.$inferSelect
