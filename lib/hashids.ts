import Hashids from "hashids"

const salt = process.env.HASHIDS_SALT || "xinna-medical-secret-salt"
const minLength = 8

const hashids = new Hashids(salt, minLength)

export const encodeId = (id: number | bigint) => {
    return hashids.encode(id)
}

export const decodeId = (hash: string) => {
    const decoded = hashids.decode(hash)
    return decoded.length > 0 ? Number(decoded[0]) : null
}

export const decodeIdAsBigInt = (hash: string) => {
    const decoded = hashids.decode(hash)
    return decoded.length > 0 ? BigInt(decoded[0].toString()) : null
}
