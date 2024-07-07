import Image from "next/image";

export default function Logo() {
	return (
		<div>
			<Image
				src="/img/ethereum.png"
				alt="ETH"
				width={150}
				height={150}
				priority
			/>
		</div>
	);
}
