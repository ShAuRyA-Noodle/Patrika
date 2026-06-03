"use client";

import { useEffect } from "react";

type Theme = "forest";

export default function ThemeRoot({ theme }: { theme: Theme }) {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const classes = ["theme-forest", "surface"];
    classes.forEach((c) => root.classList.remove(c));
    classes.forEach((c) => body.classList.remove(c));
    body.classList.add(`theme-${theme}`, "surface");
    return () => {
      body.classList.remove(`theme-${theme}`, "surface");
    };
  }, [theme]);

  return null;
}
