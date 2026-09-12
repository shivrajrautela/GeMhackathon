"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let mounted = true;

    const routeUser = (user: any) => {
      const role = user?.user_metadata?.role;
      if (role === 'officer') {
        router.push('/officer/dashboard');
      } else {
        router.push('/bidder/dashboard');
      }
    };

    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        if (mounted) setErrorMsg(error.message);
        setTimeout(() => router.push("/auth/login"), 3000);
        return;
      }

      if (session?.user) {
        routeUser(session.user);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        routeUser(session.user);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans">
      <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
      <h2 className="text-xl font-bold text-slate-800">Authenticating...</h2>
      <p className="text-slate-500 mt-2">Please wait while we redirect you to your dashboard.</p>
      {errorMsg && <p className="text-red-600 mt-4 font-medium bg-red-50 px-4 py-2 rounded">{errorMsg}</p>}
    </div>
  );
}
