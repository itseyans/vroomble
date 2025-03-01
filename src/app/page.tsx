"use client";

import Image from "next/image";
import WelcomeNavBar from "../vcomp/WelcomeNavBar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen"> 
      <WelcomeNavBar></WelcomeNavBar>
      <footer className="flex gap-6 flex-wrap items-center justify-center p-4">
      </footer>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}