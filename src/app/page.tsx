"use client";

import Image from "next/image";
import WelcomeNavBar from "../vcomp/WelcomeNavBar";
import YellowNavBar from "@/vcomp/YellowNavBar";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen"> 
      <WelcomeNavBar></WelcomeNavBar>
      <YellowNavBar />
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