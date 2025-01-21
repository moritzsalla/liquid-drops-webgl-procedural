import { MotionValue, useTransform } from "framer-motion";
import { useMousePosition } from "./useMousePosition";

const INITIAL_OFFSET = -50;

export const useReflectionRotation = (): MotionValue<number> => {
	const { mouseX, mouseY } = useMousePosition();

	const rotation = useTransform<number, number>([mouseX, mouseY], ([x, y]) => {
		const baseAngle = Math.atan2(y, x) * (180 / Math.PI);
		const adjustedAngle = (baseAngle + 180 + INITIAL_OFFSET) % 360;
		return adjustedAngle;
	});

	return rotation;
};
