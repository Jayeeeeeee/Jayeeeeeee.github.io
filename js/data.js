const SITE = {

  nav: {
    brand: "Jason Alojado",
  },

  /* ---------- hero  ---------- */
  hero: {
    name: "Jason Alojado",
    tagline: "A Bachelor of Science in Information Technology student.",
  },

  /* ---------- about ---------- */
  about: {
    paragraphs: [
      "I am a 4th-year Bachelor of Science in Information Technology student at the University " +
      "of Mindanao, with an interest in web development, networking, hardware maintenance & troubleshooting.",
      "My goal is to learn, grow and gain experience in the industry.",
      "I am a fast learner, and will be willing to take on new challenges."
    ],
    facts: [
      { label: "Degree",    value: "BS Information Technology" },
      { label: "Languages", value: "English, Filipino" }
    ]
  },

  /* ---------- skills ---------- */
  skills: [
    {
      group: "Languages",
      items: ["Visual Basic.NET", "Python", "PHP", "SQL", "HTML", "CSS"]
    },
    {
      group: "Frameworks and libraries",
      items: ["Laravel", "NumPy", "Pandas", "Tailwind", "Bootstrap"]
    },
    {
      group: "Tools",
      items: ["Git", "GitHub", "VS Code", "Visual Studio Insiders", "Figma", "MySQL", "SQLite", "Navicat"]
    },
    {
      group: "Currently learning",
      items: ["React", "TensorFlow"]
    }
  ],

  /* ---------- projects ---------- */
  projects: [
    {
      title: "Pokedex",
      year: "2026",
      description:
        "A fork of the Pokedex single-page application with React, React " +
        "Router and Tailwind CSS, from " +
        "[UM-CCE-Skills-Clinic/react-pokedex](https://github.com/UM-CCE-Skills-Clinic/react-pokedex).",
      tags: ["React", "React Router", "Tailwind CSS"],
      image: "assets/projects/Pokedex.png",
      links: [
        { label: "Source",    url: "https://github.com/Jayeeeeeee/react-pokedex/tree/alojado/pokedex-pull-request" }
      ]
    },
    {
      title: "CliniSys",
      year: "2026",
      description:
        "A school clinic management system with Time Series Forecasting " +
        "using ARIMA to predict future medicine consumption.",
      tags: ["Laravel", "Python", "MySQL"],
      image: "assets/projects/CliniSys.png",
      links: [
        { label: "Live demo", url: "https://CliniSys.online" },
        { label: "Source",    url: "https://github.com/yourname/CliniSys" }
      ]
    },
    {
      title: "Optimum Inn Management System",
      year: "2023",
      description:
        "A simple hotel management system made for Optimum Inn.",
      tags: ["Visual Basic.NET", "SQLite"],
      image: "assets/projects/IMS.png",
      links: [
        { label: "Source",    url: "https://github.com/Jayeeeeeee/Optimum-Inn-Management-System" }
      ]
    }
  ],

  /* ---------- experience and education ---------- */
  experience: [
    {
      date: "Aug 2021 - present",
      role: "Bachelor of Science in Information Technology",
      org: "University of Mindanao",
      current: true
    },
    {
      date: "Aug 2021 - Mar 2022",
      role: "Data Analyst/Data Annotator (Freelance)",
      org: "Remotasks",
      current: false,
      description: "Worked on LIDAR annotation projects for autonomous vehicles."
    }
  ],

  /* ---------- certifications ---------- */
  certifications: [
    {
      name: "Git, GitHub & React.js Training",
      issuer: "University of Mindanao - College of Computing Education",
      date: "September 5, 2026",
      tags: ["Git", "GitHub", "React.js"],
      badge: "assets/certs/GitTraining.png",
      certificate: "assets/certs/GitTraining.png",
      icon: "\u25C6"
    },
    {
      name: "Computer Hardware Basics",
      issuer: "Cisco",
      date: "February 8, 2026",
      tags: ["Device Maintenance", "Laptops", "Mobile Devices", "Personal Computers"],
      badge: "assets/certs/computer-hardware-basics.png",
      certificate: "assets/certs/ComputerHardwareBasics.png",
      icon: "\u25B2",
      url: "https://www.credly.com/badges/332474f9-bbd7-4c64-b44f-48fa76fa948d/public_url"
    },
    {
      name: "IT Specialist - Cybersecurity",
      issuer: "Certiport (Pearson VUE)",
      date: "March 13, 2025",
      tags: ["Cybersecurity", "Ethical Hacking", "Information Security", "Cyber Security",
        "EC-Council", "Hacking", "Security Analyst"],
      badge: "assets/certs/it-specialist-cybersecurity.png",
      certificate: "assets/certs/Cybersecurity.png",
      icon: "\u25B2",
      url: "https://www.credly.com/badges/1c8f4c36-5a24-41e0-9300-4aa83841d3a0/public_url"
    },
    {
      name: "IT Specialist - Network Security",
      issuer: "Certiport (Pearson VUE)",
      date: "December 18, 2024",
      tags: ["Network Security", "Operating System Security", "Security Layers", 
        "Security Software"],
      badge: "assets/certs/it-specialist-network-security.png",
      certificate: "assets/certs/Network Security.png",
      icon: "\u25B2",
      url: "https://www.credly.com/badges/3500159a-955f-406a-8f47-39988ed35dd6/public_url"
    },
    {
      name: "IT Specialist - Networking",
      issuer: "Certiport (Pearson VUE)",
      date: "March 12, 2024",
      tags: ["Network Security", "Wide Area Networks", "Basic Networking Infastructure", 
        "Internet Protocol", "Local Area Networking", "OSI Model", "Wired And Wireless Networks"],
      badge: "assets/certs/it-specialist-networking.png",
      certificate: "assets/certs/Networking.png",
      icon: "\u25CF",
      url: "https://www.credly.com/badges/2af5e03c-9e0c-4f23-8ff6-ef1ce0fabc09/public_url"
    },
    {
      name: "IT Specialist - HTML and CSS",
      issuer: "Certiport (Pearson VUE)",
      date: "December 7, 2023",
      tags: ["HTML5", "CSS", "HTML"],
      badge: "assets/certs/it-specialist-html-and-css.png",
      certificate: "assets/certs/HTML and CSS.png",
      icon: "\u25C6",
      url: "https://www.credly.com/badges/807c8335-fe24-42da-afaa-1dbcee783958/public_url"
    }
  ],

  /* ---------- contact ---------- */
  contact: {
    pitch:
      "I am looking for an internship opportunity, where I can learn, apply " +
      "my skills to a real-world project, and gain valuable experience in the industry. " +
      "The fastest way to reach me is by email.",
    email: "jayealojado@gmail.com",
    resume: "assets/resume.pdf",
    socials: [
      { label: "GitHub",   url: "https://github.com/Jayeeeeeee" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/jason-alojado-28159b388/" },
      { label: "Facebook", url: "https://www.facebook.com/Jayeee.pepeg" }
    ]
  }
};
