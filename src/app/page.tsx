"use client";

import FilterMenu from "../components/FilterMenu/FilterMenu";
import ScheduleBoard from "../components/ScheduleBoard/ScheduleBoard";
import TopBar from "../components/TopBar/TopBar";

export default function Home() {
  return (
    <main className="box-border flex min-h-screen w-full flex-col">
      <div className="h-36">
        <TopBar />
      </div>

      <div className="flex flex-grow flex-row mb-4">
        <FilterMenu />
        <ScheduleBoard />
      </div>
    </main>
  );
}
