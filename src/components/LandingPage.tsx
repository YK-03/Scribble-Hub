import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from './landing/Header';
import HeroSection from './landing/HeroSection';
import FeatureGrid from './landing/FeatureGrid';
import CTASection from './landing/CTASection';
import Footer from './landing/Footer';
// ...existing code...


const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-neutral-900 text-white">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <FeatureGrid />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
