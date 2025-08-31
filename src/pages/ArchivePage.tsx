import Header from "@/components/Header";
import { Ghost } from "lucide-react";

const ArchivePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12 flex items-center justify-center">
        <div className="text-center">
          <Ghost className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            Note Archive
          </h1>
          <p className="mt-2 text-muted-foreground">
            This is where your deleted or archived notes will appear.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ArchivePage;
