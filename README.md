# PDF Viewer

A modern, responsive PDF viewer built with PDF.js, Vite, and vanilla JavaScript.

🔗 **Live Demo**: [https://sphiment.github.io/pdf-host/](https://sphiment.github.io/pdf-host/)

## Features

- 📄 Load and view PDF files from your computer
- 📄 Auto-loads `main.pdf` if present in the project
- 🔍 Zoom in and out with smooth scaling
- 📱 Responsive design that works on desktop and mobile
- ⌨️ Keyboard navigation support
- 🎨 Modern dark/light theme support
- 🚀 Fast loading with Vite build system

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` to view the application.

### Building for Production

Build the project for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

### Deploying to GitHub Pages

This project is configured for automatic deployment to GitHub Pages:

1. Push your changes to the `main` branch
2. GitHub Actions will automatically build and deploy the site
3. Your site will be available at `https://yourusername.github.io/pdf-host/`

Manual deployment:
```bash
npm run build
# Upload the contents of the 'dist' folder to your web server
```

## Usage

1. Click the "Choose File" button to select a PDF file from your computer
2. Use the navigation buttons or arrow keys to move between pages
3. Use the zoom buttons or +/- keys to zoom in and out
4. The viewer automatically adjusts to different screen sizes

## Keyboard Shortcuts

- **Arrow Keys**: Navigate between pages
- **+ or =**: Zoom in
- **-**: Zoom out

## Technology Stack

- **PDF.js**: Mozilla's PDF rendering library
- **Vite**: Fast build tool and development server
- **Vanilla JavaScript**: Pure JavaScript with no frameworks
- **CSS3**: Modern styling with responsive design

## Browser Support

This application works in all modern browsers that support:
- ES6 modules
- Canvas API
- File API
- PDF.js

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
