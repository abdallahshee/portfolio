# Portfolio Website

A modern personal portfolio website built with Next.js and Supabase to showcase projects, technical skills, work experience, and contact information in a clean and responsive interface.

---

## Overview

This portfolio website is designed to present my professional profile, highlight featured projects, and give visitors an easy way to learn more about my background as a developer.

The site focuses on:

* Showcasing projects and technical skills
* Presenting a clean and responsive user experience
* Providing a professional online presence
* Demonstrating modern full-stack development practices
* Making it easy for recruiters or clients to contact you

---

## Features

* Responsive design for desktop, tablet, and mobile devices
* Project showcase section
* Skills and technologies section
* About me section
* Contact form or contact links
* Fast performance and modern UI design
* Smooth navigation experience

---

## Tech Stack

**Frontend**

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* Mantine UI

**Backend / Backend as a Service (BaaS)**

* Supabase

  * Authentication
  * Database
  * File Storage

**Deployment**

* Vercel 

---

## Project Structure

```bash
portfolio-website/
│
├── public/                     # Static assets such as images, icons, and downloadable files
├── src/
│   ├── app/                    # Next.js App Router pages, layouts, and global stylesheet
│   ├── components/             # Reusable UI components used across the application
│   ├── css/                    # Component-specific CSS modules or custom CSS files
│   ├── db/                     # Database schemas, types, and database helpers
│   ├── lib/                    # Supabase browser client and server client setup
│   ├── server/                 # Server-side data functions and Server Actions
│   └── sql/                    # SQL scripts, triggers, views, policies, and migrations
│
├── components.json             # shadcn/ui or component configuration file
├── drizzle.config.ts           # Drizzle ORM configuration
├── package-lock.json           # Locked dependency versions
├── package.json                # Project metadata and scripts
├── README.md                   # Project documentation
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration

---

## Installation

Clone the repository:

```bash
git clone hhttps://github.com/abdallahshee/portfolio
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

---

## Environment Variables

Supabase Environment Variables Setup

This project uses Supabase for authentication, database access, and file storage.

Step 1: Create a Supabase Project
Go to the Supabase dashboard.
Create a new project.
Wait for the database and project to finish provisioning.
Step 2: Get Your Supabase Credentials

Inside your Supabase project:

Open Project Settings.
Navigate to API.
Copy the following values:
Project URL
Publishable / Anonymous Key
Step 3: Create an Environment File

Create a .env.local file in the root of your project.

Example:
# Supabase Project URL (public, browser-accessible)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Public Anonymous Key (public, browser-accessible)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_public_anon_key

# Server-only variables
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_public_anon_key
---

Important Notes
Never expose your Supabase service role key on the frontend.
Only use public anonymous keys in client-side code.
Add .env.local to .gitignore to avoid pushing secrets to GitHub.
Screenshots


## Screenshots
Add screenshots of your portfolio here.

Example:

```md
![Homepage Screenshot](./public/screenshot.png)
```

## Deployment

You can deploy this project using:

Vercel
Netlify
GitHub Pages
Render

When deploying, remember to add your Supabase environment variables to your hosting platform.

For example, in Vercel:

Open your project dashboard.
Navigate to Settings → Environment Variables.
Add the same variables from your .env.local file.
Redeploy the application.

---

## Future Improvements

* Add blog section
* Improve animations and transitions
* Add CMS integration
* Add analytics tracking

---

## Author

**Your Name**

* Portfolio: your-portfolio-link
* GitHub: [https://github.com/your-username](https://github.com/your-username)
* LinkedIn: your-linkedin-link

---

## License

This project is open-source and available under the MIT License.
