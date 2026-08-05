import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  HiChevronDown,
  HiUser,
  HiCog6Tooth,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";

import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

export default function UserDropdown() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const fullName =
    user?.user_metadata?.full_name || "User";

  const avatar =
    fullName.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();

    navigate("/login");
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          items-center
          gap-3

          rounded-2xl

          p-2

          transition-all

          hover:bg-slate-100
        "
      >
        <div
          className="
            flex

            h-11
            w-11

            items-center
            justify-center

            rounded-full

            bg-gradient-to-r
            from-blue-600
            to-indigo-600

            font-bold

            text-white
          "
        >
          {avatar}
        </div>

        <div className="hidden text-left lg:block">
          <p className="font-semibold text-slate-900">
            {fullName}
          </p>

          <p className="text-sm text-slate-500">
            {user?.email}
          </p>
        </div>

        <HiChevronDown
          className={`
            transition-transform
            duration-300

            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div
          className="
            absolute

            right-0
            mt-3

            w-64

            rounded-2xl

            border
            border-slate-200

            bg-white

            p-2

            shadow-2xl
          "
        >
          <Link
            to="/profile"
            className="
              flex
              items-center
              gap-3

              rounded-xl

              px-4
              py-3

              transition-all

              hover:bg-slate-100
            "
          >
            <HiUser size={20} />

            My Profile
          </Link>

          <Link
            to="/settings"
            className="
              flex
              items-center
              gap-3

              rounded-xl

              px-4
              py-3

              transition-all

              hover:bg-slate-100
            "
          >
            <HiCog6Tooth size={20} />

            Settings
          </Link>

          <hr className="my-2" />

          <button
            onClick={handleLogout}
            className="
              flex

              w-full

              items-center
              gap-3

              rounded-xl

              px-4
              py-3

              text-red-600

              transition-all

              hover:bg-red-50
            "
          >
            <HiArrowRightOnRectangle size={20} />

            Logout
          </button>
        </div>
      )}
    </div>
  );
}