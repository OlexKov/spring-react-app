import React from 'react';
import Header from './header';
import MainContent from './content';
import Footer from './footer';


const Layout: React.FC = () => {
    return (
        <div className='bg-main'>
            <Header />
                <MainContent />
            <Footer />
        </div>
    );
};

export default Layout;