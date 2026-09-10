import type React from "react";
import "../../../styles/layout/main-layout.css";
import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";

function MainLayout(props: { children?: React.ReactNode }) {
  return (
    <main className="main-layout">
      <Header />
      <Sidebar />
      <Footer />
      <div className="main-content">{props.children}</div>
    </main>
  );
}

export default MainLayout;
