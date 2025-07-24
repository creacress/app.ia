

import Link from "next/link";

type Props = {
  name: string;
  href: string;
};

export default function ServiceCard({ name, href }: Props) {
  return (
    <Link
      href={href}
      className="block bg-zinc-900 hover:bg-zinc-800 transition p-6 rounded-2xl shadow-md text-center border border-zinc-700"
    >
      <span className="text-lg font-semibold">{name}</span>
    </Link>
  );
}