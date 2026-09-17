'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { login, signup} from '@/lib/api/auth.api';
import { APP_ROUTES } from '@/lib/app-routes';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from '@reddit-clone/shared';
import { useMutation } from '@tanstack/react-query';
import {
  ArrowRight,
  Check,
  Eye,
  EyeClosed,
  LockKeyhole,
  Mail,
  MessageSquareQuote,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Controller,
  useForm,
  type FieldError as HookFormFieldError,
  type UseFormRegisterReturn,
} from 'react-hook-form';

type AuthMode = 'login' | 'signup';

const content = {
  login: {
    eyebrow: 'Welcome back',
    title: 'Pick up where you left off.',
    description: 'Sign in to return to your communities, saved posts, and ongoing conversations.',
    panelTitle: 'Good conversations are better when you come back to them.',
    panelDescription:
      'Your feed is ready with the questions, ideas, and communities that matter to you.',
    submitLabel: 'Sign in',
    switchPrompt: 'New to common ground?',
    switchLabel: 'Create an account',
    switchHref: APP_ROUTES.AUTH.SIGNUP,
  },
  signup: {
    eyebrow: 'Join the community',
    title: 'Create your place in the conversation.',
    description: 'A few details are all you need to start sharing, learning, and connecting.',
    panelTitle: 'Find your people. Share what you know. Stay curious.',
    panelDescription:
      'Common ground brings thoughtful questions and useful answers into one welcoming place.',
    submitLabel: 'Create account',
    switchPrompt: 'Already have an account?',
    switchLabel: 'Sign in',
    switchHref: APP_ROUTES.AUTH.LOGIN,
  },
} as const;

