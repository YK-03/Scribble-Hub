import Header from "@/components/Header";
import NoteGrid from "@/components/NoteGrid";

const Homepage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Your Workspace
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Welcome back! Select a category to start creating or view your notes.
          </p>
        </div>
        <NoteGrid />
      </main>
    </div>
  );
};

export default Homepage;
