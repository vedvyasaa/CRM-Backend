// src/seed.js
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import sequelize from "./config/database.js";
import { User, Lead, Client, Project, ProjectComment } from "./models/index.js";

dotenv.config();

const SALT = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

async function createUsers() {
  const adminPass = await bcrypt.hash("Admin@123", SALT);

  const base = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password_hash: adminPass,
      role: "Admin",
      phone: "9876543210"
    },
    {
      name: "Rohit Sharma",
      email: "rohit@example.com",
      password_hash: await bcrypt.hash("User@123", SALT),
      role: "Staff",
      phone: "9000011111"
    },
    {
      name: "Priya Verma",
      email: "priya@example.com",
      password_hash: await bcrypt.hash("User@123", SALT),
      role: "Staff",
      phone: "9000022222"
    },
    {
      name: "Aakash Singh",
      email: "aakash@example.com",
      password_hash: await bcrypt.hash("User@123", SALT),
      role: "Staff",
      phone: "9000033333"
    },
    {
      name: "Sneha Patel",
      email: "sneha@example.com",
      password_hash: await bcrypt.hash("User@123", SALT),
      role: "Staff",
      phone: "9000044444"
    }
  ];

  for (const u of base) {
    const exists = await User.findOne({ where: { email: u.email } });
    if (!exists) await User.create(u);
  }

  return await User.findAll();
}

async function createLeads(staffList) {
  const leadsPayload = [
    {
      name: "John Lead",
      email: "johnlead@example.com",
      phone: "9990012121",
      source: "Website",
      stage: "New",
      assignedToId: staffList[0]?.id || null
    },
    {
      name: "Sara Lead",
      email: "saralead@example.com",
      phone: "9990013131",
      source: "Instagram",
      stage: "Contacted",
      assignedToId: staffList[1]?.id || null
    },
    {
      name: "Mark Prospect",
      email: "markp@example.com",
      phone: "9990024242",
      source: "Referral",
      stage: "Qualified",
      assignedToId: staffList[2]?.id || null
    },
    {
      name: "Nidhi Inquiry",
      email: "nidhi@example.com",
      phone: "9990035353",
      source: "Email",
      stage: "Proposal",
      assignedToId: staffList[0]?.id || null
    },
    {
      name: "Vikram Query",
      email: "vikram@example.com",
      phone: "9990046464",
      source: "Phone",
      stage: "New",
      assignedToId: null
    }
  ];

  for (const l of leadsPayload) {
    const exists = await Lead.findOne({ where: { email: l.email } });
    if (!exists) await Lead.create(l);
  }

  return await Lead.findAll();
}

async function createClients(leads, staffList) {
  const c1 = await Client.create({
    name: "ABC Pvt Ltd",
    email: "abc@example.com",
    phone: "8888811111",
    address: "Mumbai, India",
    originalLeadId: leads[0]?.id || null
  });
  await c1.addStaff(staffList[0]);

  const c2 = await Client.create({
    name: "Star Enterprises",
    email: "star@example.com",
    phone: "8888822222",
    address: "Pune, India",
    originalLeadId: leads[1]?.id || null
  });
  await c2.addStaff(staffList[1]);

  const c3 = await Client.create({
    name: "Blue Ocean Co",
    email: "blueocean@example.com",
    phone: "8888833333",
    address: "Bengaluru, India"
  });
  await c3.addStaff(staffList[2]);
  await c3.addStaff(staffList[3]);

  return [c1, c2, c3];
}

async function createProjects(clients, staffList) {
  const p1 = await Project.create({
    clientId: clients[0].id,
    title: "CRM Website Development",
    description: "Full CRM system with dashboard, roles and permissions",
    startDate: "2025-02-01",
    endDate: "2025-06-01",
    status: "Active",
    progress: 40
  });
  await p1.addStaff(staffList[0]);
  await p1.addStaff(staffList[1]);

  const p2 = await Project.create({
    clientId: clients[1].id,
    title: "Mobile App",
    description: "E-commerce mobile application (Android & iOS)",
    startDate: "2025-03-10",
    endDate: "2025-09-10",
    status: "Planned",
    progress: 10
  });
  await p2.addStaff(staffList[1]);

  const p3 = await Project.create({
    clientId: clients[2].id,
    title: "SEO & Marketing",
    description: "SEO campaign and marketing funnel",
    startDate: "2025-01-15",
    endDate: "2025-04-15",
    status: "Completed",
    progress: 100
  });
  await p3.addStaff(staffList[2]);

  const p4 = await Project.create({
    clientId: clients[0].id,
    title: "Maintenance Retainer",
    description: "Ongoing support and maintenance",
    startDate: "2025-06-01",
    status: "Active",
    progress: 5
  });
  await p4.addStaff(staffList[3]);

  return [p1, p2, p3, p4];
}

