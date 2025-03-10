-- Створення бази даних holywater, якщо вона не існує
SELECT 'CREATE DATABASE holywater'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'holywater') 
LIMIT 1;

-- Створення користувача admin з паролем, якщо такий користувач ще не існує
SELECT 'CREATE USER admin WITH PASSWORD ''cms_password'''
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') 
LIMIT 1;

-- Надаємо всі привілеї на базу даних holywater користувачу admin
GRANT ALL PRIVILEGES ON DATABASE holywater TO admin;

-- Підключаємося до бази даних holywater
\c holywater;

-- Надаємо привілеї на всі таблиці в базі даних для користувача admin
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;

-- Надаємо привілеї на всі функції в базі даних для користувача admin
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO admin;

-- Надаємо привілеї на всі послідовності в базі даних для користувача admin
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;
