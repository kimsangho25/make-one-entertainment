import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PortfolioSection from "../components/PortfolioSection";

export default function Portfolio() {
  return (
    <>
      <Header />
      <main className="pt-20 bg-gray-50 min-h-screen">
        <PortfolioSection />
      </main>
      <Footer />
    </>
  );
}
