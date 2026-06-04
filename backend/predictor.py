import joblib
import yfinance as yf
import os

# =========================
# MODEL PATHS
# =========================
BTC_MODEL_PATH = os.path.join("models", "Bitcoin_crypto_trend_model.pkl")
BTC_SCALER_PATH = os.path.join("scaler", "Bitcoin_crypto_scaler.pkl")

ETH_MODEL_PATH = os.path.join("models", "Ethereum_crypto_trend_model.pkl")
ETH_SCALER_PATH = os.path.join("scaler", "Ethereum_crypto_scaler.pkl")

SOL_MODEL_PATH = os.path.join("models", "Solana_crypto_trend_model.pkl")
SOL_SCALER_PATH = os.path.join("scaler", "Solana_crypto_scaler.pkl")

XRP_MODEL_PATH = os.path.join("models", "XRP_crypto_trend_model.pkl")
XRP_SCALER_PATH = os.path.join("scaler", "XRP_crypto_scaler.pkl")

# =========================
# LOAD MODELS ONCE (IMPORTANT)
# =========================
btc_model = joblib.load(BTC_MODEL_PATH)
btc_scaler = joblib.load(BTC_SCALER_PATH)

eth_model = joblib.load(ETH_MODEL_PATH)
eth_scaler = joblib.load(ETH_SCALER_PATH)

sol_model = joblib.load(SOL_MODEL_PATH)
sol_scaler = joblib.load(SOL_SCALER_PATH)

xrp_model = joblib.load(XRP_MODEL_PATH)
xrp_scaler = joblib.load(XRP_SCALER_PATH)

# =========================
# COIN INFO
# =========================
BTC_NAME = "Bitcoin"
BTC_SYMBOL = "BTC-USD"

ETH_NAME = "Ethereum"
ETH_SYMBOL = "ETH-USD"

SOL_NAME = "Solana"
SOL_SYMBOL = "SOL-USD"

XRP_NAME = "XRP"
XRP_SYMBOL = "XRP-USD"

# =========================
# FEATURE ENGINEERING (COMBINED FOR ALL)
# =========================
def add_features(df):

    # ===== Common =====
    df["Return"] = df["Close"].pct_change()
    df["Volatility"] = df["Return"].rolling(7).std()
    df["Momentum"] = df["Close"] - df["Close"].shift(7)
    df["ROC"] = df["Close"].pct_change(periods=7)
    df["Lag1"] = df["Close"].shift(1)

    # ===== BTC / ETH =====
    df["MA7"] = df["Close"].rolling(7).mean()
    df["MA14"] = df["Close"].rolling(14).mean()
    df["MA30"] = df["Close"].rolling(30).mean()

    # ===== ETH Extra =====
    df["EMA12"] = df["Close"].ewm(span=12).mean()
    df["EMA26"] = df["Close"].ewm(span=26).mean()
    df["MACD"] = df["EMA12"] - df["EMA26"]
    df["Signal"] = df["MACD"].ewm(span=9).mean()

    # ===== RSI (All) =====
    delta = df["Close"].diff()
    gain = delta.clip(lower=0).rolling(14).mean()
    loss = -delta.clip(upper=0).rolling(14).mean()
    rs = gain / loss
    df["RSI"] = 100 - (100 / (1 + rs))

    # ===== ETH Bollinger =====
    rolling_mean = df["Close"].rolling(20).mean()
    rolling_std = df["Close"].rolling(20).std()
    df["BB_upper"] = rolling_mean + (2 * rolling_std)
    df["BB_lower"] = rolling_mean - (2 * rolling_std)
    df["BB_width"] = df["BB_upper"] - df["BB_lower"]

    # ===== SOL / XRP Specific =====
    df["SMA_5"] = df["Close"].rolling(5).mean()
    df["SMA_10"] = df["Close"].rolling(10).mean()
    df["SMA_20"] = df["Close"].rolling(20).mean()
    df["EMA_10"] = df["Close"].ewm(span=10).mean()

    df = df.dropna()
    return df

# =========================
# FEATURE LISTS (MATCH NOTEBOOKS)
# =========================

BTC_FEATURES = [
    "Open","High","Low","Close","Volume",
    "Return","MA7","MA14","MA30",
    "Volatility","Momentum","ROC","Lag1"
]

ETH_FEATURES = [
    "Open","High","Low","Close","Volume",
    "Return","MA7","MA14","MA30",
    "Volatility","Momentum","ROC","Lag1",
    "EMA12","EMA26","MACD","Signal","RSI",
    "BB_upper","BB_lower","BB_width"
]

SOL_FEATURES = [
    "Open","High","Low",
    "SMA_5","SMA_10","SMA_20",
    "EMA_10","ROC","Momentum",
    "Volatility","RSI"
]

XRP_FEATURES = [
    "Open","High","Low",
    "SMA_5","SMA_10","SMA_20",
    "EMA_10","ROC","Momentum",
    "Volatility","RSI"
]

# =========================
# GENERIC PREDICT FUNCTION
# =========================
def predict(symbol, model, scaler, features):
    try:
        df = yf.download(symbol, period="30d", interval="1h")
        df = add_features(df)

        if df.empty:
            return {"trend": "Error", "price": 0.0}

        X = df[features].tail(1)
        X_scaled = scaler.transform(X)

        prediction = model.predict(X_scaled)[0]
        last_price = float(df["Close"].iloc[-1])
        trend = "Increase" if prediction == 1 else "Decrease"
        return {"trend": trend, "price": last_price}

    except Exception as e:
        print(f"{symbol} prediction error:", e)
        return {"trend": "Error", "price": 0.0}

# =========================
# PUBLIC FUNCTIONS
# =========================
def predict_bitcoin():
    return predict(BTC_SYMBOL, btc_model, btc_scaler, BTC_FEATURES)

def predict_ethereum():
    return predict(ETH_SYMBOL, eth_model, eth_scaler, ETH_FEATURES)

def predict_solana():
    return predict(SOL_SYMBOL, sol_model, sol_scaler, SOL_FEATURES)

def predict_xrp():
    return predict(XRP_SYMBOL, xrp_model, xrp_scaler, XRP_FEATURES)
