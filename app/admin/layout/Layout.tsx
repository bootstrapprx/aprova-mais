"use client";

import type { ReactNode } from "react";
import { Layout as RaLayout } from "react-admin";

import { Menu } from "./Menu";

export const Layout = ({ children }: { children?: ReactNode }) => {
  return (
    <RaLayout menu={Menu}>
      {children}
    </RaLayout>
  );
};
