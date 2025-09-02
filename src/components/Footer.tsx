import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-6 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Scribble Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by Yash Kaushik
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;