async function createComments(projects, staffList) {
  const comments = [
    {
      projectId: projects[0].id,
      userId: staffList[0].id,
      text: "Initial setup completed."
    },
    {
      projectId: projects[0].id,
      userId: staffList[1].id,
      text: "Backend API ready."
    },
    {
      projectId: projects[1].id,
      userId: staffList[1].id,
      text: "UX wireframes shared with client."
    },
    {
      projectId: projects[2].id,
      userId: staffList[2].id,
      text: "Campaign delivered, traffic up 25%."
    },
    {
      projectId: projects[3].id,
      userId: staffList[3].id,
      text: "Monitoring and hotfixes scheduled."
    }
  ];

  for (const c of comments) {
    await ProjectComment.create(c).catch(e =>
      console.warn("comment create warn:", e.message)
    );
  }
}

async function seed() {
  try {
    console.log("🌱 Seeding database (this will drop existing tables)...");
    await sequelize.sync({ force: true });

    const users = await createUsers();
    const staff = users.filter(u => u.role === "Staff");

    const leads = await createLeads(staff);
    const clients = await createClients(leads, staff);
    const projects = await createProjects(clients, staff);
    await createComments(projects, staff);

    console.log("🎉 Seeding completed. Summary:");
    console.log("Users:", await User.count());
    console.log("Leads:", await Lead.count());
    console.log("Clients:", await Client.count());
    console.log("Projects:", await Project.count());
    console.log("Comments:", await ProjectComment.count());

    console.log("Seeded staff (IDs):");
    staff.forEach(s => console.log(`${s.name}: ${s.id}`));

    process.exit(0);
  } catch (err) {
    console.error("❌ SEED ERROR:", err);
    process.exit(1);
  }
}

seed();


// src/seed.js
// import dotenv from "dotenv";
// import bcrypt from "bcrypt";
// import { v4 as uuidv4 } from "uuid";
// import sequelize from "./config/database.js";

// import {
//   User,
//   Lead,
//   Client,
//   Project,
//   ProjectComment
// } from "./models/index.js";

// dotenv.config();

// const SALT = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

// function uid() {
//   return uuidv4();
// }

// async function createUsers() {
//   const errs = [];
//   try {
//     const adminPass = await bcrypt.hash("Admin@123", SALT);

//     // Base users to create
//     const base = [
//       { id: uid(), name: "Admin User", email: "admin@example.com", password_hash: adminPass, role: "Admin", phone: "9876543210" },
//       { id: uid(), name: "Rohit Sharma", email: "rohit@example.com", password_hash: await bcrypt.hash("User@123", SALT), role: "Staff", phone: "9000011111" },
//       { id: uid(), name: "Priya Verma", email: "priya@example.com", password_hash: await bcrypt.hash("User@123", SALT), role: "Staff", phone: "9000022222" },
//       { id: uid(), name: "Aakash Singh", email: "aakash@example.com", password_hash: await bcrypt.hash("User@123", SALT), role: "Staff", phone: "9000033333" },
//       { id: uid(), name: "Sneha Patel", email: "sneha@example.com", password_hash: await bcrypt.hash("User@123", SALT), role: "Staff", phone: "9000044444" },
//       { id: uid(), name: "Client One", email: "client1@example.com", password_hash: await bcrypt.hash("Client@123", SALT), role: "Client", phone: "8888000001" },
//       { id: uid(), name: "Client Two", email: "client2@example.com", password_hash: await bcrypt.hash("Client@123", SALT), role: "Client", phone: "8888000002" }
//     ];

//     for (const u of base) {
//       // avoid duplicate email errors (idempotent)
//       const exists = await User.findOne({ where: { email: u.email } });
//       if (!exists) {
//         await User.create(u);
//       }
//     }

//     const users = await User.findAll();
//     return users;
//   } catch (e) {
//     errs.push(e);
//     throw e;
//   } finally {
//     if (errs.length) console.error("createUsers errors:", errs);
//   }
// }

// async function createLeads(staffList) {
//   const leadsPayload = [
//     { id: uid(), name: "John Lead", email: "johnlead@example.com", phone: "9990012121", source: "Website", stage: "New", assignedToId: staffList[0].id },
//     { id: uid(), name: "Sara Lead", email: "saralead@example.com", phone: "9990013131", source: "Instagram", stage: "Contacted", assignedToId: staffList[1].id },
//     { id: uid(), name: "Mark Prospect", email: "markp@example.com", phone: "9990024242", source: "Referral", stage: "Qualified", assignedToId: staffList[2].id },
//     { id: uid(), name: "Nidhi Inquiry", email: "nidhi@example.com", phone: "9990035353", source: "Email", stage: "Proposal", assignedToId: staffList[0].id },
//     { id: uid(), name: "Vikram Query", email: "vikram@example.com", phone: "9990046464", source: "Phone", stage: "New", assignedToId: null }
//   ];

