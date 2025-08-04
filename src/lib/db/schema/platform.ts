import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  integer,
  boolean,
  timestamp,
  date,
  pgEnum,
  index,
  pgSchema,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

// Enums
export const userTypeEnum = pgEnum("user_type", [
  "contractor",
  "client",
  "mediator",
]);

export const contractStatusEnum = pgEnum("contract_status", [
  "sent",
  "awaiting_deposit",
  "pending_acceptance",
  "accepted",
  "rejected",
  "in_progress",
  "completed",
  "cancelled",
  "in_dispute",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "held",
  "released",
  "refunded",
  "cancelled",
]);

export const disputeStatusEnum = pgEnum("dispute_status", [
  "open",
  "under_review",
  "resolved",
  "closed",
]);

export const evidenceTypeEnum = pgEnum("evidence_type", [
  "document",
  "image",
  "video",
  "text",
]);

export const reviewTypeEnum = pgEnum("review_type", [
  "client_to_contractor",
  "contractor_to_client",
]);

export const availabilityEnum = pgEnum("availability", [
  "full-time",
  "part-time",
  "unavailable",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "pending",
  "verified",
  "rejected",
]);

export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "basic",
  "business",
  "enterprise",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "inactive",
  "cancelled",
  "expired",
]);

export const paymentTypeEnum = pgEnum("payment_type", [
  "milestone",
  "hourly",
  "fixed",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "bank_transfer",
  "paypal",
  "stripe",
  "wire",
]);

export const accountTransactionTypeEnum = pgEnum("account_transaction_type", [
  "deposit",
  "withdrawal",
  "contract_payment",
  "contract_refund",
]);

export const accountTransactionStatusEnum = pgEnum(
  "account_transaction_status",
  ["pending", "completed", "failed", "cancelled"]
);

export const disputeInitiatorEnum = pgEnum("dispute_initiator", [
  "contractor",
  "client",
]);

// User Profiles Table - extends auth.users
export const userProfiles = pgTable(
  "user_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Reference to Supabase Auth user
    userId: uuid("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull()
      .unique(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    country: varchar("country", { length: 50 }),
    userType: userTypeEnum("user_type").notNull(),
    preferredCurrency: varchar("preferred_currency", { length: 3 }).default(
      "USD"
    ),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    active: boolean("active").default(true),
  },
  (table) => ({
    userIdIdx: index("idx_user_profiles_user_id").on(table.userId),
    userTypeIdx: index("idx_user_profiles_type").on(table.userType),
  })
);

// Contractor Profiles Table
export const contractorProfiles = pgTable(
  "contractor_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    username: varchar("username", { length: 50 }).unique(),
    specialties: text("specialties").array(),
    experienceYears: integer("experience_years"),
    hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
    portfolioUrl: varchar("portfolio_url", { length: 500 }),
    bio: text("bio"),
    skills: text("skills").array(),
    availability: availabilityEnum("availability").default("unavailable"),
    timezone: varchar("timezone", { length: 100 }),
    profileComplete: boolean("profile_complete").default(false),
    averageRating: decimal("average_rating", {
      precision: 3,
      scale: 2,
    }).default("0"),
    totalProjectsCompleted: integer("total_projects_completed").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userProfileIdIdx: index("idx_contractor_profiles_user_profile_id").on(
      table.userProfileId
    ),
    usernameIdx: index("idx_contractor_profiles_username").on(table.username),
  })
);

// Client Profiles Table
export const clientProfiles = pgTable(
  "client_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    company: varchar("company", { length: 200 }),
    industry: varchar("industry", { length: 100 }),
    website: varchar("website", { length: 500 }),
    companyDescription: text("company_description"),
    size: varchar("size", { length: 50 }),
    verificationStatus: verificationStatusEnum("verification_status").default(
      "pending"
    ),
    totalContractsCreated: integer("total_contracts_created").default(0),
    averageRating: decimal("average_rating", {
      precision: 3,
      scale: 2,
    }).default("0"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userProfileIdIdx: index("idx_client_profiles_user_profile_id").on(
      table.userProfileId
    ),
  })
);

