export const products = [
  {
    id: 1,
    title: "Calculus Early Transcendentals",
    price: "₹299",
    seller: "Rahul K.",
    condition: "Like New",
    category: "Books",
    image: null,
    description: "8th edition, barely used. No highlights or marks."
  },
  {
    id: 2,
    title: "Wooden Study Table",
    price: "₹1,500",
    seller: "Priya S.",
    condition: "Good",
    category: "Furniture",
    image: null,
    description: "4ft x 2ft study table with drawer. Slight wear on edges."
  },
  {
    id: 3,
    title: "Boat Rockerz 450",
    price: "₹1,200",
    seller: "Arjun M.",
    condition: "Excellent",
    category: "Electronics",
    image: null,
    description: "Wireless headphones, 20hr battery. Used for 2 months."
  },
  {
    id: 4,
    title: "Hero Atlas Cycle",
    price: "₹3,500",
    seller: "Vikram T.",
    condition: "Fair",
    category: "Cycles",
    image: null,
    description: "21 gear mountain bike. Needs a new chain."
  },
  {
    id: 5,
    title: "Classmate Notebook Bundle",
    price: "₹150",
    seller: "Neha G.",
    condition: "New",
    category: "Stationery",
    image: null,
    description: "5 unused 100-page notebooks. Single ruled."
  },
  {
    id: 6,
    title: "Hostel Bed Sheet Set",
    price: "₹450",
    seller: "Amit P.",
    condition: "New",
    category: "Hostel Essentials",
    image: null,
    description: "2 cotton bed sheets + 1 pillow cover. Wash before use."
  },
  {
    id: 7,
    title: "Python Crash Course Book",
    price: "₹499",
    seller: "Sneha R.",
    condition: "Like New",
    category: "Books",
    image: null,
    description: "2nd edition. Perfect for beginners."
  },
  {
    id: 8,
    title: "Desk Lamp LED",
    price: "₹600",
    seller: "Karan J.",
    condition: "Good",
    category: "Electronics",
    image: null,
    description: "USB charging, 3 brightness modes."
  },
  {
    id: 9,
    title: "Plastic Storage Boxes (Set of 3)",
    price: "₹350",
    seller: "Divya L.",
    condition: "New",
    category: "Hostel Essentials",
    image: null,
    description: "Stackable, 20L each. Clear plastic."
  },
  {
    id: 10,
    title: "BTech 2nd Year Notes",
    price: "₹200",
    seller: "Rohit S.",
    condition: "Used",
    category: "Books",
    image: null,
    description: "Complete set for all subjects. Well organized."
  },
  {
    id: 11,
    title: "Hero Sprint Cycle",
    price: "₹2,800",
    seller: "Meera D.",
    condition: "Good",
    category: "Cycles",
    image: null,
    description: "Single speed, well maintained. Great for campus."
  },
  {
    id: 12,
    title: "Geometry Box",
    price: "₹120",
    seller: "Ankit B.",
    condition: "New",
    category: "Stationery",
    image: null,
    description: "Camlin, all instruments included."
  }
];

export const categories = [
  "All",
  "Books",
  "Furniture",
  "Electronics",
  "Cycles",
  "Stationery",
  "Hostel Essentials"
];

