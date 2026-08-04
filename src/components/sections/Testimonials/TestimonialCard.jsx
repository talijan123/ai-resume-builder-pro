import { motion } from "framer-motion";
import { HiStar } from "react-icons/hi2";

export default function TestimonialCard({
  name,
  role,
  company,
  avatar,
  rating,
  review,
}) {
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.02,
      }}
      transition={{
        duration: 0.3,
      }}
      className="
        group

        rounded-3xl

        border
        border-slate-200

        bg-white

        p-8

        shadow-lg

        transition-all
        duration-300

        hover:shadow-2xl
      "
    >
      {/* Stars */}

      <div className="flex gap-1">

        {[...Array(rating)].map((_, index) => (

          <motion.div
            key={index}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: index * 0.08,
            }}
            viewport={{
              once: true,
            }}
          >
            <HiStar
              size={20}
              className="text-yellow-400"
            />
          </motion.div>

        ))}

      </div>

      {/* Review */}

      <p
        className="
          mt-6

          leading-8

          text-slate-600
        "
      >
        "{review}"
      </p>

      {/* Divider */}

      <div
        className="
          my-8

          h-px

          bg-slate-200
        "
      />

      {/* User */}

      <div className="flex items-center gap-4">

        <motion.img
          whileHover={{
            scale: 1.08,
          }}
          src={avatar}
          alt={name}
          className="
            h-16
            w-16

            rounded-full

            object-cover

            ring-4
            ring-blue-100
          "
        />

        <div>

          <h4
            className="
              text-lg

              font-bold

              text-slate-900
            "
          >
            {name}
          </h4>

          <p
            className="
              text-sm

              text-slate-500
            "
          >
            {role}
          </p>

          <span
            className="
              mt-1

              inline-flex

              rounded-full

              bg-blue-100

              px-3
              py-1

              text-xs

              font-semibold

              text-blue-700
            "
          >
            {company}
          </span>

        </div>

      </div>

    </motion.div>
  );
}