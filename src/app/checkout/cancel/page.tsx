import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CancelPage() {
  return (
    <div className="container py-20 text-center space-y-6 max-w-md mx-auto">
      <XCircle className="h-16 w-16 text-destructive mx-auto" />
      <h1 className="text-3xl font-bold">Payment cancelled</h1>
      <p className="text-muted-foreground">Your payment was not completed. You can try again any time.</p>
      <Link href="/cart"><Button>Return to Cart</Button></Link>
    </div>
  );
}
