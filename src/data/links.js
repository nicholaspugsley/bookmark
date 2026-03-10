/**
 * Default links data
 * Edit this file to customize your dashboard links.
 * 
 * Each link object supports:
 * - id: unique identifier
 * - title: display name
 * - url: link destination
 * - category: group name
 * - pinned: show in pinned section
 * - icon: emoji or text icon (optional)
 * - favicon: URL to favicon image (optional, auto-fetched if not provided)
 * - description: short description (optional)
 * - keywords: search keywords (optional)
 * - order: sort order within category
 */

export const defaultLinks = [
  // Google
  {
    id: "gmail",
    title: "Gmail",
    url: "https://mail.google.com",
    category: "Google",
    pinned: true,
    icon: "",
    description: "Email",
    keywords: "email mail inbox",
    order: 1
  },
  {
    id: "calendar",
    title: "Google Calendar",
    url: "https://calendar.google.com",
    category: "Google",
    pinned: true,
    icon: "",
    description: "Calendar and scheduling",
    keywords: "calendar schedule meetings events",
    order: 2
  },
  {
    id: "drive",
    title: "Google Drive",
    url: "https://drive.google.com",
    category: "Google",
    pinned: true,
    icon: "",
    description: "Cloud storage",
    keywords: "files storage cloud docs",
    order: 3
  },

  // Email Tools
  {
    id: "listkit",
    title: "ListKit",
    url: "https://listkit.io",
    category: "Email Tools",
    pinned: true,
    icon: "",
    description: "Lead lists and prospecting",
    keywords: "leads lists prospecting b2b",
    order: 1
  },
  {
    id: "smartlead",
    title: "Smartlead",
    url: "https://smartlead.ai",
    category: "Email Tools",
    pinned: true,
    icon: "",
    description: "Cold email outreach",
    keywords: "cold email outreach campaigns",
    order: 2
  },
  {
    id: "porkbun",
    title: "Porkbun",
    url: "https://porkbun.com/account/login",
    category: "Email Tools",
    pinned: true,
    icon: "",
    description: "Domain registrar",
    keywords: "domains dns registrar hosting",
    order: 3
  },

  // Live Sites
  {
    id: "signedclients",
    title: "Signed Clients",
    url: "https://www.signedclients.com",
    category: "Live Sites",
    pinned: true,
    icon: "",
    description: "Cold email client acquisition",
    keywords: "cold email leads clients b2b outbound",
    order: 1
  }
];

// Category display order
export const categoryOrder = [
  "Google",
  "Email Tools",
  "Live Sites"
];
