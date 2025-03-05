"use client";

import Image from "next/image";
import WelcomeNavBar from "../vcomp/WelcomeNavBar";
import Background from "@/vcomp/background";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen"> 
      <WelcomeNavBar></WelcomeNavBar>
      <Background />
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