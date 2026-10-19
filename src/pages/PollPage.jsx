import { Link, useParams } from 'react-router-dom';
import { usePoll } from '../contexts/PollContext';
import PollResults from './PollResults';


const PollPage = () => {
    const { id } = useParams();
    const { polls, loading, error } = usePoll();

    const poll = polls.find(p => p.id === id);

    return (
        <div className="mx-auto max-w-2xl px-4 py-10">
            <Link to="/" className="text-sm text-indigo-600 hover:underline">
                ← Todas las encuestas
            </Link>

            <div className="mt-6">
                {loading ? (
                    <p className="text-gray-500">Cargando...</p>
                ) : error ? (
                    <p className="text-red-700">{error}</p>
                ) : !poll ? (
                    <p className="text-gray-500">Encuesta no encontrada</p>
                ) : (
                    <PollResults poll={poll} />
                )}
            </div>
        </div>
    );
};

export default PollPage;