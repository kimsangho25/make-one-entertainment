import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';
import ProgramsSection from '../components/ProgramsSection';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <AboutSection />
        <ProgramsSection />
      </main>
      <Footer />
    </>
  );
}