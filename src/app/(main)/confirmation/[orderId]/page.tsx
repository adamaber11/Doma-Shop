import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download } from "lucide-react";

export default function ConfirmationPage({ params }: { params: { orderId: string } }) {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
                <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold mt-4 font-headline">Thank you for your order!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your order has been placed successfully. A confirmation email has been sent to you.
          </p>
          <div className="p-4 bg-secondary rounded-md">
            <p className="text-sm font-medium">Your Order ID is:</p>
            <p className="text-lg font-mono font-semibold text-primary">{params.orderId}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            You can track your order status in the 'My Orders' section of your profile.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button variant="outline">Continue Shopping</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Download className="mr-2 h-4 w-4"/>
                Download Receipt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
