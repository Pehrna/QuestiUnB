export interface Turma {
	id: string;
	name: string;
	password: string;
	dono: string;
	lista: Inscrito[];
}

export interface Inscrito {
	//id: string;
	id_turma: string;
	id_aluno: string;
	moedas: number;
	posicao: number;
	reputacao_compartilhador: number;
	reputacao_avaliador: number;
	lista_topico: Questoes[];
}

export interface Questoes {
	id_turma: string;
	id_aluno: string;
	id_topico: string;
	nome_topico: string;
	qtd_questoes: number;
	qtd_esperada: number;
}