import Layout from "./Layout.jsx";

import Home from "./Home";

import About from "./About";

import Photos from "./Photos";

import Review from "./Review";

import Auth from "./Auth";

import Admin from "./Admin";

import PhotoDetailPage from "./PhotoDetailPage";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    About: About,
    
    Photos: Photos,
    
    Review: Review,
    
    Auth: Auth,
    
    Admin: Admin,

    PhotoDetailPage: PhotoDetailPage,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/Photos" element={<Photos />} />
                
                <Route path="/Review" element={<Review />} />
                
                <Route path="/Auth" element={<Auth />} />
                
                <Route path="/Admin" element={<Admin />} />

                <Route path="/Photos/:id" element={<PhotoDetailPage />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}