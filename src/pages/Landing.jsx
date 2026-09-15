import React from "react";
import NavBar from "../components/navbar/NavBar";
import { href } from "react-router-dom";

const nav = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "about",
    href: "/about",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

function Landing() {
  return <NavBar title="Medi Care Ai" nav={nav} />;
}

export default Landing;
