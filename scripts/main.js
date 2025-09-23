const toggle = document.getElementById("theme-toggle");
const body = document.body;

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  toggle.checked = true;
}

toggle.addEventListener("change", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});


//header dissapearing
let lastScrollY = window.scrollY;
    const header = document.getElementById("header");

    window.addEventListener("scroll", () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down
        header.classList.add("hidden");
      } else {
        // scrolling up
        header.classList.remove("hidden");
      }
      lastScrollY = window.scrollY;
    });

//toggle dropdown on click
document.querySelectorAll(".drop-btn").forEach(button => {
  button.addEventListener("click", function (e) {
    e.preventDefault(); // prevent jumping to #projects
    const dropdown = this.parentElement;
    dropdown.classList.toggle("active");
  });
});
