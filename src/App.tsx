import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Programs } from './components/Programs';
import { About } from './components/About';
import { Courses } from './components/Courses';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Testimonials } from './components/Testimonials';
import { Services } from './components/Services';
import { News } from './components/News';
import { CourseDetail } from './components/CourseDetail';
import { ProgramDetail } from './components/ProgramDetail';

import { NewsPage } from './components/NewsPage';
import { NewsDetail } from './components/NewsDetail';

import { AboutOverview } from './components/AboutOverview';
import { AboutVision } from './components/AboutVision';
import { AboutLocation } from './components/AboutLocation';
import { AboutQuality } from './components/AboutQuality';
import { ProgramEnrollment } from './components/ProgramEnrollment';

import { ProjectTiAbilito } from './components/ProjectTiAbilito';
import { ProjectSegni } from './components/ProjectSegni';

import { ScrollToTop } from './components/ScrollToTop';

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Courses />
      <Programs />
      <About />
      <Services />
      <News />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={
            <>
              <Header />
              <NewsPage />
              <Footer />
            </>
          } />
          <Route path="/news/:newsId" element={
            <>
              <Header />
              <NewsDetail />
              <Footer />
            </>
          } />
          
          {/* Chi Siamo Routes */}
          <Route path="/chi-siamo/panoramica" element={
            <>
              <Header />
              <AboutOverview />
              <Footer />
            </>
          } />
          <Route path="/chi-siamo/visione-missione" element={
            <>
              <Header />
              <AboutVision />
              <Footer />
            </>
          } />
          <Route path="/chi-siamo/dove-siamo" element={
            <>
              <Header />
              <AboutLocation />
              <Footer />
            </>
          } />
          <Route path="/chi-siamo/qualita" element={
            <>
              <Header />
              <AboutQuality />
              <Footer />
            </>
          } />

          <Route path="/corsi/:courseId" element={
            <>
              <Header />
              <CourseDetail />
              <Contact />
              <Footer />
            </>
          } />
          <Route path="/programmi/:programId" element={
            <>
              <Header />
              <ProgramDetail />
              <Contact />
              <Footer />
            </>
          } />
          {/* Route per pre-iscrizione a programmi GOL/Master */}
          <Route path="/iscrizione/:slug" element={
            <>
              <Header />
              <ProgramEnrollment />
              <Footer />
            </>
          } />

          {/* Projects Routes */}
          <Route path="/progetti/ti-abilito" element={
            <>
              <Header />
              <ProjectTiAbilito />
              <Contact />
              <Footer />
            </>
          } />
          <Route path="/progetti/segni" element={
            <>
              <Header />
              <ProjectSegni />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}