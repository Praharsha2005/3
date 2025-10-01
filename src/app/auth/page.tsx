import AuthForm from '@/app/components/AuthForm';

export default function AuthPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Authentication</h1>
      <AuthForm />
    </div>
  );
}