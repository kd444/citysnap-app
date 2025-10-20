# City Snap - No-Key City Information App

A beautiful Next.js app that provides instant information about any city using free public APIs. Perfect for learning CI/CD with Azure Static Web Apps!

## Features

-   🌤️ **Weather & 5-day forecast** from Open-Meteo
-   🌅 **Sunrise/Sunset times** from sunrise-sunset.org
-   🎉 **Public holidays** from Nager.Date
-   📖 **Wikipedia summaries** from Wikipedia REST API
-   🚀 **Next SpaceX launch** from SpaceX API
-   🎨 **Beautiful UI** with Tailwind CSS
-   ⚡ **Fast loading** with Next.js 14 App Router
-   🔄 **Auto-deployment** to Azure Static Web Apps

## No API Keys Required!

All APIs used are completely free and public:

-   [Open-Meteo](https://open-meteo.com/) - Weather & geocoding
-   [Sunrise-Sunset API](https://sunrise-sunset.org/api) - Solar times
-   [Nager.Date](https://date.nager.at/) - Public holidays
-   [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/) - City summaries
-   [SpaceX API](https://docs.spacexdata.com/) - Launch information

## Quick Start

### Local Development

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd city-snap
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Run the development server**

    ```bash
    npm run dev
    ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Deploy to Azure Static Web Apps

1. **Push to GitHub**

    ```bash
    git add .
    git commit -m "Initial commit"
    git push origin main
    ```

2. **Create Azure Static Web App**

    - Go to [Azure Portal](https://portal.azure.com)
    - Create a new "Static Web App" resource
    - Connect your GitHub repository
    - Set build presets to "Next.js"
    - Azure will automatically create the deployment workflow

3. **Configure Build Settings**

    - App location: `/`
    - Output location: `out` (for static export)
    - API location: (leave empty)

4. **Deploy**
    - Azure will automatically deploy on every push to main
    - Your app will be available at `https://your-app-name.azurestaticapps.net`

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── Card.tsx             # Reusable card component
│   ├── CityForm.tsx         # Search form
│   └── CitySnapshot.tsx     # City data display
├── lib/
│   └── apis.ts              # API integration functions
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml  # CI/CD workflow
└── README.md
```

## API Integration

The app fetches data from multiple APIs in parallel for optimal performance:

```typescript
// Example: Get all data for a city
const [weather, sunrise, holidays, wiki, spacex] = await Promise.all([
    getWeather(lat, lon),
    getSunriseSunset(lat, lon),
    getHolidays(country, year),
    getWikiSummary(cityName),
    getSpaceXNextLaunch(),
]);
```

## Technologies Used

-   **Next.js 14** - React framework with App Router
-   **TypeScript** - Type safety
-   **Tailwind CSS** - Utility-first CSS framework
-   **Azure Static Web Apps** - Hosting and CI/CD
-   **GitHub Actions** - Automated deployment

## Learning Objectives

This project is perfect for learning:

-   ✅ **Next.js App Router** with server components
-   ✅ **TypeScript** integration
-   ✅ **API integration** with multiple endpoints
-   ✅ **Responsive design** with Tailwind CSS
-   ✅ **CI/CD pipelines** with GitHub Actions
-   ✅ **Azure Static Web Apps** deployment
-   ✅ **Performance optimization** with caching
-   ✅ **Error handling** and loading states

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and building your own apps!

---

**Happy coding! 🚀**

