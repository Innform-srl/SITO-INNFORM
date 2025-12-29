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
import { CourseDetail } from './components/CourseDetail';
import { ProgramDetail } from './components/ProgramDetail';
import { Layout } from './components/Layout';

import { NewsPage } from './components/NewsPage';
import { NewsDetail } from './components/NewsDetail';

import { AboutOverview } from './components/AboutOverview';
import { AboutVision } from './components/AboutVision';
import { AboutLocation } from './components/AboutLocation';
import { AboutQuality } from './components/AboutQuality';
import { ProgramEnrollment } from './components/ProgramEnrollment';

import { ProjectTiAbilito } from './components/ProjectTiAbilito';
import { ProjectSegni } from './components/ProjectSegni';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { CookiePolicy } from './components/CookiePolicy';

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
            <Layout>
              <NewsPage />
            </Layout>
          } />
          <Route path="/news/:newsId" element={
            <Layout>
              <NewsDetail />
            </Layout>
          } />

          {/* Chi Siamo Routes */}
          <Route path="/chi-siamo/panoramica" element={
            <Layout>
              <AboutOverview />
            </Layout>
          } />
          <Route path="/chi-siamo/visione-missione" element={
            <Layout>
              <AboutVision />
            </Layout>
          } />
          <Route path="/chi-siamo/dove-siamo" element={
            <Layout>
              <AboutLocation />
            </Layout>
          } />
          <Route path="/chi-siamo/qualita" element={
            <Layout>
              <AboutQuality />
            </Layout>
          } />

          <Route path="/corsi/:courseId" element={
            <Layout>
              <CourseDetail />
              <Contact />
            </Layout>
          } />
          <Route path="/programmi/:programId" element={
            <Layout>
              <ProgramDetail />
              <Contact />
            </Layout>
          } />
          {/* Route per pre-iscrizione a programmi GOL/Master */}
          <Route path="/iscrizione/:slug" element={
            <Layout>
              <ProgramEnrollment />
            </Layout>
          } />

          {/* Projects Routes */}
          <Route path="/progetti/ti-abilito" element={
            <Layout>
              <ProjectTiAbilito />
              <Contact />
            </Layout>
          } />
          <Route path="/progetti/segni" element={
            <Layout>
              <ProjectSegni />
            </Layout>
          } />

          {/* Legal Pages */}
          <Route path="/privacy-policy" element={
            <Layout>
              <PrivacyPolicy />
            </Layout>
          } />
          <Route path="/cookie-policy" element={
            <Layout>
              <CookiePolicy />
            </Layout>
          } />
        </Routes>
      </div>
    </Router>
  );
}