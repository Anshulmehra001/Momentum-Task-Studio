/**** Tailwind configuration for the Momentum Tasks UI ****/
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "ui-sans-serif", "system-ui"],
        body: ["Manrope", "ui-sans-serif", "system-ui"],
      },
      colors: {
        night: {
          900: "#0b1021",
          800: "#10162f",
          700: "#141c3a",
        },
        aurora: {
          green: "#5ef5a3",
          blue: "#f97316",
          pink: "#ff7fc8",
          amber: "#f9c46b",
        },
      },
      boxShadow: {
        glow: "0 10px 60px rgba(94, 245, 163, 0.22)",
        card: "0 20px 60px rgba(15, 23, 42, 0.35)",
      },
      backgroundImage: {
        mesh: "radial-gradient(120% 120% at 10% 20%, rgba(94,245,163,0.08), transparent), radial-gradient(120% 120% at 80% 0%, rgba(249,115,22,0.12), transparent), radial-gradient(160% 160% at 90% 70%, rgba(255,127,200,0.08), transparent)",
      },
    },
  },
  plugins: [],
};
