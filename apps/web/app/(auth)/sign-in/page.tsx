import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 lg:py-20">
      <SignIn />
    </div>
  );
}
