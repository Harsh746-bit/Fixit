/**
 * ==============================================================================
 * FixIt — Smart Campus Maintenance Management System
 * PRACTICAL 02: Vanilla JavaScript, Array Data Structure, JSON & DOM Operations
 * ==============================================================================
 * 
 * Demonstrates:
 * 1. JavaScript Array and Object data structures
 * 2. JSON Serialization (JSON.stringify) and Deserialization (JSON.parse)
 * 3. Client-side form validation with RegEx (Email and 10-digit Indian Mobile)
 * 4. DOM Manipulation (Creating elements, updating counts, dynamic cards)
 * 5. Event Listeners (submit, input, change, click)
 * 6. Dynamic searching and multi-attribute filtering
 * 7. Live statistics calculations
 * 8. Status mutation & Modal-based deletion
 */

// ==========================================
// 1. INITIAL IN-MEMORY ARRAY OF ISSUES
// ==========================================
let issues = [
    {
        id: "FIX-1001",
        name: "Rahul Sharma",
        email: "rahul.sharma@campus.edu",
        category: "Electrical",
        location: "Block A - Room 204",
        priority: "High",
        description: "Ceiling fan is making loud grinding noise and not rotating at full speed during lectures.",
        status: "Pending",
        date: "2026-09-28",
        contact: "9876543210"
    },
    {
        id: "FIX-1002",
        name: "Ananya Patel",
        email: "ananya.p@campus.edu",
        category: "Internet",
        location: "Computer Lab 3 - 2nd Floor",
        priority: "High",
        description: "Students facing frequent disconnects from Campus-Secure access point.",
        status: "In Progress",
        date: "2026-09-27",
        contact: "9812345678"
    },
    {
        id: "FIX-1003",
        name: "Vikram Mehta",
        email: "vikram.m@campus.edu",
        category: "Plumbing",
        location: "Hostel Block B - Ground Floor",
        priority: "Critical",
        description: "Continuous water leakage from pipe joint causing slippery corridor floor.",
        status: "Resolved",
        date: "2026-09-26",
        contact: "9711223344"
    },
    {
        id: "FIX-1004",
        name: "Sneha Reddy",
        email: "sneha.r@campus.edu",
        category: "Furniture",
        location: "Block C - Room 102",
        priority: "Medium",
        description: "Wooden armrest on student desk is fractured and has exposed sharp screw edges.",
        status: "Resolved",
        date: "2026-09-25",
        contact: ""
    },
    {
        id: "FIX-1005",
        name: "Arjun Nair",
        email: "arjun.nair@campus.edu",
        category: "Equipment",
        location: "Physics Lab - Station 4",
        priority: "Medium",
        description: "Cathode Ray Oscilloscope displays noisy waveform; requires potentiometer recalibration.",
        status: "In Progress",
        date: "2026-09-24",
        contact: "9988776655"
    },
    {
        id: "FIX-1006",
        name: "Pooja Gupta",
        email: "pooja.g@campus.edu",
        category: "Cleaning",
        location: "Main Building - 1st Floor Corridor",
        priority: "Low",
        description: "Recycling bin overflowing after faculty seminar. Requires prompt sanitation disposal.",
        status: "Resolved",
        date: "2026-09-23",
        contact: ""
    }
];

// Reference ID sequence counter (auto-increment)
let nextIdNumber = 1007;
let pendingDeleteId = null;

// ==========================================
// 2. DOM ELEMENT REFERENCES
// ==========================================
const form = document.getElementById("issue-form");
const inputName = document.getElementById("input-name");
const inputEmail = document.getElementById("input-email");
const inputCategory = document.getElementById("input-category");
const inputPriority = document.getElementById("input-priority");
const inputLocation = document.getElementById("input-location");
const inputContact = document.getElementById("input-contact");
const inputDescription = document.getElementById("input-description");

