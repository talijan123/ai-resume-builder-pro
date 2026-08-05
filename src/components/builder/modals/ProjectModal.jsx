import { useEffect, useState } from "react";

import Modal from "../../ui/Modal/Modal";

const initialState = {
    title: "",
    role: "",
    technologies: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    githubLink: "",
    liveLink: "",
    description: "",
};

export default function ProjectModal({
    open,
    onClose,
    onSave,
    initialData,
}) {
    const [form, setForm] = useState(initialState);

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        } else {
            setForm(initialState);
        }
    }, [initialData, open]);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        onSave(form);
    }

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={
                initialData
                    ? "Edit Project"
                    : "Add Project"
            }
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                {/* Project Title */}

                <div>
                    <label className="mb-2 block font-medium">
                        Project Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="ResumeForge"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                        required
                    />
                </div>

                {/* Role */}

                <div>
                    <label className="mb-2 block font-medium">
                        Your Role
                    </label>

                    <input
                        type="text"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        placeholder="Frontend Developer"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                </div>

                {/* Technologies */}

                <div>
                    <label className="mb-2 block font-medium">
                        Technologies
                    </label>

                    <input
                        type="text"
                        name="technologies"
                        value={form.technologies}
                        onChange={handleChange}
                        placeholder="React, Tailwind CSS, Supabase"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />

                    <p className="mt-1 text-xs text-slate-500">
                        Separate technologies with commas.
                    </p>
                </div>

                {/* Dates */}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-2 block font-medium">
                            Start Date
                        </label>

                        <input
                            type="month"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            End Date
                        </label>

                        <input
                            type="month"
                            name="endDate"
                            value={form.endDate}
                            disabled={form.currentlyWorking}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 disabled:bg-slate-100"
                        />
                    </div>
                </div>

                {/* Current */}

                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name="currentlyWorking"
                        checked={form.currentlyWorking}
                        onChange={handleChange}
                    />

                    Currently Working
                </label>

                {/* GitHub */}

                <div>
                    <label className="mb-2 block font-medium">
                        GitHub Link
                    </label>

                    <input
                        type="url"
                        name="githubLink"
                        value={form.githubLink}
                        onChange={handleChange}
                        placeholder="https://github.com/username/project"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    />
                </div>

                {/* Live */}

                <div>
                    <label className="mb-2 block font-medium">
                        Live Demo
                    </label>

                    <input
                        type="url"
                        name="liveLink"
                        value={form.liveLink}
                        onChange={handleChange}
                        placeholder="https://project.com"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    />
                </div>

                {/* Description */}

                <div>
                    <label className="mb-2 block font-medium">
                        Description
                    </label>

                    <textarea
                        rows={5}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe your project..."
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 resize-none"
                    />
                </div>

                {/* Buttons */}

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-300 px-5 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="rounded-xl bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
                    >
                        Save Project
                    </button>
                </div>
            </form>
        </Modal>
    );
}