import type { ThemeOptions } from "@mui/material/styles";

export const lightTheme: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1",
      light: "#a5b4fc",
      dark: "#4f46e5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#22c55e",
      light: "#86efac",
      dark: "#16a34a",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    error: { main: "#ef4444" },
    warning: { main: "#f59e0b" },
    info: { main: "#6366f1" },
    success: { main: "#22c55e" },
    divider: "#e2e8f0",
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 800 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 8 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": { fontWeight: 700, fontSize: "0.875rem" },
        },
      },
    },
    MuiDrawer: { styleOverrides: { paper: { borderRight: "none" } } },
  },
};

export const darkTheme: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#818cf8",
      light: "#a5b4fc",
      dark: "#6366f1",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#4ade80",
      light: "#86efac",
      dark: "#22c55e",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    error: { main: "#f87171" },
    warning: { main: "#fbbf24" },
    info: { main: "#818cf8" },
    success: { main: "#4ade80" },
    divider: "#334155",
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 800 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 8 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.15)",
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": { fontWeight: 700, fontSize: "0.875rem" },
        },
      },
    },
    MuiDrawer: { styleOverrides: { paper: { borderRight: "none" } } },
  },
};
