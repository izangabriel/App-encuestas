import { useState, useMemo } from 'react';
import PollForm from '../components/PollForm';
import { usePoll } from '../contexts/PollContext';
import { Link } from 'react-router-dom';

const MAX_PREVIEW = 3;

const formatDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
};

const ChartIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M4 20V10" />
        <path d="M10 20V4" />
        <path d="M16 20v-7" />
        <path d="M22 20H2" />
    </svg>
);

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
    </svg>
);

const ChevronIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <path d="m9 6 6 6-6 6" />
    </svg>
);

const PollList = () => {
    const { polls, loading, error } = usePoll();
    const [query, setQuery] = useState('');

    const totalOptions = useMemo(
        () => (polls || []).reduce((sum, poll) => sum + (poll.options?.length || 0), 0),
        [polls]
    );

    const filteredPolls = useMemo(() => {
        const term = query.trim().toLowerCase();
        const list = polls || [];
        if (!term) return list;
        return list.filter(poll => poll.question?.toLowerCase().includes(term));
    }, [polls, query]);

    const hasPolls = !loading && !error && polls.length > 0;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Encabezado de la página */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-800 text-white">
                            <ChartIcon />
                        </span>
                        <p className="text-sm font-semibold text-slate-900">Panel de encuestas</p>
                    </div>

                    <h1 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Recoge opiniones y mira los resultados al instante
                    </h1>
                    <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
                        Crea una encuesta en segundos, compártela y sigue cada voto en tiempo real.
                    </p>

                    <dl className="mt-8 grid max-w-md grid-cols-2 gap-4">
                        <div className="rounded-lg border border-slate-200 px-4 py-3">
                            <dt className="text-xs text-slate-500">Encuestas activas</dt>
                            <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
                                {loading ? '–' : polls.length}
                            </dd>
                        </div>
                        <div className="rounded-lg border border-slate-200 px-4 py-3">
                            <dt className="text-xs text-slate-500">Opciones de respuesta</dt>
                            <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
                                {loading ? '–' : totalOptions}
                            </dd>
                        </div>
                    </dl>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <section aria-labelledby="lista-encuestas">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 id="lista-encuestas" className="text-lg font-semibold text-slate-900">
                            Todas las encuestas
                        </h2>

                        {hasPolls && (
                            <div className="relative w-full sm:w-64">
                                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                                    <SearchIcon />
                                </span>
                                <input
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Buscar encuesta"
                                    aria-label="Buscar encuesta"
                                    className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-2 focus:outline-offset-0 focus:outline-blue-700/30"
                                />
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div
                            role="status"
                            className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-16 text-sm text-slate-500"
                        >
                            <span
                                aria-hidden="true"
                                className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-800 motion-reduce:animate-none"
                            />
                            Cargando encuestas...
                        </div>
                    ) : error ? (
                        <p
                            role="alert"
                            className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800"
                        >
                            No se pudieron cargar las encuestas. {error}
                        </p>
                    ) : polls.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                <ChartIcon className="h-6 w-6" />
                            </span>
                            <p className="mt-4 text-sm font-semibold text-slate-900">
                                Todavía no hay encuestas
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Crea la primera con el formulario de la derecha.
                            </p>
                        </div>
                    ) : filteredPolls.length === 0 ? (
                        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
                            <p className="text-sm font-semibold text-slate-900">Sin resultados</p>
                            <p className="mt-1 text-sm text-slate-500">
                                Ninguna encuesta coincide con “{query}”.
                            </p>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-4">
                            {filteredPolls.map(poll => {
                                const options = poll.options || [];
                                const preview = options.slice(0, MAX_PREVIEW);
                                const remaining = options.length - preview.length;
                                const date = formatDate(poll.created_at);

                                return (
                                    <li key={poll.id}>
                                        <Link
                                            to={`/polls/${poll.id}`}
                                            className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 motion-reduce:transition-none"
                                        >
                                            <div>
                                                <h3 className="text-base font-semibold leading-snug text-slate-900">
                                                    {poll.question}
                                                </h3>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {options.length} {options.length === 1 ? 'opción' : 'opciones'}
                                                    {date ? ` · Creada el ${date}` : ''}
                                                </p>
                                            </div>

                                            {preview.length > 0 && (
                                                <ul className="flex flex-wrap gap-2">
                                                    {preview.map((option, index) => (
                                                        <li
                                                            key={index}
                                                            className="max-w-full truncate rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                                                        >
                                                            {option}
                                                        </li>
                                                    ))}
                                                    {remaining > 0 && (
                                                        <li className="px-1 py-1 text-xs text-slate-500">
                                                            +{remaining} más
                                                        </li>
                                                    )}
                                                </ul>
                                            )}

                                            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                                <span className="text-xs text-slate-500">
                                                    Resultados en tiempo real
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-800 group-hover:underline">
                                                    Votar y ver resultados
                                                    <ChevronIcon />
                                                </span>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>

                {/* Panel lateral: crear encuesta */}
                <aside aria-labelledby="crear-encuesta" className="lg:sticky lg:top-6 lg:self-start">
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <h2 id="crear-encuesta" className="text-lg font-semibold text-slate-900">
                            Crear encuesta
                        </h2>
                        <p className="mt-1 mb-4 text-sm text-slate-500">
                            Escribe una pregunta y añade las opciones de respuesta.
                        </p>
                        <PollForm />
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default PollList;