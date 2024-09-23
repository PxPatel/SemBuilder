"use client";

import Dashboard from "../components/Dashboard.tsx/Dashboard";
import SearchBar from "../components/SearchBar/SearchBar";

export default function Home() {
  return (
    <main className="bg-grey-100 box-border flex min-h-screen w-full flex-col">
      <div
        id="searchbar-container"
        className={`mx-2 my-2 h-36 rounded-lg border border-gray-400 bg-gray-300 py-4 shadow-lg`}
      >
        <SearchBar />
      </div>
      <div
        id="dashboard-container"
        className="mx-2 mt-2 flex h-full flex-grow rounded-lg"
      >
        <Dashboard />
      </div>
    </main>
  );
}
