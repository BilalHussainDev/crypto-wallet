import Image from "next/image";

export default function Logo() {
	return (
    <div style={{ margin: "1rem", filter: "drop-shadow(-2px 4px 6px #2063a5)" }}>
      <Image src="/img/pol.svg" alt="POL" width={120} height={120} priority />
    </div>
  );
}
