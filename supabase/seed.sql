-- create test unit
INSERT INTO
    public.groups (name)
VALUES
    ('demo');

-- create test users
DELETE FROM
    auth.users
WHERE
    email LIKE 'user%';

INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        select
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4(),
            'authenticated',
            'authenticated',
            'demo' || '@example.com',
            crypt ('Password@1234', gen_salt ('bf')),
            current_timestamp,
            null,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            jsonb_build_object(
                'unit',
                'demo',
                'name',
                'demo',
                'email',
                'demo' || '@example.com',
                'email_verified',
                false,
                'phone_verified',
                false
            ),
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
    );
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        select
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4(),
            'authenticated',
            'authenticated',
            'user' || (ROW_NUMBER() OVER ()) || '@example.com',
            crypt ('Password@1234', gen_salt ('bf')),
            current_timestamp,
            null,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            jsonb_build_object(
                'unit',
                'demo',
                'name',
                'user' || ROW_NUMBER() OVER (),
                'email',
                'user' || ROW_NUMBER() OVER () || '@example.com',
                'email_verified',
                false,
                'phone_verified',
                false
            ),
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        FROM
            generate_series(1, 12)
    );

-- test user email identities
INSERT INTO
    auth.identities (
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        select
            uuid_generate_v4(),
            id,
            uuid_generate_v4(),
            format('{"sub":"%s","email":"%s"}', id :: text, email) :: jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        from
            auth.users
    );

insert into vault.secrets
(secret, name, description)
values
  ('http://127.0.0.1:54321', 'project_url', ''),
  ('some_value', 'service_role_key', '');