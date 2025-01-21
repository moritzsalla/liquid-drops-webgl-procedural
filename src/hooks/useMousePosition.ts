import { useMotionValue } from "framer-motion";
import { useEffect } from "react";

// Normalized: 0 - 1
export const useMousePosition = () => {
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			const centerX = window.innerWidth / 2;
			const centerY = window.innerHeight / 2;
			const relativeX = (e.clientX - centerX) / (window.innerWidth / 2);
			const relativeY = (e.clientY - centerY) / (window.innerHeight / 2);
			mouseX.set(relativeX);
			mouseY.set(relativeY);
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [mouseX, mouseY]);

	return {
		mouseX,
		mouseY,
	};
};
