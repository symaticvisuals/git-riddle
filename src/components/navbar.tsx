import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import { UserButton } from "@clerk/nextjs";


export default function MainNavbar() {
  return (
    <Navbar>
      <NavbarBrand>
      
        <p className="font-bold text-inherit">Git Riddles</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
       
      </NavbarContent>
      <NavbarContent justify="end">
       
        <NavbarItem>
          <UserButton afterSignOutUrl="/" />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
