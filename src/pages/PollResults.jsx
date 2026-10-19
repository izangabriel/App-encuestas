import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { usePoll } from '../contexts/PollContext';

const PollResults = ({ poll }) => {
    const [votes, setVotes] = useState([]);
    const { castVote } = usePoll();
    const [voteMsg, setVoteMsg] = useState("");

    useEffect(() => {
        const fetchVotes = async () => {
            const { data } = await supabase
                .from('votes')
                .select('*')
                .eq('poll_id', poll.id);
            setVotes(data || []);
        };
        fetchVotes();

        const channel = supabase
            .channel(`votes-${poll.id}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'votes', filter: `poll_id=eq.${poll.id}` },
                (payload) => {
                    setVotes(prev => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [poll.id]);

    const totalsByVotes = votes.reduce((acc, vote) => {
        const { option_index } = vote;

        if (!acc[option_index]) {
            acc[option_index] = 0;
        }

        acc[option_index] += 1;
        return acc;
    }, {});

    const totalVotes = votes.length;
    const maxCount = Math.max(0, ...Object.values(totalsByVotes));

    const handleVote = async (index) => {
        const result = await castVote(poll.id, index);

        if (result) {
            setVoteMsg("Voto registrado");
        } else {
            setVoteMsg("Ya votaste");
        }
    };

    const isSuccess = voteMsg === "Voto registrado";

    return (
        <section className="w-full max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white">
            <header className="flex items-start justify-between gap-6 border-b border-slate-200 px-6 py-5">
                <h2 className="text-lg font-semibold leading-snug text-slate-900">
                    {poll.question}
                </h2>
                <div className="shrink-0 text-right">
                    <p className="text-2xl font-semibold tabular-nums leading-none text-slate-900">
                        {totalVotes}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        {totalVotes === 1 ? 'voto' : 'votos'}
                    </p>
                </div>
            </header>

            <ul className="divide-y divide-slate-100">
                {poll.options.map((option, index) => {
                    const count = totalsByVotes[index] || 0;
                    const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                    const isLeading = count > 0 && count === maxCount;

                    return (
                        <li key={index}>
                            <button
                                type="button"
                                onClick={() => handleVote(index)}
                                aria-label={`Votar por ${option}. ${count} ${count === 1 ? 'voto' : 'votos'}, ${percent}%`}
                                className="group block w-full cursor-pointer px-6 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-700 motion-reduce:transition-none"
                            >
                                <span className="flex items-baseline justify-between gap-4">
                                    <span
                                        className={`text-sm ${isLeading ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'
                                            }`}
                                    >
                                        {option}
                                    </span>
                                    <span className="flex items-baseline gap-3 tabular-nums">
                                        <span className="text-xs text-slate-500">
                                            {count} {count === 1 ? 'voto' : 'votos'}
                                        </span>
                                        <span
                                            className={`w-12 text-right text-sm font-semibold ${isLeading ? 'text-blue-800' : 'text-slate-700'
                                                }`}
                                        >
                                            {percent}%
                                        </span>
                                    </span>
                                </span>

                                <span
                                    aria-hidden="true"
                                    className="mt-2.5 block h-1.5 overflow-hidden rounded-full bg-slate-100"
                                >
                                    <span
                                        className={`block h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none ${isLeading ? 'bg-blue-800' : 'bg-slate-400'
                                            }`}
                                        style={{ width: `${percent}%` }}
                                    />
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>

            <footer className="flex min-h-12 items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-6 py-3">
                <p className="text-xs text-slate-500">
                    Selecciona una opción para votar. Los resultados se actualizan en tiempo real.
                </p>
                <p
                    role="status"
                    className={`shrink-0 text-xs font-medium ${isSuccess ? 'text-green-700' : 'text-amber-700'}`}
                >
                    {voteMsg}
                </p>
            </footer>
        </section>
    );
};

export default PollResults;