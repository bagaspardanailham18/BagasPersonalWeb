import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import { MeteorShower } from '@/components/MeteorShower';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import React, { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const currentYear = new Date().getFullYear();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Sign In — Personal Manifesto" />
            <div className="bg-[#050505] text-mist font-body">
                <MeteorShower />

                <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
                    <div className="glow-orb -top-20 -left-20 h-60 w-60 bg-emerald-500/20" style={{ animationDelay: '0s' }}></div>
                    <div className="glow-orb -bottom-20 -right-20 h-72 w-72 bg-blue-500/10" style={{ animationDelay: '2s' }}></div>

                    <Link href="/" className="absolute top-6 left-6 sm:top-10 sm:left-10 inline-flex items-center gap-2 text-sm text-pewter transition hover:text-white group animate-fade-in-up z-20">
                        <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
                        Home
                    </Link>

                    <div className="glass-card relative w-full max-w-md rounded-[2.5rem] p-8 sm:p-10 shadow-soft animate-fade-in-up delay-1">
                        <div className="text-center space-y-3 mb-10">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-pewter sm:text-xs">Welcome back to</p>
                            <h1 className="font-display text-3xl sm:text-4xl text-white">Personal Manifesto</h1>
                            <p className="text-sm text-pewter leading-relaxed">Sign in to continue your journey</p>
                        </div>

                        {status && (
                            <div className="mb-4 text-center text-sm font-medium text-emerald-400">
                                {status}
                            </div>
                        )}

                        <Form
                            {...AuthenticatedSessionController.store.form()}
                            resetOnSuccess={['password']}
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-xs uppercase tracking-[0.3em] text-pewter">Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder="your@email.com"
                                            className="auth-input"
                                            required
                                            autoFocus
                                            autoComplete="email"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="password" className="block text-xs uppercase tracking-[0.3em] text-pewter">Password</label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Enter your password"
                                                className="auth-input pr-16"
                                                required
                                                autoComplete="current-password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-pewter hover:text-white transition"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <label className="flex items-center gap-2.5 cursor-pointer">
                                            <input type="checkbox" id="remember" name="remember" className="custom-checkbox" />
                                            <span className="text-sm text-pewter">Remember me</span>
                                        </label>
                                        {canResetPassword && (
                                            <Link href={request()} className="text-sm text-pewter transition hover:text-white">
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

                                    <div className="pt-3">
                                        <button type="submit" className="auth-btn flex items-center justify-center gap-2" disabled={processing}>
                                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            Sign In
                                        </button>
                                    </div>
                                </>
                            )}
                        </Form>

                        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        <p className="text-center text-sm text-pewter">
                            Don't have an account?{' '}
                            <Link href={register()} className="text-white font-medium transition hover:text-pewter ml-1">
                                Create one →
                            </Link>
                        </p>
                    </div>

                    <p className="mt-8 text-[10px] uppercase tracking-[0.35em] text-pewter/50 animate-fade-in-up delay-3">
                        © {currentYear} Bagas Pardana Ilham
                    </p>
                </div>
            </div>
        </>
    );
}
