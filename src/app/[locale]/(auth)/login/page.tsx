'use client';

import { useActionState } from 'react';
import { authenticate } from '@/actions/auth-actions';

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Giriş Yap</h1>
                <form action={dispatch} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="admin@ezgi.com"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="******"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    {errorMessage && (
                        <div className="text-red-500 text-sm font-medium text-center">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-200 cursor-pointer"
                    >
                        Giriş Yap
                    </button>
                </form>
                <div className="mt-4 text-center text-xs text-gray-500">
                    <p>Demo Hesaplar:</p>
                    <p>Doktor: dt.mert@ezgi.com / 123</p>
                    <p>Admin: admin@ezgi.com / admin</p>
                </div>
            </div>
        </div>
    );
}
