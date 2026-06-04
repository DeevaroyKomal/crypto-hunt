import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const floatAnimation = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
  }
`;

const fadeInScale = `
  @keyframes fadeInScale {
    0% { opacity: 0; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1); }
  }
`;

const PredictionPage = () => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadPredictions = () => {
    setLoading(true);
    setPredictions(null);
    fetch("http://127.0.0.1:5000/predictions")
      .then((res) => res.json())
      .then((data) => {
        setPredictions(data);
        setLoading(false);
      })
      .catch(() => {
        setPredictions([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPredictions();
  }, []);

  const formatPrice = (price) => {
    if (price === 0 || !price) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "IND",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(price);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0b0c10",
        background: "radial-gradient(ellipse at top, #1f2833 0%, #0b0c10 100%)",
        paddingTop: 10,
        paddingBottom: 10,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{floatAnimation}</style>
      <style>{fadeInScale}</style>

      {/* Subtle modern background glow instead of bright neon */}
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "50%",
          height: "50%",
          background: "radial-gradient(circle, rgba(69, 162, 158, 0.05) 0%, rgba(0,0,0,0) 70%)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "50%",
          height: "50%",
          background: "radial-gradient(circle, rgba(102, 252, 241, 0.05) 0%, rgba(0,0,0,0) 70%)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "#ffffff",
            mb: 2,
            letterSpacing: 1,
            animation: "fadeInScale 0.8s ease-out",
          }}
        >
          Cryptocurrency Predictions
        </Typography>

        <Typography
          variant="h6"
          sx={{ color: "#c5c6c7", mb: 5, fontWeight: "400", animation: "fadeInScale 1s ease-out" }}
        >
          Advanced forecast analysis for next-day market trends
        </Typography>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={loadPredictions}
          disabled={loading}
          sx={{
            mb: 8,
            px: 4,
            py: 1.5,
            fontWeight: "600",
            fontSize: "1rem",
            borderRadius: "8px",
            backgroundColor: "orchid",
            color: "#0b0c10",
            textTransform: "none",
            boxShadow: "0 4px 14px rgba(69, 162, 158, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(69, 162, 158, 0.4)",
              backgroundColor: "#66fcf1",
            },
            "&:disabled": {
              backgroundColor: "#1f2833",
              color: "#c5c6c7",
              boxShadow: "none",
            }
          }}
        >
          {loading ? "Generating forecast..." : "Refresh Predictions"}
        </Button>

        {(!predictions || loading) ? (
          <Box sx={{ mt: 8, animation: "fadeInScale 0.5s ease-out" }}>
             <CircularProgress size={60} thickness={4} sx={{ color: "#45a29e", mb: 3 }} />
             <Typography variant="body1" sx={{ color: "#c5c6c7", letterSpacing: 1 }}>
               Analyzing market data...
             </Typography>
          </Box>
        ) : predictions.length === 0 ? (
          <Typography sx={{ color: "#c5c6c7", fontSize: "1.1rem" }}>
            Forecast currently unavailable. Please check back later.
          </Typography>
        ) : (
          <Grid container spacing={4} justifyContent="center" sx={{ animation: "fadeInScale 0.8s ease-out" }}>
            {predictions.map((coin, index) => {
              const result = coin.result || {};
              const isIncrease = result.trend === "Increase";
              const isError = result.trend === "Error";
              const price = result.price || 0;
              const delay = `${index * 0.1}s`;

              const trendColor = isIncrease ? "#4caf50" : "#f44336";
              const bgColor = "rgba(31, 40, 51, 0.6)";

              return (
                <Grid item xs={12} sm={6} md={3} key={coin.name}>
                  <Card
                    sx={{
                      height: "100%",
                      backgroundColor: bgColor,
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      borderRadius: "16px",
                      padding: "24px 16px",
                      color: "#ffffff",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      transition: "all 0.4s ease",
                      cursor: "default",
                      animation: "fadeInScale 0.6s ease-out backwards",
                      animationDelay: delay,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        backgroundColor: "rgba(31, 40, 51, 0.8)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        "& .coin-image": {
                          transform: "scale(1.05)",
                        }
                      },
                    }}
                  >
                    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                      <Box
                        className="coin-image"
                        component="img"
                        src={coin.image}
                        alt={coin.name}
                        sx={{
                          width: "72px",
                          height: "72px",
                          objectFit: "contain",
                          mb: 2,
                          transition: "transform 0.4s ease",
                          animation: "float 4s ease-in-out infinite",
                          animationDelay: delay,
                          filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.3))"
                        }}
                      />
                      
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "600", mb: 0.5, letterSpacing: 0.5, color: "#ffffff" }}
                      >
                        {coin.name}
                      </Typography>

                      <Typography
                        variant="subtitle1"
                        sx={{ 
                          color: "#c5c6c7", 
                          mb: 3, 
                          fontWeight: 500,
                          backgroundColor: "rgba(11, 12, 16, 0.5)",
                          padding: "4px 12px",
                          borderRadius: "8px",
                        }}
                      >
                        {formatPrice(price)}
                      </Typography>
                    </Box>

                    <Box 
                      sx={{ 
                        width: "100%", 
                        borderTop: "1px solid rgba(255,255,255,0.05)", 
                        pt: 2,
                        mt: "auto"
                      }}
                    >
                      {isError ? (
                        <Typography sx={{ color: "#ff9800", fontWeight: "500", fontSize: "1rem" }}>
                          Data Unavailable
                        </Typography>
                      ) : (
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "600",
                            color: trendColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.5,
                            letterSpacing: 0.5
                          }}
                        >
                          {isIncrease ? "↑ Increase" : "↓ Decrease"}
                        </Typography>
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default PredictionPage;
