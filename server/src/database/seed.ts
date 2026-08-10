import { getDriver, closeDriver, verifyConnection } from './driver';

export async function runSeed() {
  console.log('🌱 Starting TalentGraph seed process...');

  const conn = await verifyConnection();
  if (!conn.connected) {
    console.error('❌ Could not connect to CognoDB:', conn.message);
    console.error('👉 Please check your COGNODB_URI and COGNODB_PASSWORD in .env');
    process.exit(1);
  }

  console.log('✅ Connection verified:', conn.message);

  const driver = getDriver();
  const session = driver.session();

  try {
    // 1. Clear existing database nodes & relationships
    console.log('🧹 Clearing existing database graph...');
    await session.run('MATCH (n) DETACH DELETE n');

    // 2. Define Entities
    const skills = [
      { id: 'skill-react', name: 'React', category: 'Frontend' },
      { id: 'skill-typescript', name: 'TypeScript', category: 'Languages' },
      { id: 'skill-javascript', name: 'JavaScript', category: 'Languages' },
      { id: 'skill-nextjs', name: 'Next.js', category: 'Frontend' },
      { id: 'skill-vue', name: 'Vue.js', category: 'Frontend' },
      { id: 'skill-angular', name: 'Angular', category: 'Frontend' },
      { id: 'skill-redux', name: 'Redux', category: 'Frontend' },
      { id: 'skill-zustand', name: 'Zustand', category: 'Frontend' },
      { id: 'skill-tailwind', name: 'Tailwind CSS', category: 'Frontend' },
      { id: 'skill-css', name: 'CSS3 / SASS', category: 'Frontend' },
      { id: 'skill-html', name: 'Semantic HTML5', category: 'Frontend' },
      { id: 'skill-nodejs', name: 'Node.js', category: 'Backend' },
      { id: 'skill-express', name: 'Express.js', category: 'Backend' },
      { id: 'skill-nestjs', name: 'NestJS', category: 'Backend' },
      { id: 'skill-python', name: 'Python', category: 'Languages' },
      { id: 'skill-fastapi', name: 'FastAPI', category: 'Backend' },
      { id: 'skill-graphql', name: 'GraphQL', category: 'Architecture' },
      { id: 'skill-restapi', name: 'RESTful API Design', category: 'Architecture' },
      { id: 'skill-grpc', name: 'gRPC & Protobuf', category: 'Architecture' },
      { id: 'skill-postgresql', name: 'PostgreSQL', category: 'Database' },
      { id: 'skill-mongodb', name: 'MongoDB', category: 'Database' },
      { id: 'skill-redis', name: 'Redis', category: 'Database' },
      { id: 'skill-neo4j', name: 'Graph Databases (Cypher/Neo4j)', category: 'Database' },
      { id: 'skill-docker', name: 'Docker & Containers', category: 'DevOps' },
      { id: 'skill-kubernetes', name: 'Kubernetes', category: 'DevOps' },
      { id: 'skill-aws', name: 'AWS Cloud', category: 'Cloud' },
      { id: 'skill-ci-cd', name: 'CI/CD Pipelines (GitHub Actions)', category: 'DevOps' },
      { id: 'skill-testing', name: 'Unit & E2E Testing (Jest/Playwright)', category: 'Quality' },
      { id: 'skill-accessibility', name: 'Web Accessibility (a11y/WCAG)', category: 'Frontend' },
      { id: 'skill-webperf', name: 'Web Performance Optimization', category: 'Frontend' },
      { id: 'skill-microservices', name: 'Microservices Architecture', category: 'Architecture' },
      { id: 'skill-system-design', name: 'Distributed System Design', category: 'Architecture' },
      { id: 'skill-security', name: 'Web Application Security & OAuth2', category: 'Security' },
      { id: 'skill-webrtc', name: 'WebRTC & Realtime Sockets', category: 'Frontend' },
      { id: 'skill-design-systems', name: 'Design Systems & Storybook', category: 'Frontend' },
    ];

    const companies = [
      { id: 'comp-technova', name: 'TechNova Solutions', industry: 'Enterprise SaaS', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80' },
      { id: 'comp-cloudscale', name: 'CloudScale Infrastructure', industry: 'Cloud & DevOps', logo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=150&auto=format&fit=crop&q=80' },
      { id: 'comp-databridge', name: 'DataBridge AI', industry: 'AI & Data Platforms', logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&auto=format&fit=crop&q=80' },
      { id: 'comp-finedge', name: 'FinEdge Global', industry: 'FinTech & Payments', logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80' },
      { id: 'comp-healthstack', name: 'HealthStack Health', industry: 'HealthTech', logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80' },
      { id: 'comp-travelsphere', name: 'TravelSphere Mobility', industry: 'Travel & Logistics', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=150&auto=format&fit=crop&q=80' },
      { id: 'comp-cybervault', name: 'CyberVault Security', industry: 'Cybersecurity', logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&auto=format&fit=crop&q=80' },
      { id: 'comp-omnicommerce', name: 'OmniCommerce Labs', industry: 'E-Commerce & Retail', logo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=150&auto=format&fit=crop&q=80' },
    ];

    const technologies = [
      { id: 'tech-react', name: 'React 18', category: 'Frontend Framework' },
      { id: 'tech-typescript', name: 'TypeScript', category: 'Language' },
      { id: 'tech-nodejs', name: 'Node.js', category: 'Runtime' },
      { id: 'tech-postgresql', name: 'PostgreSQL', category: 'Relational DB' },
      { id: 'tech-redis', name: 'Redis', category: 'In-Memory Cache' },
      { id: 'tech-graphql', name: 'Apollo GraphQL', category: 'API Query Layer' },
      { id: 'tech-aws', name: 'AWS (ECS / S3 / Lambda)', category: 'Cloud Infrastructure' },
      { id: 'tech-docker', name: 'Docker', category: 'Containerization' },
      { id: 'tech-vite', name: 'Vite', category: 'Build Tool' },
      { id: 'tech-tailwind', name: 'Tailwind CSS', category: 'Styling' },
      { id: 'tech-cognodb', name: 'CognoDB Graph Engine', category: 'Graph Database' },
      { id: 'tech-kafka', name: 'Apache Kafka', category: 'Event Streaming' },
      { id: 'tech-nextjs', name: 'Next.js 14 App Router', category: 'Fullstack Framework' },
      { id: 'tech-playwright', name: 'Playwright', category: 'E2E Testing' },
      { id: 'tech-fastapi', name: 'FastAPI', category: 'Python Web Framework' },
      { id: 'tech-elasticsearch', name: 'Elasticsearch', category: 'Search Engine' },
      { id: 'tech-storybook', name: 'Storybook', category: 'UI Component Workshop' },
      { id: 'tech-kubernetes', name: 'Kubernetes (K8s)', category: 'Orchestration' },
      { id: 'tech-terraform', name: 'Terraform IaC', category: 'Infrastructure as Code' },
      { id: 'tech-webrtc', name: 'WebRTC Mediasoup', category: 'Realtime Protocol' },
    ];

    const projects = [
      {
        id: 'proj-1',
        name: 'Enterprise Cloud Portal',
        description: 'Scalable multi-tenant dashboard with realtime telemetry and micro-frontend federation.',
        domain: 'Cloud Management',
        year: 2024,
        techIds: ['tech-react', 'tech-typescript', 'tech-tailwind', 'tech-vite', 'tech-aws', 'tech-graphql']
      },
      {
        id: 'proj-2',
        name: 'FinEdge Payment Gateway',
        description: 'High-throughput low-latency checkout pipeline processing 50k transactions/sec with fraud graph checks.',
        domain: 'FinTech',
        year: 2023,
        techIds: ['tech-typescript', 'tech-nodejs', 'tech-redis', 'tech-postgresql', 'tech-kafka', 'tech-docker']
      },
      {
        id: 'proj-3',
        name: 'Graph-Powered Talent Platform',
        description: 'Next-generation candidate-job matching engine utilizing openCypher graph traversal.',
        domain: 'HR Tech',
        year: 2024,
        techIds: ['tech-react', 'tech-typescript', 'tech-cognodb', 'tech-nodejs', 'tech-tailwind']
      },
      {
        id: 'proj-4',
        name: 'HealthStack Clinical Records',
        description: 'HIPAA-compliant EHR workflow management system with rigorous accessibility and audit compliance.',
        domain: 'HealthTech',
        year: 2023,
        techIds: ['tech-nextjs', 'tech-typescript', 'tech-postgresql', 'tech-playwright', 'tech-aws']
      },
      {
        id: 'proj-5',
        name: 'OmniStore Design System',
        description: 'Cross-platform component library supporting 12 brand themes with automated visual regression tests.',
        domain: 'Design Systems',
        year: 2023,
        techIds: ['tech-react', 'tech-typescript', 'tech-storybook', 'tech-tailwind', 'tech-playwright']
      },
      {
        id: 'proj-6',
        name: 'Realtime Logistics Tracker',
        description: 'Live GPS fleet telemetry visualizer using WebSockets and geographic map clustering.',
        domain: 'Logistics',
        year: 2024,
        techIds: ['tech-react', 'tech-typescript', 'tech-webrtc', 'tech-redis', 'tech-docker']
      },
      {
        id: 'proj-7',
        name: 'AI Document Knowledge Base',
        description: 'Semantic vector search and knowledge graph indexing for enterprise PDF repositories.',
        domain: 'AI & Search',
        year: 2024,
        techIds: ['tech-fastapi', 'tech-elasticsearch', 'tech-cognodb', 'tech-docker', 'tech-react']
      },
      {
        id: 'proj-8',
        name: 'SecOps Attack Surface Visualizer',
        description: 'Interactive topology explorer highlighting multi-hop privilege escalation paths.',
        domain: 'Cybersecurity',
        year: 2023,
        techIds: ['tech-react', 'tech-typescript', 'tech-cognodb', 'tech-aws', 'tech-kubernetes']
      },
      {
        id: 'proj-9',
        name: 'High-Volume Order Dispatcher',
        description: 'Distributed event-driven order processing engine with resilient retry queues.',
        domain: 'E-Commerce',
        year: 2022,
        techIds: ['tech-nodejs', 'tech-kafka', 'tech-postgresql', 'tech-redis', 'tech-docker']
      },
      {
        id: 'proj-10',
        name: 'SaaS Billing & Subscription Core',
        description: 'Stripe webhook orchestration, tax calculations, and usage-based metered billing engine.',
        domain: 'SaaS Infrastructure',
        year: 2023,
        techIds: ['tech-typescript', 'tech-nodejs', 'tech-postgresql', 'tech-redis', 'tech-aws']
      },
      {
        id: 'proj-11',
        name: 'TravelBooking Global Search Engine',
        description: 'Multi-criteria flight and hotel aggregations with sub-100ms response cache.',
        domain: 'Travel',
        year: 2023,
        techIds: ['tech-nextjs', 'tech-typescript', 'tech-redis', 'tech-elasticsearch', 'tech-graphql']
      },
      {
        id: 'proj-12',
        name: 'DevOps Automated Pipeline Orchestrator',
        description: 'Multi-region canary deployment controller with automatic rollback on metric regression.',
        domain: 'DevOps',
        year: 2024,
        techIds: ['tech-kubernetes', 'tech-terraform', 'tech-aws', 'tech-docker', 'tech-nodejs']
      },
      {
        id: 'proj-13',
        name: 'Collaborative Whiteboard Canvas',
        description: 'CRDT-based multi-user spatial collaboration tool with 60fps canvas rendering.',
        domain: 'Realtime Apps',
        year: 2024,
        techIds: ['tech-react', 'tech-typescript', 'tech-webrtc', 'tech-vite']
      },
      {
        id: 'proj-14',
        name: 'Micro-Frontend Host Shell',
        description: 'Single-SPA based container hosting 7 autonomous squad modules with shared auth state.',
        domain: 'Frontend Architecture',
        year: 2023,
        techIds: ['tech-react', 'tech-typescript', 'tech-vite', 'tech-tailwind']
      },
      {
        id: 'proj-15',
        name: 'Customer 360 Graph Intelligence',
        description: 'Unified customer journey tracker across support, sales, and product usage nodes.',
        domain: 'Analytics',
        year: 2024,
        techIds: ['tech-cognodb', 'tech-nodejs', 'tech-react', 'tech-graphql']
      },
      {
        id: 'proj-16',
        name: 'Modern Resume Parser & Matcher',
        description: 'Automated skill extraction pipeline with confidence scoring and semantic skill clustering.',
        domain: 'HR Tech',
        year: 2023,
        techIds: ['tech-fastapi', 'tech-typescript', 'tech-react', 'tech-postgresql']
      }
    ];

    const candidates = [
      {
        id: 'cand-mayuri-lad',
        name: 'Mayuri Lad',
        title: 'Senior Frontend Developer',
        location: 'San Francisco, CA (Remote)',
        experienceYears: 9,
        summary: 'Specialist in high-performance React/TypeScript applications, enterprise design systems, and graph visualizations.',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-react', 'skill-typescript', 'skill-javascript', 'skill-redux', 'skill-tailwind', 'skill-restapi', 'skill-webperf', 'skill-design-systems', 'skill-testing'],
        projectWork: [
          { projId: 'proj-1', role: 'Lead Frontend Architect', durationMonths: 14 },
          { projId: 'proj-3', role: 'Core Fullstack Engineer', durationMonths: 8 },
          { projId: 'proj-5', role: 'Design System Lead', durationMonths: 10 }
        ]
      },
      {
        id: 'cand-priya-shah',
        name: 'Priya Shah',
        title: 'Lead Frontend Architect',
        location: 'New York, NY',
        experienceYears: 10,
        summary: 'Architecting large-scale TypeScript micro-frontends with strict web accessibility, Next.js, and GraphQL federations.',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-react', 'skill-typescript', 'skill-nextjs', 'skill-graphql', 'skill-tailwind', 'skill-accessibility', 'skill-testing', 'skill-microservices', 'skill-system-design'],
        projectWork: [
          { projId: 'proj-4', role: 'Principal Architect', durationMonths: 18 },
          { projId: 'proj-14', role: 'Frontend Lead', durationMonths: 12 }
        ]
      },
      {
        id: 'cand-rahul-patel',
        name: 'Rahul Patel',
        title: 'Senior Full Stack Engineer',
        location: 'Austin, TX',
        experienceYears: 8,
        summary: 'Full-stack specialist with deep Node.js, PostgreSQL, React, and AWS serverless expertise.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-react', 'skill-typescript', 'skill-nodejs', 'skill-express', 'skill-postgresql', 'skill-redis', 'skill-aws', 'skill-docker', 'skill-restapi'],
        projectWork: [
          { projId: 'proj-2', role: 'Senior Backend Engineer', durationMonths: 16 },
          { projId: 'proj-10', role: 'Full Stack Tech Lead', durationMonths: 12 }
        ]
      },
      {
        id: 'cand-elena-rostova',
        name: 'Elena Rostova',
        title: 'Staff UI Platform Engineer',
        location: 'Seattle, WA (Remote)',
        experienceYears: 11,
        summary: 'Creator of enterprise component ecosystems, canvas-based graph engines, and WebRTC streaming tools.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-react', 'skill-typescript', 'skill-javascript', 'skill-zustand', 'skill-webrtc', 'skill-webperf', 'skill-design-systems', 'skill-testing'],
        projectWork: [
          { projId: 'proj-13', role: 'Staff Canvas Engineer', durationMonths: 15 },
          { projId: 'proj-5', role: 'Core Contributor', durationMonths: 9 }
        ]
      },
      {
        id: 'cand-alex-chen',
        name: 'Alex Chen',
        title: 'Distributed Systems & Graph Engineer',
        location: 'San Jose, CA',
        experienceYears: 7,
        summary: 'Data engineer specializing in openCypher graph databases, Neo4j, real-time Kafka pipelines, and Redis clustering.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-neo4j', 'skill-nodejs', 'skill-python', 'skill-fastapi', 'skill-redis', 'skill-postgresql', 'skill-system-design', 'skill-docker', 'skill-graphql'],
        projectWork: [
          { projId: 'proj-3', role: 'Graph Database Architect', durationMonths: 10 },
          { projId: 'proj-15', role: 'Data Systems Lead', durationMonths: 14 }
        ]
      },
      {
        id: 'cand-sarah-jenkins',
        name: 'Sarah Jenkins',
        title: 'Principal Cloud & DevOps Architect',
        location: 'Denver, CO',
        experienceYears: 12,
        summary: 'Infrastructure leader designing zero-downtime Kubernetes deployments, multi-region AWS fabrics, and CI/CD pipelines.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-aws', 'skill-kubernetes', 'skill-docker', 'skill-ci-cd', 'skill-microservices', 'skill-system-design', 'skill-security', 'skill-python'],
        projectWork: [
          { projId: 'proj-12', role: 'Cloud Architect Lead', durationMonths: 20 },
          { projId: 'proj-8', role: 'Infra Consultant', durationMonths: 6 }
        ]
      },
      {
        id: 'cand-marcus-vance',
        name: 'Marcus Vance',
        title: 'Senior Frontend Engineer (React/Next.js)',
        location: 'Chicago, IL',
        experienceYears: 6,
        summary: 'Specializing in Next.js App Router, Tailwind CSS, high-conversion e-commerce funnels, and Core Web Vitals.',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-react', 'skill-nextjs', 'skill-typescript', 'skill-tailwind', 'skill-css', 'skill-html', 'skill-webperf', 'skill-restapi'],
        projectWork: [
          { projId: 'proj-11', role: 'Senior Frontend Dev', durationMonths: 11 },
          { projId: 'proj-1', role: 'UI Engineer', durationMonths: 8 }
        ]
      },
      {
        id: 'cand-ananya-iyer',
        name: 'Ananya Iyer',
        title: 'Senior Backend Engineer (Node/GraphQL)',
        location: 'Boston, MA',
        experienceYears: 7,
        summary: 'Expert in federated GraphQL microservices, PostgreSQL query tuning, and payment gateway security.',
        avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-nodejs', 'skill-nestjs', 'skill-graphql', 'skill-postgresql', 'skill-redis', 'skill-docker', 'skill-security', 'skill-restapi'],
        projectWork: [
          { projId: 'proj-2', role: 'Senior Backend Dev', durationMonths: 14 },
          { projId: 'proj-10', role: 'API Architect', durationMonths: 9 }
        ]
      },
      {
        id: 'cand-david-kim',
        name: 'David Kim',
        title: 'Full Stack Engineer & WebRTC Specialist',
        location: 'Toronto, Canada',
        experienceYears: 5,
        summary: 'Passionate about real-time interactive systems, WebRTC video/audio streaming, and modern React architectures.',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-react', 'skill-typescript', 'skill-webrtc', 'skill-nodejs', 'skill-express', 'skill-redis', 'skill-tailwind', 'skill-testing'],
        projectWork: [
          { projId: 'proj-6', role: 'Realtime Engineer', durationMonths: 13 },
          { projId: 'proj-13', role: 'Frontend Engineer', durationMonths: 7 }
        ]
      },
      {
        id: 'cand-sophie-martin',
        name: 'Sophie Martin',
        title: 'Staff Security & DevSecOps Engineer',
        location: 'London, UK (Remote)',
        experienceYears: 9,
        summary: 'Zero-trust architecture practitioner, OAuth2/OIDC specialist, and graph-based identity blast radius analyst.',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-security', 'skill-aws', 'skill-kubernetes', 'skill-neo4j', 'skill-docker', 'skill-python', 'skill-ci-cd', 'skill-system-design'],
        projectWork: [
          { projId: 'proj-8', role: 'Lead Security Engineer', durationMonths: 18 },
          { projId: 'proj-12', role: 'DevSecOps Specialist', durationMonths: 8 }
        ]
      },
      {
        id: 'cand-vikram-singh',
        name: 'Vikram Singh',
        title: 'Senior Python & AI Platform Engineer',
        location: 'Austin, TX',
        experienceYears: 8,
        summary: 'Building high-scale search engines, FastAPI microservices, and graph knowledge retrieval pipelines.',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-python', 'skill-fastapi', 'skill-neo4j', 'skill-postgresql', 'skill-docker', 'skill-microservices', 'skill-system-design'],
        projectWork: [
          { projId: 'proj-7', role: 'AI Platform Lead', durationMonths: 16 },
          { projId: 'proj-16', role: 'NLP Tech Lead', durationMonths: 10 }
        ]
      },
      {
        id: 'cand-chloe-dupont',
        name: 'Chloe Dupont',
        title: 'Frontend UI/UX Engineer',
        location: 'Paris, France (Remote)',
        experienceYears: 4,
        summary: 'Bridging design and engineering with pixel-perfect Tailwind CSS, React components, and accessible interfaces.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-react', 'skill-javascript', 'skill-typescript', 'skill-tailwind', 'skill-css', 'skill-html', 'skill-design-systems', 'skill-accessibility'],
        projectWork: [
          { projId: 'proj-5', role: 'UI Engineer', durationMonths: 12 },
          { projId: 'proj-1', role: 'Frontend Contributor', durationMonths: 6 }
        ]
      },
      {
        id: 'cand-gabriel-santos',
        name: 'Gabriel Santos',
        title: 'Full Stack React & Node Developer',
        location: 'Miami, FL',
        experienceYears: 5,
        summary: 'Hands-on product engineer building fast web apps with React, Express, REST APIs, and automated E2E tests.',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-react', 'skill-typescript', 'skill-javascript', 'skill-nodejs', 'skill-express', 'skill-mongodb', 'skill-testing', 'skill-tailwind'],
        projectWork: [
          { projId: 'proj-9', role: 'Full Stack Engineer', durationMonths: 14 },
          { projId: 'proj-16', role: 'Frontend Engineer', durationMonths: 8 }
        ]
      },
      {
        id: 'cand-kavita-reddy',
        name: 'Kavita Reddy',
        title: 'Frontend Platform & Web Performance Engineer',
        location: 'San Francisco, CA',
        experienceYears: 7,
        summary: 'Obsessed with Web Vitals, tree-shaking, SSR caching, and Next.js / Vite build pipeline optimizations.',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-react', 'skill-typescript', 'skill-nextjs', 'skill-webperf', 'skill-testing', 'skill-design-systems', 'skill-tailwind', 'skill-graphql'],
        projectWork: [
          { projId: 'proj-1', role: 'Performance Engineer', durationMonths: 15 },
          { projId: 'proj-11', role: 'Lead Web Engineer', durationMonths: 10 }
        ]
      },
      {
        id: 'cand-lucas-muller',
        name: 'Lucas Müller',
        title: 'Backend & Event Streaming Engineer',
        location: 'Berlin, Germany',
        experienceYears: 8,
        summary: 'High-volume distributed event pipelines using Node.js, Kafka, Redis streams, and PostgreSQL clustering.',
        avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-nodejs', 'skill-typescript', 'skill-redis', 'skill-postgresql', 'skill-microservices', 'skill-docker', 'skill-system-design', 'skill-aws'],
        projectWork: [
          { projId: 'proj-2', role: 'Distributed Systems Lead', durationMonths: 18 },
          { projId: 'proj-9', role: 'Senior Backend Engineer', durationMonths: 12 }
        ]
      },
      {
        id: 'cand-tanya-morales',
        name: 'Tanya Morales',
        title: 'Senior Angular & Enterprise Frontend Engineer',
        location: 'Los Angeles, CA',
        experienceYears: 8,
        summary: 'Enterprise Angular to modern React migrations, state management with NgRx/Redux, and rigorous testing.',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-angular', 'skill-typescript', 'skill-javascript', 'skill-react', 'skill-redux', 'skill-restapi', 'skill-testing', 'skill-accessibility'],
        projectWork: [
          { projId: 'proj-4', role: 'Enterprise Frontend Lead', durationMonths: 16 },
          { projId: 'proj-14', role: 'Migration Specialist', durationMonths: 8 }
        ]
      },
      {
        id: 'cand-jordan-blake',
        name: 'Jordan Blake',
        title: 'Junior Full Stack Developer',
        location: 'Seattle, WA',
        experienceYears: 2,
        summary: 'Fast learner with solid fundamentals in React, TypeScript, Node.js, Tailwind CSS, and REST API development.',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-react', 'skill-typescript', 'skill-javascript', 'skill-nodejs', 'skill-tailwind', 'skill-restapi', 'skill-html', 'skill-css'],
        projectWork: [
          { projId: 'proj-3', role: 'Junior Web Developer', durationMonths: 6 },
          { projId: 'proj-16', role: 'Full Stack Contributor', durationMonths: 7 }
        ]
      },
      {
        id: 'cand-fatima-al-mansoor',
        name: 'Fatima Al-Mansoor',
        title: 'Senior Database & Graph Architect',
        location: 'Dubai, UAE (Remote)',
        experienceYears: 9,
        summary: 'Specializing in openCypher graph modeling, relational-to-graph transformations, and real-time recommendation engines.',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-neo4j', 'skill-postgresql', 'skill-redis', 'skill-system-design', 'skill-nodejs', 'skill-python', 'skill-graphql', 'skill-docker'],
        projectWork: [
          { projId: 'proj-3', role: 'Lead Graph Architect', durationMonths: 12 },
          { projId: 'proj-15', role: 'Senior Data Engineer', durationMonths: 15 }
        ]
      },
      {
        id: 'cand-owen-wright',
        name: 'Owen Wright',
        title: 'Lead QA Automation & Test Architect',
        location: 'Dublin, Ireland',
        experienceYears: 7,
        summary: 'End-to-end automated testing pipelines using Playwright, Jest, CI/CD integration, and accessibility audits.',
        avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-testing', 'skill-accessibility', 'skill-typescript', 'skill-javascript', 'skill-ci-cd', 'skill-docker', 'skill-webperf'],
        projectWork: [
          { projId: 'proj-4', role: 'Test Automation Architect', durationMonths: 14 },
          { projId: 'proj-5', role: 'Visual Regression Lead', durationMonths: 8 }
        ]
      },
      {
        id: 'cand-zoe-kaufman',
        name: 'Zoe Kaufman',
        title: 'Senior React Native & Mobile Engineer',
        location: 'Portland, OR',
        experienceYears: 6,
        summary: 'Cross-platform mobile applications, state management with Zustand/Redux, and offline-first data sync.',
        avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-react', 'skill-typescript', 'skill-zustand', 'skill-redux', 'skill-restapi', 'skill-graphql', 'skill-testing'],
        projectWork: [
          { projId: 'proj-6', role: 'Mobile Lead', durationMonths: 12 },
          { projId: 'proj-13', role: 'React Developer', durationMonths: 6 }
        ]
      },
      {
        id: 'cand-arjun-nair',
        name: 'Arjun Nair',
        title: 'Staff Microservices Architect',
        location: 'Bangalore, India (Remote)',
        experienceYears: 11,
        summary: 'Pioneering event-driven distributed architectures, NestJS, gRPC, and multi-region Kubernetes clusters.',
        avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-microservices', 'skill-system-design', 'skill-grpc', 'skill-nestjs', 'skill-nodejs', 'skill-kubernetes', 'skill-aws', 'skill-postgresql'],
        projectWork: [
          { projId: 'proj-2', role: 'Principal Architect', durationMonths: 18 },
          { projId: 'proj-12', role: 'Kubernetes Advisor', durationMonths: 10 }
        ]
      },
      {
        id: 'cand-natalia-popova',
        name: 'Natalia Popova',
        title: 'Vue.js & Frontend Engineer',
        location: 'Prague, Czech Republic',
        experienceYears: 5,
        summary: 'Vue 3 composition API, Tailwind CSS, Pinia state stores, and TypeScript frontend development.',
        avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-vue', 'skill-typescript', 'skill-javascript', 'skill-tailwind', 'skill-css', 'skill-html', 'skill-restapi', 'skill-testing'],
        projectWork: [
          { projId: 'proj-1', role: 'Frontend Engineer', durationMonths: 9 },
          { projId: 'proj-11', role: 'UI Contributor', durationMonths: 7 }
        ]
      },
      {
        id: 'cand-ethan-hayes',
        name: 'Ethan Hayes',
        title: 'Full Stack Next.js & AI Engineer',
        location: 'Austin, TX',
        experienceYears: 4,
        summary: 'Fast-moving fullstack engineer building modern AI-infused apps with Next.js 14, Tailwind, and Python backends.',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-nextjs', 'skill-react', 'skill-typescript', 'skill-tailwind', 'skill-python', 'skill-fastapi', 'skill-postgresql', 'skill-docker'],
        projectWork: [
          { projId: 'proj-7', role: 'Full Stack AI Developer', durationMonths: 11 },
          { projId: 'proj-3', role: 'Next.js Contributor', durationMonths: 5 }
        ]
      },
      {
        id: 'cand-leila-mirza',
        name: 'Leila Mirza',
        title: 'Senior Frontend Architect (Design Systems)',
        location: 'San Francisco, CA',
        experienceYears: 8,
        summary: 'Crafting resilient design systems, tokenized CSS architecture, Storybook documentation, and WCAG AAA compliance.',
        avatar: 'https://images.unsplash.com/photo-1534751516642-a171edd270f2?w=150&auto=format&fit=crop&q=80',
        skillIds: ['skill-react', 'skill-typescript', 'skill-design-systems', 'skill-accessibility', 'skill-tailwind', 'skill-css', 'skill-testing', 'skill-webperf'],
        projectWork: [
          { projId: 'proj-5', role: 'Principal Design Technologist', durationMonths: 16 },
          { projId: 'proj-14', role: 'Design System Architect', durationMonths: 9 }
        ]
      }
    ];

    const jobs = [
      {
        id: 'job-sr-react-dev',
        title: 'Senior React Developer',
        description: 'Lead the frontend architecture of our flagship enterprise analytics platform with React 18, TypeScript, and state management.',
        location: 'San Francisco, CA (Hybrid / Remote)',
        employmentType: 'Full-time',
        experienceMin: 5,
        experienceMax: 9,
        companyId: 'comp-technova',
        requirements: [
          { skillId: 'skill-react', importance: 'Required' },
          { skillId: 'skill-typescript', importance: 'Required' },
          { skillId: 'skill-javascript', importance: 'Required' },
          { skillId: 'skill-redux', importance: 'Preferred' },
          { skillId: 'skill-tailwind', importance: 'Required' },
          { skillId: 'skill-restapi', importance: 'Required' },
          { skillId: 'skill-testing', importance: 'Preferred' }
        ]
      },
      {
        id: 'job-frontend-architect',
        title: 'Frontend Architect',
        description: 'Define technical standards, cross-squad component libraries, accessibility compliance, and micro-frontend strategy.',
        location: 'New York, NY (Remote)',
        employmentType: 'Full-time',
        experienceMin: 8,
        experienceMax: 14,
        companyId: 'comp-technova',
        requirements: [
          { skillId: 'skill-react', importance: 'Required' },
          { skillId: 'skill-typescript', importance: 'Required' },
          { skillId: 'skill-design-systems', importance: 'Required' },
          { skillId: 'skill-accessibility', importance: 'Required' },
          { skillId: 'skill-webperf', importance: 'Required' },
          { skillId: 'skill-microservices', importance: 'Preferred' },
          { skillId: 'skill-testing', importance: 'Required' }
        ]
      },
      {
        id: 'job-ui-engineer',
        title: 'UI Engineer (Design Systems)',
        description: 'Work closely with product designers to implement our multi-brand design tokens, accessible components, and animations.',
        location: 'Remote (US/Canada)',
        employmentType: 'Full-time',
        experienceMin: 3,
        experienceMax: 7,
        companyId: 'comp-omnicommerce',
        requirements: [
          { skillId: 'skill-react', importance: 'Required' },
          { skillId: 'skill-typescript', importance: 'Required' },
          { skillId: 'skill-tailwind', importance: 'Required' },
          { skillId: 'skill-css', importance: 'Required' },
          { skillId: 'skill-design-systems', importance: 'Required' },
          { skillId: 'skill-accessibility', importance: 'Preferred' }
        ]
      },
      {
        id: 'job-sr-fullstack-eng',
        title: 'Senior Full Stack Engineer',
        description: 'End-to-end feature delivery connecting React user interfaces with scalable Node.js microservices and PostgreSQL.',
        location: 'Austin, TX (Hybrid)',
        employmentType: 'Full-time',
        experienceMin: 5,
        experienceMax: 9,
        companyId: 'comp-finedge',
        requirements: [
          { skillId: 'skill-react', importance: 'Required' },
          { skillId: 'skill-typescript', importance: 'Required' },
          { skillId: 'skill-nodejs', importance: 'Required' },
          { skillId: 'skill-postgresql', importance: 'Required' },
          { skillId: 'skill-redis', importance: 'Preferred' },
          { skillId: 'skill-docker', importance: 'Preferred' }
        ]
      },
      {
        id: 'job-graph-data-engineer',
        title: 'Graph Database & Intelligence Engineer',
        description: 'Harness openCypher and graph databases to power relationship discovery, fraud detection, and recommendation algorithms.',
        location: 'San Jose, CA (Remote)',
        employmentType: 'Full-time',
        experienceMin: 4,
        experienceMax: 10,
        companyId: 'comp-databridge',
        requirements: [
          { skillId: 'skill-neo4j', importance: 'Required' },
          { skillId: 'skill-python', importance: 'Required' },
          { skillId: 'skill-nodejs', importance: 'Preferred' },
          { skillId: 'skill-system-design', importance: 'Required' },
          { skillId: 'skill-postgresql', importance: 'Preferred' },
          { skillId: 'skill-docker', importance: 'Preferred' }
        ]
      },
      {
        id: 'job-principal-cloud-architect',
        title: 'Principal Cloud & Platform Architect',
        description: 'Design multi-region cloud infrastructure, infrastructure-as-code, and resilient Kubernetes deployment topologies.',
        location: 'Denver, CO (Remote)',
        employmentType: 'Full-time',
        experienceMin: 9,
        experienceMax: 16,
        companyId: 'comp-cloudscale',
        requirements: [
          { skillId: 'skill-aws', importance: 'Required' },
          { skillId: 'skill-kubernetes', importance: 'Required' },
          { skillId: 'skill-docker', importance: 'Required' },
          { skillId: 'skill-ci-cd', importance: 'Required' },
          { skillId: 'skill-system-design', importance: 'Required' },
          { skillId: 'skill-security', importance: 'Preferred' }
        ]
      },
      {
        id: 'job-nextjs-lead',
        title: 'Lead Next.js & Frontend Developer',
        location: 'Chicago, IL (Remote)',
        description: 'Build hyper-fast SSR web applications with Next.js 14 App Router, GraphQL queries, and Tailwind styling.',
        employmentType: 'Full-time',
        experienceMin: 5,
        experienceMax: 9,
        companyId: 'comp-travelsphere',
        requirements: [
          { skillId: 'skill-nextjs', importance: 'Required' },
          { skillId: 'skill-react', importance: 'Required' },
          { skillId: 'skill-typescript', importance: 'Required' },
          { skillId: 'skill-graphql', importance: 'Required' },
          { skillId: 'skill-tailwind', importance: 'Preferred' },
          { skillId: 'skill-webperf', importance: 'Required' }
        ]
      },
      {
        id: 'job-lead-secops-eng',
        title: 'Lead Cloud Security Engineer',
        description: 'Enforce zero-trust security postures, automated vulnerability detection, and identity graph blast radius modeling.',
        location: 'London, UK (Remote)',
        employmentType: 'Full-time',
        experienceMin: 7,
        experienceMax: 12,
        companyId: 'comp-cybervault',
        requirements: [
          { skillId: 'skill-security', importance: 'Required' },
          { skillId: 'skill-aws', importance: 'Required' },
          { skillId: 'skill-kubernetes', importance: 'Required' },
          { skillId: 'skill-ci-cd', importance: 'Required' },
          { skillId: 'skill-python', importance: 'Preferred' }
        ]
      },
      {
        id: 'job-sr-backend-graphql',
        title: 'Senior Backend Engineer (GraphQL/Node)',
        description: 'Scale our federated GraphQL subgraph services handling tens of thousands of simultaneous requests.',
        location: 'Boston, MA (Hybrid)',
        employmentType: 'Full-time',
        experienceMin: 6,
        experienceMax: 10,
        companyId: 'comp-finedge',
        requirements: [
          { skillId: 'skill-nodejs', importance: 'Required' },
          { skillId: 'skill-graphql', importance: 'Required' },
          { skillId: 'skill-postgresql', importance: 'Required' },
          { skillId: 'skill-redis', importance: 'Required' },
          { skillId: 'skill-typescript', importance: 'Required' },
          { skillId: 'skill-microservices', importance: 'Preferred' }
        ]
      },
      {
        id: 'job-health-web-lead',
        title: 'Healthcare Frontend Platform Lead',
        description: 'Build mission-critical healthcare workflow interfaces prioritizing WCAG 2.1 AAA accessibility and robust automated test suites.',
        location: 'New York, NY',
        employmentType: 'Full-time',
        experienceMin: 7,
        experienceMax: 12,
        companyId: 'comp-healthstack',
        requirements: [
          { skillId: 'skill-react', importance: 'Required' },
          { skillId: 'skill-typescript', importance: 'Required' },
          { skillId: 'skill-accessibility', importance: 'Required' },
          { skillId: 'skill-testing', importance: 'Required' },
          { skillId: 'skill-restapi', importance: 'Required' },
          { skillId: 'skill-design-systems', importance: 'Preferred' }
        ]
      },
      {
        id: 'job-realtime-engineer',
        title: 'Realtime & WebRTC Platform Engineer',
        description: 'Develop low-latency video and data streaming channels for collaborative canvas and interactive sessions.',
        location: 'Seattle, WA (Remote)',
        employmentType: 'Full-time',
        experienceMin: 4,
        experienceMax: 8,
        companyId: 'comp-technova',
        requirements: [
          { skillId: 'skill-webrtc', importance: 'Required' },
          { skillId: 'skill-react', importance: 'Required' },
          { skillId: 'skill-typescript', importance: 'Required' },
          { skillId: 'skill-nodejs', importance: 'Required' },
          { skillId: 'skill-redis', importance: 'Preferred' }
        ]
      },
      {
        id: 'job-ai-fastapi-eng',
        title: 'AI Microservices & Search Engineer',
        description: 'Architect low-latency FastAPI inference endpoints and knowledge graph integrations for AI-assisted products.',
        location: 'Austin, TX',
        employmentType: 'Full-time',
        experienceMin: 5,
        experienceMax: 9,
        companyId: 'comp-databridge',
        requirements: [
          { skillId: 'skill-python', importance: 'Required' },
          { skillId: 'skill-fastapi', importance: 'Required' },
          { skillId: 'skill-neo4j', importance: 'Preferred' },
          { skillId: 'skill-docker', importance: 'Required' },
          { skillId: 'skill-system-design', importance: 'Required' }
        ]
      },
      {
        id: 'job-frontend-qa-architect',
        title: 'Lead QA Automation & Test Engineer',
        description: 'Champion end-to-end testing quality, Playwright automation suites, visual diff checks, and CI pipeline testing gates.',
        location: 'Dublin, Ireland (Remote)',
        employmentType: 'Full-time',
        experienceMin: 5,
        experienceMax: 9,
        companyId: 'comp-omnicommerce',
        requirements: [
          { skillId: 'skill-testing', importance: 'Required' },
          { skillId: 'skill-typescript', importance: 'Required' },
          { skillId: 'skill-accessibility', importance: 'Required' },
          { skillId: 'skill-ci-cd', importance: 'Preferred' },
          { skillId: 'skill-react', importance: 'Preferred' }
        ]
      },
      {
        id: 'job-distrib-backend-eng',
        title: 'Senior Distributed Backend Engineer',
        description: 'Design fault-tolerant event streams, high-speed Redis caches, and ACID-compliant transaction pipelines.',
        location: 'Berlin, Germany',
        employmentType: 'Full-time',
        experienceMin: 6,
        experienceMax: 11,
        companyId: 'comp-cloudscale',
        requirements: [
          { skillId: 'skill-nodejs', importance: 'Required' },
          { skillId: 'skill-postgresql', importance: 'Required' },
          { skillId: 'skill-redis', importance: 'Required' },
          { skillId: 'skill-microservices', importance: 'Required' },
          { skillId: 'skill-docker', importance: 'Required' }
        ]
      },
      {
        id: 'job-jr-fullstack-dev',
        title: 'Junior Full Stack Developer',
        description: 'Great growth role building customer-facing UI features in React/Tailwind and helping maintain Node/Express endpoints.',
        location: 'Seattle, WA (Hybrid)',
        employmentType: 'Full-time',
        experienceMin: 1,
        experienceMax: 3,
        companyId: 'comp-technova',
        requirements: [
          { skillId: 'skill-react', importance: 'Required' },
          { skillId: 'skill-javascript', importance: 'Required' },
          { skillId: 'skill-typescript', importance: 'Preferred' },
          { skillId: 'skill-nodejs', importance: 'Preferred' },
          { skillId: 'skill-tailwind', importance: 'Preferred' },
          { skillId: 'skill-html', importance: 'Required' }
        ]
      },
      {
        id: 'job-sr-angular-react-dev',
        title: 'Senior Enterprise Frontend Developer',
        description: 'Modernize large-scale Angular and React enterprise platforms with high-reliability TypeScript architectures.',
        location: 'Los Angeles, CA',
        employmentType: 'Full-time',
        experienceMin: 6,
        experienceMax: 10,
        companyId: 'comp-travelsphere',
        requirements: [
          { skillId: 'skill-angular', importance: 'Required' },
          { skillId: 'skill-react', importance: 'Required' },
          { skillId: 'skill-typescript', importance: 'Required' },
          { skillId: 'skill-redux', importance: 'Preferred' },
          { skillId: 'skill-restapi', importance: 'Required' }
        ]
      }
    ];

    const skillRelationships = [
      { from: 'skill-react', to: 'skill-nextjs' },
      { from: 'skill-react', to: 'skill-redux' },
      { from: 'skill-react', to: 'skill-zustand' },
      { from: 'skill-react', to: 'skill-typescript' },
      { from: 'skill-react', to: 'skill-tailwind' },
      { from: 'skill-react', to: 'skill-design-systems' },
      { from: 'skill-typescript', to: 'skill-javascript' },
      { from: 'skill-typescript', to: 'skill-nodejs' },
      { from: 'skill-nextjs', to: 'skill-webperf' },
      { from: 'skill-nodejs', to: 'skill-express' },
      { from: 'skill-nodejs', to: 'skill-nestjs' },
      { from: 'skill-nodejs', to: 'skill-graphql' },
      { from: 'skill-python', to: 'skill-fastapi' },
      { from: 'skill-fastapi', to: 'skill-restapi' },
      { from: 'skill-postgresql', to: 'skill-redis' },
      { from: 'skill-neo4j', to: 'skill-graphql' },
      { from: 'skill-docker', to: 'skill-kubernetes' },
      { from: 'skill-aws', to: 'skill-kubernetes' },
      { from: 'skill-ci-cd', to: 'skill-docker' },
      { from: 'skill-testing', to: 'skill-accessibility' },
      { from: 'skill-design-systems', to: 'skill-accessibility' },
      { from: 'skill-microservices', to: 'skill-grpc' },
      { from: 'skill-microservices', to: 'skill-system-design' },
      { from: 'skill-security', to: 'skill-system-design' },
      { from: 'skill-webrtc', to: 'skill-webperf' },
    ];

    // 3. Create Skills
    console.log('📌 Inserting Skills...');
    for (const skill of skills) {
      await session.run(
        `MERGE (s:Skill {id: $id})
         SET s.name = $name, s.category = $category`,
        skill
      );
    }

    // 4. Create Companies
    console.log('🏢 Inserting Companies...');
    for (const comp of companies) {
      await session.run(
        `MERGE (c:Company {id: $id})
         SET c.name = $name, c.industry = $industry, c.logo = $logo`,
        comp
      );
    }

    // 5. Create Technologies
    console.log('💻 Inserting Technologies...');
    for (const tech of technologies) {
      await session.run(
        `MERGE (t:Technology {id: $id})
         SET t.name = $name, t.category = $category`,
        tech
      );
    }

    // 6. Create Projects & Link to Technologies
    console.log('📁 Inserting Projects & (Project)-[:USES]->(Technology)...');
    for (const proj of projects) {
      await session.run(
        `MERGE (p:Project {id: $id})
         SET p.name = $name, p.description = $description, p.domain = $domain, p.year = $year`,
        { id: proj.id, name: proj.name, description: proj.description, domain: proj.domain, year: proj.year }
      );

      for (const techId of proj.techIds) {
        await session.run(
          `MATCH (p:Project {id: $projId}), (t:Technology {id: $techId})
           MERGE (p)-[:USES]->(t)`,
          { projId: proj.id, techId }
        );
      }
    }

    // 7. Create Candidates & Link to Skills and Projects
    console.log('👤 Inserting Candidates, (Candidate)-[:HAS_SKILL]->(Skill), (Candidate)-[:WORKED_ON]->(Project)...');
    for (const cand of candidates) {
      await session.run(
        `MERGE (c:Candidate {id: $id})
         SET c.name = $name, c.title = $title, c.location = $location,
             c.experienceYears = $experienceYears, c.summary = $summary, c.avatar = $avatar`,
        {
          id: cand.id,
          name: cand.name,
          title: cand.title,
          location: cand.location,
          experienceYears: cand.experienceYears,
          summary: cand.summary,
          avatar: cand.avatar,
        }
      );

      // Link Skills
      for (const skillId of cand.skillIds) {
        await session.run(
          `MATCH (c:Candidate {id: $candId}), (s:Skill {id: $skillId})
           MERGE (c)-[:HAS_SKILL]->(s)`,
          { candId: cand.id, skillId }
        );
      }

      // Link Projects
      for (const pw of cand.projectWork) {
        await session.run(
          `MATCH (c:Candidate {id: $candId}), (p:Project {id: $projId})
           MERGE (c)-[r:WORKED_ON]->(p)
           SET r.role = $role, r.durationMonths = $durationMonths`,
          { candId: cand.id, projId: pw.projId, role: pw.role, durationMonths: pw.durationMonths }
        );
      }
    }

    // 8. Create Jobs & Link to Companies and Skills
    console.log('💼 Inserting Jobs, (Job)-[:POSTED_BY]->(Company), (Job)-[:REQUIRES]->(Skill)...');
    for (const job of jobs) {
      await session.run(
        `MERGE (j:Job {id: $id})
         SET j.title = $title, j.description = $description, j.location = $location,
             j.employmentType = $employmentType, j.experienceMin = $experienceMin, j.experienceMax = $experienceMax`,
        {
          id: job.id,
          title: job.title,
          description: job.description,
          location: job.location,
          employmentType: job.employmentType,
          experienceMin: job.experienceMin,
          experienceMax: job.experienceMax,
        }
      );

      // Link Company
      await session.run(
        `MATCH (j:Job {id: $jobId}), (c:Company {id: $companyId})
         MERGE (j)-[:POSTED_BY]->(c)`,
        { jobId: job.id, companyId: job.companyId }
      );

      // Link Required Skills
      for (const req of job.requirements) {
        await session.run(
          `MATCH (j:Job {id: $jobId}), (s:Skill {id: $skillId})
           MERGE (j)-[r:REQUIRES]->(s)
           SET r.importance = $importance`,
          { jobId: job.id, skillId: req.skillId, importance: req.importance }
        );
      }
    }

    // 9. Create Skill Relationships (Skill)-[:RELATED_TO]->(Skill)
    console.log('🔗 Inserting (Skill)-[:RELATED_TO]->(Skill)...');
    for (const rel of skillRelationships) {
      await session.run(
        `MATCH (s1:Skill {id: $fromId}), (s2:Skill {id: $toId})
         MERGE (s1)-[:RELATED_TO]->(s2)
         MERGE (s2)-[:RELATED_TO]->(s1)`,
        { fromId: rel.from, toId: rel.to }
      );
    }

    // 10. Verification Counts
    console.log('\n📊 Database Node & Relationship Summary:');
    const nodeCounts = await session.run(`
      MATCH (c:Candidate) WITH count(c) AS candidates
      MATCH (j:Job) WITH candidates, count(j) AS jobs
      MATCH (s:Skill) WITH candidates, jobs, count(s) AS skills
      MATCH (comp:Company) WITH candidates, jobs, skills, count(comp) AS companies
      MATCH (p:Project) WITH candidates, jobs, skills, companies, count(p) AS projects
      MATCH (t:Technology) WITH candidates, jobs, skills, companies, projects, count(t) AS technologies
      RETURN candidates, jobs, skills, companies, projects, technologies
    `);

    const relCounts = await session.run(`
      MATCH ()-[r]->()
      RETURN type(r) AS relType, count(r) AS count
      ORDER BY count DESC
    `);

    if (nodeCounts.records.length > 0) {
      const stats = nodeCounts.records[0].toObject();
      console.table({
        Candidates: stats.candidates?.toNumber ? stats.candidates.toNumber() : stats.candidates,
        Jobs: stats.jobs?.toNumber ? stats.jobs.toNumber() : stats.jobs,
        Skills: stats.skills?.toNumber ? stats.skills.toNumber() : stats.skills,
        Companies: stats.companies?.toNumber ? stats.companies.toNumber() : stats.companies,
        Projects: stats.projects?.toNumber ? stats.projects.toNumber() : stats.projects,
        Technologies: stats.technologies?.toNumber ? stats.technologies.toNumber() : stats.technologies,
      });
    }

    console.log('Relationships created:');
    relCounts.records.forEach((rec) => {
      const type = rec.get('relType');
      const count = rec.get('count');
      console.log(`  - [:${type}] -> ${count?.toNumber ? count.toNumber() : count}`);
    });

    console.log('\n🎉 TalentGraph database seeded successfully into CognoDB!\n');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  } finally {
    await session.close();
    await closeDriver();
  }
}

if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
