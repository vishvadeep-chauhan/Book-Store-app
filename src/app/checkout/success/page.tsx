import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  return (
    <div className="container py-20 text-center space-y-6 max-w-md mx-auto">
      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
      <h1 className="text-3xl font-bold">Payment successful!</h1>
      <p className="text-muted-foreground">
        Thank you for your order. Your books are on the way. Order ID: <strong>{orderId}</strong>
      </p>
      <div className="flex justify-center gap-3">
        <Link href="/dashboard/orders"><Button>View Orders</Button></Link>
        <Link href="/books"><Button variant="outline">Continue Shopping</Button></Link>
      </div>
    </div>
  );
}
