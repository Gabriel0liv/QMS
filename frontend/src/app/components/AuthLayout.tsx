import { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center " data-theme="qms">
            {children}
        </div>
    );
}
