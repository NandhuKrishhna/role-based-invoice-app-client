// src/layouts/AuthLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
    return (
        <main className="p-4 bg-gray-500 min-h-screen flex flex-col items-center justify-center font-satoshi">
            <Outlet />
        </main>
    );
};

export default AuthLayout;
