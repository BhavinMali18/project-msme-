"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Startup/Community registration redirects to the general participant form
export default function StartupRegisterPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/register/student?type=startup");
  }, [router]);
  return null;
}
