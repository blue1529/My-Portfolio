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

//hamburger
const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('show');
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

//typing text
    const text = "| Computer Systems & Security Student | Web Developer | Ethical Hacking Enthusiast |";
    let index = 0;

    function typeEffect() {
      if (index < text.length) {
        document.getElementById("text").innerHTML += text.charAt(index);
        index++;
        setTimeout(typeEffect, 120); // speed (ms)
      }
    }

    window.onload = typeEffect;
//skills %  
    const skills = document.querySelectorAll(".skill");

  skills.forEach(skill => {
    const fill = skill.querySelector(".fill");
    const bar = skill.querySelector(".bar");
    const percent = skill.getAttribute("data-percent");

    // Show on hover
    skill.addEventListener("mouseenter", () => {
      bar.style.display = "block";
      setTimeout(() => { fill.style.width = percent + "%"; }, 50);
    });

    skill.addEventListener("mouseleave", () => {
      fill.style.width = "0";
      setTimeout(() => { bar.style.display = "none"; }, 500);
    });

    // Also allow click to "lock" it open
    skill.addEventListener("click", () => {
      if (bar.style.display === "block" && fill.style.width === percent + "%") {
        fill.style.width = "0";
        setTimeout(() => { bar.style.display = "none"; }, 500);
      } else {
        bar.style.display = "block";
        setTimeout(() => { fill.style.width = percent + "%"; }, 50);
      }
    });
  });