// Subscriptions Table
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientProfileId: uuid("client_profile_id")
      .references(() => clientProfiles.id, { onDelete: "cascade" })
      .notNull(),
    plan: subscriptionPlanEnum("plan").notNull(),
    status: subscriptionStatusEnum("status").notNull().default("active"),
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    clientProfileIdIdx: index("idx_subscriptions_client_profile_id").on(
      table.clientProfileId
    ),
    statusIdx: index("idx_subscriptions_status").on(table.status),
  })
);

// Contracts Table
export const contracts = pgTable(
  "contracts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .references(() => userProfiles.id)
      .notNull(),
    contractorId: uuid("contractor_id")
      .references(() => userProfiles.id)
      .notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    startDate: date("start_date"),
    endDate: date("end_date"),
    deliverables: text("deliverables").array(),
    termsAndConditions: text("terms_and_conditions"),
    status: contractStatusEnum("status").notNull().default("sent"),
    blockchainContractId: text("blockchain_contract_id"),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    clientIdIdx: index("idx_contracts_client_id").on(table.clientId),
    contractorIdIdx: index("idx_contracts_contractor_id").on(
      table.contractorId
    ),
    statusIdx: index("idx_contracts_status").on(table.status),
  })
);

// Contract Clients Table (Many-to-Many relationship)
export const contractClients = pgTable(
  "contract_clients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contractId: uuid("contract_id")
      .references(() => contracts.id, { onDelete: "cascade" })
      .notNull(),
    clientId: uuid("client_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    isPrimary: boolean("is_primary").default(false), // Para identificar el cliente principal
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    contractIdIdx: index("idx_contract_clients_contract_id").on(
      table.contractId
    ),
    clientIdIdx: index("idx_contract_clients_client_id").on(table.clientId),
    uniqueContractClient: index("idx_contract_clients_unique").on(
      table.contractId,
      table.clientId
    ),
  })
);

// Contract Contractors Table (Many-to-Many relationship)
export const contractContractors = pgTable(
  "contract_contractors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contractId: uuid("contract_id")
      .references(() => contracts.id, { onDelete: "cascade" })
      .notNull(),
    contractorId: uuid("contractor_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    isPrimary: boolean("is_primary").default(false), // Para identificar el contratista principal
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    contractIdIdx: index("idx_contract_contractors_contract_id").on(
      table.contractId
    ),
    contractorIdIdx: index("idx_contract_contractors_contractor_id").on(
      table.contractorId
    ),
    uniqueContractContractor: index("idx_contract_contractors_unique").on(
      table.contractId,
      table.contractorId
    ),
  })
);

// Milestones Table
export const milestones = pgTable(
  "milestones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contractId: uuid("contract_id")
      .references(() => contracts.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    dueDate: date("due_date"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, completed, cancelled
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    contractIdIdx: index("idx_milestones_contract_id").on(table.contractId),
    statusIdx: index("idx_milestones_status").on(table.status),
    dueDateIdx: index("idx_milestones_due_date").on(table.dueDate),
  })
);

// Payments Table
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contractId: uuid("contract_id")
      .references(() => contracts.id, { onDelete: "cascade" })
      .notNull(),
    milestoneId: uuid("milestone_id").references(() => milestones.id, {
      onDelete: "set null",
    }),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    type: paymentTypeEnum("type").notNull().default("fixed"),
    paymentMethod: paymentMethodEnum("payment_method")
      .notNull()
      .default("bank_transfer"),
    processingFee: decimal("processing_fee", {
      precision: 10,
      scale: 2,
    }).default("0"),
    totalAmount: decimal("total_amount", { precision: 12, scale: 2 }),
    status: paymentStatusEnum("status").notNull().default("pending"),
    transferredAt: timestamp("transferred_at", { withTimezone: true }),
    releasedAt: timestamp("released_at", { withTimezone: true }),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    transactionReference: varchar("transaction_reference", { length: 200 }),
    notes: text("notes"),
    // Para pagos por hora
    hoursWorked: integer("hours_worked"),
    periodStart: timestamp("period_start", { withTimezone: true }),
    periodEnd: timestamp("period_end", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    contractIdIdx: index("idx_payments_contract_id").on(table.contractId),
    milestoneIdIdx: index("idx_payments_milestone_id").on(table.milestoneId),
    statusIdx: index("idx_payments_status").on(table.status),
    paidAtIdx: index("idx_payments_paid_at").on(table.paidAt),
  })
);

