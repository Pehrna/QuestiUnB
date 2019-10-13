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

}