const issuesContainer = document.getElementById("issues-container");
const emptyState = document.getElementById("empty-state");
const visibleCount = document.getElementById("visible-count");
const autoNextId = document.getElementById("auto-next-id");

// Statistics DOM
const statTotal = document.getElementById("stat-total");
const statPending = document.getElementById("stat-pending");
const statInProgress = document.getElementById("stat-inprogress");
const statResolved = document.getElementById("stat-resolved");

// Search and Filter Controls
const filterSearch = document.getElementById("filter-search");
const filterCategory = document.getElementById("filter-category");
const filterStatus = document.getElementById("filter-status");
const filterPriority = document.getElementById("filter-priority");
const btnClearFilters = document.getElementById("btn-clear-filters");
const btnEmptyClear = document.getElementById("btn-empty-clear");
const filterIndicator = document.getElementById("filter-indicator");

// JSON Inspector DOM
const jsonDisplay = document.getElementById("json-display");
const jsonByteSize = document.getElementById("json-byte-size");
const btnRefreshJson = document.getElementById("btn-refresh-json");
const btnCopyJson = document.getElementById("btn-copy-json");

// Modal and Toast
const deleteModalElement = document.getElementById("deleteConfirmModal");
const deleteTicketId = document.getElementById("delete-ticket-id");
const btnConfirmDelete = document.getElementById("btn-confirm-delete");
const actionToastElement = document.getElementById("actionToast");
const toastTitle = document.getElementById("toast-title");
const toastMessage = document.getElementById("toast-message");

let deleteModalInstance = null;
let toastInstance = null;

// ==========================================
// 3. JSON SERIALIZATION & DESERIALIZATION
// ==========================================
/**
 * Explicitly demonstrates JSON.stringify() and JSON.parse()
 * Updates the JSON inspector box for viva demonstration.
 */
function updateJsonInspector() {
    // 1. Serialization: Convert JavaScript Array to JSON string
    const jsonData = JSON.stringify(issues, null, 2);

    // 2. Deserialization: Verify conversion back to JS Array
    const parsedData = JSON.parse(jsonData);

    // 3. Render into Inspector element
    if (jsonDisplay) {
        jsonDisplay.textContent = jsonData;
    }
    if (jsonByteSize) {
        const bytes = new Blob([jsonData]).size;
        jsonByteSize.textContent = `${bytes} bytes (${parsedData.length} records)`;
    }
}

// ==========================================
// 4. STATISTICS CALCULATION
// ==========================================
/**
 * Dynamically computes statistics using Array methods (filter/reduce)
 */
function updateStatistics() {
    const total = issues.length;
    const pending = issues.filter(issue => issue.status === "Pending").length;
    const inProgress = issues.filter(issue => issue.status === "In Progress").length;
    const resolved = issues.filter(issue => issue.status === "Resolved").length;

    statTotal.textContent = total;
    statPending.textContent = pending;
    statInProgress.textContent = inProgress;
    statResolved.textContent = resolved;

    if (autoNextId) {
        autoNextId.textContent = `Next ID: FIX-${nextIdNumber}`;
    }
}

// ==========================================
// 5. CLIENT-SIDE VALIDATION ENGINE
// ==========================================
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const indianMobileRegex = /^[6-9]\d{9}$/;

function setFieldValidation(inputElement, isValid, errorMessage = "") {
    const errorDiv = document.getElementById(`error-${inputElement.id.replace("input-", "")}`);
    if (isValid) {
        inputElement.classList.remove("is-invalid");
        inputElement.classList.add("is-valid");
        if (errorDiv) errorDiv.style.display = "none";
    } else {
        inputElement.classList.remove("is-valid");
        inputElement.classList.add("is-invalid");
        if (errorDiv) {
            if (errorMessage) errorDiv.textContent = errorMessage;
            errorDiv.style.display = "block";
        }
    }
    return isValid;
}

