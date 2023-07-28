import joi from "joi"

export const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().required().positive(),
    pricePerDay: joi.number().required().positive()
})
export const customersSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().required().min(10).max(11),
    cpf: joi.string().length(11).required(),
    birthday: joi.date().iso().required()
})

export const rentalsSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().required()
})