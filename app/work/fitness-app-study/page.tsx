import type { Metadata } from "next";
import { FitnessStudy } from "./fitness-study";

export const metadata: Metadata = {
  title: "Fitness app competitor study",
  description: "UX review of 18 fitness and wellness apps by Waseem Taha: common features, unique features and what is worth learning from.",
};

export default function Page() {
  return <FitnessStudy />;
}
