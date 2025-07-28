import Hero from "@/Components/Home/Hero";
import AssignmentForm from "@/Components/Home/AssignmentForm";
import Separator from "@/Utility/Separator";
import FAQ from "@/Components/Home/Faq";
import JoinTeam from "@/Components/Home/JoinTeam";
import CSEProjectAssistance from "@/Components/Home/CSEProjectAssistance";

export default function Home() {
  return (
    <div>
      <Hero />
      <Separator />
      <AssignmentForm />
      <Separator />
      <CSEProjectAssistance />
      <Separator />
      <FAQ />
      {/* <Separator />
      <JoinTeam /> */}
    </div>
  );
}
