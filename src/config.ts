import type { SpringOptions } from "framer-motion";

export const COLORS = {
	fruity: "#F4AE47",
	floral: "#C8A6C0",
	grassy: "#97A367",
	cereal: "#E0D17F",
	feinty: "#847353",
	peaty: "#919071",
	nutty: "#C38B2E",
	woody: "#966544",
	spicy: "#9A4343",
	winey: "#89537A",
} as const;

export type Color = (typeof COLORS)[keyof typeof COLORS];

export const SPRING_CONFIG: SpringOptions = {
	bounce: 0,
	mass: 0.1,
	damping: 10,
};
