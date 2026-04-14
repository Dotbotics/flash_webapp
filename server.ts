/**
 * SERVER.TS
 * 
 * What it does:
 * This is the main backend entry point for the Flash Index application. It handles 
 * database management, API routes, file uploads, and serves the frontend.
 * 
 * Why it exists:
 * To provide a persistent data store (SQLite) for page content and SEO metadata,
 * and to enable an admin dashboard to manage that content dynamically.
 * 
 * How it works:
 * - Uses Express.js for the web server.
 * - Uses better-sqlite3 for a lightweight, file-based database.
 * - Uses Multer for handling image uploads (e.g., OG images).
 * - Integrates Vite middleware in development for Hot Module Replacement (HMR).
 * - Serves static files from the 'dist' folder in production.
 * 
 * Connections:
 * - Connects to 'cms.db' (SQLite database).
 * - Provides endpoints used by 'src/lib/api.ts' and 'src/lib/auth.ts'.
 * - Serves 'index.html' as the entry point for the React app.
 * 
 * Module: Backend / Shared Logic
 */

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import { getDB, DBInterface } from "./src/lib/db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

let db: DBInterface;

// Seed initial content if empty
const seed = async () => {
  const count = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM pages");
  if (count && count.count === 0) {
    console.log("Seeding initial content...");
    const initialPages = [
      {
        id: "home",
        title: "Flash Index Home",
        meta_title: "Flash Index - Find Photos Instantly",
        meta_description: "Experience the future of photo management with our intuitive and powerful AI-powered tools.",
        meta_keywords: "photo management, AI search, flash index, image retrieval",
        content: JSON.stringify({
          heroLabel: "AI-Powered File Retrieval · 2026",
          heroTagline: "Describe anything you want to find",
          heroHeadline1: "Find anything.",
          heroHeadline2Base: "Just describe what you ",
          heroHeadline2Words: ["remember", "think of", "need"],
          heroDescription: "FlashIndex connects to your cloud storage and finds photos, documents, videos, and files — with no folders, filenames, or filters required.",
          heroCloudSources: "Google Drive · SharePoint · Dropbox · OneDrive & more",
          heroPrimaryButton: "Start for Free →",
          heroPrimaryButtonLink: "/pricing",
          heroSecondaryButton: "Watch Demo ▷",
          heroSecondaryButtonLink: "#demo",
          stats: [
            { value: "2M+", label: "Files indexed daily" },
            { value: "<300ms", label: "Avg retrieval time" },
            { value: "12+", label: "Cloud integrations" }
          ],
          testimonials: [
            { name: "Sarah Jenkins", company: "Design Co", text: "Flash Index changed how I work. I no longer waste hours digging through folders.", image: "https://picsum.photos/seed/sarah/100/100" },
            { name: "Michael Chen", company: "TechFlow", text: "The natural language search is spooky accurate. It's like it knows exactly what I'm looking for.", image: "https://picsum.photos/seed/michael/100/100" }
          ],
          clientLogos: [
            { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
            { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
            { name: "Dropbox", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_logo_2017.svg" }
          ],
          problemLabel: "The Old Way",
          problemHeadline: "Searching shouldn't feel like",
          problemHeadlineHighlight: "detective work.",
          problemDescription: "You don't remember filenames. You remember moments — a conversation, a location, a feeling. Traditional systems force you to think like a machine.",
          problemPoints: [
            "Exact filenames always required",
            "Endless nested folders to dig through",
            "Search returns zero useful results",
            "Hours wasted searching every week"
          ],
          solutionLabel: "The FlashIndex Way",
          solutionHeadline: "Search the way",
          solutionHeadlineHighlight: "you think.",
          features: [
            { icon: "💬", title: "Describe Naturally", desc: "Type exactly how you'd explain it to a colleague. Context, emotions, rough details — it all works. No exact names needed." },
            { icon: "🧠", title: "Memory-Aware AI", desc: "Our semantic engine maps meaning, not keywords. It understands people, places, time, and context the way humans do." },
            { icon: "⚡", title: "Instant Recall", desc: "Sub-300ms retrieval across every connected cloud platform, every file format, all from a single unified interface." },
            { icon: "🔐", title: "Zero Data Storage", desc: "We index metadata and meaning — never your content. Files stay in your cloud, under your control, always." },
            { icon: "🌐", title: "12+ Integrations", desc: "Connect Google Drive, SharePoint, Dropbox, OneDrive, Notion, Box and more in seconds. No migration needed." },
            { icon: "📈", title: "Enterprise Scale", desc: "Works for 10 files or 10 million. FlashIndex scales with your organization without any added complexity." }
          ],
          howItWorksLabel: "How It Works",
          howItWorksHeadline: "From memory to result.",
          howItWorksHeadlineHighlight: "In seconds.",
          steps: [
            { num: "01", icon: "☁️", title: "Connect your cloud storage.", desc: "Link Google Drive, SharePoint, Dropbox, OneDrive, or any supported platform in under 60 seconds. No data migration. No disruption to your existing folder structure.", points: ["OAuth-based secure auth", "Read-only index access", "Multiple sources at once", "Setup in under 60 seconds"] },
            { num: "02", icon: "💬", title: "Describe what you remember.", desc: "Tell FlashIndex what you're thinking of — the way you'd explain it to a colleague. Context, dates, people, emotions, topics — all work perfectly.", points: ["Plain English input", "Context & emotion aware", "Any language supported", "No exact details needed"] },
            { num: "03", icon: "⚡", title: "Get it instantly.", desc: "Our semantic AI retrieves your file in milliseconds — with relevance scores, source location, and one-click open. Across every format, every connected source.", points: ["Sub-300ms response time", "Relevance scoring shown", "Cross-platform results", "One-click to open"] }
          ],
          demoLabel: "Live Demo",
          demoHeadline: "See it in action.",
          demo: [
            {
              label: "Personal Memory",
              query: "sunset photo from Goa trip with friends",
              time: "0.19s",
              results: [
                { name: "goa_sunset_beach.jpg", type: "Image · Google Photos", icon: "🌅", score: 98, size: "4.2 MB" },
                { name: "Goa_Trip_Album_Jun23.zip", type: "Archive · Drive", icon: "📦", score: 84, size: "820 MB" },
                { name: "Friends_Goa_Day2.heic", type: "Image · iCloud", icon: "🏖️", score: 79, size: "6.1 MB" }
              ]
            },
            {
              label: "Work Document",
              query: "client presentation from March last year",
              time: "0.21s",
              results: [
                { name: "ClientDeck_Mar2024_v4.pptx", type: "Slides · SharePoint", icon: "📊", score: 96, size: "14 MB" },
                { name: "Q1_Meeting_Notes.docx", type: "Doc · OneDrive", icon: "📝", score: 81, size: "0.9 MB" },
                { name: "ClientBrief_Final.pdf", type: "PDF · Dropbox", icon: "📄", score: 74, size: "2.2 MB" }
              ]
            }
          ],
          useCasesLabel: "Use Cases",
          useCasesHeadline: "Built for everyone.",
          useCasesHeadlineHighlight: "Scales for anything.",
          useCases: [
            { tag: "Personal", icon: "👤", title: "For Individuals", desc: "Your memories, photos, and documents found by how you remember them — not by how they were named or filed.", items: ["Personal photo collections", "Tax docs & receipts", "Notes & journals", "Project archives"] },
            { tag: "Teams", icon: "👥", title: "For Teams", desc: "Stop wasting collective time searching shared drives. Give every member instant access to the right knowledge.", items: ["Shared project files", "Meeting recordings", "Client deliverables", "Design assets"] },
            { tag: "Enterprise", icon: "🏢", title: "For Enterprise", desc: "Unlock organizational knowledge across massive, unstructured systems — at the speed of thought and any scale.", items: ["Multi-TB knowledge bases", "Cross-department search", "Compliance & audit trails", "SSO & enterprise auth"] }
          ],
          trustLabel: "Trust & Reliability",
          trustHeadline: "Built for scale.",
          trustHeadlineHighlight: "Designed for clarity.",
          trustBadges: [
            { icon: "🔐", label: "SOC 2 Ready", desc: "Enterprise-grade security" },
            { icon: "📡", label: "99.9% Uptime", desc: "Reliable at any scale" },
            { icon: "🔒", label: "Zero Data Storage", desc: "Files stay in your cloud" },
            { icon: "⚙️", label: "REST API", desc: "Build on top of FlashIndex" }
          ],
          integrations: [
            { name: "Google Drive", emoji: "🟢" },
            { name: "SharePoint", emoji: "🔵" },
            { name: "Dropbox", emoji: "🟦" },
            { name: "OneDrive", emoji: "☁️" },
            { name: "Box", emoji: "📦" },
            { name: "Notion", emoji: "⬛" },
            { name: "Slack Files", emoji: "💬" },
            { name: "Confluence", emoji: "🔷" },
            { name: "iCloud Drive", emoji: "🍏" },
            { name: "S3 / AWS", emoji: "🟠" }
          ],
          ctaBadge: "⚡ Start for free today",
          ctaHeadline: "Ready to find",
          ctaHeadlineHighlight: "what matters?",
          ctaDescription: "Stop searching. Start remembering. Connect your first storage in 60 seconds — no credit card, no migration, no hassle.",
          ctaPrimaryButton: "Get Started for Free →",
          ctaPrimaryButtonLink: "/pricing",
          ctaSecondaryButton: "Talk to Sales",
          ctaSecondaryButtonLink: "/contact"
        })
      },
      {
        id: "features",
        title: "Powerful Features",
        meta_title: "Flash Index Features - AI-Powered Search & More",
        meta_description: "Everything you need to find anything. Natural Language Search, Multi-Cloud Integration, and more.",
        meta_keywords: "AI search features, cloud integration, image search",
        content: JSON.stringify({
          heroLabel: "Features & Capabilities",
          mainTitle: "Everything you need to find anything.",
          description: "Unlocking the power of your memory with advanced AI indexing and retrieval.",
          oldWayLabel: "The Old Way",
          oldWayHeadline: "Searching shouldn't feel like detective work.",
          oldWayDescription: "You don't remember filenames. You remember moments ? a conversation, a location, a feeling. Traditional systems force you to think like a machine.",
          oldWayPoints: [
            "Exact filenames always required",
            "Endless nested folders to dig through",
            "Search returns zero useful results",
            "Hours wasted searching every week"
          ],
          featureSections: [
            {
              label: "AI Search",
              title: "Natural Language Search",
              description: "Search your files exactly how you think. No more memorizing filenames or folder paths. Just ask, and Flash Index finds it.",
              reversed: true,
              points: ["Instant sub-second response times", "End-to-end encrypted metadata", "Zero-config setup in minutes"]
            },
            {
              label: "Connectivity",
              title: "Multi-Cloud Integration",
              description: "Connect all your storage providers in seconds. Google Drive, Dropbox, OneDrive, and local storage ? all indexed in one unified memory.",
              reversed: false,
              points: ["Unified search interface", "No data migration needed", "Real-time synchronization"]
            },
            {
              label: "Visual AI",
              title: "Instant Image Retrieval",
              description: "Our AI understands the content of your images. Search for 'beach sunset' or 'whiteboard notes' and find exactly what you're looking for instantly.",
              reversed: true,
              points: ["Automatic image tagging", "OCR for text in images", "Facial recognition support"]
            }
          ],
          ctaTitle: "Ready to unlock your",
          ctaTitleHighlight: "digital memory?",
          ctaDescription: "Explore the plan that fits your workflow or talk to our team about a custom rollout.",
          ctaPrimaryButtonText: "View Pricing",
          ctaPrimaryButtonLink: "/pricing",
          ctaSecondaryButtonText: "Contact Sales",
          ctaSecondaryButtonLink: "/contact"
        })
      },
      {
        id: "pricing",
        title: "Pricing Plans",
        meta_title: "Flash Index Pricing - Choose Your Plan",
        meta_description: "Flexible pricing plans for individuals and enterprises. Start for free or upgrade for advanced AI features.",
        meta_keywords: "flash index pricing, AI search cost, enterprise plans",
        content: JSON.stringify({
          heroLabel: "Pricing Plans",
          mainTitle: "Simple, Transparent Pricing",
          subtitle: "Choose the plan that's right for your memory scale.",
          plans: [
            { 
              name: "Individual", 
              price: "Free", 
              features: [
                { name: "Basic search", enabled: true },
                { name: "1 Cloud account", enabled: true },
                { name: "Advanced AI", enabled: false },
                { name: "Unlimited Clouds", enabled: false },
                { name: "Priority support", enabled: false },
                { name: "SSO", enabled: false },
                { name: "Dedicated support", enabled: false },
                { name: "Custom integrations", enabled: false },
                { name: "Audit logs", enabled: false },
                { name: "SLA Guarantee", enabled: false }
              ], 
              tag: "", 
              featured: false,
              ctaText: "Get Started",
              ctaLink: "/contact"
            },
            { 
              name: "Pro", 
              price: "$9.99/mo", 
              features: [
                { name: "Basic search", enabled: true },
                { name: "1 Cloud account", enabled: true },
                { name: "Advanced AI", enabled: true },
                { name: "Unlimited Clouds", enabled: true },
                { name: "Priority support", enabled: true },
                { name: "SSO", enabled: false },
                { name: "Dedicated support", enabled: false },
                { name: "Custom integrations", enabled: false },
                { name: "Audit logs", enabled: false },
                { name: "SLA Guarantee", enabled: false }
              ], 
              tag: "Most Popular", 
              featured: true,
              ctaText: "Get Started",
              ctaLink: "/contact"
            },
            { 
              name: "Enterprise", 
              price: "Custom", 
              features: [
                { name: "Basic search", enabled: true },
                { name: "1 Cloud account", enabled: true },
                { name: "Advanced AI", enabled: true },
                { name: "Unlimited Clouds", enabled: true },
                { name: "Priority support", enabled: true },
                { name: "SSO", enabled: true },
                { name: "Dedicated support", enabled: true },
                { name: "Custom integrations", enabled: true },
                { name: "Audit logs", enabled: true },
                { name: "SLA Guarantee", enabled: true }
              ], 
              tag: "Best Value", 
              featured: false,
              ctaText: "Contact Sales",
              ctaLink: "/contact"
            }
          ],
          comparisonTitle: "Compare Plans",
          comparisonDescription: "Detailed feature breakdown for all Flash Index tiers.",
          ctaTitle: "Need something custom?",
          ctaDescription: "We offer tailored solutions for large-scale enterprises with specific security and compliance requirements.",
          ctaButtonText: "Contact Sales",
          ctaButtonLink: "/contact"
        })
      },
      {
        id: "about",
        title: "About Us",
        meta_title: "About Flash Index - Our Mission & Vision",
        meta_description: "FlashIndex is for individuals and enterprises of any size to instantly find what they?re looking for across cloud storage.",
        meta_keywords: "about flash index, AI search mission, company vision",
        content: JSON.stringify({
          heroLabel: "Our Story",
          heroTitle: "About",
          heroTitleAccent: "Flash Index",
          aboutText: "FlashIndex is for individuals and enterprises of any size to instantly find what they?re looking for across both organized and unorganized content lost in cloud storage.",
          missionTitle: "Our Mission",
          mission: "To help people instantly find what matters by allowing them to describe what they remember?naturally, in their own words.",
          visionTitle: "Our Vision",
          vision: "We eliminate the friction between human memory and digital content?so people can find what they need, when they need it.",
          valuesLabel: "Values",
          valuesTitle: "Our Core Values",
          coreValues: [
            { label: "Human-First", icon: "Users" },
            { label: "Calm Confidence", icon: "Shield" },
            { label: "Memory-Aware", icon: "Zap" },
            { label: "Inclusive", icon: "Users" }
          ],
          ctaTitle: "Join us on our journey to redefine memory.",
          ctaDescription: "Reach out to the team or explore the product in more detail.",
          ctaPrimaryButtonText: "Get in Touch",
          ctaPrimaryButtonLink: "/contact",
          ctaSecondaryButtonText: "Explore Features",
          ctaSecondaryButtonLink: "/features"
        })
      },
      {
        id: "contact",
        title: "Contact Us",
        meta_title: "Contact Flash Index - Get in Touch",
        meta_description: "Have questions? Get in touch with the Flash Index team for support or enterprise inquiries.",
        meta_keywords: "contact flash index, support, enterprise sales",
        content: JSON.stringify({
          heroLabel: "Contact Us",
          heroTitle: "Get in",
          heroTitleAccent: "Touch",
          heroDescription: "Have questions? We are here to help you find your way. Our team is ready to assist with any inquiries.",
          contactInfoTitle: "Contact Information",
          addressLabel: "Address",
          address: "123 Tech Lane, Innovation City",
          emailLabel: "Email",
          email: "hello@flashindex.ai",
          phoneLabel: "Phone",
          phone: "+1 (555) FLASH-ID",
          enterpriseTitle: "Enterprise Inquiries",
          enterpriseDescription: "Looking for a custom deployment or high-volume indexing? Our enterprise team is ready to build a solution that fits your scale.",
          firstNameLabel: "First Name",
          firstNamePlaceholder: "John",
          lastNameLabel: "Last Name",
          lastNamePlaceholder: "Doe",
          emailFieldLabel: "Email Address",
          emailPlaceholder: "john@example.com",
          subjectLabel: "Subject",
          subjectOptions: ["General Inquiry", "Sales", "Support", "Partnership"],
          messageLabel: "Message",
          messagePlaceholder: "How can we help you?",
          submitButtonText: "Send Message",
          submittingButtonText: "Sending...",
          successTitle: "Message Sent!",
          successMessage: "Thank you for reaching out. Our team will get back to you shortly.",
          resetButtonText: "Send Another Message",
          errorMessage: "Something went wrong. Please try again."
        })
      }
    ];

    for (const p of initialPages) {
      await db.run(
        "INSERT INTO pages (id, title, content, meta_title, meta_description, meta_keywords) VALUES (?, ?, ?, ?, ?, ?)",
        [p.id, p.title, p.content, p.meta_title, p.meta_description, p.meta_keywords]
      );
    }
  }

  // Seed default settings if empty
  const settingsCount = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM settings");
  if (settingsCount && settingsCount.count === 0) {
    console.log("Seeding initial settings...");
    const defaultEmailConfig = {
      fromEmail: "noreply@flashindex.ai",
      toEmail: "admin@flashindex.ai, support@flashindex.ai",
      subject: "New Contact Form Submission",
      messageTemplate: "You have received a new message from the contact form.",
      fieldsToSend: "name, email, subject, message"
    };
    await db.run("INSERT INTO settings (key, value) VALUES (?, ?)", ['email_config', JSON.stringify(defaultEmailConfig)]);

    const defaultSiteConfig = {
      siteName: "Flash.Index",
      logoUrl: "",
      faviconUrl: "",
      logoSizeDesktop: 120,
      logoSizeTablet: 100,
      logoSizeMobile: 80,
      footerDescription: "FlashIndex is for individuals and enterprises of any size to instantly find what they’re looking for across cloud storage.",
      footerCopyright: "© 2024 FlashIndex. All rights reserved."
    };
    await db.run("INSERT INTO settings (key, value) VALUES (?, ?)", ['site_config', JSON.stringify(defaultSiteConfig)]);

    const defaultNavigation = [
      { id: '1', label: 'Home', path: '/' },
      { id: '2', label: 'Features', path: '/features' },
      { id: '3', label: 'Pricing', path: '/pricing' },
      { id: '4', label: 'About', path: '/about' },
      { id: '5', label: 'Contact', path: '/contact' }
    ];
    await db.run("INSERT INTO settings (key, value) VALUES (?, ?)", ['navigation', JSON.stringify(defaultNavigation)]);

    const defaultFooterConfig = {
      socialLinks: [
        { id: '1', label: 'X', url: '/contact' },
        { id: '2', label: 'LI', url: '/about' },
        { id: '3', label: 'IG', url: '/features' }
      ],
      resourceLinks: [
        { id: '1', label: 'Features', path: '/features' },
        { id: '2', label: 'Pricing', path: '/pricing' },
        { id: '3', label: 'About', path: '/about' },
        { id: '4', label: 'Contact', path: '/contact' }
      ],
      navigationTitle: "Navigation",
      resourcesTitle: "Resources"
    };
    await db.run("INSERT INTO settings (key, value) VALUES (?, ?)", ['footer_config', JSON.stringify(defaultFooterConfig)]);
  }
};


// Migration: Ensure all pages have the latest fields
const migrate = async () => {
  await db.run("DELETE FROM pages WHERE id IN (?, ?)", ['home-new', 'home2']);

  // Add SEO columns if they don't exist (only for SQLite, Postgres handled in initSchema)
  if (db.constructor.name === "SQLiteDB") {
    const tableInfo = await db.all<any>("PRAGMA table_info(pages)");
    const columns = tableInfo.map(c => c.name);
    
    if (!columns.includes('meta_title')) {
      await db.exec("ALTER TABLE pages ADD COLUMN meta_title TEXT");
    }
    if (!columns.includes('meta_description')) {
      await db.exec("ALTER TABLE pages ADD COLUMN meta_description TEXT");
    }
    if (!columns.includes('meta_keywords')) {
      await db.exec("ALTER TABLE pages ADD COLUMN meta_keywords TEXT");
    }
    if (!columns.includes('og_image')) {
      await db.exec("ALTER TABLE pages ADD COLUMN og_image TEXT");
    }
  }

  const pages = await db.all<any>("SELECT * FROM pages");
  
  const updates = [
    {
      id: "home",
      defaults: {
        heroLabel: "AI-Powered File Retrieval · 2026",
        heroTagline: "Find every file from the fragments you remember.",
        heroHeadline1: "Find anything.",
        heroHeadline2Base: "Just describe what you ",
        heroHeadline2Words: ["remember", "think of", "need"],
        heroDescription: "FlashIndex connects to your cloud storage and finds photos, documents, videos, and files — with no folders, filenames, or filters required.",
        heroCloudSources: "Google Drive · SharePoint · Dropbox · OneDrive & more",
        heroPrimaryButton: "Start for Free →",
        heroPrimaryButtonLink: "/pricing",
        heroSecondaryButton: "Watch Demo ▷",
        heroSecondaryButtonLink: "#demo",
        stats: [
          { value: "2M+", label: "Files indexed daily" },
          { value: "<300ms", label: "Avg retrieval time" },
          { value: "12+", label: "Cloud integrations" }
        ],
        testimonials: [
          { name: "Sarah Jenkins", company: "Design Co", text: "Flash Index changed how I work. I no longer waste hours digging through folders.", image: "https://picsum.photos/seed/sarah/100/100" },
          { name: "Michael Chen", company: "TechFlow", text: "The natural language search is spooky accurate. It's like it knows exactly what I'm looking for.", image: "https://picsum.photos/seed/michael/100/100" }
        ],
        clientLogos: [
          { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
          { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
          { name: "Dropbox", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_logo_2017.svg" }
        ],
        problemLabel: "The Old Way",
        problemHeadline: "Searching shouldn't feel like",
        problemHeadlineHighlight: "detective work.",
        problemDescription: "You don't remember filenames. You remember moments — a conversation, a location, a feeling. Traditional systems force you to think like a machine.",
        problemPoints: [
          "Exact filenames always required",
          "Endless nested folders to dig through",
          "Search returns zero useful results",
          "Hours wasted searching every week"
        ],
        solutionLabel: "The FlashIndex Way",
        solutionHeadline: "Search the way",
        solutionHeadlineHighlight: "you think.",
        features: [
          { icon: "💬", title: "Describe Naturally", desc: "Type exactly how you'd explain it to a colleague. Context, emotions, rough details — it all works. No exact names needed." },
          { icon: "🧠", title: "Memory-Aware AI", desc: "Our semantic engine maps meaning, not keywords. It understands people, places, time, and context the way humans do." },
          { icon: "⚡", title: "Instant Recall", desc: "Sub-300ms retrieval across every connected cloud platform, every file format, all from a single unified interface." },
          { icon: "🔐", title: "Zero Data Storage", desc: "We index metadata and meaning — never your content. Files stay in your cloud, under your control, always." },
          { icon: "🌐", title: "12+ Integrations", desc: "Connect Google Drive, SharePoint, Dropbox, OneDrive, Notion, Box and more in seconds. No migration needed." },
          { icon: "📈", title: "Enterprise Scale", desc: "Works for 10 files or 10 million. FlashIndex scales with your organization without any added complexity." }
        ],
        howItWorksLabel: "How It Works",
        howItWorksHeadline: "From memory to result.",
        howItWorksHeadlineHighlight: "In seconds.",
        steps: [
          { num: "01", icon: "☁️", title: "Connect your cloud storage.", desc: "Link Google Drive, SharePoint, Dropbox, OneDrive, or any supported platform in under 60 seconds. No data migration. No disruption to your existing folder structure.", points: ["OAuth-based secure auth", "Read-only index access", "Multiple sources at once", "Setup in under 60 seconds"] },
          { num: "02", icon: "💬", title: "Describe what you remember.", desc: "Tell FlashIndex what you're thinking of — the way you'd explain it to a colleague. Context, dates, people, emotions, topics — all work perfectly.", points: ["Plain English input", "Context & emotion aware", "Any language supported", "No exact details needed"] },
          { num: "03", icon: "⚡", title: "Get it instantly.", desc: "Our semantic AI retrieves your file in milliseconds — with relevance scores, source location, and one-click open. Across every format, every connected source.", points: ["Sub-300ms response time", "Relevance scoring shown", "Cross-platform results", "One-click to open"] }
        ],
        demoLabel: "Live Demo",
        demoHeadline: "See it in action.",
        demo: [
          {
            label: "Personal Memory",
            query: "sunset photo from Goa trip with friends",
            time: "0.19s",
            results: [
              { name: "goa_sunset_beach.jpg", type: "Image · Google Photos", icon: "🌅", score: 98, size: "4.2 MB" },
              { name: "Goa_Trip_Album_Jun23.zip", type: "Archive · Drive", icon: "📦", score: 84, size: "820 MB" },
              { name: "Friends_Goa_Day2.heic", type: "Image · iCloud", icon: "🏖️", score: 79, size: "6.1 MB" }
            ]
          }
        ],
        useCasesLabel: "Use Cases",
        useCasesHeadline: "Built for everyone.",
        useCasesHeadlineHighlight: "Scales for anything.",
        useCases: [
          { tag: "Personal", icon: "👤", title: "For Individuals", desc: "Your memories, photos, and documents found by how you remember them — not by how they were named or filed.", items: ["Personal photo collections", "Tax docs & receipts", "Notes & journals", "Project archives"] },
          { tag: "Teams", icon: "👥", title: "For Teams", desc: "Stop wasting collective time searching shared drives. Give every member instant access to the right knowledge.", items: ["Shared project files", "Meeting recordings", "Client deliverables", "Design assets"] },
          { tag: "Enterprise", icon: "🏢", title: "For Enterprise", desc: "Unlock organizational knowledge across massive, unstructured systems — at the speed of thought and any scale.", items: ["Multi-TB knowledge bases", "Cross-department search", "Compliance & audit trails", "SSO & enterprise auth"] }
        ],
        trustLabel: "Trust & Reliability",
        trustHeadline: "Built for scale.",
        trustHeadlineHighlight: "Designed for clarity.",
        trustBadges: [
          { icon: "🔐", label: "SOC 2 Ready", desc: "Enterprise-grade security" },
          { icon: "📡", label: "99.9% Uptime", desc: "Reliable at any scale" },
          { icon: "🔒", label: "Zero Data Storage", desc: "Files stay in your cloud" },
          { icon: "⚙️", label: "REST API", desc: "Build on top of FlashIndex" }
        ],
        integrations: [
          { name: "Google Drive", emoji: "🟢" },
          { name: "SharePoint", emoji: "🔵" },
          { name: "Dropbox", emoji: "🟦" },
          { name: "OneDrive", emoji: "☁️" },
          { name: "Box", emoji: "📦" },
          { name: "Notion", emoji: "⬛" },
          { name: "Slack Files", emoji: "💬" },
          { name: "Confluence", emoji: "🔷" },
          { name: "iCloud Drive", emoji: "🍏" },
          { name: "S3 / AWS", emoji: "🟠" }
        ],
        ctaBadge: "⚡ Start for free today",
        ctaHeadline: "Ready to find",
        ctaHeadlineHighlight: "what matters?",
        ctaDescription: "Stop searching. Start remembering. Connect your first storage in 60 seconds — no credit card, no migration, no hassle.",
        ctaPrimaryButton: "Get Started for Free →",
        ctaPrimaryButtonLink: "/pricing",
        ctaSecondaryButton: "Talk to Sales",
        ctaSecondaryButtonLink: "/contact"
      }
    },
    {
      id: "features",
      defaults: {
        heroLabel: "Features & Capabilities",
        mainTitle: "Everything you need to find anything.",
        description: "Unlocking the power of your memory with advanced AI indexing and retrieval.",
        oldWayLabel: "The Old Way",
        oldWayHeadline: "Searching shouldn't feel like detective work.",
        oldWayDescription: "You don't remember filenames. You remember moments ? a conversation, a location, a feeling. Traditional systems force you to think like a machine.",
        oldWayPoints: [
          "Exact filenames always required",
          "Endless nested folders to dig through",
          "Search returns zero useful results",
          "Hours wasted searching every week"
        ],
        featureSections: [
          {
            label: "AI Search",
            title: "Natural Language Search",
            description: "Search your files exactly how you think. No more memorizing filenames or folder paths. Just ask, and Flash Index finds it.",
            reversed: true,
            points: ["Instant sub-second response times", "End-to-end encrypted metadata", "Zero-config setup in minutes"]
          },
          {
            label: "Connectivity",
            title: "Multi-Cloud Integration",
            description: "Connect all your storage providers in seconds. Google Drive, Dropbox, OneDrive, and local storage ? all indexed in one unified memory.",
            reversed: false,
            points: ["Unified search interface", "No data migration needed", "Real-time synchronization"]
          },
          {
            label: "Visual AI",
            title: "Instant Image Retrieval",
            description: "Our AI understands the content of your images. Search for 'beach sunset' or 'whiteboard notes' and find exactly what you're looking for instantly.",
            reversed: true,
            points: ["Automatic image tagging", "OCR for text in images", "Facial recognition support"]
          }
        ],
        ctaTitle: "Ready to unlock your",
        ctaTitleHighlight: "digital memory?",
        ctaDescription: "Explore the plan that fits your workflow or talk to our team about a custom rollout.",
        ctaPrimaryButtonText: "View Pricing",
        ctaPrimaryButtonLink: "/pricing",
        ctaSecondaryButtonText: "Contact Sales",
        ctaSecondaryButtonLink: "/contact"
      }
    },
    {
      id: "pricing",
      defaults: {
        heroLabel: "Pricing Plans",
        mainTitle: "Simple, Transparent Pricing",
        subtitle: "Choose the plan that's right for your memory scale.",
        plans: [
          { 
            name: "Individual", 
            price: "Free", 
            features: [
              { name: "Basic search", enabled: true },
              { name: "1 Cloud account", enabled: true },
              { name: "Advanced AI", enabled: false },
              { name: "Unlimited Clouds", enabled: false },
              { name: "Priority support", enabled: false },
              { name: "SSO", enabled: false },
              { name: "Dedicated support", enabled: false },
              { name: "Custom integrations", enabled: false },
              { name: "Audit logs", enabled: false },
              { name: "SLA Guarantee", enabled: false }
            ], 
            tag: "", 
            featured: false,
            ctaText: "Get Started",
            ctaLink: "/contact"
          },
          { 
            name: "Pro", 
            price: "$9.99/mo", 
            features: [
              { name: "Basic search", enabled: true },
              { name: "1 Cloud account", enabled: true },
              { name: "Advanced AI", enabled: true },
              { name: "Unlimited Clouds", enabled: true },
              { name: "Priority support", enabled: true },
              { name: "SSO", enabled: false },
              { name: "Dedicated support", enabled: false },
              { name: "Custom integrations", enabled: false },
              { name: "Audit logs", enabled: false },
              { name: "SLA Guarantee", enabled: false }
            ], 
            tag: "Most Popular", 
            featured: true,
            ctaText: "Get Started",
            ctaLink: "/contact"
          },
          { 
            name: "Enterprise", 
            price: "Custom", 
            features: [
              { name: "Basic search", enabled: true },
              { name: "1 Cloud account", enabled: true },
              { name: "Advanced AI", enabled: true },
              { name: "Unlimited Clouds", enabled: true },
              { name: "Priority support", enabled: true },
              { name: "SSO", enabled: true },
              { name: "Dedicated support", enabled: true },
              { name: "Custom integrations", enabled: true },
              { name: "Audit logs", enabled: true },
              { name: "SLA Guarantee", enabled: true }
            ], 
            tag: "Best Value", 
            featured: false,
            ctaText: "Contact Sales",
            ctaLink: "/contact"
          }
        ],
        comparisonTitle: "Compare Plans",
        comparisonDescription: "Detailed feature breakdown for all Flash Index tiers.",
        ctaTitle: "Need something custom?",
        ctaDescription: "We offer tailored solutions for large-scale enterprises with specific security and compliance requirements.",
        ctaButtonText: "Contact Sales",
        ctaButtonLink: "/contact"
      }
    },
    {
      id: "about",
      defaults: {
        heroLabel: "Our Story",
        heroTitle: "About",
        heroTitleAccent: "Flash Index",
        missionTitle: "Our Mission",
        visionTitle: "Our Vision",
        valuesLabel: "Values",
        valuesTitle: "Our Core Values",
        coreValues: [
          { label: "Human-First", icon: "Users" },
          { label: "Calm Confidence", icon: "Shield" },
          { label: "Memory-Aware", icon: "Zap" },
          { label: "Inclusive", icon: "Users" }
        ],
        ctaTitle: "Join us on our journey to redefine memory.",
        ctaDescription: "Reach out to the team or explore the product in more detail.",
        ctaPrimaryButtonText: "Get in Touch",
        ctaPrimaryButtonLink: "/contact",
        ctaSecondaryButtonText: "Explore Features",
        ctaSecondaryButtonLink: "/features"
      }
    },
    {
      id: "contact",
      defaults: {
        heroLabel: "Contact Us",
        heroTitle: "Get in",
        heroTitleAccent: "Touch",
        heroDescription: "Have questions? We are here to help you find your way. Our team is ready to assist with any inquiries.",
        contactInfoTitle: "Contact Information",
        addressLabel: "Address",
        emailLabel: "Email",
        phoneLabel: "Phone",
        enterpriseTitle: "Enterprise Inquiries",
        enterpriseDescription: "Looking for a custom deployment or high-volume indexing? Our enterprise team is ready to build a solution that fits your scale.",
        firstNameLabel: "First Name",
        firstNamePlaceholder: "John",
        lastNameLabel: "Last Name",
        lastNamePlaceholder: "Doe",
        emailFieldLabel: "Email Address",
        emailPlaceholder: "john@example.com",
        subjectLabel: "Subject",
        subjectOptions: ["General Inquiry", "Sales", "Support", "Partnership"],
        messageLabel: "Message",
        messagePlaceholder: "How can we help you?",
        submitButtonText: "Send Message",
        submittingButtonText: "Sending...",
        successTitle: "Message Sent!",
        successMessage: "Thank you for reaching out. Our team will get back to you shortly.",
        resetButtonText: "Send Another Message",
        errorMessage: "Something went wrong. Please try again."
      }
    }
  ];

  for (const upd of updates) {
    const page = pages.find(p => p.id === upd.id);
    if (page) {
      const content = JSON.parse(page.content);
      let changed = false;
      
      // Force update for home page if it has old structure
      if (upd.id === 'home' && !content.heroLabel) {
        await db.run("UPDATE pages SET content = ? WHERE id = ?", [JSON.stringify(upd.defaults), upd.id]);
        console.log(`Force updated page structure: ${upd.id}`);
        continue;
      }

      if (upd.id === 'pricing' && Array.isArray(content.plans) && Array.isArray(upd.defaults.plans)) {
        const templatePlans = upd.defaults.plans;
        content.plans = content.plans.map((plan: any, index: number) => {
          const template = templatePlans[index] || {};
          return {
            ...template,
            ...plan,
            features: Array.isArray(plan.features) ? plan.features : (template.features || [])
          };
        });
        changed = true;
      }

      Object.entries(upd.defaults).forEach(([key, val]) => {
        if (!(key in content)) {
          content[key] = val;
          changed = true;
        }
      });
      if (changed) {
        await db.run("UPDATE pages SET content = ? WHERE id = ?", [JSON.stringify(content), upd.id]);
        console.log(`Migrated page: ${upd.id}`);
      }
    }
  }
};

async function startServer() {
  db = await getDB();
  await seed();
  await migrate();

  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/pages", async (req, res) => {
    const pages = await db.all("SELECT * FROM pages");
    res.json(pages);
  });

  app.post("/api/pages", async (req, res) => {
    const { id, title, content, meta_title, meta_description, meta_keywords, og_image } = req.body;
    try {
      await db.run("INSERT INTO pages (id, title, content, meta_title, meta_description, meta_keywords, og_image) VALUES (?, ?, ?, ?, ?, ?, ?)", [
        id, 
        title, 
        JSON.stringify(content),
        meta_title || null,
        meta_description || null,
        meta_keywords || null,
        og_image || null
      ]);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: "Page ID already exists or invalid data" });
    }
  });

  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "Admin" && password === "Admin123") {
      res.json({ success: true, token: "fake-admin-token" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/pages/:id", async (req, res) => {
    console.log(`GET /api/pages/${req.params.id}`);
    const page = await db.get("SELECT * FROM pages WHERE id = ?", [req.params.id]);
    if (page) {
      res.json(page);
    } else {
      res.status(404).json({ error: "Page not found" });
    }
  });

  app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });

  // Get Started Form Submissions (from Pricing page)
  app.post("/api/get-started", async (req, res) => {
    const { name, company, email, phone, designation, reason, plan } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    try {
      const message = JSON.stringify({ company, phone, designation, reason, plan });
      await db.run(
        "INSERT INTO submissions (name, email, subject, message) VALUES (?, ?, ?, ?)",
        [name, email, `Get Started — ${plan || "Pricing Page"}`, message]
      );
      res.json({ success: true });
    } catch (err) {
      console.error("Get Started submission error:", err);
      res.status(500).json({ error: "Failed to save submission" });
    }
  });

  // Contact Form Submissions
  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
      // 1. Save to database
      await db.run("INSERT INTO submissions (name, email, subject, message) VALUES (?, ?, ?, ?)", [
        name, email, subject, message
      ]);

      // 2. Mock "sending" email based on settings
      const settings = await db.get<{ value: string }>("SELECT value FROM settings WHERE key = ?", ['email_config']);
      if (settings) {
        const config = JSON.parse(settings.value);

        console.log("--- MOCK EMAIL SENT ---");
        console.log(`From: ${config.fromEmail}`);
        console.log(`To: ${config.toEmail}`);
        console.log(`Subject: ${config.subject} - ${subject}`);
        console.log(`Body: ${config.messageTemplate}\n\nUser Details:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
        console.log("------------------------");
      }

      res.json({ success: true });
    } catch (err) {
      console.error("Submission error:", err);
      res.status(500).json({ error: "Failed to save submission" });
    }
  });

  app.get("/api/submissions", async (req, res) => {
    const submissions = await db.all("SELECT * FROM submissions ORDER BY created_at DESC");
    res.json(submissions);
  });

  app.delete("/api/submissions/:id", async (req, res) => {
    await db.run("DELETE FROM submissions WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  });

  // Global Settings
  app.get("/api/settings/:key", async (req, res) => {
    const setting = await db.get<{ value: string }>("SELECT value FROM settings WHERE key = ?", [req.params.key]);
    if (setting) {
      res.json(JSON.parse(setting.value));
    } else {
      res.status(404).json({ error: "Setting not found" });
    }
  });

  app.post("/api/settings/:key", async (req, res) => {
    const value = JSON.stringify(req.body);
    // SQLite uses INSERT OR REPLACE, Postgres uses ON CONFLICT
    const isPostgres = db.constructor.name === "PostgresDB";
    if (isPostgres) {
      await db.run("INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", [req.params.key, value]);
    } else {
      await db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [req.params.key, value]);
    }
    res.json({ success: true });
  });

  app.post("/api/pages/:id", async (req, res) => {
    console.log(`POST /api/pages/${req.params.id}`, req.body);
    const { title, content, meta_title, meta_description, meta_keywords, og_image } = req.body;
    try {
      const result = await db.run(`
        UPDATE pages 
        SET title = ?, 
            content = ?, 
            meta_title = ?, 
            meta_description = ?, 
            meta_keywords = ?, 
            og_image = ? 
        WHERE id = ?
      `, [
        title, 
        JSON.stringify(content), 
        meta_title || null,
        meta_description || null,
        meta_keywords || null,
        og_image || null,
        req.params.id
      ]);
      if (result.changes > 0) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Page not found" });
      }
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use("/uploads", express.static(uploadDir));
    app.use(vite.middlewares);
  } else {
    app.use("/uploads", express.static(uploadDir));
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = parseInt(process.env.PORT || "5000");
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
