DROP DATABASE IF EXISTS `techgo`;
CREATE DATABASE IF NOT EXISTS `Techgo`;
CREATE TABLE IF NOT EXISTS `Techgo`.`Administrador` (
  `id` CHAR(36) NOT NULL,
  `nome` VARCHAR(80) NOT NULL,
  `senha` CHAR(40) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC)
  )
ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `Techgo`.`usuarios` (
  `id` CHAR(36) NOT NULL,
  `cpf` VARCHAR(12) NOT NULL,
  `nome` VARCHAR(80) NOT NULL,
  `email` VARCHAR(80) NOT NULL,
  `senha` CHAR(40) NOT NULL,
  `status` ENUM('ativo', 'inativo', 'premium') NOT NULL DEFAULT 'ativo',
  `data_nascimento` DATE NOT NULL,
  `data_registro` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC) ,
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC) ,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) )
ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `Techgo`.`Categoria` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(50) NOT NULL,
  `Descricao` TEXT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Techgo`.`trabalhadores` (
  `id` CHAR(36) NOT NULL,
  `cpf` VARCHAR(12) NOT NULL,
  `nome` VARCHAR(80) NOT NULL,
  `email` VARCHAR(80) NOT NULL,
  `senha` CHAR(40) NOT NULL,
  `status` ENUM('ativo', 'inativo', 'premium') NOT NULL DEFAULT 'ativo',
  `data_nascimento` DATE NOT NULL,
  `data_registro` TIMESTAMP NULL,
  `Categoria_id` INT NOT NULL,
  PRIMARY KEY (`id`, `Categoria_id`),
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC) ,
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC) ,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) ,
    FOREIGN KEY (`Categoria_id`)
    REFERENCES `Techgo`.`Categoria` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `Techgo`.`banimento2` (
  `Administrador_id` CHAR(36) NOT NULL,
  `trabalhadores_id` CHAR(36) NOT NULL,
  `motivo` MEDIUMTEXT NOT NULL,
  `dataBanimento` TIMESTAMP NOT NULL,
  PRIMARY KEY (`Administrador_id`, `trabalhadores_id`),
    FOREIGN KEY (`Administrador_id`)
    REFERENCES `Techgo`.`Administrador` (`id`),
    FOREIGN KEY (`trabalhadores_id`)
    REFERENCES `Techgo`.`trabalhadores` (`id`)
)
ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `Techgo`.`Pedidos` (
  `id_pedido` CHAR(36) NOT NULL,
  `descricao` TEXT NOT NULL,
  `localizacao` VARCHAR(50) NOT NULL,
  `data_criacao` TIMESTAMP NOT NULL,
  `data_conclusao` TIMESTAMP NULL DEFAULT NULL,
  `valor_fechado` DECIMAL(10,2) DEFAULT NULL,
  `trabalhadores_id` CHAR(36) DEFAULT NULL,
  `usuarios_id` CHAR(36) NOT NULL,
  PRIMARY KEY (`id_pedido`, `usuarios_id`),
    FOREIGN KEY (`trabalhadores_id`)
    REFERENCES `Techgo`.`trabalhadores` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    FOREIGN KEY (`usuarios_id`)
    REFERENCES `Techgo`.`usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `Techgo`.`mensagens` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `mensagem` LONGTEXT NOT NULL,
  `data_envio` TIMESTAMP NOT NULL,
  `status` ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo',
  `emissor` ENUM('usuario', 'trabalhador') NOT NULL,
  `trabalhador_id` CHAR(36) NOT NULL,
  `usuario_id` CHAR(36) NOT NULL,
  PRIMARY KEY (`id`, `trabalhador_id`, `usuario_id`),
    FOREIGN KEY (`trabalhador_id`)
    REFERENCES `Techgo`.`trabalhadores` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    FOREIGN KEY (`usuario_id`)
    REFERENCES `Techgo`.`usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `Techgo`.`banimento` (
  `Administrador_id` CHAR(36) NOT NULL,
  `usuarios_id` CHAR(36) NOT NULL,
  `motivo` MEDIUMTEXT NOT NULL,
  `dataBanimento` TIMESTAMP NOT NULL,
  PRIMARY KEY (`Administrador_id`, `usuarios_id`),
    FOREIGN KEY (`Administrador_id`)
    REFERENCES `Techgo`.`Administrador` (`id`),
    FOREIGN KEY (`usuarios_id`)
    REFERENCES `Techgo`.`usuarios` (`id`))
ENGINE = InnoDB;
insert into techgo.categoria values(null, 'técnico', 'especialista em aperelhos eletronicos');
insert into techgo.categoria values(null, 'eletricista', 'especialista em redes elétricas');

#comandos de debug

/*
insert into Techgo.Usuarios values('uuid2', '10000000000', 'infrator', 'infrator@gmail.com', sha1('senha') ,'inativo' ,'2004-05-22', '2020-04-02');
insert into Techgo.Usuarios values('uuid3', '20000000000', 'joão', 'joãozin@gmail.com', sha1('senha') ,'ativo' ,'2004-05-22', '2020-04-01');
insert into techgo.banimento values('uuid1', 'uuid2', 'usuario roubou seu trabalhador', '2020-04-05');
insert into Techgo.Administrador values(uuid(), 'sergio', sha1('senha'));
insert into techgo.trabalhadores values('uuid5', '10010000000', 'trabalhador', 'trabalhador@gmail.com', sha1('senha') ,'premium' ,'2004-05-22', '2020-04-02', 2);
insert into techgo.trabalhadores values('uuid6', '10010060000', 'ronaldo', 'ronaldo@gmail.com', sha1('senha') ,'premium' ,'2004-05-22', '2020-04-12', 1);
insert into techgo.pedidos values('uuid7', '2020-04-03', '2020-04-04', '400.00', 'uuid5', 'uuid2');
insert into techgo.mensagens values(null, 'quanto custaria um reparo no computador', '2020-04-04', 'ativo','usuario' ,'uuid6', 'uuid2');
insert into techgo.mensagens values(null, 'quanto custaria um reparo no computador', '2020-04-04', 'ativo','trabalhador' ,'uuid6', 'uuid3');
insert into techgo.banimento2 values('uuid1', 'uuid5' , 'trabalhador roubou seu usuario', '2020-04-03');
show columns from techgo.mensagens;
*/
delete from trabalhadores limit 1;
delete from pedidos limit 1;
update trabalhadores set `status` = 'ativo' where nome = 'Rodrigo Elias';
select * from trabalhadores;
describe categoria;