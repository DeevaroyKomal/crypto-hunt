// src/Pages/CoinPage.js
import {
  Button,
  LinearProgress,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api";
import { numberWithCommas } from "../components/CoinsTable";
import { CryptoState } from "../CryptoContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);

  const { currency, symbol, user, setAlert, watchlist } = CryptoState();

  const fetchCoin = async () => {
    try {
      const { data } = await axios.get(SingleCoin(id));
      setCoin(data);
    } catch (error) {
      console.error("Error fetching coin:", error);
    }
  };

  const inWatchlist = watchlist.includes(coin?.id);

  const addToWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    await setDoc(
      coinRef,
      { coins: [...watchlist, coin.id] },
      { merge: true }
    );
    setAlert({
      open: true,
      message: `${coin.name} added to Watchlist`,
      type: "success",
    });
  };

  const removeFromWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    await setDoc(
      coinRef,
      { coins: watchlist.filter((c) => c !== coin.id) },
      { merge: true }
    );
    setAlert({
      open: true,
      message: `${coin.name} removed from Watchlist`,
      type: "success",
    });
  };

  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!coin) return <LinearProgress sx={{ bgcolor: "orchid" }} />;

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
      <Box sx={{ width: { md: "30%" }, p: 3 }}>
        <img src={coin.image.large} alt={coin.name} height="200" />
        <Typography variant="h3">{coin.name}</Typography>
        <Typography sx={{ textAlign: "justify" }}>
          {coin.description.en.split(". ")[0]}.
        </Typography>

        <Typography>
          Rank: {coin.market_cap_rank}
        </Typography>

        <Typography>
          Current Price: {symbol}{" "}
          {numberWithCommas(
            coin.market_data.current_price[currency.toLowerCase()]
          )}
        </Typography>

        {user && (
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, bgcolor: inWatchlist ? "red" : "orchid" }}
            onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
          >
            {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          </Button>
        )}
      </Box>

      <CoinInfo coin={coin} />
    </Box>
  );
};

export default CoinPage;
