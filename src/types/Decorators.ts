export function ValidaDebito(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(valordoDebito: number) {
        if (valordoDebito <= 0) {
            throw new Error("O valor a ser debitado precisa ser maior do que zero!");
        }

        if (valordoDebito > this.saldo) {
            throw new Error("Seu saldo é insulficiente para realizar a operação!");
        }

        return originalMethod.apply(this, [valordoDebito]);
    };

    return descriptor;
}

export function ValidaDeposito(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(valorDoDeposito: number) {
        if (valorDoDeposito <= 0) {
            throw new Error("O valor a ser depositado precisa ser maior do que zero!");
        }

        return originalMethod.apply(this, [valorDoDeposito]);
    }

    return descriptor;
}