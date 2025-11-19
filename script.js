// Add JavaScript code for your web site here and call it from index.html.

//  ==========  FAKE LIVE MARKET DATA  ==========  //

// Our "universe" of instruments
const INSTRUMENTS = [
    { symbol: "SPY", display: "$SPY",  type: "ETF",   basePrice: 529.71 },
    { symbol: "QQQ", display: "$QQQ",  type: "ETF",   basePrice: 460.25 },
    { symbol: "IWM", display: "$IWM",  type: "ETF",   basePrice: 214.10 },
    { symbol: "TLT", display: "TLT",   type: "Bond",  basePrice: 96.40 },
    { symbol: "LQD", display: "LQD",   type: "Bond",  basePrice: 110.32 },
  
    { symbol: "AAPL", display: "$AAPL", type: "Stock", basePrice: 226.57 },
    { symbol: "MSFT", display: "$MSFT", type: "Stock", basePrice: 454.91 },
    { symbol: "NVDA", display: "$NVDA", type: "Stock", basePrice: 114.66 },
    { symbol: "TSLA", display: "$TSLA", type: "Stock", basePrice: 210.44 },
    { symbol: "JPM",  display: "$JPM",  type: "Stock", basePrice: 196.12 },
  
    { symbol: "GLD", display: "GLD", type: "ETF", basePrice: 226.32 },
    { symbol: "USO", display: "USO", type: "ETF", basePrice: 76.41 },
  
    // Include fake option contracts//
    { symbol: "AAPL_1220C_200", display: "AAPL 12/20 200C", type: "Option", basePrice: 7.25 },
    { symbol: "SPY_1220P_500",  display: "SPY 12/20 500P",  type: "Option", basePrice: 9.80 }
  ];
  
  // Initialize live fields
  INSTRUMENTS.forEach(inst => {
    inst.price = inst.basePrice;
    inst.change = 0;
    inst.changePercent = "0.00%";
  });
  
  // Subset for the Market Snapshot cards (no options – just the main stuff)
  const SNAPSHOT_SYMBOLS = INSTRUMENTS.filter(
    inst => inst.type !== "Option"
  ).slice(0, 6); // first 6 instruments
  
  // Small random walk to simulate live price moves
  function randomWalkUpdate() {
    INSTRUMENTS.forEach(inst => {
      // ±0.4% random move each tick
      const pctMove = (Math.random() - 0.5) * 0.008; // -0.4% .. +0.4%
  
      // New price
      inst.price = +(inst.price * (1 + pctMove)).toFixed(2);
  
      // Change vs base (our fake "previous close")
      inst.change = +(inst.price - inst.basePrice).toFixed(2);
      inst.changePercent = ((inst.change / inst.basePrice) * 100).toFixed(2) + "%";
    });
  }
  
  // Build ticker + snapshot HTML from current instrument state
  function renderMarket(tickerInner, snapshotGrid) {
    randomWalkUpdate(); // move prices a tiny bit first
  
    // ----- TICKER -----
    let tickerHtml = "";
  
    INSTRUMENTS.forEach(inst => {
      const directionClass =
        inst.change > 0 ? "change-up" :
        inst.change < 0 ? "change-down" :
        "change-flat";
  
      tickerHtml += `
        <span class="ticker-item">
          <span class="ticker-symbol">${inst.display}</span>
          <span class="ticker-price">${inst.price.toFixed(2)}</span>
          <span class="ticker-change ${directionClass}">
            ${inst.change >= 0 ? "+" : ""}${inst.change.toFixed(2)}
            (${inst.changePercent})
          </span>
        </span>
      `;
    });
  
    // Duplicate once so the ticker loops smoothly
    tickerInner.innerHTML = tickerHtml + tickerHtml;
  
    // ----- SNAPSHOT CARDS -----
    let snapshotHtml = "";
  
    SNAPSHOT_SYMBOLS.forEach(inst => {
      const directionClass =
        inst.change > 0 ? "change-up" :
        inst.change < 0 ? "change-down" :
        "change-flat";
  
      snapshotHtml += `
        <div class="snapshot-card">
          <div class="snapshot-symbol">${inst.display}</div>
          <div class="snapshot-price">${inst.price.toFixed(2)}</div>
          <div class="snapshot-change ${directionClass}">
            ${inst.change >= 0 ? "+" : ""}${inst.change.toFixed(2)}
            (${inst.changePercent})
          </div>
        </div>
      `;
    });
  
    snapshotGrid.innerHTML = snapshotHtml;
  }
  
  // Hook into DOM
  document.addEventListener("DOMContentLoaded", () => {
    const tickerInner = document.getElementById("ticker-inner");
    const snapshotGrid = document.getElementById("snapshot-grid");
  
    if (!tickerInner || !snapshotGrid) return;
  
    // First render
    renderMarket(tickerInner, snapshotGrid);
  
    // Update every 5 seconds
    setInterval(() => renderMarket(tickerInner, snapshotGrid), 5000);
  });
  
  
  
  
  
  
  