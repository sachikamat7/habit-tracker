import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "../ui/button";

export const ErrorCard = () => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader className="text-center">
        <h2 className="text-2xl font-bold">Oops! Something went wrong!</h2>
      </CardHeader>
      <CardFooter className="text-center">
        <Button>
            <a href="/signin">Back to signin</a>
        </Button>
      </CardFooter>
    </Card>
  );
}