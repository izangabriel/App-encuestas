import { useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { supabase } from '../supabaseClient';


const PollContext = createContext();

export const PollProvider = ({ children }) => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchPolls = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('polls')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            setError(error.message);
        } else {
            setPolls(data);
            setError("");
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchPolls()
    }, []);

    const getVoterId = () => {
        let voterId = localStorage.getItem('voterId');

        if (!voterId) {
            voterId = crypto.randomUUID();
            localStorage.setItem('voterId', voterId);
        }

        return voterId;
    };

    const createPoll = async (question, options) => {
        const { error, data } = await supabase.from('polls').insert([
            { question, options }
        ]).select();

        if (!error) {
            setPolls(prev => [...prev, data[0]]);
            return true;
        } else {
            return false
        }
    };

    const castVote = async (pollId, optionIndex) => {
        const voterId = getVoterId();

        const { data: existingVote } = await supabase
            .from('votes')
            .select('id')
            .eq('poll_id', pollId)
            .eq('voter_id', voterId)
            .maybeSingle();

        if (existingVote) {
            return false;
        } else {
            const { error } = await supabase.from('votes').insert([
                { poll_id: pollId, option_index: optionIndex, voter_id: voterId }
            ]);

            return !error;
        }
    };

    return (
        <PollContext.Provider value={{ createPoll, polls, loading, error, castVote }}>
            {children}
        </PollContext.Provider>
    );
};

export const usePoll = () => useContext(PollContext);

