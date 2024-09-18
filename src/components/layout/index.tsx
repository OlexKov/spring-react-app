import React from 'react';
import Header from './header';
import MainContent from './content';
import Footer from './footer';


const Layout: React.FC = () => {
    return (
        <div className='bg-main d-flex flex-column justify-content-between h-100'>
            <Header />
                <MainContent />
            <Footer />
        </div>
    );
};

export default Layout;