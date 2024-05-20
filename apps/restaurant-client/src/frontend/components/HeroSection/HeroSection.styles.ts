"use client";
import { Box, styled } from "@mui/material";

export const HeroSectionContainer = styled(Box)(() => ({
	backgroundImage: "linear-gradient(rgb(0 0 0 / 80%), rgb(0 0 0 / 80%)), url('/hero-section-image.jpeg')",
  backgroundSize: "cover",
  height:	"100vh",
	position: "relative",
}));