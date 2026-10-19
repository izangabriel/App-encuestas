import { useState } from "react";
import { usePoll } from "../contexts/PollContext";

const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

const PollForm = () => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const { createPoll } = usePoll();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanOptions = options.map(o => o.trim()).filter(o => o !== "");
        if (!question.trim() || cleanOptions.length < 2) return;

        const success = await createPoll(question.trim(), cleanOptions);

        if (success) {
            setQuestion("");
            setOptions(["", ""]);
        }
    };

    const addOption = () => {
        if (options.length < 5) {
            setOptions(prev => [...prev, ""]);
        }
    };

    const removeOption = (index) => {
        if (options.length > 2) {
            setOptions(prev => prev.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index, value) => {
        setOptions(prev => prev.map((option, i) => (i === index ? value : option)));
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
            <h2 className="text-lg font-semibold text-gray-900">Nueva encuesta</h2>

            <input
                type="text"
                placeholder="Escribe tu pregunta"
                aria-label="Pregunta"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={inputClass}
            />

            <div className="flex flex-col gap-2.5">
                {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder={`Opción ${index + 1}`}
                            aria-label={`Opción ${index + 1}`}
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            className={inputClass}
                        />
                        <button
                            type="button"
                            onClick={() => removeOption(index)}
                            disabled={options.length <= 2}
                            className="cursor-pointer shrink-0 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                        >
                            Quitar
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                    type="button"
                    onClick={addOption}
                    disabled={options.length >= 5}
                    className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    + Agregar opción
                </button>
                <button
                    type="submit"
                    className="cursor-pointer rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:scale-95"
                >
                    Crear encuesta
                </button>
            </div>
        </form>
    );
};

export default PollForm;