export const lostItems = [
  {
    id: 1,
    title: "Blue Water Bottle",
    description: "Milton steel bottle, blue color, left in C-Block canteen.",
    location: "C-Block Canteen",
    date: "2026-07-19",
    status: "lost",
    reporter: "Ananya P.",
    image: null
  },
  {
    id: 2,
    title: "Casio Calculator fx-991",
    description: "Scientific calculator, black, lost in Library 2nd floor.",
    location: "Library 2nd Floor",
    date: "2026-07-18",
    status: "lost",
    reporter: "Ravi K.",
    image: null
  },
  {
    id: 3,
    title: "Red Umbrella",
    description: "Red folding umbrella with a brown handle.",
    location: "Main Auditorium",
    date: "2026-07-17",
    status: "lost",
    reporter: "Neha S.",
    image: null
  },
  {
    id: 4,
    title: "Black Notebook",
    description: "A4 black spiral notebook with physics notes.",
    location: "Physics Lab",
    date: "2026-07-20",
    status: "found",
    reporter: "Tanya M.",
    image: null
  },
  {
    id: 5,
    title: "ID Card - 2024 Batch",
    description: "ID card of student Rohan Desai, CSE department.",
    location: "Parking Lot B",
    date: "2026-07-19",
    status: "found",
    reporter: "Vikas R.",
    image: null
  },
  {
    id: 6,
    title: "Wireless Mouse",
    description: "HP wireless mouse, silver, found in Lab 3.",
    location: "Computer Lab 3",
    date: "2026-07-18",
    status: "found",
    reporter: "Aakash J.",
    image: null
  }
];

export const events = [
  {
    id: 1,
    title: "Tech Fest 2026",
    description: "Annual technical festival with hackathons, workshops, and competitions.",
    date: "2026-08-15",
    time: "9:00 AM",
    location: "Main Auditorium",
    category: "Technical",
    organizer: "CSIT Department",
    image: null,
    registered: 234
  },
  {
    id: 2,
    title: "Cultural Night",
    description: "An evening of music, dance, and drama performances by students.",
    date: "2026-08-20",
    time: "6:00 PM",
    location: "Open Air Theatre",
    category: "Cultural",
    organizer: "Cultural Committee",
    image: null,
    registered: 450
  },
  {
    id: 3,
    title: "Startup Pitch Competition",
    description: "Pitch your startup idea to investors and win seed funding.",
    date: "2026-08-25",
    time: "10:00 AM",
    location: "Innovation Lab",
    category: "Technical",
    organizer: "E-Cell",
    image: null,
    registered: 89
  },
  {
    id: 4,
    title: "Sports Meet",
    description: "Inter-department sports competition including cricket, football, and athletics.",
    date: "2026-09-01",
    time: "7:00 AM",
    location: "Sports Complex",
    category: "Sports",
    organizer: "Sports Department",
    image: null,
    registered: 567
  },
  {
    id: 5,
    title: "Photography Workshop",
    description: "Learn the basics of photography from professional photographers.",
    date: "2026-08-28",
    time: "2:00 PM",
    location: "Media Room",
    category: "Workshop",
    organizer: "Photography Club",
    image: null,
    registered: 120
  },
  {
    id: 6,
    title: "Alumni Meet 2026",
    description: "Networking event with alumni from various batches and industries.",
    date: "2026-09-10",
    time: "11:00 AM",
    location: "Conference Hall",
    category: "Networking",
    organizer: "Alumni Cell",
    image: null,
    registered: 198
  }
];

export const internships = [
  {
    id: 1,
    title: "Software Development Intern",
    company: "TechCorp India",
    location: "Remote",
    duration: "3 months",
    stipend: "₹15,000/month",
    type: "Part-time",
    deadline: "2026-08-10"
  },
  {
    id: 2,
    title: "Data Analyst Intern",
    company: "DataViz Solutions",
    location: "Bangalore",
    duration: "6 months",
    stipend: "₹20,000/month",
    type: "Full-time",
    deadline: "2026-08-15"
  },
  {
    id: 3,
    title: "Marketing Intern",
    company: "BrandBuild Agency",
    location: "Remote",
    duration: "2 months",
    stipend: "₹8,000/month",
    type: "Part-time",
    deadline: "2026-08-05"
  },
  {
    id: 4,
    title: "UI/UX Design Intern",
    company: "CreativeWeb",
    location: "Hyderabad",
    duration: "3 months",
    stipend: "₹12,000/month",
    type: "Full-time",
    deadline: "2026-08-20"
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Aditi Sharma",
    role: "CSE 3rd Year",
    text: "UniHub helped me find a great second-hand laptop within campus. Saved ₹15,000! The community is amazing.",
    avatar: null,
    rating: 5
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "ECE 2nd Year",
    text: "Found my lost ID card within hours of posting. This platform is a lifesaver for hostel students.",
    avatar: null,
    rating: 5
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "ME 4th Year",
    text: "Got my first internship through the opportunities listed here. Highly recommend every student to join!",
    avatar: null,
    rating: 4
  }
];

