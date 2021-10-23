-- Dropping the tables
drop table items_integrations;
drop table integrations;
drop table integration_categories;
drop table items;
drop table projects;
drop table users;
-- Creating the tables
create table users (
    id uuid not null primary key,
    email varchar(256) not null unique,
    password_hash varchar(1024) not null,
    full_name varchar(256) null,
    created_at timestamp without time zone not null default now(),
    deleted_at timestamp without time zone null
);
create table projects (
    id uuid not null primary key,
    name varchar(256) not null,
    color varchar(16) not null,
    user_id uuid not null,
    created_at timestamp without time zone not null default now(),
    deleted_at timestamp without time zone null,
    foreign key (user_id) references users (id)
);
create table items (
    id uuid not null primary key,
    name varchar(256) not null,
    project_id uuid not null,
    created_at timestamp without time zone not null default now(),
    deleted_at timestamp without time zone null,
    foreign key (project_id) references projects (id)
);
create table integration_categories (
    id uuid not null primary key,
    name varchar(256) not null,
    color varchar(16) not null
);
create table integrations (
    id uuid not null primary key,
    name varchar(256) not null,
    thumbnail_url varchar(512) not null,
    slug varchar(64) not null unique,
    integration_category_id uuid not null,
    created_at timestamp without time zone not null default now(),
    deleted_at timestamp without time zone null,
    foreign key (integration_category_id) references integration_categories (id)
);
create table items_integrations (
    item_id uuid not null,
    integration_id uuid not null,
    created_at timestamp without time zone not null default now(),
    deleted_at timestamp without time zone null,
    primary key (item_id, integration_id),
    foreign key (item_id) references items (id),
    foreign key (integration_id) references integrations (id)
);