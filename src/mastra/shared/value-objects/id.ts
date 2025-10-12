export class Id {
    #value: string
    constructor(value: number | string | Id) {
        this.#value = value instanceof Id ? value.#value : String(value).trim()
    }

    equals(id: Id | string | number) {
        return this.value === new Id(id).value
    }
    get value() {
        return `${this.#value}`
    }
    toString() {
        return this.value
    }
}
