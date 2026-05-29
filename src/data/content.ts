export type PhotoType = 'project' | 'personal'

export interface Photo {
  src: string
  caption: string
  type: PhotoType
}

export interface EmploymentEntry {
  company: string
  role: string
  dates: string
  question: string
  responsibilities: string[]
}

export interface EducationEntry {
  school: string
  degree: string
  field: string
  dates: string
  certifications: string[]
}

export const content = {
  bio: {
    name: 'Jonas Tham',
    title: 'Computer Science Undergraduate',
    url: 'jonastham.dev',
    summary:
      "A passionate programmer driven by curiosity and ambition, I've always been passionate about technology and its ability to shape the future. My interest in Artificial Intelligence began at a young age and quickly grew into a passion for building innovative solutions that create real impact. I enjoy exploring the possibilities of AI, challenging myself creatively and technically, and pushing the boundaries of what technology can achieve.",
    interests: ['Open Source', 'Deep Learning', 'Machine Learning', 'Travelling', 'Exercise'],
    skills: [
      'Python', 'Javascript', 'Github', 'Stack Overflow', 'Node.js', 'Microsoft SQL', 'MySQL', 'Tableau', 'Scikit-Learn', 'Pandas', 'Numpy', 'Scipy', 'Matplotlib', 'Seaborn', 'Plotly', 'Tensorflow', 'Keras', 'PyTorch', 'OpenCV', 'Statsmodel', 'HTML5', 'CSS3', 'Express.js', 'Bootstrap'
    ],
  },

  education: [
    {
      school: 'Singapore Management University',
      degree: 'Bachelor of Computer Science',
      field: 'Computer Science',
      dates: '2026 - present',
      certifications: [],
    },
    {
      school: 'Singapore Polytechnic',
      degree: 'Diploma in Applied AI & Analytics',
      field: 'Machine Learning & AI',
      dates: '2021 - 2024',
      certifications: ["Director's Honour Roll 2022", "Director's Honour Roll 2023", 'Tableau Desktop Specialist', 'Microsoft Azure AI Fundamentals'],
    },
    {
      school: 'Presbyterian High School',
      degree: 'General Certificate of Education Ordinary Level',
      field: 'Secondary School',
      dates: '2017 - 2020',
      certifications: [],
    },
    {
      school: 'Unity Secondary School',
      degree: 'Primary School Leaving Examination',
      field: 'Primary School',
      dates: '2011 - 2016',
      certifications: [],
    },
  ] as EducationEntry[],

  employment: [
    {
      company: 'A*STAR Advanced Remanufacturing and Technology Centre (ARTC)',
      role: 'Deep Learning & Software Engineering Intern',
      dates: 'Mar 2023 - May 2024',
      question: 'Tell me about your accomplishments here at ARTC?',
      responsibilities: [
        'Partnered with Dental Stars to develop an advanced solution for generating dentures and braces through 3D segmentation techniques.',
        'Worked with RossDigital on 3D depth completion for transparent objects.',
        'Collaborated with Hyundai on Optical Character Recognition (OCR) for serial numbers on car parts under challenging conditions.',
        'Developed an Optical Character Recognition (OCR) solution for both handwritten and printed texts in documents in partnership with IHI.',
        'Worked with Rolls-Royce & SAESL on an in-service parts inspection system utilizing various deep learning networks and contrastive learning for visual representations.'
      ],
    },
    {
      company: 'Singapore Armed Forces (SAF)',
      role: 'Logistic Officer',
      dates: 'Sep 2024 - May 2026',
      question: 'Tell me about your accomplishments here at SAF?',
      responsibilities: [
        'Responsible for command and control, daily operations, and soldier welfare',
        'Ensured operational readiness',
        'Ensured completion of soldier fundamentals and readiness',
      ],
    },
  ] as EmploymentEntry[],

  contact: {
    email: 'jonastham2004@gmail.com',
    github: 'https://github.com/Jonas-JXT',
    instagram: 'https://www.instagram.com/imjonast',
  },

  photos: [
    { src: '/photos/artc brief.jpeg', caption: 'Briefing Secondary School students', type: 'project' },
    { src: '/photos/artc car.jpeg', caption: 'Friends', type: 'project' },
    { src: '/photos/artc event.jpeg', caption: 'S&A Appreciation Night 2023', type: 'project' },
    { src: '/photos/artc event1.jpeg', caption: 'S&A Appreciation Night 2023', type: 'project' },
    { src: '/photos/artc lunch.jpeg', caption: 'Farewell photo', type: 'project' },
    { src: '/photos/artc pic1.jpeg', caption: 'Student visit', type: 'project' },
    { src: '/photos/artc pic2.jpeg', caption: 'Student visit', type: 'project' },
    { src: '/photos/amsterdam.jpeg', caption: 'Amsterdam', type: 'personal' },
    { src: '/photos/aurora camp.jpeg', caption: 'Rovaniemi Aurora Campsite', type: 'personal' },
    { src: '/photos/aurora me.jpeg', caption: 'Rovaniemi Aurora', type: 'personal' },
    { src: '/photos/aurora me1.jpeg', caption: 'Rovaniemi Aurora', type: 'personal' },
    { src: '/photos/aurora.jpeg', caption: 'Rovaniemi Aurora', type: 'personal' },
    { src: '/photos/aurora1.jpeg', caption: 'Rovaniemi Aurora', type: 'personal' },
    { src: '/photos/flower.jpeg', caption: 'Netherlands Tulips', type: 'personal' },
    { src: '/photos/ghent.jpeg', caption: 'Belgium Ghent', type: 'personal' },
    { src: '/photos/snow house.jpeg', caption: 'Lapland', type: 'personal' },
    { src: '/photos/windmill.jpeg', caption: 'Dutch Windmills', type: 'personal' },

  ] as Photo[],
}
