export interface Pergunta {
	id: string;
	texto: string;
	invest: number;
	avaliacao: Nota[];
	data_criacao: Date;
	dono: string;



}

export interface Nota {
	id: string;
	dono: string;
	dono_nome: string;
	like: string;
	data_nota: Date;
}