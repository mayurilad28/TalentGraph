# TalentGraph — Job & Skill Recommendation Graph

[![Database](https://img.shields.io/badge/Database-CognoDB%20Cloud-6366f1?style=for-the-badge&logo=neo4j&logoColor=white)](https://console.cognodb.com)
[![Protocol](https://img.shields.io/badge/Protocol-Bolt%205.x%20%2F%20openCypher-10b981?style=for-the-badge)](https://opencypher.org)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript%20%2B%20Vite-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://vitejs.dev)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)

**TalentGraph** is a full-stack talent intelligence application built for the **Wexa AI CognoDB Take-Home Assignment**. It demonstrates graph data modeling, multi-hop relationship traversals, and dynamic recommendation scoring powered by **CognoDB** (openCypher over the Bolt protocol) and the official Neo4j JavaScript driver.

---

## 🌟 Demo & Submission Links
- **Live Hosted Application**: `https://talentgraph-demo.vercel.app` *(or your deployed Vercel link)*
- **Demo Screen Recording**: `https://www.loom.com/share/your-demo-recording-id`
- **GitHub Repository**: `https://github.com/mayurilad28/TalentGraph`

---

## 📑 Table of Contents
1. [Why a Graph Database?](#-why-a-graph-database)
2. [Graph Data Model & Architecture](#-graph-data-model--architecture)
3. [Key Features](#-key-features)
4. [Important openCypher Queries Explained](#-important-opencypher-queries-explained)
5. [Tech Stack](#-tech-stack)
6. [CognoDB Cloud Setup Guide](#-cognodb-cloud-setup-guide)
7. [Local Setup & Seed Instructions](#-local-setup--seed-instructions)
8. [Testing & Verification](#-testing--verification)
9. [Deployment Guide](#-deployment-guide)
10. [Application Screenshots](#-application-screenshots)

---

## 💡 Why a Graph Database?

In recruitment and talent intelligence, the most valuable insights come from **relationships and connectivity**, not isolated tabular rows.

### The Relational Limitation
In a traditional relational (SQL) database, answering *"Which jobs match a candidate's skills and which skills are missing?"* requires joining across at least 5 separate tables (`candidates`, `candidate_skills`, `skills`, `job_skills`, `jobs`, `companies`).

When extending the inquiry to answer:
1. *"What technologies has a candidate used hands-on across their past projects?"*
2. *"Which related skills could bridge a candidate's gap for a target job?"*
3. *"What is the blast radius or candidate pool when a company posts a new multi-discipline opening?"*

A relational database must perform recursive joins (`JOIN ... JOIN ... JOIN`) or complex Common Table Expressions (CTEs). As the schema and dataset expand:
- **Join Exponential Complexity**: Each hop introduces combinatorial join explosion and Cartesian products.
- **Fragile Schema Evolution**: Adding new entities (e.g., certifications, open-source repositories) requires rigid junction tables and migration overhead.
- **Awkward Match Logic**: Calculating dynamic intersection sets (matched vs missing skills) in SQL requires cumbersome `GROUP BY`, `HAVING`, and nested subqueries.

### Why CognoDB and openCypher Earn Their Place
CognoDB treats relationships as **first-class citizens** with **index-free adjacency**. Traversing from a `Candidate` node to a `Skill` or `Project` node is an $O(1)$ memory pointer traversal rather than an $O(\log N)$ or $O(N)$ index lookup per record.

```text
Candidate ──[:HAS_SKILL]──► Skill ◄──[:REQUIRES]── Job ──[:POSTED_BY]──► Company
    │
    └──[:WORKED_ON]──► Project ──[:USES]──► Technology
```

1. **Multi-Hop Traversal in Expressive Syntax**: A 2-hop indirect technology lookup is simply:
   ```cypher
   MATCH (c:Candidate {id: $id})-[:WORKED_ON]->(p:Project)-[:USES]->(t:Technology)
   RETURN DISTINCT t
   ```
2. **Dynamic Compatibility Scoring Directly in the Engine**: Set intersections, matched skill counts, missing skill arrays, and match percentages are computed natively in Cypher in a single parameterized round-trip.
3. **Upskilling Graph Pathways**: Finding adjacent skills that unlock new job tiers is expressed naturally by traversing `(Candidate)-[:HAS_SKILL]->(s1)-[:RELATED_TO]->(s2)`.

---

## 📐 Graph Data Model & Architecture

### Graph Data Model (Mermaid Diagram)

```mermaid
graph TD
    Candidate["👤 Candidate\n(id, name, title, experienceYears, location, avatar)"]
    Skill["🏷️ Skill\n(id, name, category)"]
    Project["📁 Project\n(id, name, domain, year, description)"]
    Technology["💻 Technology\n(id, name, category)"]
    Job["💼 Job\n(id, title, location, employmentType, experienceMin/Max)"]
    Company["🏢 Company\n(id, name, industry, logo)"]

    Candidate -->|HAS_SKILL| Skill
    Candidate -->|WORKED_ON {role, durationMonths}| Project
    Project -->|USES| Technology
    Job -->|REQUIRES {importance}| Skill
    Job -->|POSTED_BY| Company
    Skill -->|RELATED_TO| Skill
```

### Node Types & Properties
| Node Label | Key Properties | Description |
| :--- | :--- | :--- |
| **`Candidate`** | `id`, `name`, `title`, `location`, `experienceYears`, `summary`, `avatar` | Engineers and designers with skill graphs and portfolios |
| **`Skill`** | `id`, `name`, `category` (Frontend, Backend, Database, Architecture, DevOps) | Technical capabilities and domain specializations |
| **`Project`** | `id`, `name`, `description`, `domain`, `year` | Real-world projects delivered by candidates |
| **`Technology`** | `id`, `name`, `category` | Underlying tech stack components used inside projects |
| **`Job`** | `id`, `title`, `description`, `location`, `employmentType`, `experienceMin`, `experienceMax` | Open engineering roles with weighted skill requirements |
| **`Company`** | `id`, `name`, `industry`, `logo` | Organizations posting job opportunities |

### Relationship Types & Properties
| Relationship | Connecting Nodes | Properties | Description |
| :--- | :--- | :--- | :--- |
| **`[:HAS_SKILL]`** | `(Candidate) -> (Skill)` | — | Direct skill possessed by candidate |
| **`[:WORKED_ON]`** | `(Candidate) -> (Project)` | `role`, `durationMonths` | Candidate project experience |
| **`[:USES]`** | `(Project) -> (Technology)` | — | Technologies utilized in project |
| **`[:REQUIRES]`** | `(Job) -> (Skill)` | `importance` ('Required' / 'Preferred') | Skills demanded for an open role |
| **`[:POSTED_BY]`** | `(Job) -> (Company)` | — | Organization offering the position |
| **`[:RELATED_TO]`** | `(Skill) -> (Skill)` | — | Bidirectional skill affinity for upskilling |

---

## 🚀 Key Features

1. **Dashboard Intelligence (`/`)**:
   - High-level platform KPIs (Total Candidates, Jobs, Skills, Companies).
   - Top high-confidence matching opportunities calculated from graph relationships.
   - Built-in **openCypher Query Inspector** displaying real-time Cypher code and traversal metrics.

2. **Candidate Explorer & Deep Profile (`/candidates`, `/candidates/:id`)**:
   - Search by name, title, and filter by skill.
   - Profile breakdown with direct skills, projects worked on, and **indirect technologies discovered via projects** (2-hop traversal).
   - **Upskilling Suggestions**: Graph-recommended skills to learn via `(Skill)-[:RELATED_TO]->(Skill)`.
   - **Find Matching Jobs**: Graph traversal calculating exact match percentages, matched skills, and missing skills.

3. **Job Explorer & Candidate Matching (`/jobs`, `/jobs/:id`)**:
   - Filter jobs by company, required skill, or search keyword.
   - Job specification breakdown with required vs preferred skills.
   - **Find Matching Candidates**: Reverse graph traversal ranking candidates by skill compatibility and experience.

4. **Interactive Graph Explorer (`/graph`)**:
   - Force-directed 2D network diagram rendered with `vis-network`.
   - Center on a specific candidate or job to inspect their subgraph.
   - Color-coded nodes (Candidate: Indigo, Job: Pink, Skill: Emerald, Company: Amber, Project: Purple, Tech: Cyan).
   - Node detail inspector drawer with direct deep-links.

5. **Resilient Failure Handling**:
   - Database health check endpoint (`GET /api/health`).
   - Graceful offline error banners with auto-retry and clear user guidance when CognoDB is cold-starting or offline.

---

## 🔍 Important openCypher Queries Explained

All queries are 100% parameterized via the official Neo4j driver (`session.run(query, params)`) with zero string concatenation.

### 1. Multi-Hop Traversal: Indirect Technologies via Projects
> **Hops**: 2 Hops (`Candidate -> Project -> Technology`)  
> **Advantage**: Discovers tools a candidate used hands-on in real projects even if not explicitly listed in their direct skill tags.

```cypher
MATCH (c:Candidate {id: $candidateId})-[:WORKED_ON]->(p:Project)-[:USES]->(t:Technology)
RETURN DISTINCT
  t.id AS id,
  t.name AS name,
  t.category AS category,
  collect(DISTINCT p.name) AS usedInProjects,
  count(DISTINCT p) AS projectCount
ORDER BY projectCount DESC, t.name ASC
```

### 2. Multi-Hop Matching: Candidate to Jobs with Matched & Missing Skills
> **Hops**: 3 Hops (`Candidate -> Skill <- Job -> Company`)  
> **Advantage**: Dynamically computes intersection sets and missing skill lists without nested SQL sub-queries.

```cypher
MATCH (c:Candidate {id: $candidateId})
MATCH (j:Job)-[:POSTED_BY]->(comp:Company)
MATCH (j)-[r:REQUIRES]->(required:Skill)
WITH c, j, comp, collect(DISTINCT required) AS allRequiredSkills

OPTIONAL MATCH (c)-[:HAS_SKILL]->(matched:Skill)<-[:REQUIRES]-(j)
WITH c, j, comp, allRequiredSkills, collect(DISTINCT matched) AS matchedSkills

WITH c, j, comp, allRequiredSkills, matchedSkills,
     [s IN allRequiredSkills WHERE NOT s IN matchedSkills] AS missingSkills,
     size(matchedSkills) AS matchedCount,
     size(allRequiredSkills) AS requiredCount

WHERE requiredCount > 0 AND matchedCount > 0

RETURN
  j AS job,
  comp AS company,
  matchedSkills,
  missingSkills,
  allRequiredSkills,
  matchedCount,
  requiredCount,
  round((toFloat(matchedCount) / toFloat(requiredCount)) * 100) AS matchScore
ORDER BY matchScore DESC, matchedCount DESC, j.title ASC
```

### 3. Reverse Graph Traversal: Job to Top Ranked Candidates
> **Hops**: 2 Hops (`Job -> Skill <- Candidate`)  
> **Advantage**: Instantly ranks candidates by matching skill density.

```cypher
MATCH (j:Job {id: $jobId})
MATCH (j)-[r:REQUIRES]->(required:Skill)
WITH j, collect(DISTINCT required) AS allRequiredSkills

MATCH (c:Candidate)
OPTIONAL MATCH (c)-[:HAS_SKILL]->(matched:Skill)<-[:REQUIRES]-(j)
WITH j, c, allRequiredSkills, collect(DISTINCT matched) AS matchedSkills

WITH j, c, allRequiredSkills, matchedSkills,
     [s IN allRequiredSkills WHERE NOT s IN matchedSkills] AS missingSkills,
     size(matchedSkills) AS matchedCount,
     size(allRequiredSkills) AS requiredCount

WHERE requiredCount > 0 AND matchedCount > 0

RETURN
  c AS candidate,
  matchedSkills,
  missingSkills,
  allRequiredSkills,
  matchedCount,
  requiredCount,
  round((toFloat(matchedCount) / toFloat(requiredCount)) * 100) AS matchScore
ORDER BY matchScore DESC, matchedCount DESC, c.experienceYears DESC
```

### 4. Upskilling Recommendation: Related Skills Pathway
> **Hops**: 2 Hops (`Candidate -> Skill -> RELATED_TO -> Skill`)  
> **Advantage**: Recommends skills that complement a candidate's current capabilities to bridge job qualification gaps.

```cypher
MATCH (c:Candidate {id: $candidateId})-[:HAS_SKILL]->(mySkill:Skill)-[:RELATED_TO]->(recommended:Skill)
WHERE NOT (c)-[:HAS_SKILL]->(recommended)
RETURN
  recommended.id AS id,
  recommended.name AS name,
  recommended.category AS category,
  collect(DISTINCT mySkill.name) AS relatedToCurrentSkills,
  count(DISTINCT mySkill) AS connectionStrength
ORDER BY connectionStrength DESC, recommended.name ASC
LIMIT 6
```

---

## 🛠️ Tech Stack

- **Database**: [CognoDB Cloud](https://console.cognodb.com) (openCypher / Bolt protocol 5.0–5.4)
- **Backend**: Node.js, Express, TypeScript, official `neo4j-driver`, `zod`, `dotenv`
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router 6, Lucide Icons
- **Visualization**: `vis-network` (interactive force-directed graph canvas)

---

## ☁️ CognoDB Cloud Setup Guide

1. **Create an Account**:
   - Go to [https://console.cognodb.com/signup](https://console.cognodb.com/signup) and sign up (No credit card required).
2. **Create a Free Instance**:
   - Create a free (`c0`) instance in your preferred region. It provisions in under 60 seconds.
3. **Save Connection Details**:
   - Copy the Bolt URI: `bolt+s://<instance-id>.databases.cognodb.cloud`
   - Copy the generated password for user `cognodb`.
4. **Configure `.env`**:
   - Copy `.env.example` to `.env` and fill in your credentials:
     ```env
     COGNODB_URI=bolt+s://your-instance.databases.cognodb.cloud
     COGNODB_USERNAME=cognodb
     COGNODB_PASSWORD=your-generated-password
     PORT=5000
     ```

---

## 💻 Local Setup & Seed Instructions

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/talentgraph.git
cd talentgraph

# Install root, server, and client dependencies
npm run install:all
```

### 2. Seed CognoDB Graph Database
Populates 24 candidates, 16 jobs, 35 skills, 8 companies, 16 projects, 20 technologies, and all multi-hop relationships:
```bash
npm run seed
```

### 3. Run Development Server
Starts both the Express API (`localhost:5000`) and the Vite React frontend (`localhost:5173`) concurrently:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧪 Testing & Verification

Run the automated backend test suite to verify driver parameterization, recommendation math, and error handling:
```bash
npm run test:server
```

To verify TypeScript builds:
```bash
npm run build
```

---

## 🚀 Deployment Guide

### Deploy Frontend (Vercel)
1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set **Root Directory** to `client`.
4. Add environment variable:
   - `VITE_API_URL`: URL of your deployed backend (e.g. `https://talentgraph-api.onrender.com/api`).
5. Deploy.

### Deploy Backend (Render / Railway)
1. Create a new Web Service on [Render](https://render.com) or [Railway](https://railway.app).
2. Set **Root Directory** to `server`.
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `npm start`
5. Add Environment Variables:
   - `COGNODB_URI`: `bolt+s://<instance-id>.databases.cognodb.cloud`
   - `COGNODB_USERNAME`: `cognodb`
   - `COGNODB_PASSWORD`: `<your-password>`
   - `PORT`: `5000`
   - `NODE_ENV`: `production`

---

## 📸 Application Screenshots

| Screen | Description |
| :--- | :--- |
| **Dashboard** | Metrics overview, top graph-matched opportunities, and Cypher inspector |
| **Candidate Profile** | Direct skills, project portfolio, and indirect project technologies (2-hop) |
| **Job Recommendations** | Real-time graph match percentage, matched skills, and missing skills |
| **Job Details & Matches** | Reverse graph candidate ranking with skill compatibility breakdown |
| **Graph Explorer** | Interactive 2D force-directed network diagram with node detail drawer |

---

## 📄 License & Attribution
Submitted for the **Wexa AI CognoDB Take-Home Assignment**. Backed by CognoDB Cloud graph database.