export const faqs = [
  {
    q: "What is UniHub?",
    a: "UniHub is a student ecosystem connecting you with marketplace, lost & found, events, internships, and clubs — all within your campus."
  },
  {
    q: "Is UniHub free to use?",
    a: "Yes, UniHub is completely free for all students. No hidden charges."
  },
  {
    q: "How do I list an item for sale?",
    a: "Go to the Marketplace section, click 'Add Listing', fill in the details, and your item will be visible to all campus students."
  },
  {
    q: "How do I report a lost item?",
    a: "Navigate to Lost & Found, click 'Report Lost Item', and provide details like description, location, and date."
  },
  {
    q: "Can I edit or delete my listing?",
    a: "Yes, you can manage all your listings from your Dashboard or Profile page."
  }
];

export const dashboardStats = {
  totalListings: 5,
  activeListings: 3,
  eventsAttended: 4,
  lostReports: 2,
  achievements: 3,
  connections: 28
};

export const recentActivity = [
  { id: 1, action: "Listed 'Calculus Book' for sale", time: "2 hours ago", type: "listing" },
  { id: 2, action: "Registered for Tech Fest 2026", time: "5 hours ago", type: "event" },
  { id: 3, action: "Reported lost water bottle", time: "1 day ago", type: "lost" },
  { id: 4, action: "Connected with Priya S.", time: "2 days ago", type: "connection" },
  { id: 5, action: "Bookmarked 'Data Analyst Intern'", time: "3 days ago", type: "bookmark" }
];

export const notifications = [
  { id: 1, title: "New Message", message: "Rahul K. is interested in your Calculus book", time: "30 min ago", read: false },
  { id: 2, title: "Event Reminder", message: "Tech Fest 2026 starts in 2 days!", time: "1 hour ago", read: false },
  { id: 3, title: "Lost Item Found", message: "Someone found a calculator matching your description", time: "3 hours ago", read: false },
  { id: 4, title: "Listing Viewed", message: "Your table listing got 15 views today", time: "5 hours ago", read: true }
];

export const studentProfile = {
  name: "Arjun Mehta",
  email: "arjun.mehta@university.edu.in",
  branch: "Computer Science & Engineering",
  year: "3rd Year",
  semester: "6th",
  enrollmentNo: "2024CSE0123",
  avatar: null,
  bio: "Passionate developer & tech enthusiast. Love building things that make campus life easier.",
  achievements: [
    { id: 1, title: "Top Seller", description: "Sold 10+ items on Marketplace", icon: "Award" },
    { id: 2, title: "Helper Badge", description: "Helped reunite 3 lost items", icon: "Heart" },
    { id: 3, title: "Event Enthusiast", description: "Attended 4+ campus events", icon: "Calendar" }
  ],
  skills: ["React", "Node.js", "Python", "Figma", "C++"],
  socialLinks: {
    github: "github.com/arjunmehta",
    linkedin: "linkedin.com/in/arjunmehta",
    twitter: "twitter.com/arjunmehta"
  }
};

export const quickActions = [
  { id: 1, title: "Add Listing", icon: "Plus", path: "/marketplace", color: "#2563EB" },
  { id: 2, title: "Report Lost", icon: "Search", path: "/lost-found", color: "#DC2626" },
  { id: 3, title: "Register Event", icon: "CalendarPlus", path: "/events", color: "#059669" },
  { id: 4, title: "Find Internship", icon: "Briefcase", path: "/events", color: "#7C3AED" }
];