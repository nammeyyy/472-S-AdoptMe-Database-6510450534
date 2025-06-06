import { adoption } from "@prisma/client";
import db from "./Database";


class AdoptionRepository{

	public async getAll(): Promise<adoption[]> {
		return await db.adoption.findMany();
	}

	public async getById(id: number): Promise<adoption | null> {
		return await db.adoption.findUnique({
			where: { id: id },
		});
	}

	public async getByPetId(pet_id: number): Promise<adoption | null> {
		return await db.adoption.findFirst({
			where: { pet_id: pet_id },
		});
	}

	public async createAdoption({
		pet_id,
		user_id,
	}: {
		pet_id: number;
		user_id: string;
	}): Promise<adoption> {
		return await db.adoption.create({
			data: {
				pet_id: pet_id,
				user_id: user_id,
			},
		});
	}

	public async updateAdoption({
		id,
		adoption,
	}: {
		id: number;
		adoption: Partial <adoption>;
	}): Promise<adoption | null> {
		return await db.adoption.update({
			where: { id: id },
			data: adoption,
		});
	}

	public async updateAdopted({
		id
	}: {
		id: number;
	}): Promise<adoption | null> {
		return await db.adoption.update({
			where: { id: id },
			data: {
				updatedAt : new Date()
			}
		});
	}

	public async deleteAdoption(id: number): Promise<adoption> {
		return await db.adoption.delete({
			where: { id: id },
		});
	}

}


export default AdoptionRepository;
