export interface Topico {
	id: string;
	title: string;
	data_inicio: Date;
	data_fim: Date;
	data_criada: Date;
	id_turma: string;
	encerrado: boolean;
	quantidade: number;
	peso_pergunta: number;
	peso_avaliacao: number;

}