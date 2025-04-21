import Hero from "@/components/Hero";
import AssignmentForm from "@/components/AssignmentForm";
import Separator from "@/components/Separator";
import FAQ from "@/components/Faq";
import JoinTeam from "@/components/JoinTeam";

export default function Home() {
  return (
    <div>
      <Hero />
      <Separator />
      <AssignmentForm />
      <Separator />
      <FAQ />
      {/* <Separator />
      <JoinTeam /> */}
    </div>
  );
}
