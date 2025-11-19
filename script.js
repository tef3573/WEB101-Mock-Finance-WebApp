// Add JavaScript code for your web site here and call it from index.html.

//  ==========  MAKING FAKE MOVING LIVE MARKET DATA  ==========  //
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
  ).slice(0, 6); 
  
  // Small random walk to simulate live price moves
  function randomWalkUpdate() {
    INSTRUMENTS.forEach(inst => {
      // ±0.4% random move each tick
      const pctMove = (Math.random() - 0.5) * 0.008; 
  
      // New price
      inst.price = +(inst.price * (1 + pctMove)).toFixed(2);
  
      // Change vs base (our fake "previous close")
      inst.change = +(inst.price - inst.basePrice).toFixed(2);
      inst.changePercent = ((inst.change / inst.basePrice) * 100).toFixed(2) + "%";
    });
  }
  
  // Build ticker + snapshot HTML from current instrument state
  function renderMarket(tickerInner, snapshotGrid) {
    randomWalkUpdate(); 
  
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
  
  // ---------- MOCK LIVE MARKET DATA (no API) TO Build the Snapshot ---------- //
  
  // Six assets: stock, bond, ETF, option, commodity, crypto
  const ASSETS = [
    { symbol: "AAPL",            type: "Stock",      base: 180 },    // Stock
    { symbol: "TLT",             type: "Bond",       base: 100 },    // Bond ETF proxy
    { symbol: "SPY",             type: "ETF",        base: 520 },    // Equity ETF
    { symbol: "AAPL 12/20 200C", type: "Option",     base: 10 },     // Call option
    { symbol: "GLD",             type: "Commodity",  base: 190 },    // Gold ETF
    { symbol: "BTCUSD",          type: "Crypto",     base: 46000 }   // Bitcoin
  ];
  
  
  // Helpers Methods for random time, dates, etc. 
  function randBetween(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  function formatPrice(v) {
    return v >= 1000 ? v.toLocaleString(undefined, { maximumFractionDigits: 2 }) 
                    : v.toFixed(2);
  }
  
  function formatTime(d) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  
  function formatDate(d) {
    return d.toLocaleDateString([], { month: "2-digit", day: "2-digit", year: "2-digit" });
  }
  
  // Build a realistic snapshot from a base price
  function buildSnapshotForAsset(asset) {
    const base = asset.base;
  
    const prevClose = randBetween(base * 0.98, base * 1.02);
    const open      = randBetween(prevClose * 0.99, prevClose * 1.01);
  
    const dayLow    = Math.min(prevClose, open) * randBetween(0.98, 0.995);
    const dayHigh   = Math.max(prevClose, open) * randBetween(1.005, 1.02);
  
    const last      = randBetween(dayLow, dayHigh);
  
    const low52     = base * randBetween(0.6, 0.75);
    const high52    = base * randBetween(1.25, 1.4);
  
    const change    = last - prevClose;
    const changePct = (change / prevClose) * 100;
  
    const dayPos  = ((last - dayLow) / (dayHigh - dayLow)) * 100;
    const weekPos = ((last - low52) / (high52 - low52)) * 100;
  
    const now  = new Date();
    const time = formatTime(now);
    const date = formatDate(now); // for weekends/holidays you could override this manual if you want
  
    return {
      ...asset,
      prevClose,
      open,
      dayLow,
      dayHigh,
      last,
      low52,
      high52,
      change,
      changePct,
      dayPos:  Math.max(0, Math.min(100, dayPos)),
      weekPos: Math.max(0, Math.min(100, weekPos)),
      time,
      date
    };
  }
  
  // Build ticker text from asset snapshots
  function buildTicker(snapshots) {
    const tickerInner = document.getElementById("ticker-inner");
    if (!tickerInner) return;
  
    tickerInner.innerHTML = "";
  
    snapshots.forEach(s => {
      const span = document.createElement("span");
      span.className = "ticker-item";
  
      const directionClass =
        s.change > 0 ? "change-up" :
        s.change < 0 ? "change-down" : "change-flat";
  
      const sign = s.change >= 0 ? "+" : "";
  
      span.innerHTML = `
        <span class="ticker-symbol">$${s.symbol}</span>
        <span class="ticker-price">${formatPrice(s.last)}</span>
        <span class="ticker-change ${directionClass}">
          ${sign}${s.change.toFixed(2)} (${sign}${s.changePct.toFixed(2)}%)
        </span>
      `;
      tickerInner.appendChild(span);
    });
  
    // duplicate content once so the scroll loop is seamless
    tickerInner.innerHTML += tickerInner.innerHTML;
  }
  
  // Build the detailed snapshot cards
  function buildSnapshotCards(snapshots) {
    const grid = document.getElementById("snapshot-grid");
    if (!grid) return;
  
    grid.innerHTML = "";
  
    snapshots.forEach(s => {
      const card = document.createElement("div");
      card.className = "snapshot-card";
  
      const directionClass =
        s.change > 0 ? "change-up" :
        s.change < 0 ? "change-down" : "change-flat";
  
      const sign = s.change >= 0 ? "+" : "";
  
      const dayPos  = s.dayPos.toFixed(1);
      const weekPos = s.weekPos.toFixed(1);
  
      card.innerHTML = `
        <div class="snapshot-asset-line">
          <span class="snapshot-symbol">$${s.symbol}</span>
          <span class="snapshot-type">${s.type}</span>
        </div>
  
        <div class="snapshot-last-row">
          <span class="snapshot-last-label">Last trade</span>
          <span class="snapshot-last ${directionClass}">
            ${formatPrice(s.last)} (${sign}${s.changePct.toFixed(2)}%)
          </span>
        </div>
  
        <div class="snapshot-two-col">
          <div class="snapshot-row">
            <span>Prev. Close</span>
            <span>${formatPrice(s.prevClose)}</span>
          </div>
          <div class="snapshot-row">
            <span>Open</span>
            <span>${formatPrice(s.open)}</span>
          </div>
        </div>
  
        <div class="snapshot-two-col">
          <div class="snapshot-row">
            <span>Day Low</span>
            <span>${formatPrice(s.dayLow)}</span>
          </div>
          <div class="snapshot-row">
            <span>Day High</span>
            <span>${formatPrice(s.dayHigh)}</span>
          </div>
        </div>
  
        <div class="range-block">
          <div class="range-labels">
            <span>${formatPrice(s.dayLow)}</span>
            <span>${formatPrice(s.dayHigh)}</span>
          </div>
          <div class="range-bar">
            <div class="range-marker" style="left: ${dayPos}%"></div>
          </div>
        </div>
  
        <div class="snapshot-two-col">
          <div class="snapshot-row">
            <span>52W Low</span>
            <span>${formatPrice(s.low52)}</span>
          </div>
          <div class="snapshot-row">
            <span>52W High</span>
            <span>${formatPrice(s.high52)}</span>
          </div>
        </div>
  
        <div class="range-block">
          <div class="range-labels">
            <span>${formatPrice(s.low52)}</span>
            <span>${formatPrice(s.high52)}</span>
          </div>
          <div class="range-bar">
            <div class="range-marker" style="left: ${weekPos}%"></div>
          </div>
        </div>
  
        <div class="snapshot-footer">
          <span>${s.time} (Trade Time)</span>
          <span>${s.date} (Trade Date)</span>
        </div>
      `;
  
      grid.appendChild(card);
    });
  }
  
  // Main runner – generates data and builds UI
  function renderMarketData() {
    const snapshots = ASSETS.map(buildSnapshotForAsset);
    buildTicker(snapshots);
    buildSnapshotCards(snapshots);
  }
  
  // Run once on load; you could also refresh every 30–60s if you want it to wiggle
  document.addEventListener("DOMContentLoaded", () => {
    renderMarketData();
  
    // Optional: slightly refresh numbers every 45 seconds to feel "alive"
    setInterval(renderMarketData, 30000);
  });
  
  
  
  
  
  
  