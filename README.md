# Portfolio Website

A modern personal portfolio website built with Next.js to showcase projects, technical skills, and contact information in a clean and responsive interface.

---

## Overview

This portfolio website is designed to present my professional profile, highlight my projects, and give visitors an easy way to learn more about my background as a developer.

The site focuses on:

* Showcasing projects and technical skills
* Presenting a clean and responsive user experience
* Providing a professional online presence
* Making it easy for recruiters or clients to get in touch

---

## Features

* Responsive design for desktop, tablet, and mobile devices
* Project showcase with pagination
* Core tech stack section
* Light/dark theme toggle
* Contact page with downloadable resume
* Fast performance and modern UI design powered by the Next.js App Router

---

## Tech Stack

**Frontend**

* Next.js (App Router)
* React 19
* TypeScript
* Tailwind CSS
* Mantine UI (core, hooks, notifications, forms, dates, carousel, Tiptap rich text editor)

**Data**

* Static, typed project data defined in [`data/data.ts`](./data/data.ts) — no external database, ORM, or backend service is used. Data is read directly through server functions in `src/server/project.functions.ts`.

**Deployment**

* Vercel

---

## Project Structure

```bash
portfolio/
│
├── data/
│   └── data.ts                 # Static project data (source of truth for all projects)
├── public/                     # Static assets such as images, icons, and downloadable files
├── src/
│   ├── app/                    # Next.js App Router pages, layouts, and global stylesheet
│   │   ├── connect/            # Contact page
│   │   └── unauthorized/       # Unauthorized page
│   ├── components/             # Reusable UI components used across the application
│   ├── css/                    # Component-specific CSS modules
│   ├── lib/                    # Shared utility helpers
│   └── server/                 # Server-side data functions that read from data/data.ts
│
├── components.json             # shadcn/ui component configuration file
├── package.json                # Project metadata and scripts
├── README.md                   # Project documentation
├── tsconfig.json               # TypeScript configuration
└── next.config.ts              # Next.js configuration
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/abdallahshee/portfolio
```

Move into the project folder:

```bash
cd portfolio
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The app runs at `http://localhost:3000` by default.

---

## Available Scripts

```bash
npm run dev      # Start the local development server
npm run build    # Create a production build
npm run start    # Serve the production build
npm run test     # Run the test suite with Vitest
```

---

## Environment Variables

This project currently has no required environment variables — all project data is static and bundled with the app, so there's no database or backend service to configure.

---

## Adding or Editing Projects

Projects are managed directly in [`data/data.ts`](./data/data.ts). Add, edit, or remove an entry in the array to update what's shown on the site — no database migrations or seeding required.

---

## Deployment

You can deploy this project using:

* Vercel
* Netlify
* Any platform that supports Next.js

Since there are no environment variables or external services required, deployment is as simple as connecting the repository and building with `npm run build`.

---

## Future Improvements

* Add a blog section
* Improve animations and transitions
* Add analytics tracking

---

## Author

**Abdallah Shee**

* GitHub: [github.com/abdallahshee](https://github.com/abdallahshee)
* LinkedIn: [linkedin.com/in/abdallahshee](https://linkedin.com/in/abdallahshee)

---

## License

This project is open-source and available under the MIT License.
