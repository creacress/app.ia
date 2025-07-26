

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

type Props = {
  name: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
};

export default function AnimatedServiceCard({
  name,
  href,
  description,
  icon,
  className,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Link
        href={href}
        aria-label={`Accéder au service ${name}`}
        className={`block bg-zinc-900 dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-gray-100 hover:scale-[1.03] transition-transform duration-300 ease-in-out p-6 rounded-2xl shadow-md text-center border border-zinc-700 dark:border-gray-300 ${className || ""}`}
      >
        {icon && <div className="text-3xl mb-3 text-zinc-300 dark:text-zinc-700">{icon}</div>}
        <span className="text-lg font-semibold block">{name}</span>
        {description && (
          <p className="text-sm text-zinc-400 dark:text-zinc-600 mt-2">{description}</p>
        )}
      </Link>
    </motion.div>
  );
}