import { useEffect } from "react";
import { HiXMark } from "react-icons/hi2";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-3xl",
}) {
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50

        flex
        items-center
        justify-center

        bg-black/50

        p-6
      "
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          relative

          w-full
          ${width}

          rounded-3xl

          bg-white

          shadow-2xl

          animate-in
          fade-in
          zoom-in-95
          duration-200
        `}
      >
        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between

            border-b
            border-slate-200

            px-8
            py-6
          "
        >
          <h2 className="text-2xl font-black text-slate-900">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              rounded-xl

              p-2

              transition-all

              hover:bg-slate-100
            "
          >
            <HiXMark size={24} />
          </button>
        </div>

        {/* Body */}

        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}