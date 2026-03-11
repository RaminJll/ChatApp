// src/pages/HomePage.tsx
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import { HomeProvider } from '../contexts/HomeContext';

export default function HomePage() {
    return (
        <HomeProvider>
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <ChatArea />
            </div>
        </HomeProvider>
    );
}