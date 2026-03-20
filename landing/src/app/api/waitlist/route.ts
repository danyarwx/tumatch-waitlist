import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const CAMPUS_OPTIONS = ["TUM", "HHN", "42"] as const;

export async function POST(req: Request) {
  const { email, campus } = await req.json();

  const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const selectedCampus =
    typeof campus === "string" && CAMPUS_OPTIONS.includes(campus as (typeof CAMPUS_OPTIONS)[number])
      ? campus
      : "TUM";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }

  let error;

  ({ error } = await supabase
    .from("waitlist")
    .insert([{ email: cleanEmail, campus: selectedCampus }]));

  const canFallbackToEmailOnly =
    Boolean(error) &&
    typeof error?.message === "string" &&
    (error.message.includes("Could not find the 'campus' column") ||
      error.message.includes("schema cache"));

  if (canFallbackToEmailOnly) {
    ({ error } = await supabase
      .from("waitlist")
      .insert([{ email: cleanEmail }]));
  }

  if (error) {
    return NextResponse.json({ error: "Failed to save email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
