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
        slug,
        integration_category_id
    )
values (
        gen_random_uuid(),
        'Google Calendar',
        'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
        'google-calendar',
        calendar_id
    ),
    (
        gen_random_uuid(),
        'Trello',
        'https://www.vectorlogo.zone/logos/trello/trello-tile.svg',
        'trello',
        task_management_id
    );
end $$;