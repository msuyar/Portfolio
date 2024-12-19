// Select navigation buttons and project elements
const navButtons = document.querySelectorAll('#project-nav button');
const projects = document.querySelectorAll('.project');

// Add click event to each button
navButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetProject = button.dataset.project;

    // Hide all projects by removing the 'active' class
    projects.forEach(project => {
      project.classList.remove('active');
    });

    // Show the selected project by adding the 'active' class
    const targetElement = document.getElementById(targetProject);
    if (targetElement) {
      targetElement.classList.add('active');
    }
  });
});

// Default to showing the first project
if (projects.length > 0) {
  projects.forEach(project => project.classList.remove('active'));
  projects[0].classList.add('active');
}

// Toggle the collapsible tab
document.getElementById("skills-toggle").addEventListener("click", function () {
  const content = document.getElementById("skills-content");

  // Toggle visibility
  if (content.style.display === "block") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
  }

  // Change button text if needed (optional)
  this.textContent = content.style.display === "block" ? "Hide Skills" : "Skills";
});