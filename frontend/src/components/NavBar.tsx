"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import AlbumIcon from "@mui/icons-material/Album";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import ThemeToggle from "@/components/ThemeToggle";
import { useAppContainer } from "@/infrastructure/container";
import { signOut } from "@/application/auth/sign-out";

export default function NavBar() {
  const router = useRouter();
  const { authProvider } = useAppContainer();

  async function handleSignOut() {
    await signOut(authProvider);
    router.push("/login");
    router.refresh();
  }

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar>
        <Button component={Link} href="/" color="primary" startIcon={<AlbumIcon />} sx={{ fontWeight: 600, fontSize: "1.05rem" }}>
          Bergas
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Buscar por foto">
          <Button component={Link} href="/search" color="inherit" startIcon={<CameraAltIcon />} sx={{ display: { xs: "none", sm: "inline-flex" } }}>
            Buscar por foto
          </Button>
        </Tooltip>
        <Tooltip title="Buscar por foto">
          <IconButton component={Link} href="/search" color="inherit" sx={{ display: { xs: "inline-flex", sm: "none" } }} aria-label="Buscar por foto">
            <CameraAltIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Adicionar disco">
          <Button component={Link} href="/add" color="inherit" startIcon={<AddIcon />} sx={{ display: { xs: "none", sm: "inline-flex" } }}>
            Adicionar
          </Button>
        </Tooltip>
        <Box sx={{ mx: 1 }}>
          <ThemeToggle />
        </Box>
        <Tooltip title="Sair">
          <IconButton onClick={handleSignOut} color="inherit" aria-label="Sair">
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
