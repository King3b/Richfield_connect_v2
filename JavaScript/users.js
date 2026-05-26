// user.js - 4 Users with profile images matching feed assets

const users = [
  {
    userId: "1779721048474jnlyvq",
    name: "Blessings",
    surname: "Marera",
    username: "@blessings",
    email: "marerablessings@gmail.com",
    studentId: "402413918",
    gender: "male",
    campus: "campus2",
    campusName: "Cape Town Campus",
    yearOfStudy: "year3",
    yearName: "BScIT",
    password: "@King4one",
    bio: "Passionate about coding and building scalable web apps. Currently exploring React and Node.js. Open to collaborations! 🚀",
    location: "Cape Town, South Africa",
    github: "github.com/blessingsmarera",
    linkedin: "linkedin.com/in/blessings-marera",
    portfolio: "blessingsmarera.dev",
    hobbies: ["Chess", "Hiking", "Reading tech blogs", "Playing guitar"],
    skills: ["JavaScript", "React", "Node.js", "Python", "MongoDB", "Git"],
    achievements: [
      "Winner - Campus Hackathon 2025",
      "Dean's List 2024",
      "Certified AWS Cloud Practitioner",
    ],
    interests: ["Web Development", "AI", "Open Source", "Cybersecurity"],
    profileImage: "assets/images/user1.jpeg",
    bannerImage: "https://picsum.photos/id/26/1200/300", // nature waterfall
    createdAt: "2026-05-25T14:57:28.474Z",
    lastLogin: "2026-05-26T08:30:00.000Z",
    isActive: true,
  },
  {
    userId: "1779721048475abcxyz",
    name: "Williams",
    surname: "Howdy",
    username: "@WilliamsHowdy",
    email: "williams.howdy@example.com",
    studentId: "415789234",
    gender: "male",
    campus: "campus1",
    campusName: "Johannesburg Campus",
    yearOfStudy: "year2",
    yearName: "BSc Game Development",
    password: "@WilliamGame2025",
    bio: "Game developer in the making. Working on my first indie game! 🎮✨",
    location: "Johannesburg, South Africa",
    github: "github.com/williamshowdy",
    linkedin: "linkedin.com/in/williams-howdy",
    portfolio: "williamsgames.dev",
    hobbies: ["Gaming", "3D Modeling", "Music production", "Streaming"],
    skills: ["C#", "Unity", "Blender", "Photoshop", "Pixel Art"],
    achievements: [
      "Game Jam Winner 2025",
      "Pixel Art Contest Finalist",
      "Built 5+ mini games",
    ],
    interests: ["Game Design", "VR/AR", "Retro Gaming", "Esports"],
    profileImage: "assets/images/user3.png",
    bannerImage: "https://picsum.photos/id/96/1200/300", // gaming setup
    createdAt: "2026-05-20T10:15:00.000Z",
    lastLogin: "2026-05-25T22:45:00.000Z",
    isActive: true,
  },
  {
    userId: "1779721048476defuvw",
    name: "Mousa",
    surname: "TheGoat",
    username: "@MousaTheGoat",
    email: "mousa.goat@example.com",
    studentId: "428367591",
    gender: "male",
    campus: "campus3",
    campusName: "Durban Campus",
    yearOfStudy: "year4",
    yearName: "BSc Computer Science",
    password: "@MousaGOAT24",
    bio: "The GOAT of coding. Full-stack dev, gamer, and content creator. Let's collab! 🐐🔥",
    location: "Durban, South Africa",
    github: "github.com/mousathegoat",
    linkedin: "linkedin.com/in/mousa-thegoat",
    portfolio: "mousathegoat.dev",
    hobbies: ["Football", "Coding challenges", "Content creation", "Anime"],
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Node.js",
      "MongoDB",
    ],
    achievements: [
      "Open Source Contributor of the Year",
      "1000+ GitHub stars",
      "Tech Content Creator (10k+ followers)",
    ],
    interests: ["Web3", "Blockchain", "Streaming", "Tech Reviews"],
    profileImage: "assets/images/user2.png",
    bannerImage: "https://picsum.photos/id/155/1200/300", // mountain view
    createdAt: "2026-05-18T09:30:00.000Z",
    lastLogin: "2026-05-26T01:20:00.000Z",
    isActive: true,
  },
  {
    userId: "1779721048477ghijkl",
    name: "Veronica",
    surname: "TheGoat",
    username: "@VeronicaTheGoat",
    email: "veronica.goat@example.com",
    studentId: "439182746",
    gender: "female",
    campus: "campus2",
    campusName: "Cape Town Campus",
    yearOfStudy: "year1",
    yearName: "BSc Information Systems",
    password: "@VeronicaFirst",
    bio: "Gaming enthusiast and future tech leader. Let's game and grow together! 🎮💪",
    location: "Cape Town, South Africa",
    github: "github.com/veronicathegoat",
    linkedin: "linkedin.com/in/veronica-thegoat",
    portfolio: "",
    hobbies: ["Gaming", "Streaming", "Dance", "Volunteering"],
    skills: [
      "HTML/CSS",
      "JavaScript",
      "UI/UX Basics",
      "Content Creation",
      "Community Management",
    ],
    achievements: [
      "Esports Tournament Winner 2025",
      "Women in Gaming Scholarship",
      "Top Streamer Award",
    ],
    interests: ["Esports", "Game Streaming", "Tech Events", "Mentoring"],
    profileImage: "assets/images/user1.jpeg",
    bannerImage: "https://picsum.photos/id/29/1200/300", // cityscape
    createdAt: "2026-05-22T14:00:00.000Z",
    lastLogin: null,
    isActive: true,
  },
];

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = users;
}

// Helper functions
function getUserById(userId) {
  return users.find((user) => user.userId === userId);
}

function getUserByUsername(username) {
  // Remove @ if present for matching
  const cleanUsername = username.replace("@", "");
  return users.find((user) => user.username.replace("@", "") === cleanUsername);
}

function getAllUsers() {
  return users;
}

// Map of feed usernames to full user objects
function getUserFromFeedUsername(feedUsername) {
  return getUserByUsername(feedUsername);
}

// Example usage
// console.log(getUserByUsername("WilliamsHowdy"));
// console.log(getUserByUsername("MousaTheGoat"));
