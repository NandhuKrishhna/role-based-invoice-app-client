// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout: React.FC = () => {
    return (
        <>
            <Header />
            <main className='font-satoshi'>
                <Outlet />
            </main>
        </>
    );
};

export default MainLayout;
