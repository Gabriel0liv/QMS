import { Users } from "lucide-react";

export function GestaoUtilizadores() {
    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow">
                    <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestão de Utilizadores</h1>
                    <p className="text-sm text-gray-500">Criar contas, redefinir passwords e atribuir perfis</p>
                </div>
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-10 text-center max-w-lg">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700">Módulo em desenvolvimento</p>
                <p className="text-sm text-gray-400 mt-1">Este módulo será implementado em breve.</p>
            </div>
        </div>
    );
}
