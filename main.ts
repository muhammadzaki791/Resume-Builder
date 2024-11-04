declare var html2pdf: any;

const form = document.getElementById("resume-form") as HTMLFormElement;
const downloadButton = document.querySelector(".download-button") as HTMLButtonElement;
const uploadImageInput = document.getElementById("upload-image") as HTMLInputElement;
const profilePicture = document.getElementById("profile-picture") as HTMLImageElement;
const shareButton = document.querySelector(".share-button") as HTMLButtonElement | null;

// Add event listeners for adding/removing education and experience entries
document.getElementById("add-education-button")?.addEventListener("click", addEducationEntry);
document.getElementById("add-experience-button")?.addEventListener("click", addExperienceEntry);

// Function to add a new education entry
function addEducationEntry() {
    const educationContainer = document.getElementById("education-container") as HTMLElement;
    const educationEntry = document.createElement("div");
    educationEntry.classList.add("education-entry");
    educationEntry.innerHTML = `
        <input type="text" placeholder="Institute" class="education-institute" required>
        <input type="text" placeholder="Degree" class="education-degree" required>
        <button type="button" class="remove-education-button">Remove Education</button>
    `;
    educationContainer.insertBefore(educationEntry, educationContainer.lastElementChild);

    // Add event listener to the remove button
    educationEntry.querySelector(".remove-education-button")?.addEventListener("click", function () {
        educationEntry.remove();
    });
}

// Function to add a new experience entry
function addExperienceEntry() {
    const experienceContainer = document.getElementById("experience-container") as HTMLElement;
    const experienceEntry = document.createElement("div");
    experienceEntry.classList.add("experience-entry");
    experienceEntry.innerHTML = `
        <input type="text" placeholder="Company Name" class="experience-company" required>
        <input type="text" placeholder="Designation" class="experience-designation" required>
        <button type="button" class="remove-experience-button">Remove Experience</button>
    `;
    experienceContainer.insertBefore(experienceEntry, experienceContainer.lastElementChild);

    // Add event listener to the remove button
    experienceEntry.querySelector(".remove-experience-button")?.addEventListener("click", function () {
        experienceEntry.remove();
    });
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get user input values
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const about = (document.getElementById("about") as HTMLTextAreaElement).value;
    const skills = (document.getElementById("skills") as HTMLInputElement).value.split(",");

    // Get education entries
    const educationEntries = document.querySelectorAll(".education-entry");
    const educationData: { institute: string; degree: string }[] = [];
    educationEntries.forEach(entry => {
        const institute = (entry.querySelector(".education-institute") as HTMLInputElement).value;
        const degree = (entry.querySelector(".education-degree") as HTMLInputElement).value;
        educationData.push({ institute, degree });
    });

    // Get experience entries
    const experienceEntries = document.querySelectorAll(".experience-entry");
    const experienceData: { company: string; designation: string }[] = [];
    experienceEntries.forEach(entry => {
        const company = (entry.querySelector(".experience-company") as HTMLInputElement).value;
        const designation = (entry.querySelector(".experience-designation") as HTMLInputElement).value;
        experienceData.push({ company, designation });
    });

    // Populate the preview fields
    (document.getElementById("preview-name") as HTMLElement).innerText = name;
    (document.getElementById("preview-email") as HTMLElement).innerText = email;

    // Populate about section
    const aboutElement = document.getElementById("preview-about")?.getElementsByTagName("p")[0];
    if (aboutElement) {
        aboutElement.innerText = about;
    }

    // Update education preview
    const educationPreview = document.getElementById("preview-education")?.getElementsByTagName("div")[0];
    if (educationPreview) {
        educationPreview.innerHTML = ""; // Clear existing content
        educationData.forEach(({ institute, degree }) => {
            const p = document.createElement("p");
            p.innerText = `${institute}: ${degree}`;
            educationPreview.appendChild(p);
        });
    }

    // Update experience preview
    const experiencePreview = document.getElementById("preview-experience")?.getElementsByTagName("div")[0];
    if (experiencePreview) {
        experiencePreview.innerHTML = ""; // Clear existing content
        experienceData.forEach(({ company, designation }) => {
            const p = document.createElement("p");
            p.innerText = `${company}: ${designation}`;
            experiencePreview.appendChild(p);
        });
    }

    // Update skills
    const skillsList = document.getElementById("preview-skills")?.getElementsByTagName("ul")[0];
    if (skillsList) {
        skillsList.innerHTML = ""; // Clear existing list
        skills.forEach((skill) => {
            const li = document.createElement("li");
            li.textContent = skill.trim();
            skillsList.appendChild(li);
        });
    }

    // Update project list
    const projectsInput = (document.getElementById("projects") as HTMLTextAreaElement)?.value;
    const projects = projectsInput ? projectsInput.split(",") : [];
    const projectsList = document.getElementById("preview-projects")?.getElementsByTagName("ul")[0];
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
    shareButton?.addEventListener("click", () => {
        navigator.clipboard.writeText(uniqueUrl);
        alert("Shareable link copied to clipboard!");
    });
});

