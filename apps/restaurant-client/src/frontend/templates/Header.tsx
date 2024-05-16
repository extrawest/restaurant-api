"use client";
import React, { useCallback } from "react";
import {
	Box,
	AppBar,
	Container,
	Menu,
	MenuItem,
	Typography,
	Tooltip,
	IconButton,
	Toolbar,
	Icon,
	Avatar,
  Button
} from "@mui/material";
import Link from "next/link";
import { useIntl } from "react-intl";
import { Adb } from "@mui/icons-material";
import { Pages } from "shared";
import { useAppSelector, useLogOutMutation } from "@redux";

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export const Header = () => {
  const { $t } = useIntl();
  const [logOut] = useLogOutMutation();

  const { token } = useAppSelector((state) => state.auth);
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logOutHanlder = useCallback(() => {
    logOut();
  }, []);

	return (
		<AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Adb sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <Icon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link href={Pages.LOGIN}>
                  <Typography textAlign="center">{$t({ id: "text.login"})}</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link href={Pages.REGISTRATION}>
                  <Typography textAlign="center">{$t({ id: "text.registration"})}</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link href={Pages.PRODUCTS}>
                  <Typography textAlign="center">{$t({ id: "text.products"})}</Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>
          <Adb sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <MenuItem onClick={handleCloseNavMenu}>
              {
                token?.refresh_token ? (
                  <Button
                    sx={{
                      color: "white",
                      textTransform: "none"
                    }}
                    onClick={logOutHanlder}
                  >
                    <Typography textAlign="center">{$t({ id: "text.submit.logout"})}</Typography>
                  </Button>
                ) : (
                  <Link href={Pages.LOGIN}>
                    <Typography textAlign="center">{$t({ id: "text.submit.login"})}</Typography>
                  </Link>
                )
              }
            </MenuItem>
            {
              !token?.refresh_token ? (
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link href={Pages.REGISTRATION}>
                    <Typography textAlign="center">{$t({ id: "text.registration"})}</Typography>
                  </Link>
                </MenuItem>
              ) : null
            }
            <MenuItem onClick={handleCloseNavMenu}>
              <Link href={Pages.PRODUCTS}>
                <Typography textAlign="center">{$t({ id: "text.products"})}</Typography>
              </Link>
            </MenuItem>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar>H</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
	);
};

export default Header;