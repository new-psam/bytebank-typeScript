import { TipoTransacao } from "./TipoTransacao.js";
let saldo = JSON.parse(localStorage.getItem("saldo")) || 0;
const transacoes = JSON.parse(localStorage.getItem("transacoes"), (key, value) => {
    if (key === "data") {
        return new Date(value);
    }
    return value;
}) || [];
function debitar(valor) {
    if (valor <= 0) {
        throw new Error("O valor debitado deve ser maior que zero");
    }
    if (valor > saldo) {
        throw new Error("Saldo insuficiente!");
    }
    saldo -= valor;
    localStorage.setItem("saldo", saldo.toString());
}
function depositar(valor) {
    if (valor <= 0) {
        throw new Error("O valor debitado deve ser maior que zero");
    }
    saldo += valor;
    localStorage.setItem("saldo", saldo.toString());
}
const Conta = {
    getSaldo() {
        return saldo;
    },
    getDataAcesso() {
        return new Date();
    },
    getGrupoTransacoes() {
        const gruposTransacoes = [];
        const ListaTransacoes = structuredClone(transacoes);
        const transacoesOrdenadas = ListaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacao = "";
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao = transacao.data.toLocaleDateString("pt-br", { month: "long", year: "numeric" });
            if (labelAtualGrupoTransacao !== labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao;
                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: []
                });
            }
            gruposTransacoes.at(-1).transacoes.push(transacao);
        }
        return gruposTransacoes;
    },
    registrarTransacao(novaTransacao) {
        if (novaTransacao.tipoTransacao === TipoTransacao.DEPOSITO) {
            depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao === TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
            debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        }
        else {
            throw new Error("Tipo de Transação inválida!");
        }
        transacoes.push(novaTransacao);
        console.log(this.getGrupoTransacoes());
        localStorage.setItem("transacoes", JSON.stringify(transacoes));
    }
    // agruparTransacoes(): ResumoTransacoes {
    //     const resumo: ResumoTransacoes = {
    //         totalDepositos: 0,
    //         totalTransferencias: 0,
    //         totalPagamentos: 0
    //     };
    //     this.transacoes.forEach(transacao => {
    //        switch (transacao.TipoTransacao) {
    //         case TipoTransacao.DEPOSITO:
    //             resumo.totalDepositos += transacao.valor;
    //             break;
    //         case TipoTransacao.TRANSFERENCIA:
    //             resumo.totalTransferencias += transacao.valor;
    //             break;
    //         case TipoTransacao.PAGAMENTO_BOLETO:
    //             resumo.totalPagamentos += transacao.valor;
    //             break;
    //        } 
    //     });
    //     return resumo;
    // }
};
export default Conta;
