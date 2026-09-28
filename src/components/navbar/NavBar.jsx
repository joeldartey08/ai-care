import React, { useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";

function NavBar({ title, nav }) {
  
  return (
    <div className="navbar">
      <h1 className="logo">{title}</h1>

      <ul className="nav-list">
        {nav.map((item, index) => (
          <li>
            <Link to={item.href}>{item.name}</Link>
          </li>
        ))}
      </ul>
      <Link className="btn" to="/login">
        Book A Demo
      </Link>
    </div>
  );
}

export default NavBar;
