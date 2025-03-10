# Web3 Crypto Tracker & Airdrop Dashboard with AI Analysis

## Overview

This project is a **Web3 Crypto Tracker & Airdrop Dashboard** built using **Next.js** for the frontend and **Express.js** for the backend. The application provides real-time cryptocurrency price tracking, a list of the latest airdrops, and AI-powered market analysis. It also includes a wallet connection feature using **ethers.js** and a modern, responsive UI powered by **Tailwind CSS**.

---

## Features

### Frontend (Next.js)
- **Cryptocurrency Price Table**: Displays live cryptocurrency prices fetched from CoinGecko API.
- **Airdrop List**: Shows the latest airdrops scraped from Airdrops.io.
- **Wallet Connection**: Allows users to connect their Ethereum wallet using **ethers.js**.
- **AI Market Analysis**: Provides AI-based market analysis with visualizations using **Recharts**.
- **Responsive Design**: Optimized for all screen sizes (desktop, tablet, mobile).
- **Dark Mode UI**: Modern Web3-inspired dark mode theme using Tailwind CSS.

### Backend (Express.js via Next.js API Routes)
- **Crypto Prices Endpoint**: Fetches real-time cryptocurrency data from CoinGecko.
- **Airdrops Endpoint**: Scrapes the latest airdrop data from Airdrops.io.
- **AI Analysis Endpoint**: Provides AI-based market analysis.

---

## Project Structure

```
web3-analysis-dashboard/
├── components/
│   ├── CryptoPriceTable.js
│   ├── AirdropList.js
│   ├── ConnectWalletButton.js
│   └── AIAnalysisComponent.js
├── pages/
│   ├── api/
│   │   ├── crypto-prices.js
│   │   ├── airdrops.js
│   │   └── ai-analysis.js
│   ├── _app.js
│   └── index.js
├── styles/
│   └── globals.css
├── utils/
│   └── api.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .gitignore
```

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/web3-analysis-dashboard.git
   cd web3-analysis-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## API Endpoints

### 1. Crypto Prices
- **Endpoint**: `/api/crypto-prices`
- **Method**: `GET`
- **Description**: Fetches real-time cryptocurrency prices from CoinGecko API.
- **Response**:
  ```json
  [
    {
      "id": "bitcoin",
      "symbol": "btc",
      "name": "Bitcoin",
      "current_price": 42000,
      "price_change_percentage_24h": 1.5
    }
  ]
  ```

### 2. Airdrops
- **Endpoint**: `/api/airdrops`
- **Method**: `GET`
- **Description**: Scrapes the latest airdrops from Airdrops.io.
- **Response**:
  ```json
  [
    {
      "name": "Project A",
      "description": "Airdrop for Project A",
      "link": "https://airdrops.io/project-a"
    }
  ]
  ```

### 3. AI Analysis
- **Endpoint**: `/api/ai-analysis`
- **Method**: `GET`
- **Description**: Provides AI-based market analysis.
- **Response**:
  ```json
  {
    "analysis": "The market is trending upwards with a 70% confidence level.",
    "visualization_data": {
      "labels": ["Jan", "Feb", "Mar"],
      "data": [65, 59, 80]
    }
  }
  ```

---

## Technologies Used

- **Frontend**:
  - Next.js
  - Tailwind CSS
  - ethers.js (for wallet connection)
  - Recharts (for data visualization)

- **Backend**:
  - Express.js (via Next.js API routes)
  - Axios (for API requests)
  - Cheerio (for web scraping)

---

## Deployment

This project is ready for deployment on **Vercel**. Follow these steps:

1. Push your code to a Git repository (e.g., GitHub).
2. Log in to [Vercel](https://vercel.com/).
3. Import your repository and deploy.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data.
- [Airdrops.io](https://airdrops.io/) for airdrop data.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Recharts](https://recharts.org/) for data visualization.

---

## Contact

For any questions or feedback, feel free to reach out:

- **Email**: muhammadfaathir004@gmail.com
- **Linkedin**: [Faathir azukhruf](www.linkedin.com/in/faathir-azukhruf-61335b307)

---

Enjoy building and exploring the Web3 world! 🚀