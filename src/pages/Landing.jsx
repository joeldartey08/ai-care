import React from "react";
import NavBar from "../components/navbar/NavBar";
import { href } from "react-router-dom";
import Testing from "../components/Testing";

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
  return (
    <>
      <NavBar title="Medi Care Ai" nav={nav} />
      <Testing />
    </>
  );
}

export default Landing;