// Disputes Table
export const disputes = pgTable(
  "disputes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contractId: uuid("contract_id")
      .references(() => contracts.id, { onDelete: "cascade" })
      .notNull(),
    milestoneId: uuid("milestone_id").references(() => milestones.id, {
      onDelete: "set null",
    }),
    initiatorId: uuid("initiator_id")
      .references(() => userProfiles.id)
      .notNull(),
    initiatedBy: disputeInitiatorEnum("initiated_by").notNull(),
    mediatorId: uuid("mediator_id").references(() => userProfiles.id),
    reason: text("reason").notNull(),
    description: text("description").notNull(),
    status: disputeStatusEnum("status").notNull().default("open"),
    resolution: text("resolution"),
    resolutionDetails: text("resolution_details"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    winnerId: uuid("winner_id").references(() => userProfiles.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    contractIdIdx: index("idx_disputes_contract_id").on(table.contractId),
    milestoneIdIdx: index("idx_disputes_milestone_id").on(table.milestoneId),
    statusIdx: index("idx_disputes_status").on(table.status),
    mediatorIdIdx: index("idx_disputes_mediator_id").on(table.mediatorId),
  })
);

// Dispute Evidence Table
export const disputeEvidence = pgTable(
  "dispute_evidence",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    disputeId: uuid("dispute_id")
      .references(() => disputes.id, { onDelete: "cascade" })
      .notNull(),
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id)
      .notNull(),
    evidenceType: evidenceTypeEnum("evidence_type").notNull(),
    description: text("description"),
    fileUrl: varchar("file_url", { length: 500 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    disputeIdIdx: index("idx_dispute_evidence_dispute_id").on(table.disputeId),
  })
);

// Reviews Table
export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contractId: uuid("contract_id")
      .references(() => contracts.id, { onDelete: "cascade" })
      .notNull(),
    reviewerId: uuid("reviewer_id")
      .references(() => userProfiles.id)
      .notNull(),
    reviewedId: uuid("reviewed_id")
      .references(() => userProfiles.id)
      .notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    reviewType: reviewTypeEnum("review_type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    contractIdIdx: index("idx_reviews_contract_id").on(table.contractId),
    reviewedIdIdx: index("idx_reviews_reviewed_id").on(table.reviewedId),
  })
);

// Notifications Table
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    message: text("message").notNull(),
    read: boolean("read").default(false),
    actionUrl: varchar("action_url", { length: 500 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userProfileIdIdx: index("idx_notifications_user_profile_id").on(
      table.userProfileId
    ),
    readIdx: index("idx_notifications_read").on(table.read),
  })
);

// Status History Table
export const statusHistory = pgTable(
  "status_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contractId: uuid("contract_id")
      .references(() => contracts.id, { onDelete: "cascade" })
      .notNull(),
    previousStatus: varchar("previous_status", { length: 20 }),
    newStatus: varchar("new_status", { length: 20 }).notNull(),
    userProfileId: uuid("user_profile_id").references(() => userProfiles.id),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    contractIdIdx: index("idx_status_history_contract_id").on(table.contractId),
  })
);

// Account Balances Table
export const accountBalances = pgTable(
  "account_balances",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    availableBalance: decimal("available_balance", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    lastUpdated: timestamp("last_updated", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userProfileIdIdx: index("idx_account_balances_user_profile_id").on(
      table.userProfileId
    ),
  })
);

