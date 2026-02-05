import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Button asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    </div>
  );
}