function validateForm() {
    let isValid = true;

    // Student Name: Required
    if (!inputName.value.trim()) {
        isValid = setFieldValidation(inputName, false, "Please enter your name.") && isValid;
    } else {
        setFieldValidation(inputName, true);
    }

    // Email: Required + Format
    const emailVal = inputEmail.value.trim();
    if (!emailVal) {
        isValid = setFieldValidation(inputEmail, false, "Please enter your email address.") && isValid;
    } else if (!emailRegex.test(emailVal)) {
        isValid = setFieldValidation(inputEmail, false, "Please enter a valid email address (e.g. name@campus.edu).") && isValid;
    } else {
        setFieldValidation(inputEmail, true);
    }

    // Category: Required
    if (!inputCategory.value) {
        isValid = setFieldValidation(inputCategory, false, "Please select an issue category.") && isValid;
    } else {
        setFieldValidation(inputCategory, true);
    }

    // Priority: Required
    if (!inputPriority.value) {
        isValid = setFieldValidation(inputPriority, false, "Please select an issue priority.") && isValid;
    } else {
        setFieldValidation(inputPriority, true);
    }

    // Location: Required
    if (!inputLocation.value.trim()) {
        isValid = setFieldValidation(inputLocation, false, "Please specify the campus location or room number.") && isValid;
    } else {
        setFieldValidation(inputLocation, true);
    }

    // Contact: Optional, but if present must be Indian 10-digit mobile
    const contactVal = inputContact.value.trim();
    if (contactVal && !indianMobileRegex.test(contactVal)) {
        isValid = setFieldValidation(inputContact, false, "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).") && isValid;
    } else {
        setFieldValidation(inputContact, true);
    }

    // Description: Required + Minimum 10 characters
    const descVal = inputDescription.value.trim();
    if (!descVal) {
        isValid = setFieldValidation(inputDescription, false, "Please provide a detailed description.") && isValid;
    } else if (descVal.length < 10) {
        isValid = setFieldValidation(inputDescription, false, `Description must contain at least 10 characters (currently ${descVal.length}).`) && isValid;
    } else {
        setFieldValidation(inputDescription, true);
    }

    return isValid;
}

// Clear individual field errors on user input
[inputName, inputEmail, inputLocation, inputContact, inputDescription].forEach(input => {
    input.addEventListener("input", () => {
        input.classList.remove("is-invalid");
        const errorDiv = document.getElementById(`error-${input.id.replace("input-", "")}`);
        if (errorDiv) errorDiv.style.display = "none";
    });
});

[inputCategory, inputPriority].forEach(select => {
    select.addEventListener("change", () => {
        select.classList.remove("is-invalid");
        const errorDiv = document.getElementById(`error-${select.id.replace("input-", "")}`);
        if (errorDiv) errorDiv.style.display = "none";
    });
});

// ==========================================
// 6. DYNAMIC ISSUE RENDERING (DOM)
// ==========================================
function getPriorityBadgeClass(priority) {
    switch (priority) {
        case "Critical": return "badge-priority-Critical";
        case "High": return "badge-priority-High";
        case "Medium": return "badge-priority-Medium";
        case "Low": return "badge-priority-Low";
        default: return "bg-secondary text-white";
    }
}

function getStatusBadgeClass(status) {
    switch (status) {
        case "Pending": return "badge-status-Pending";
        case "In Progress": return "badge-status-InProgress";
        case "Resolved": return "badge-status-Resolved";
        default: return "bg-light text-slate";
    }
}

