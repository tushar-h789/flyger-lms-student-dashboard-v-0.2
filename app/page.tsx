import { redirect } from "next/navigation";
// import { getSession } from "@/lib/action/auth-actions";
// import { redirect as nextRedirect } from "next/navigation";

export default async function Home() {
  // AUTHENTICATION COMMENTED OUT - Redirect directly to student dashboard
  // const session = await getSession();

  // if (session?.isAuthenticated && session?.user) {
  //   return redirect("/student");
  // }

  // Send unauthenticated users to our OIDC initiator which sets PKCE and redirects
  // return nextRedirect("/auth/start");
  
  // Direct redirect to student dashboard without authentication
  return redirect("/student");
}
