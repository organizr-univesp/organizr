create table if not exists user_data(
	login varchar(256)  unique not null,
	senha varchar(256) not null,
	nome varchar(256) not null,
	sobrenome varchar(256),
	idade int,
	email varchar(256) unique not null,
	id_usr SERIAL primary key 
	)
	
create table if not exists produto(
	nome varchar(20),
	cor varchar(15),
	categoria varchar(20),
	id int primary key
)

-- itens, sujeitos a alteração
create table if not exists itens(
	projeto varchar(256) not null,
	id_projeto serial primary key,
	id_usr int,
	constraint fk_itemPessoa foreign key (id_usr) references user_data(id_usr)
)

-- Formato postgreSQL padrão para inserção de datas é Ano/Mes/Dia
-- Etapas são referentes aos tipos de eventos criados pelo usuário.
create table if not exists etapas(
	dataInicio date,
	dataFim date,
	id_projeto int,
	nomeEtapa varchar(50),
	descEtapa text,
	constraint fk_etapaItems foreign key (id_projeto) references items(id_projeto)
)