function renderIssues(itemsToRender) {
    issuesContainer.innerHTML = "";
    visibleCount.textContent = itemsToRender.length;

    if (itemsToRender.length === 0) {
        emptyState.classList.remove("d-none");
        return;
    } else {
        emptyState.classList.add("d-none");
    }

    itemsToRender.forEach(issue => {
        const card = document.createElement("article");
        card.className = "issue-card";
        card.setAttribute("data-id", issue.id);

        card.innerHTML = `
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-charcoal font-monospace">${issue.id}</span>
                    <span class="badge ${getPriorityBadgeClass(issue.priority)}">${issue.priority} Priority</span>
                    <span class="badge bg-light text-slate border">${issue.category}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="badge ${getStatusBadgeClass(issue.status)} font-semibold">${issue.status}</span>
                </div>
            </div>

            <h4 class="h6 fw-bold text-charcoal mb-1">${issue.location}</h4>
            <p class="small text-secondary mb-3">${escapeHtml(issue.description)}</p>

            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 pt-2 border-top border-light-gray small">
                <div class="text-slate">
                    <i class="bi bi-person-circle me-1"></i>${escapeHtml(issue.name)} &bull; 
                    <span class="text-secondary">${issue.date}</span>
                    ${issue.contact ? `&bull; <i class="bi bi-telephone me-1"></i>+91 ${issue.contact}` : ""}
                </div>

                <div class="d-flex align-items-center gap-2">
                    <!-- Status update dropdown -->
                    <label for="status-${issue.id}" class="visually-hidden">Update Status</label>
                    <select class="form-select form-select-sm status-select" id="status-${issue.id}" onchange="handleStatusChange('${issue.id}', this.value)">
                        <option value="Pending" ${issue.status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="In Progress" ${issue.status === "In Progress" ? "selected" : ""}>In Progress</option>
                        <option value="Resolved" ${issue.status === "Resolved" ? "selected" : ""}>Resolved</option>
                    </select>

                    <!-- Delete button triggering Modal -->
                    <button type="button" class="btn btn-outline-danger btn-sm px-2 py-1" onclick="openDeleteModal('${issue.id}')" title="Delete ticket">
                        <i class="bi bi-trash3"></i>
                    </button>
                </div>
            </div>
        `;

        issuesContainer.appendChild(card);
    });
}

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
}

// ==========================================
// 7. FILTERING AND SEARCHING LOGIC
// ==========================================
function filterAndDisplayIssues() {
    const searchTerm = filterSearch.value.trim().toLowerCase();
    const category = filterCategory.value;
    const status = filterStatus.value;
    const priority = filterPriority.value;

    const filtered = issues.filter(issue => {
        // Search filter across ID, category, location, and description
        const matchesSearch = !searchTerm ||
            issue.id.toLowerCase().includes(searchTerm) ||
            issue.category.toLowerCase().includes(searchTerm) ||
            issue.location.toLowerCase().includes(searchTerm) ||
            issue.description.toLowerCase().includes(searchTerm) ||
            issue.name.toLowerCase().includes(searchTerm);

        // Dropdown filters
        const matchesCategory = (category === "All" || issue.category === category);
        const matchesStatus = (status === "All" || issue.status === status);
        const matchesPriority = (priority === "All" || issue.priority === priority);

        return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    });

    const isFiltered = (searchTerm || category !== "All" || status !== "All" || priority !== "All");
    filterIndicator.textContent = isFiltered ? "Active filters applied" : "Showing all items";

    renderIssues(filtered);
}

// Attach filter listeners
filterSearch.addEventListener("input", filterAndDisplayIssues);
filterCategory.addEventListener("change", filterAndDisplayIssues);
filterStatus.addEventListener("change", filterAndDisplayIssues);
filterPriority.addEventListener("change", filterAndDisplayIssues);

function clearAllFilters() {
    filterSearch.value = "";
    filterCategory.value = "All";
    filterStatus.value = "All";
    filterPriority.value = "All";
    filterAndDisplayIssues();
    showToast("Filters Reset", "Search query and filter dropdowns have been cleared.");
}

btnClearFilters.addEventListener("click", clearAllFilters);
btnEmptyClear.addEventListener("click", clearAllFilters);

