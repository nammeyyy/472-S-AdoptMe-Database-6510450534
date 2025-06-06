import Elysia, { error, t } from "elysia";
import ProductRepository from "../repositories/ProductRepository";

enum status {
	AVAILABLE,
	OUT_OF_STOCK
}

const ProductController = new Elysia({
	prefix: "/api/product",
	tags: ["Product"],
})


ProductController.get(
	"/getAll",
	async () => {
		const productRepository = new ProductRepository();
		const product = await productRepository.getAll();
		return product ?? error(404,{error: "Product not found"});
	},
	{
		detail: {
			summary: "Get all products",
			description: "Get all products",
		}
	}
)

ProductController.get(
	"/getById/:id",
	async ({ params: { id } }) => {
		const productRepository = new ProductRepository();
		const product = await productRepository.getById(id);
		return product ?? error(404,{error: "Product not found"} );
	},
	{
		params: t.Object({
			id: t.Number(),
		}),
		detail: {
			summary: "Get product by id",
			description: "Get product by id",
		}
	}
)

ProductController.post(
	"/createProduct",
	async ({ body }) => {
		const productRepository = new ProductRepository();
		const product = await productRepository.createProduct(body);
		return product ?? { error: "Product not created" };
	},
	{
		body: t.Object({
			name: t.String(),
			price: t.Number(),
			stock: t.Number(),
			description: t.String(),
			product_category_id: t.Number(),
			imageurl: t.String(),
		}),
		detail: {
			summary: "Create product",
			description: "Create product",
		}
	}
)

ProductController.patch(
	"/orderProduct",
	async ({ body }) => {
		const productRepository = new ProductRepository();
		const product = await productRepository.getById(body.id);
		if (!product) {
			return error(404,{error: "Product not found"}
			);
		}
		if (product.stock < body.total) {
			return error(400,{error: "Not enough stock"}
			);
		}
		const newStock = product.stock - body.total;
		const newStatus = newStock > 0 ? "AVAILABLE" : "OUT_OF_STOCK"

		const updatedProduct = await productRepository.updateProduct({
			id: body.id,
			product: { 
				stock: newStock, 
				status: newStatus
			},
		});

		return updatedProduct;
	},
	{
		body: t.Object({
			id: t.Number(),
			total: t.Number(),
		}),
		detail: {
			summary: "Order product",
			description: "Order product",
		}
	}
)

ProductController.patch(
	"/updateProduct",
	async ({ body }) => {
		const productRepository = new ProductRepository();
		const findedProduct = await productRepository.getById(body.id);
		if (!findedProduct) {
			return error(404,{error: "Product not found"} );
		}
		const product = await productRepository.updateProduct({ id:body.id, product: body });
		return product;
	},
	{
		body: t.Object({
			id: t.Number(),
			name: t.Optional(t.String()),
			price: t.Optional(t.Number()),
			stock: t.Optional(t.Number()),
			product_category_id: t.Optional(t.Number()),
			description: t.Optional(t.String()),
			imageurl: t.Optional(t.String()),
			status: t.Optional(t.Enum({
				AVAILABLE: "AVAILABLE",
				OUT_OF_STOCK: "OUT_OF_STOCK",
			})),
		}),
		detail: {
			summary: "Update product",
			description: "Update product",
		}
	}
)

ProductController.delete(
	"/deleteProduct",
	async ({ body }) => {
		const productRepository = new ProductRepository();
		const findedProduct = await productRepository.getById(body.id);
		if (!findedProduct) {
			return error(404,{error: "Product not found"} );
		}
		const product = await productRepository.deleteProduct(body.id);
		return product ?? error(404,{error: "Product not found"} );
	},
	{
		body: t.Object({
			id: t.Number(),
		}),
		detail: {
			summary: "Delete product",
			description: "Delete product",
		}
	}
)


export default ProductController;
