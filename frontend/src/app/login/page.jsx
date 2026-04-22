import React from "react";

const LoginPage = () => {
  return (
    <>
      <div className="min-h-screen bg-bg-1 flex justify-center items-center p-4">
        {/* Background grid */}
        <div
          className="fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#6c8cff 1px, transparent 1px), linear-gradient(90deg, #6c8cff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="w-full max-w-sm animate-scaleIn">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="logo w-10 h-10 flex items-center justify-center rounded-xl bg-accent text-white font-mono text-sm font-bold">
              {"{ }"}
            </div>
            <div>
              <div className="text-white text-lg leading-tight font-bold">
                DSA Tracker
              </div>
              <div className="text-xs text-text-3">
                Master algorithms, one problem at a time
              </div>
            </div>
          </div>
          <div className="p-7 bg-bg-2 rounded-2xl border border-white/7 ">
            <div className="text-white font-semibold text-lg mb-1">
              Welcome back
            </div>
            <div className="text-xs text-text-3 mb-6">
              Sign in to continue your practice
            </div>
            <form action="">
              <label>EMAIL</label>
              <input type="email" name="" id="" />
              <label>PASSWORD</label>
              <input type="password" name="" id="" />
              <input type="submit" value="Sign In" />
            </form>
            No Account Create One
          </div>
          <div className="text-text-3 text-xs text-center">
            Demo use any email, password after registering
          </div>

          <div className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            test
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
