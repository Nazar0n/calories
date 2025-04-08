import { Nutritions } from "../intakes/Intake";

export type Product = {
	id: string;
	userId: string;
	name: string;
	nutrition: Nutritions;
	createdAt: Date;
}