// Account Transactions Table
export const accountTransactions = pgTable(
  "account_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    type: accountTransactionTypeEnum("type").notNull(),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    status: accountTransactionStatusEnum("status").notNull().default("pending"),
    paymentMethod: paymentMethodEnum("payment_method"),
    transactionReference: varchar("transaction_reference", { length: 200 }),
    description: text("description"),
    processingFee: decimal("processing_fee", {
      precision: 10,
      scale: 2,
    }).default("0"),
    contractId: uuid("contract_id").references(() => contracts.id, {
      onDelete: "set null",
    }), // Optional, for contract-related transactions
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userProfileIdIdx: index("idx_account_transactions_user_profile_id").on(
      table.userProfileId
    ),
    typeIdx: index("idx_account_transactions_type").on(table.type),
    statusIdx: index("idx_account_transactions_status").on(table.status),
    contractIdIdx: index("idx_account_transactions_contract_id").on(
      table.contractId
    ),
  })
);

// Relations
export const userProfilesRelations = relations(
  userProfiles,
  ({ one, many }) => ({
    authUser: one(user, {
      fields: [userProfiles.userId],
      references: [user.id],
    }),
    contractorProfile: one(contractorProfiles, {
      fields: [userProfiles.id],
      references: [contractorProfiles.userProfileId],
    }),
    clientProfile: one(clientProfiles, {
      fields: [userProfiles.id],
      references: [clientProfiles.userProfileId],
    }),
    contractsAsClient: many(contracts, { relationName: "clientContracts" }),
    contractsAsContractor: many(contracts, {
      relationName: "contractorContracts",
    }),
    initiatedDisputes: many(disputes, { relationName: "initiatedDisputes" }),
    mediatedDisputes: many(disputes, { relationName: "mediatedDisputes" }),
    reviewsGiven: many(reviews, { relationName: "reviewsGiven" }),
    reviewsReceived: many(reviews, { relationName: "reviewsReceived" }),
    notifications: many(notifications),
    accountBalance: one(accountBalances),
    accountTransactions: many(accountTransactions),
  })
);

export const contractorProfilesRelations = relations(
  contractorProfiles,
  ({ one }) => ({
    userProfile: one(userProfiles, {
      fields: [contractorProfiles.userProfileId],
      references: [userProfiles.id],
    }),
  })
);

export const clientProfilesRelations = relations(
  clientProfiles,
  ({ one, many }) => ({
    userProfile: one(userProfiles, {
      fields: [clientProfiles.userProfileId],
      references: [userProfiles.id],
    }),
    subscriptions: many(subscriptions),
  })
);

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  client: one(userProfiles, {
    fields: [contracts.clientId],
    references: [userProfiles.id],
    relationName: "clientContracts",
  }),
  contractor: one(userProfiles, {
    fields: [contracts.contractorId],
    references: [userProfiles.id],
    relationName: "contractorContracts",
  }),
  payments: many(payments),
  disputes: many(disputes),
  reviews: many(reviews),
  statusHistory: many(statusHistory),
  milestones: many(milestones),
  contractClients: many(contractClients),
  contractContractors: many(contractContractors),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  contract: one(contracts, {
    fields: [payments.contractId],
    references: [contracts.id],
  }),
  milestone: one(milestones, {
    fields: [payments.milestoneId],
    references: [milestones.id],
  }),
}));

export const disputesRelations = relations(disputes, ({ one, many }) => ({
  contract: one(contracts, {
    fields: [disputes.contractId],
    references: [contracts.id],
  }),
  milestone: one(milestones, {
    fields: [disputes.milestoneId],
    references: [milestones.id],
  }),
  initiator: one(userProfiles, {
    fields: [disputes.initiatorId],
    references: [userProfiles.id],
    relationName: "initiatedDisputes",
  }),
  mediator: one(userProfiles, {
    fields: [disputes.mediatorId],
    references: [userProfiles.id],
    relationName: "mediatedDisputes",
  }),
  winner: one(userProfiles, {
    fields: [disputes.winnerId],
    references: [userProfiles.id],
  }),
  evidence: many(disputeEvidence),
}));

