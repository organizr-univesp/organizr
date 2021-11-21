-- Dropping the tables
drop table if exists items_integrations;
drop table if exists user_external_integrations;
drop table if exists items_integrations;
drop table if exists projects_integrations;
drop table if exists integrations;
drop table if exists integration_categories;
drop table if exists items;
drop table if exists projects;
drop table if exists users;
drop table if exists user_external_integrations;
-- Creating the tables
create table users (
    id uuid not null primary key,
    email varchar(256) not null unique,
    password_hash varchar(1024) not null,
    full_name varchar(256) null,
    role int not null default 0,
    activation_key uuid not null,
    activated_at timestamp without time zone null,
    created_at timestamp without time zone not null default now(),
    updated_at timestamp without time zone not null default now(),
    deleted_at timestamp without time zone null
);
create table projects (
    id uuid not null primary key,
    name varchar(256) not null,
    color varchar(16) not null,
    user_id uuid not null,
    slug varchar(256) not null,
    created_at timestamp without time zone not null default now(),
    updated_at timestamp without time zone not null default now(),
    deleted_at timestamp without time zone null,
    foreign key (user_id) references users (id)
);
create table items (
    id uuid not null primary key,
    name varchar(256) not null,
    project_id uuid not null,
    slug varchar(256) not null,
    finished_at timestamp without time zone null,
    created_at timestamp without time zone not null default now(),
    updated_at timestamp without time zone not null default now(),
    deleted_at timestamp without time zone null,
    foreign key (project_id) references projects (id)
);
create table integration_categories (
    id uuid not null primary key,
    name varchar(256) not null,
    color varchar(16) not null,
    created_at timestamp without time zone not null default now(),
    updated_at timestamp without time zone not null default now(),
    deleted_at timestamp without time zone null
);
create table integrations (
    id uuid not null primary key,
    name varchar(256) not null,
    thumbnail_url varchar(512) not null,
    color varchar(256) not null,
    slug varchar(64) not null unique,
    integration_category_id uuid not null,
    created_at timestamp without time zone not null default now(),
    updated_at timestamp without time zone not null default now(),
    deleted_at timestamp without time zone null,
    foreign key (integration_category_id) references integration_categories (id)
);
create table items_integrations (
    item_id uuid not null,
    integration_id uuid not null,
    external_id varchar(512) not null,
    created_at timestamp without time zone not null default now(),
    updated_at timestamp without time zone not null default now(),
    deleted_at timestamp without time zone null,
    primary key (item_id, integration_id),
    foreign key (item_id) references items (id),
    foreign key (integration_id) references integrations (id)
);
create table projects_integrations (
    project_id uuid not null,
    integration_id uuid not null,
    external_id varchar(512) not null,
    created_at timestamp without time zone not null default now(),
    updated_at timestamp without time zone not null default now(),
    deleted_at timestamp without time zone null,
    primary key (project_id, integration_id),
    foreign key (project_id) references projects (id),
    foreign key (integration_id) references integrations (id)
);
create table user_external_integrations (
    user_id uuid not null,
    type varchar(32) not null,
    meta text not null,
    created_at timestamp without time zone not null default now(),
    updated_at timestamp without time zone not null default now(),
    deleted_at timestamp without time zone null,
    primary key (user_id, type),
    foreign key (user_id) references users (id)
);

select * from projects;
select * from projects_integrations;
select * from items_integrations;
select * from users;
delete from projects_integrations where project_id is not null;
delete from projects where name = 'Projeto #2';
delete from items where name like 'Item #%';