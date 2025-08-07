import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.COINGECKO_API_KEY;
  
  if (!apiKey) {
    console.error("COINGECKO_API_KEY not found in environment variables");
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Using CoinGecko Demo API with markets endpoint for more detailed data
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum&x_cg_demo_api_key=" + apiKey,
      {
        headers: {
          "Accept": "application/json",
        },
        // Cache for 5 minutes
        next: { revalidate: 300 }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CoinGecko API error: ${response.status} - ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("CoinGecko Markets API response:", data);

    if (!Array.isArray(data) || data.length === 0 || !data[0]?.current_price) {
      console.error("Invalid response structure:", data);
      throw new Error("Invalid response from CoinGecko API");
    }

    const ethData = data[0];
    return NextResponse.json({ 
      usd: ethData.current_price,
      price_change_percentage_24h: ethData.price_change_percentage_24h,
      timestamp: Date.now(),
      source: "coingecko-demo"
    });
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch ETH price" },
      { status: 500 }
    );
  }
}