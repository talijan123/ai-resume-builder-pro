import { useEffect, useState } from "react";

import Modal from "../../UI/Modal/Modal";

const initialState = {
  name: "",
  issuer: "",
  issueDate: "",
  expiryDate: "",
  neverExpires: false,
  credentialId: "",
  credentialUrl: "",
  description: "",
};

export default function CertificationModal({
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
    const { name, value, type, checked } =
      e.target;

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
          ? "Edit Certification"
          : "Add Certification"
      }
      width="max-w-3xl"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Certificate Name */}

        <div>
          <label className="mb-2 block font-medium">
            Certificate Name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Google UX Design Professional Certificate"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Issuer */}

        <div>
          <label className="mb-2 block font-medium">
            Issuing Organization
          </label>

          <input
            type="text"
            name="issuer"
            value={form.issuer}
            onChange={handleChange}
            placeholder="Google"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Dates */}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block font-medium">
              Issue Date
            </label>

            <input
              type="month"
              name="issueDate"
              value={form.issueDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Expiry Date
            </label>

            <input
              type="month"
              name="expiryDate"
              value={form.expiryDate}
              disabled={form.neverExpires}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 disabled:bg-slate-100"
            />
          </div>
        </div>

        {/* Never Expires */}

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="neverExpires"
            checked={form.neverExpires}
            onChange={handleChange}
          />

          This certificate never expires
        </label>

        {/* Credential ID */}

        <div>
          <label className="mb-2 block font-medium">
            Credential ID
          </label>

          <input
            type="text"
            name="credentialId"
            value={form.credentialId}
            onChange={handleChange}
            placeholder="ABC-12345"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        {/* Credential URL */}

        <div>
          <label className="mb-2 block font-medium">
            Credential URL
          </label>

          <input
            type="url"
            name="credentialUrl"
            value={form.credentialUrl}
            onChange={handleChange}
            placeholder="https://..."
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
            placeholder="Describe this certification..."
            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        {/* Footer */}

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
            Save Certification
          </button>
        </div>
      </form>
    </Modal>
  );
}