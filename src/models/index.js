import sequelize from "../config/database.js";
import User from "./user.model.js";
import Lead from "./lead.model.js";
import Client from "./client.model.js";
import Project from "./project.model.js";
import ProjectComment from "./projectComment.model.js";

// Lead assignedTo -> User
Lead.belongsTo(User, {
    as: "assignedTo",
    foreignKey: { name: "assignedToId", allowNull: true }
});
User.hasMany(Lead, { foreignKey: "assignedToId", as: "leads" });

// Client original lead
Client.belongsTo(Lead, { as: "originalLead", foreignKey: "originalLeadId" });

// Client <-> Staff (many-to-many)
const ClientStaff = sequelize.define(
    "ClientStaff",
    {},
    { tableName: "client_staff", timestamps: false }
);
Client.belongsToMany(User, {
    through: ClientStaff,
    as: "staff",
    foreignKey: "clientId",
    otherKey: "staffId"
});
User.belongsToMany(Client, {
    through: ClientStaff,
    as: "clients",
    foreignKey: "staffId",
    otherKey: "clientId"
});

// Project belongsTo Client
Project.belongsTo(Client, {
    as: "client",
    foreignKey: { name: "clientId", allowNull: false }
});
Client.hasMany(Project, { foreignKey: "clientId", as: "projects" });

// Project <-> Staff (many-to-many)
const ProjectStaff = sequelize.define(
    "ProjectStaff",
    {},
    { tableName: "project_staff", timestamps: false }
);
Project.belongsToMany(User, {
    through: ProjectStaff,
    as: "staff",
    foreignKey: "projectId",
    otherKey: "staffId"
});
User.belongsToMany(Project, {
    through: ProjectStaff,
    as: "projects",
    foreignKey: "staffId",
    otherKey: "projectId"
});

// Project comments
ProjectComment.belongsTo(Project, { as: "project", foreignKey: "projectId" });
Project.hasMany(ProjectComment, { foreignKey: "projectId", as: "comments" });

ProjectComment.belongsTo(User, { as: "author", foreignKey: "userId" });
User.hasMany(ProjectComment, { foreignKey: "userId", as: "comments" });

export {
    sequelize,
    User,
    Lead,
    Client,
    Project,
    ProjectComment,
    ClientStaff,
    ProjectStaff
};

