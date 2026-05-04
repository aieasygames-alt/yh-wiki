import Image from "next/image";

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <Image
      src="/logo-80.png"
      alt="NTE Guide"
      width={size}
      height={size}
      className="rounded-full"
      priority
    />
  );
}
