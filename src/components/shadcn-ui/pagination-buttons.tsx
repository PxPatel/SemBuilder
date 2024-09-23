"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { ISchedulerContextType, useScheduler } from "../../hooks/use-scheduler";
import { useEffect, useState } from "react";

interface PaginationButtonsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLastPage: boolean;
}

export function PaginationButtons() {
  const { sectionsData, LPDMap, navPage, setNavPage } =
    useScheduler() as ISchedulerContextType;

  useEffect(() => {
    console.log("LPDMap:", LPDMap, "navPage:", navPage);
  });

  if (Object.keys(sectionsData).length === 0) {
    return null;
  }

  const isLastPage = navPage === LPDMap.length && LPDMap.at(-1) === null;

  return (
    <PaginationButtonsComponent
      currentPage={navPage}
      totalPages={LPDMap.length}
      isLastPage={isLastPage}
      onPageChange={(page: number) => {
        console.log("Increasing page count to", page);
        setNavPage(page);
      }}
    />
  );
}

function PaginationButtonsComponent({
  currentPage,
  totalPages,
  onPageChange,
  isLastPage,
}: PaginationButtonsProps) {
  const isFirstPage = currentPage === 1;
  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = currentPage + 1;

  return (
    <div className="mt-4 flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(prevPage)}
        disabled={isFirstPage}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {!isFirstPage && (
        <Button variant="outline" onClick={() => onPageChange(prevPage)}>
          {prevPage}
        </Button>
      )}

      <Button variant="default">{currentPage}</Button>

      {!isLastPage && (
        <Button variant="outline" onClick={() => onPageChange(nextPage)}>
          {nextPage}
        </Button>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(nextPage)}
        disabled={isLastPage}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
