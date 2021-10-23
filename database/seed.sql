-- Clear the database
delete from items_integrations;
delete from integrations;
delete from integration_categories;
delete from items;
delete from projects;
delete from users;
do $$
declare calendar_id uuid = gen_random_uuid();
task_management_id uuid = gen_random_uuid();
user_id uuid = gen_random_uuid();
admin_id uuid = gen_random_uuid();
user_project_id uuid = gen_random_uuid();
admin_project_id uuid = gen_random_uuid();
user_project_items_ids uuid [] = array [gen_random_uuid(), gen_random_uuid(), gen_random_uuid()];
admin_project_items_ids uuid [] = array [gen_random_uuid(), gen_random_uuid(), gen_random_uuid()];
begin -- Add data
insert into integration_categories (id, name, color)
values (calendar_id, 'Calendário', '#0362fc'),
    (
        task_management_id,
        'Gerenciador de Tarefas',
        '#fc7703'
    );
insert into integrations (
        id,
        name,
        thumbnail_url,
        color,
        slug,
        integration_category_id
    )
values (
        gen_random_uuid(),
        'Google Calendar',
        'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
        '#4285F4',
        'google-calendar',
        calendar_id
    ),
    (
        gen_random_uuid(),
        'Trello',
        'https://www.vectorlogo.zone/logos/trello/trello-tile.svg',
        '#0075B9',
        'trello',
        task_management_id
    );
insert into users (
        id,
        email,
        password_hash,
        full_name,
        role
    )
values (
        user_id,
        'test+user@organizr.com',
        sha512('test+user'),
        'Organizr User',
        0
    ),
    (
        admin_id,
        'test+administrator@organizr.com',
        sha512('test+administrator'),
        'Organizr Administrator',
        0
    );
insert into projects (
        id,
        name,
        color,
        user_id,
        slug
    )
values (
        user_project_id,
        'Estudos',
        '#FD6E25',
        user_id,
        'estudos'
    ),
    (
        admin_project_id,
        'Trabalho',
        '#2758FB',
        admin_id,
        'trabalho'
    );
insert into items (
        id,
        name,
        project_id,
        slug
    )
values (
        user_project_items_ids [1],
        'Ler sobre Docker',
        user_project_id,
        'ler-sobre-docker'
    ),
    (
        user_project_items_ids [2],
        'Criar container Docker',
        user_project_id,
        'criar-container-docker'
    ),
    (
        user_project_items_ids [3],
        'Criar imagem customizada no Docker',
        user_project_id,
        'criar-imagem-customizada-no-docker'
    ),
    (
        admin_project_items_ids [1],
        'Deploy para produção',
        admin_project_id,
        'deploy-para-producao'
    ),
    (
        admin_project_items_ids [2],
        'Verificar snapshots do banco de dados',
        admin_project_id,
        'verificar-snapshots-do-banco-de-dados'
    ),
    (
        admin_project_items_ids [3],
        'Review PR para integração com Apple',
        admin_project_id,
        'review-pr-para-integracao-com-apple'
    );
end $$;