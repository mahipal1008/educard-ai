import { Sparkles } from "lucide-react";

const team = [
  {
    name: " Ravi Roy",
    role: "Founder & Full-Stack Developer",
    bio: "Building the future of AI-powered education.",
    initials: "RR",
    color: "bg-primary",
  },
];

export function Team() {
  return (
    <section className="py-24 md:py-32 lg:py-40 relative" id="team">
      <div className="absolute inset-0 dot-pattern opacity-50" />

      <div className="mx-auto max-w-[1400px] px-4 md:px-8 relative">
        <div className="text-center mb-16 md:mb-20 lg:mb-24">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm lg:text-base font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            Our Team
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Meet the <span className="gradient-text">builder</span>
          </h2>
          <p className="mt-5 text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            EduCard AI is built by a passionate developer who believes AI can make studying smarter for everyone.
          </p>
        </div>

        <div className="flex justify-center">
          {team.map((member) => (
            <div
              key={member.name}
              className="relative group rounded-2xl border-2 bg-card p-8 lg:p-10 text-center max-w-sm lg:max-w-md hover-lift transition-all hover:border-primary/30"
            >
              <div className={`h-20 w-20 lg:h-24 lg:w-24 rounded-full ${member.color} text-primary-foreground flex items-center justify-center mx-auto mb-5 text-2xl lg:text-3xl font-bold`}>
                {member.initials}
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-1">{member.name}</h3>
              <p className="text-sm lg:text-base text-primary font-medium mb-3">{member.role}</p>
              <p className="text-sm lg:text-base text-muted-foreground">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