//   for (const l of leadsPayload) {
//     const exists = await Lead.findOne({ where: { email: l.email } });
//     if (!exists) await Lead.create(l);
//   }
//   return await Lead.findAll();
// }

// async function createClients(leads, staffList) {
//   // convert two leads into clients, and add a couple more clients
//   const c1 = await Client.create({
//     id: uid(),
//     name: "ABC Pvt Ltd",
//     email: "abc@example.com",
//     phone: "8888811111",
//     address: "Mumbai, India",
//     originalLeadId: leads[0]?.id || null
//   });
//   await c1.addStaff(staffList[0]);

//   const c2 = await Client.create({
//     id: uid(),
//     name: "Star Enterprises",
//     email: "star@example.com",
//     phone: "8888822222",
//     address: "Pune, India",
//     originalLeadId: leads[1]?.id || null
//   });
//   await c2.addStaff(staffList[1]);

//   const c3 = await Client.create({
//     id: uid(),
//     name: "Blue Ocean Co",
//     email: "blueocean@example.com",
//     phone: "8888833333",
//     address: "Bengaluru, India"
//   });
//   await c3.addStaff(staffList[2]);
//   await c3.addStaff(staffList[3]);

//   return [c1, c2, c3];
// }

// async function createProjects(clients, staffList) {
//   const p1 = await Project.create({
//     id: uid(),
//     clientId: clients[0].id,
//     title: "CRM Website Development",
//     description: "Full CRM system with dashboard, roles and permissions",
//     startDate: "2025-02-01",
//     endDate: "2025-06-01",
//     status: "Active",
//     progress: 40
//   });
//   await p1.addStaff(staffList[0]);
//   await p1.addStaff(staffList[1]);

//   const p2 = await Project.create({
//     id: uid(),
//     clientId: clients[1].id,
//     title: "Mobile App",
//     description: "E-commerce mobile application (Android & iOS)",
//     startDate: "2025-03-10",
//     endDate: "2025-09-10",
//     status: "Planned",
//     progress: 10
//   });
//   await p2.addStaff(staffList[1]);

//   const p3 = await Project.create({
//     id: uid(),
//     clientId: clients[2].id,
//     title: "SEO & Marketing",
//     description: "SEO campaign and marketing funnel",
//     startDate: "2025-01-15",
//     endDate: "2025-04-15",
//     status: "Completed",
//     progress: 100
//   });
//   await p3.addStaff(staffList[2]);

//   const p4 = await Project.create({
//     id: uid(),
//     clientId: clients[0].id,
//     title: "Maintenance Retainer",
//     description: "Ongoing support and maintenance",
//     startDate: "2025-06-01",
//     status: "Active",
//     progress: 5
//   });
//   await p4.addStaff(staffList[3]);

//   return [p1, p2, p3, p4];
// }

// async function createComments(projects, staffList) {
//   const comments = [
//     { id: uid(), projectId: projects[0].id, userId: staffList[0].id, text: "Initial setup completed." },
//     { id: uid(), projectId: projects[0].id, userId: staffList[1].id, text: "Backend API ready." },
//     { id: uid(), projectId: projects[1].id, userId: staffList[1].id, text: "UX wireframes shared with client." },
//     { id: uid(), projectId: projects[2].id, userId: staffList[2].id, text: "Campaign delivered, traffic up 25%." },
//     { id: uid(), projectId: projects[3].id, userId: staffList[3].id, text: "Monitoring and hotfixes scheduled." }
//   ];

//   for (const c of comments) {
//     await ProjectComment.create(c).catch(e => console.warn("comment create warn:", e.message));
//   }
//   return await ProjectComment.findAll();
// }

// async function seed() {
//   try {
//     console.log("🌱 Seeding database (this will drop existing tables)...");
//     await sequelize.sync({ force: true });

//     // Users
//     const users = await createUsers();
//     const staff = users.filter(u => u.role === "Staff");
//     const clientsRole = users.filter(u => u.role === "Client");

//     // Leads
//     const leads = await createLeads(staff);

//     // Clients (converted + new)
//     const clients = await createClients(leads, staff);

//     // Projects
//     const projects = await createProjects(clients, staff);

//     // Comments
//     await createComments(projects, staff);

//     console.log("🎉 Seeding completed. Summary:");
//     console.log("Users:", (await User.count()));
//     console.log("Leads:", (await Lead.count()));
//     console.log("Clients:", (await Client.count()));
//     console.log("Projects:", (await Project.count()));
//     console.log("Comments:", (await ProjectComment.count()));

//     console.log("Seeded staff IDs (use these in UI):");
//     staff.forEach(s => console.log(`${s.name}: ${s.id}`));

//     process.exit(0);
//   } catch (err) {
//     console.error("❌ SEED ERROR:", err);
//     process.exit(1);
//   }
// }

// seed();
