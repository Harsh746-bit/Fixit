/**
 * MongoDB Shell Initialization Script
 * Practical 07: Create Database and Collection
 * 
 * Usage in mongosh:
 *   mongosh < mongo-init.js
 * or in mongosh interactive shell:
 *   load("mongo-init.js")
 */

// 1. Switch to or create database 'fixit_campus_db'
db = db.getSiblingDB('fixit_campus_db');

print("--> Switched to database: " + db.getName());

// 2. Create collection 'maintenance_issues' with schema validation
db.createCollection("maintenance_issues", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "category", "location", "description", "reporterName", "reporterEmail"],
            properties: {
                title: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                category: {
                    enum: ["Electrical", "Plumbing", "HVAC", "Furniture", "Internet", "Civil", "General"],
                    description: "can only be one of the enum values and is required"
                },
                location: {
                    bsonType: "string",
                    description: "campus location string"
                },
                priority: {
                    enum: ["Low", "Medium", "High", "Critical"]
                },
                status: {
                    enum: ["Pending", "In Progress", "Resolved"]
                },
                reporterEmail: {
                    bsonType: "string",
                    pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
                }
            }
        }
    }
});

print("--> Collection 'maintenance_issues' created with JSON Schema validation.");

// 3. Create index on ticketId
db.maintenance_issues.createIndex({ ticketId: 1 }, { unique: true, sparse: true });
db.maintenance_issues.createIndex({ category: 1, status: 1 });

print("--> Indexes created on { ticketId } and { category, status }.");

// 4. Insert Initial Document
db.maintenance_issues.insertOne({
    ticketId: "FIX-2001",
    title: "Overhead Projector Fan Malfunction",
    category: "Electrical",
    location: "Lecture Hall 101, Block B",
    priority: "High",
    status: "Pending",
    description: "Projector shuts down automatically every 15 minutes due to thermal fan failure.",
    reporterName: "Dr. Aris Thorne",
    reporterEmail: "aris.thorne@campus.edu",
    reporterPhone: "9876543210",
    createdAt: new Date(),
    updatedAt: new Date()
});

print("--> Sample initial document inserted successfully.");
print("--> Practical 07 MongoDB setup complete!");