function AuthPage({ mode }: { mode: AuthMode }) {
  const pageContent = content[mode];
  const isLogin = mode === 'login';

  return (
    <section className="grid min-h-[calc(100dvh-4rem)] overflow-hidden bg-background text-foreground lg:grid-cols-[minmax(0,0.85fr)_minmax(32rem,1.15fr)]">
      <aside className="relative isolate overflow-hidden bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-14 lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-16">
        <div
          className="pointer-events-none absolute -right-24 -top-24 -z-10 size-72 rounded-full border border-primary-foreground/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-10 -top-10 -z-10 size-44 rounded-full border border-primary-foreground/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 -left-28 -z-10 size-80 rounded-full border border-primary-foreground/10"
          aria-hidden="true"
        />

        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 px-3 py-1.5 text-xs font-medium text-primary-foreground/75">
            <span className="size-1.5 rounded-full bg-primary-foreground" />A place for thoughtful
            people
          </div>

          <h2 className="mt-8 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.045em] text-balance sm:text-4xl lg:mt-12 lg:text-5xl">
            {pageContent.panelTitle}
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-primary-foreground/65 sm:text-base">
            {pageContent.panelDescription}
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:mt-16 lg:grid-cols-1">
          <CommunityPoint
            icon={MessageSquareQuote}
            title="Speak freely"
            description="Start conversations that are worth having."
          />
          <CommunityPoint
            icon={UsersRound}
            title="Find your circle"
            description="Discover people who care about the same things."
          />
          <CommunityPoint
            icon={ShieldCheck}
            title="Stay in control"
            description="Your profile and preferences remain yours."
          />
        </div>
      </aside>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8 sm:py-16 lg:px-14">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {pageContent.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl">
              {pageContent.title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {pageContent.description}
            </p>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm submitLabel={pageContent.submitLabel} />}

          <p className="mt-7 text-center text-sm text-muted-foreground">
            {pageContent.switchPrompt}{' '}
            <Link
              href={pageContent.switchHref}
              className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              {pageContent.switchLabel}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function LoginForm() {
  const [passwordShown, setPasswordShown] = useState(false);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const router = useRouter();

  const { mutateAsync: triggerLogin, isPending } = useMutation({
    mutationFn: login,
    mutationKey: ['login'],
  });

  const onSubmit = (data: LoginInput) => {
    toast.promise(triggerLogin(data), {
      loading: 'Logging in...',
      success: () => {
        router.push(APP_ROUTES.DASHBOARD);
        return 'Login successful';
      },
      error: 'Failed to log in.',
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-7">
        <CardContent className="p-0 flex flex-col gap-5">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm font-medium" htmlFor="login-email">
                  Email
                </FieldLabel>
                <Input
                  className="h-11 bg-background px-3 text-sm md:text-sm"
                  id="login-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="you@example.com"
                  autoComplete="off"
                  autoFocus
                  {...field}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm font-medium" htmlFor="login-password">
                  Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    className="h-11 bg-background px-3 text-sm md:text-sm"
                    id="login-password"
                    type={passwordShown ? 'text' : 'password'}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                    autoComplete="off"
                    autoFocus
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordShown((pv) => !pv)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-60"
                  >
                    {passwordShown ? (
                      <EyeClosed className="size-4 stroke-1" />
                    ) : (
                      <Eye className="size-4 stroke-1" />
                    )}
                  </button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button loading={isPending} type="submit" className="h-11 w-full rounded-xl text-sm">
            Login <ArrowRight />
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

function RegisterForm({ submitLabel }: { submitLabel: string }) {
  
  const router = useRouter();
  
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {mutateAsync: triggerSignup, isPending} = useMutation({
    mutationFn: signup,
    mutationKey: ['signup'],
  });

  const onSubmit = (data: RegisterInput) => {
    toast.promise(triggerSignup(data), {
      loading: 'Creating account...',
      success: () => {
        router.push(APP_ROUTES.AUTH.LOGIN);
        return 'Account created successfully. Please log in.'
      },
      error: 'Failed to create account. Please try again.',
    });
  };


  return (
    <AuthFormShell
      formId="register-form"
      submitLabel={submitLabel}
      onSubmit={form.handleSubmit(onSubmit)}
      isPending={isPending}
      preference="I agree to keep conversations respectful and follow the community guidelines."
      preferenceChecked
    >
      <div
        className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-7"
      >
        <AuthField
          id="register-name"
          label="Display name"
          placeholder="How should people know you?"
          type="text"
          autoComplete="name"
          icon={UserRound}
          registration={form.register('name')}
          error={form.formState.errors.name}
        />
        <AuthField
          id="register-email"
          label="Email address"
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
          icon={Mail}
          registration={form.register('email')}
          error={form.formState.errors.email}
        />
        <AuthField
          id="register-password"
          label="Password"
          placeholder="Create a password"
          type="password"
          autoComplete="new-password"
          icon={LockKeyhole}
          registration={form.register('password')}
          error={form.formState.errors.password}
        />
        <AuthField
          id="register-password-confirmation"
          label="Confirm password"
          placeholder="Enter it once more"
          type="password"
          autoComplete="new-password"
          icon={LockKeyhole}
          registration={form.register('confirmPassword')}
          error={form.formState.errors.confirmPassword}
        />
      </div>
    </AuthFormShell>
  );
}

function AuthFormShell({
  children,
  formId,
  onSubmit,
  preference,
  preferenceChecked = false,
  submitLabel,
  isPending=false,
}: {
  children: React.ReactNode;
  formId: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  preference: string;
  preferenceChecked?: boolean;
  submitLabel: string;
  isPending?: boolean;
}) {
  return (
    <form
      id={formId}
      className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-7"
      onSubmit={onSubmit}
      noValidate
    >
      <FieldGroup className="gap-5">{children}</FieldGroup>

      <div className="mt-5 flex items-start gap-2.5">
        <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded border border-border bg-muted text-muted-foreground">
          {preferenceChecked ? <Check className="size-3" aria-hidden="true" /> : null}
        </span>
        <p className="text-xs leading-5 text-muted-foreground">{preference}</p>
      </div>

      <Button loading={isPending} type="submit" className="mt-6 h-11 w-full rounded-xl text-sm">
        {submitLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </form>
  );
}

function AuthField({
  id,
  label,
  icon: Icon,
  registration,
  error,
  ...inputProps
}: {
  id: string;
  label: string;
  icon: typeof Mail;
  registration: UseFormRegisterReturn;
  error?: HookFormFieldError;
  placeholder: string;
  type: 'email' | 'password' | 'text';
  autoComplete: string;
}) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id} className="text-sm text-foreground">
        {label}
      </FieldLabel>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />

        <Input
          id={id}
          aria-invalid={Boolean(error)}
          className="h-11 rounded-xl border-border bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 md:text-sm"
          {...inputProps}
          {...registration}
        />
      </div>
      {error ? <FieldError errors={[error]} /> : null}
    </Field>
  );
}

function CommunityPoint({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof MessageSquareQuote;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-foreground/10 text-primary-foreground">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-primary-foreground/55">{description}</p>
      </div>
    </div>
  );
}

export default AuthPage;
