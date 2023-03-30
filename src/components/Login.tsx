import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div className="min-h-screen w-screen min-w-full">
      <div className="flex items-center justify-center text-zinc-50">
        <div className="flex h-screen flex-1 flex-col items-center justify-center">
          <h1 className="text-3xl">Your Place to keep notes</h1>
          <h2>Login via github.com</h2>
        </div>
        <div className="flex h-screen flex-1 items-center justify-center">
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() => void signIn()}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
