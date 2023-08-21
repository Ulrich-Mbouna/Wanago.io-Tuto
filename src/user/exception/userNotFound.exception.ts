import {NotFoundException} from "@nestjs/common";

export class UserNotFoundException extends NotFoundException {
    constructor(type: string, entity: string|number) {
        super(`User with ${type} ${entity} not found`)
    }
}
