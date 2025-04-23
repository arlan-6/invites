// app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Adjust the import path if necessary
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'; // Adjust the import path if necessary
import { AlertTriangle } from 'lucide-react'; // Optional: for an icon

function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-12">
      {/* Adjust min-h if you have different header/footer heights, or use min-h-screen if it takes the full viewport */}
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
            {/* Optional Icon */}
            <AlertTriangle className="h-8 w-8" aria-hidden="true" />
          </div>
          <CardTitle className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            404 - Page Not Found
          </CardTitle>
          <CardDescription className="mt-2 text-lg text-muted-foreground">
            Oops! Looks like you've stumbled upon a page that doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The link might be broken, the page may have been moved, or it
            never existed in the first place. Let's get you back on track.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Go Back Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
export default NotFound