export const disputeEvidenceRelations = relations(
  disputeEvidence,
  ({ one }) => ({
    dispute: one(disputes, {
      fields: [disputeEvidence.disputeId],
      references: [disputes.id],
    }),
    userProfile: one(userProfiles, {
      fields: [disputeEvidence.userProfileId],
      references: [userProfiles.id],
    }),
  })
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  contract: one(contracts, {
    fields: [reviews.contractId],
    references: [contracts.id],
  }),
  reviewer: one(userProfiles, {
    fields: [reviews.reviewerId],
    references: [userProfiles.id],
    relationName: "reviewsGiven",
  }),
  reviewed: one(userProfiles, {
    fields: [reviews.reviewedId],
    references: [userProfiles.id],
    relationName: "reviewsReceived",
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  userProfile: one(userProfiles, {
    fields: [notifications.userProfileId],
    references: [userProfiles.id],
  }),
}));

export const statusHistoryRelations = relations(statusHistory, ({ one }) => ({
  contract: one(contracts, {
    fields: [statusHistory.contractId],
    references: [contracts.id],
  }),
  userProfile: one(userProfiles, {
    fields: [statusHistory.userProfileId],
    references: [userProfiles.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  clientProfile: one(clientProfiles, {
    fields: [subscriptions.clientProfileId],
    references: [clientProfiles.id],
  }),
}));

export const milestonesRelations = relations(milestones, ({ one, many }) => ({
  contract: one(contracts, {
    fields: [milestones.contractId],
    references: [contracts.id],
  }),
  payments: many(payments),
  disputes: many(disputes),
}));

export const contractClientsRelations = relations(
  contractClients,
  ({ one }) => ({
    contract: one(contracts, {
      fields: [contractClients.contractId],
      references: [contracts.id],
    }),
    client: one(userProfiles, {
      fields: [contractClients.clientId],
      references: [userProfiles.id],
    }),
  })
);

export const contractContractorsRelations = relations(
  contractContractors,
  ({ one }) => ({
    contract: one(contracts, {
      fields: [contractContractors.contractId],
      references: [contracts.id],
    }),
    contractor: one(userProfiles, {
      fields: [contractContractors.contractorId],
      references: [userProfiles.id],
    }),
  })
);

export const accountBalancesRelations = relations(
  accountBalances,
  ({ one, many }) => ({
    userProfile: one(userProfiles, {
      fields: [accountBalances.userProfileId],
      references: [userProfiles.id],
    }),
    transactions: many(accountTransactions),
  })
);

export const accountTransactionsRelations = relations(
  accountTransactions,
  ({ one }) => ({
    userProfile: one(userProfiles, {
      fields: [accountTransactions.userProfileId],
      references: [userProfiles.id],
    }),
    accountBalance: one(accountBalances, {
      fields: [accountTransactions.userProfileId],
      references: [accountBalances.userProfileId],
    }),
    contract: one(contracts, {
      fields: [accountTransactions.contractId],
      references: [contracts.id],
    }),
  })
);

// Type exports for TypeScript
export type AuthUser = typeof user.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
export type ContractorProfile = typeof contractorProfiles.$inferSelect;
export type NewContractorProfile = typeof contractorProfiles.$inferInsert;
export type ClientProfile = typeof clientProfiles.$inferSelect;
export type NewClientProfile = typeof clientProfiles.$inferInsert;
export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Dispute = typeof disputes.$inferSelect;
export type NewDispute = typeof disputes.$inferInsert;
export type DisputeEvidence = typeof disputeEvidence.$inferSelect;
export type NewDisputeEvidence = typeof disputeEvidence.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type StatusHistory = typeof statusHistory.$inferSelect;
export type NewStatusHistory = typeof statusHistory.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Milestone = typeof milestones.$inferSelect;
export type NewMilestone = typeof milestones.$inferInsert;
export type ContractClient = typeof contractClients.$inferSelect;
export type NewContractClient = typeof contractClients.$inferInsert;
export type ContractContractor = typeof contractContractors.$inferSelect;
export type NewContractContractor = typeof contractContractors.$inferInsert;
export type AccountBalance = typeof accountBalances.$inferSelect;
export type NewAccountBalance = typeof accountBalances.$inferInsert;
export type AccountTransaction = typeof accountTransactions.$inferSelect;
export type NewAccountTransaction = typeof accountTransactions.$inferInsert;
