"use strict";
// declare var html2pdf: any;
var _a, _b;
const form = document.getElementById("resume-form");
const downloadButton = document.querySelector(".download-button");
const uploadImageInput = document.getElementById("upload-image");
const profilePicture = document.getElementById("profile-picture");
const shareButton = document.querySelector(".share-button");
// Add event listeners for adding/removing education and experience entries
(_a = document.getElementById("add-education-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", addEducationEntry);
(_b = document.getElementById("add-experience-button")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", addExperienceEntry);
// Function to add a new education entry
function addEducationEntry() {
    var _a;
    const educationContainer = document.getElementById("education-container");
    const educationEntry = document.createElement("div");
    educationEntry.classList.add("education-entry");
    educationEntry.innerHTML = `
        <input type="text" placeholder="Institute" class="education-institute" required>
        <input type="text" placeholder="Degree" class="education-degree" required>
        <button type="button" class="remove-education-button">Remove Education</button>
    `;
    educationContainer.insertBefore(educationEntry, educationContainer.lastElementChild);
    // Add event listener to the remove button
    (_a = educationEntry.querySelector(".remove-education-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        educationEntry.remove();
    });
}
// Function to add a new experience entry
function addExperienceEntry() {
    var _a;
    const experienceContainer = document.getElementById("experience-container");
    const experienceEntry = document.createElement("div");
    experienceEntry.classList.add("experience-entry");
    experienceEntry.innerHTML = `
        <input type="text" placeholder="Company Name" class="experience-company" required>
        <input type="text" placeholder="Designation" class="experience-designation" required>
        <button type="button" class="remove-experience-button">Remove Experience</button>
    `;
    experienceContainer.insertBefore(experienceEntry, experienceContainer.lastElementChild);
    // Add event listener to the remove button
    (_a = experienceEntry.querySelector(".remove-experience-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        experienceEntry.remove();
    });
}
form.addEventListener("submit", function (event) {
    var _a, _b, _c, _d, _e, _f;
    event.preventDefault();
    // Get user input values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const about = document.getElementById("about").value;
    const skills = document.getElementById("skills").value.split(",");
    // Get education entries
    const educationEntries = document.querySelectorAll(".education-entry");
    const educationData = [];
    educationEntries.forEach(entry => {
        const institute = entry.querySelector(".education-institute").value;
        const degree = entry.querySelector(".education-degree").value;
        educationData.push({ institute, degree });
    });
    // Get experience entries
    const experienceEntries = document.querySelectorAll(".experience-entry");
    const experienceData = [];
    experienceEntries.forEach(entry => {
        const company = entry.querySelector(".experience-company").value;
        const designation = entry.querySelector(".experience-designation").value;
        experienceData.push({ company, designation });
    });
    // Populate the preview fields
    document.getElementById("preview-name").innerText = name;
    document.getElementById("preview-email").innerText = email;
    // Populate about section
    const aboutElement = (_a = document.getElementById("preview-about")) === null || _a === void 0 ? void 0 : _a.getElementsByTagName("p")[0];
    if (aboutElement) {
        aboutElement.innerText = about;
    }
    // Update education preview
    const educationPreview = (_b = document.getElementById("preview-education")) === null || _b === void 0 ? void 0 : _b.getElementsByTagName("div")[0];
    if (educationPreview) {
        educationPreview.innerHTML = ""; // Clear existing content
        educationData.forEach(({ institute, degree }) => {
            const p = document.createElement("p");
            p.innerText = `${institute}: ${degree}`;
            educationPreview.appendChild(p);
        });
    }
    // Update experience preview
    const experiencePreview = (_c = document.getElementById("preview-experience")) === null || _c === void 0 ? void 0 : _c.getElementsByTagName("div")[0];
    if (experiencePreview) {
        experiencePreview.innerHTML = ""; // Clear existing content
        experienceData.forEach(({ company, designation }) => {
            const p = document.createElement("p");
            p.innerText = `${company}: ${designation}`;
            experiencePreview.appendChild(p);
        });
    }
    // Update skills
    const skillsList = (_d = document.getElementById("preview-skills")) === null || _d === void 0 ? void 0 : _d.getElementsByTagName("ul")[0];
    if (skillsList) {
        skillsList.innerHTML = ""; // Clear existing list
        skills.forEach((skill) => {
            const li = document.createElement("li");
            li.textContent = skill.trim();
            skillsList.appendChild(li);
        });
    }
    // Update project list
    const projectsInput = (_e = document.getElementById("projects")) === null || _e === void 0 ? void 0 : _e.value;
    const projects = projectsInput ? projectsInput.split(",") : [];
    const projectsList = (_f = document.getElementById("preview-projects")) === null || _f === void 0 ? void 0 : _f.getElementsByTagName("ul")[0];
    if (projectsList) {
        projectsList.innerHTML = ""; // Clear existing list
        projects.forEach((project) => {
            const li = document.createElement("li");
            li.textContent = project.trim();
            projectsList.appendChild(li);
        });
    }
    // Generate shareable link
    const queryParams = new URLSearchParams();
    queryParams.set("name", name);
    queryParams.set("email", email);
    queryParams.set("about", about);
    queryParams.set("skills", skills.join(","));
    queryParams.set("education", JSON.stringify(educationData));
    queryParams.set("experience", JSON.stringify(experienceData));
    queryParams.set("projects", projects.join(","));
    const uniqueUrl = `${window.location.origin}?${queryParams.toString()}`;
    window.history.replaceState(null, "", `?${queryParams.toString()}`);
    // Set shareable link in the clipboard
    shareButton === null || shareButton === void 0 ? void 0 : shareButton.addEventListener("click", () => {
        navigator.clipboard.writeText(uniqueUrl);
        alert("Shareable link copied to clipboard!");
    });
});
// Populate fields from URL if data exists
window.addEventListener("DOMContentLoaded", () => {
    var _a, _b, _c, _d, _e, _f;
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name") || "";
    const email = params.get("email") || "";
    const about = params.get("about") || "";
    const skills = ((_a = params.get("skills")) === null || _a === void 0 ? void 0 : _a.split(",")) || [];
    const educationData = JSON.parse(params.get("education") || "[]");
    const experienceData = JSON.parse(params.get("experience") || "[]");
    const projects = ((_b = params.get("projects")) === null || _b === void 0 ? void 0 : _b.split(",")) || [];
    if (name || email || about || skills.length || educationData.length || experienceData.length || projects.length) {
        document.getElementById("preview-name").textContent = name;
        document.getElementById("preview-email").textContent = email;
        document.getElementById("preview-about").textContent = about;
        // Populate skills
        const skillsList = (_c = document.getElementById("preview-skills")) === null || _c === void 0 ? void 0 : _c.getElementsByTagName("ul")[0];
        if (skillsList) {
            skillsList.innerHTML = "";
            skills.forEach((skill) => {
                const li = document.createElement("li");
                li.textContent = skill.trim();
                skillsList.appendChild(li);
            });
        }
        // Populate education data
        const educationPreview = (_d = document.getElementById("preview-education")) === null || _d === void 0 ? void 0 : _d.getElementsByTagName("div")[0];
        if (educationPreview) {
            educationPreview.innerHTML = "";
            educationData.forEach(({ institute, degree }) => {
                const p = document.createElement("p");
                p.textContent = `${institute}: ${degree}`;
                educationPreview.appendChild(p);
            });
        }
        // Populate experience data
        const experiencePreview = (_e = document.getElementById("preview-experience")) === null || _e === void 0 ? void 0 : _e.getElementsByTagName("div")[0];
        if (experiencePreview) {
            experiencePreview.innerHTML = "";
            experienceData.forEach(({ company, designation }) => {
                const p = document.createElement("p");
                p.textContent = `${company}: ${designation}`;
                experiencePreview.appendChild(p);
            });
        }
        // Populate projects
        const projectsList = (_f = document.getElementById("preview-projects")) === null || _f === void 0 ? void 0 : _f.getElementsByTagName("ul")[0];
        if (projectsList) {
            projectsList.innerHTML = "";
            projects.forEach((project) => {
                const li = document.createElement("li");
                li.textContent = project.trim();
                projectsList.appendChild(li);
            });
        }
    }
});
// Upload profile image
uploadImageInput === null || uploadImageInput === void 0 ? void 0 : uploadImageInput.addEventListener("change", (event) => {
    var _a;
    const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            var _a;
            if (profilePicture) {
                profilePicture.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            }
        };
        reader.readAsDataURL(file);
    }
    let isEditing = false;
    // Selecting buttons
    const editButton = document.querySelector(".edit-button");
    const saveButton = document.querySelector(".save-button");
    // Enable editing function
    function enableEditing() {
        isEditing = true;
        const sections = document.querySelectorAll("#resume-content p, #resume-content h2, #resume-content h3, #resume-content ul");
        sections.forEach((section) => {
            section.setAttribute("contenteditable", "true");
            section.classList.add("editable");
        });
        document.getElementById("resume-content").style.pointerEvents = "auto";
    }
    // Save changes function
    function saveChanges() {
        var _a;
        if (isEditing) {
            const name = document.getElementById("preview-name").innerText;
            const email = document.getElementById("preview-email").innerText;
            const previewAboutElement = (_a = document.getElementById("preview-about")) === null || _a === void 0 ? void 0 : _a.getElementsByTagName("p")[0];
            const about = previewAboutElement ? previewAboutElement.innerText : "";
            // Optional: you can log these to verify
            console.log("Saved Resume Data:", { name, email, about });
            alert("Resume changes saved successfully!");
            // Disable editing
            disableEditing();
        }
    }
    // Disable editing function
    function disableEditing() {
        isEditing = false;
        const sections = document.querySelectorAll("#resume-content .editable");
        sections.forEach((section) => {
            section.setAttribute("contenteditable", "false");
            section.classList.remove("editable");
        });
    }
    // Adding event listeners for edit and save buttons
    editButton === null || editButton === void 0 ? void 0 : editButton.addEventListener("click", function () {
        if (!isEditing) {
            enableEditing();
        }
        else {
            alert("You are already in edit mode!");
        }
    });
    saveButton === null || saveButton === void 0 ? void 0 : saveButton.addEventListener("click", saveChanges);
    // Download functionality
    downloadButton.addEventListener("click", function () {
        const resumeContent = document.getElementById("resume-content");
        const opt = {
            margin: 0.5,
            filename: 'resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        if (resumeContent) {
            html2pdf().from(resumeContent).set(opt).save();
        }
    });
});