// Populate fields from URL if data exists
window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name") || "";
    const email = params.get("email") || "";
    const about = params.get("about") || "";
    const skills = params.get("skills")?.split(",") || [];
    const educationData = JSON.parse(params.get("education") || "[]");
    const experienceData = JSON.parse(params.get("experience") || "[]");
    const projects = params.get("projects")?.split(",") || [];

    if (name || email || about || skills.length || educationData.length || experienceData.length || projects.length) {
        (document.getElementById("preview-name") as HTMLElement).textContent = name;
        (document.getElementById("preview-email") as HTMLElement).textContent = email;
        (document.getElementById("preview-about") as HTMLElement).textContent = about;

        // Populate skills
        const skillsList = document.getElementById("preview-skills")?.getElementsByTagName("ul")[0];
        if (skillsList) {
            skillsList.innerHTML = "";
            skills.forEach((skill) => {
                const li = document.createElement("li");
                li.textContent = skill.trim();
                skillsList.appendChild(li);
            });
        }

        // Populate education data
        const educationPreview = document.getElementById("preview-education")?.getElementsByTagName("div")[0];
        if (educationPreview) {
            educationPreview.innerHTML = "";
            educationData.forEach(({ institute, degree }: { institute: string; degree: string }) => {
                const p = document.createElement("p");
                p.textContent = `${institute}: ${degree}`;
                educationPreview.appendChild(p);
            });
        }

        // Populate experience data
        const experiencePreview = document.getElementById("preview-experience")?.getElementsByTagName("div")[0];
        if (experiencePreview) {
            experiencePreview.innerHTML = "";
            experienceData.forEach(({ company, designation }: { company: string; designation: string }) => {
                const p = document.createElement("p");
                p.textContent = `${company}: ${designation}`;
                experiencePreview.appendChild(p);
            });
        }

        // Populate projects
        const projectsList = document.getElementById("preview-projects")?.getElementsByTagName("ul")[0];
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
uploadImageInput?.addEventListener("change", (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (profilePicture) {
                profilePicture.src = e.target?.result as string;
            }
        };
        reader.readAsDataURL(file);
    }

      let isEditing = false;

  // Selecting buttons
  const editButton = document.querySelector(".edit-button") as HTMLButtonElement | null;
  const saveButton = document.querySelector(".save-button") as HTMLButtonElement | null;

  // Enable editing function
  function enableEditing() {
      isEditing = true;
      const sections = document.querySelectorAll(
          "#resume-content p, #resume-content h2, #resume-content h3, #resume-content ul"
      );

      sections.forEach((section) => {
          section.setAttribute("contenteditable", "true");
          section.classList.add("editable");
      });

      document.getElementById("resume-content")!.style.pointerEvents = "auto";
  }

  // Save changes function
  function saveChanges() {
      if (isEditing) {
          const name = (document.getElementById("preview-name") as HTMLElement).innerText;
          const email = (document.getElementById("preview-email") as HTMLElement).innerText;
          const previewAboutElement = document.getElementById("preview-about")?.getElementsByTagName("p")[0];
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
  editButton?.addEventListener("click", function () {
      if (!isEditing) {
          enableEditing();
      } else {
          alert("You are already in edit mode!");
      }
  });

  saveButton?.addEventListener("click", saveChanges);

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
