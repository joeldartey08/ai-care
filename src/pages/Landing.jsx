import React from "react";
import NavBar from "../components/navbar/NavBar";
import { href } from "react-router-dom";
import Testing from "../components/Testing";



function Landing({nav}) {
  return (
    <>
      <NavBar title="Medi Care Ai" nav={nav} />
      <Testing />
    </>
  );
}

export default Landing;
