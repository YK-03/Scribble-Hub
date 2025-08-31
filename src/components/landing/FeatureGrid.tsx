import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Lightbulb, 
  Users, 
  GraduationCap, 
  BookOpen, 
  ChefHat, 
  Palette,
  ArrowRight,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "Project Ideas",
    description: "Capture and develop your next big ideas.",
    gradient: "from-yellow-400 to-orange-500",
    delay: "0s"
  },
  {
    icon: Users,
    title: "Meeting Notes",
    description: "Stay organized with smart meeting notes and action items.",
    gradient: "from-blue-400 to-cyan-500",
    delay: "0.1s"
  },
  {
    icon: GraduationCap,
    title: "Learning Goals",
    description: "Track your learning journey with personalized goal setting and progress monitoring.",
    gradient: "from-green-400 to-emerald-500",
    delay: "0.2s"
  },
  {
    icon: BookOpen,
    title: "Reading List",
    description: "Your personal archive of knowledge. Track, summarize, and reflect on your reading journey.",
    gradient: "from-purple-400 to-pink-500",
    delay: "0.3s"
  },
  {
    icon: ChefHat,
    title: "Recipe Ideas",
    description: "AI-powered culinary creative space. Turn any prompt into delicious, step-by-step recipes.",
    gradient: "from-red-400 to-rose-500",
    delay: "0.4s"
  },
  {
    icon: Palette,
    title: "Art Playground",
    description: "Digital space for you to scribble, sketch, and doodle with a variety of colors and brush sizes.",
    gradient: "from-indigo-400 to-purple-500",
    delay: "0.5s"
  }
];

const FeatureGrid = () => {
  return (
    <section id="features" className="py-24 bg-background scroll-mt-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything you need to
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Unlock Your Mind
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're brainstorming creatively or learning systematically, our intelligent features
            provide the perfect canvas for every thought, project, and idea.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group flex flex-col p-8 bg-card/50 backdrop-blur-lg border border-border/20 rounded-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1.5 animate-slide-up"
                style={{ animationDelay: feature.delay }}
              >
                <div className="flex-grow">
                  <div className="relative inline-block mb-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className={`absolute -inset-2.5 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;