// ==========================================
// 8. FORM SUBMISSION & ARRAY MUTATION
// ==========================================
form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) {
        showToast("Validation Error", "Please review and fix highlighted form errors.", "danger");
        return;
    }

    const todayDate = new Date().toISOString().split("T")[0];
    const generatedId = `FIX-${nextIdNumber++}`;

    const newIssue = {
        id: generatedId,
        name: inputName.value.trim(),
        email: inputEmail.value.trim(),
        category: inputCategory.value,
        location: inputLocation.value.trim(),
        priority: inputPriority.value,
        description: inputDescription.value.trim(),
        status: "Pending",
        date: todayDate,
        contact: inputContact.value.trim()
    };

    // Add to beginning of Array
    issues.unshift(newIssue);

    // Reset Form fields & validation classes
    form.reset();
    form.querySelectorAll(".is-valid").forEach(el => el.classList.remove("is-valid"));

    // Synchronize UI, Statistics & JSON Inspector
    updateStatistics();
    filterAndDisplayIssues();
    updateJsonInspector();

    // Show Success Toast
    showToast("Issue Reported Successfully", `Reference ID: ${generatedId}`, "success");

    // Smooth scroll to issues dashboard
    const dashboardSection = document.getElementById("dashboard-section");
    if (dashboardSection) {
        dashboardSection.scrollIntoView({ behavior: "smooth" });
    }
});

// ==========================================
// 9. STATUS UPDATE & DELETE OPERATIONS
// ==========================================
window.handleStatusChange = function(issueId, newStatus) {
    const targetIssue = issues.find(item => item.id === issueId);
    if (targetIssue) {
        targetIssue.status = newStatus;
        updateStatistics();
        filterAndDisplayIssues();
        updateJsonInspector();
        showToast("Status Updated", `Ticket ${issueId} marked as "${newStatus}"`);
    }
};

window.openDeleteModal = function(issueId) {
    pendingDeleteId = issueId;
    deleteTicketId.textContent = issueId;
    if (!deleteModalInstance) {
        deleteModalInstance = new bootstrap.Modal(deleteModalElement);
    }
    deleteModalInstance.show();
};

btnConfirmDelete.addEventListener("click", () => {
    if (pendingDeleteId) {
        const index = issues.findIndex(item => item.id === pendingDeleteId);
        if (index !== -1) {
            const deleted = issues.splice(index, 1)[0];
            updateStatistics();
            filterAndDisplayIssues();
            updateJsonInspector();
            showToast("Issue Deleted", `Ticket ${deleted.id} permanently removed from array.`);
        }
        pendingDeleteId = null;
    }
    if (deleteModalInstance) {
        deleteModalInstance.hide();
    }
});

// ==========================================
// 10. TOAST NOTIFICATION UTILITY
// ==========================================
function showToast(title, message, type = "success") {
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    const toastIcon = document.getElementById("toast-icon");
    if (type === "danger") {
        toastIcon.className = "bi bi-exclamation-octagon-fill text-danger fs-5";
    } else {
        toastIcon.className = "bi bi-check-circle-fill text-safety-orange fs-5";
    }

    if (!toastInstance) {
        toastInstance = new bootstrap.Toast(actionToastElement, { delay: 3500 });
    }
    toastInstance.show();
}

// ==========================================
// 11. JSON INSPECTOR CONTROLS
// ==========================================
btnRefreshJson.addEventListener("click", () => {
    updateJsonInspector();
    showToast("JSON Synced", "In-memory array state serialized into JSON inspector.");
});

btnCopyJson.addEventListener("click", () => {
    const jsonData = JSON.stringify(issues, null, 2);
    navigator.clipboard.writeText(jsonData).then(() => {
        showToast("Copied to Clipboard", "JSON array copied successfully.");
    });
});

// ==========================================
// 12. INITIAL APPLICATION BOOTSTRAP
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    updateStatistics();
    renderIssues(issues);
    updateJsonInspector();
});
