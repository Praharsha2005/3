# Sciencify

A full-stack web application that functions as an e-commerce platform for student projects with collaboration features for businesses.

## Features

- **E-commerce Platform**: Students can showcase and sell their projects
- **Seller Dashboard**: Students can upload and manage their projects
- **Collaboration Hub**: Businesses can connect with students for partnerships
- **Shopping Cart**: Users can purchase projects
- **User Authentication**: Separate accounts for students and business professionals

## Tech Stack

- **Frontend**: Next.js 13+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd sciencify
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Deployment

This application is configured for deployment on Vercel:

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Vercel will automatically detect the Next.js framework and configure the build settings
4. Deploy!

## Project Structure

```
sciencify/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/             # API routes
│   │   ├── components/      # React components
│   │   ├── lib/             # Utility functions
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Helper functions
│   │   ├── auth/            # Authentication pages
│   │   ├── cart/            # Shopping cart pages
│   │   ├── collaborate/     # Collaboration pages
│   │   ├── products/        # Product listing pages
│   │   ├── seller/          # Seller dashboard pages
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── public/              # Static assets
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database connection (example)
DATABASE_URL=your_database_url

# Authentication secrets
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# API keys (examples)
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vercel Documentation](https://vercel.com/docs)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.