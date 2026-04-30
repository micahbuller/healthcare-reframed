import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About",
  description:
    "Healthcare Reframed is a 501(c)3 nonprofit amplifying voices of change in healthcare. Learn about our team, mission, and founding story.",
};

export default function AboutPage() {
  return <AboutClient />;
}
