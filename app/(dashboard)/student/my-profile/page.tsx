// import { redirect } from "next/navigation";
// import { getSession } from "@/lib/action/auth-actions";
// import { getAccessToken, getIdToken } from "@/lib/utils/token-manager";
import StudentProfileDashboard from "./_components/StudentProfileDashboard";
// import { getAccountsSignInUrl } from "@/lib/utils/index";

export const metadata = {
  title: "Dashboard - Profile",
  description: "User Profile",
};

export default async function DashboardPage() {
  // AUTHENTICATION COMMENTED OUT - Using mock user data
  // const session = await getSession();
  // console.log("session", session.user);
  // const [accessToken, idToken] = await Promise.all([
  //   getAccessToken(),
  //   getIdToken(),
  // ]);
  // const decodeIdTokenClaims = (() => {
  //   if (!idToken) return null;
  //   try {
  //     const parts = idToken.split(".");
  //     if (parts.length < 2) return null;
  //     const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  //     const padded = base64 + "===".slice((base64.length + 3) % 4);
  //     const json = Buffer.from(padded, "base64").toString("utf8");
  //     return JSON.parse(json);
  //   } catch {
  //     return null;
  //   }
  // })();
  // console.log("decodeIdTokenClaims", decodeIdTokenClaims);

  // if (!session.isAuthenticated || !session.user) {
  //   redirect(getAccountsSignInUrl());
  // }

  const mockUser = {
    id: "mock-user-id",
    name: "Rafiq Islam",
    email: "rafiq121@gmail.com",
    picture: null,
  };

  return (
    <StudentProfileDashboard
      user={mockUser}
      accessToken={null}
      idToken={null}
      decodedIdClaims={null}
    />
  );
}
