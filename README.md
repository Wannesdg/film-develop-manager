# Film Develop Manager

A Next.js application for managing film photography development processes, including tracking chemicals, film rolls, recipes, and statistics.

## Features

- 📷 **Film Rolls**: Track and manage your film rolls
- 🧪 **Chemicals**: Manage developing chemicals and their properties
- 📋 **Recipes**: Store and organize development recipes
- 📊 **Statistics**: View analytics and insights about your development process
- 🎨 **Theme Support**: Light and dark mode support
- 📱 **Responsive**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Package Manager**: npm (with legacy peer deps support)

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Wannesdg/film-develop-manager.git
   cd film-develop-manager
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   
   > **Note**: The `--legacy-peer-deps` flag is required due to React version conflicts with some dependencies (specifically `vaul` package compatibility with React 19).

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### WSL Users

If you're running this on Windows Subsystem for Linux (WSL):

1. Make sure you're in the WSL terminal
2. Follow the installation steps above
3. Access the app at `http://localhost:3000` from your Windows browser

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Development

The application uses:

- **App Router** (Next.js 13+ routing)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Hook Form** for form management
- **Local Storage** for data persistence

### Project Structure

```
├── app/                    # Next.js app router pages
│   ├── chemicals/         # Chemical management pages
│   ├── film-rolls/        # Film roll management pages
│   ├── recipes/           # Recipe management pages
│   └── stats/             # Statistics pages
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (Radix UI)
│   └── *.tsx             # Feature-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and types
└── public/               # Static assets
```

## Troubleshooting

### Dependency Issues

If you encounter dependency resolution errors, try:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall with legacy peer deps
npm install --legacy-peer-deps
```

### Port Already in Use

If port 3000 is already in use, Next.js will automatically use the next available port (3001, 3002, etc.).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.
