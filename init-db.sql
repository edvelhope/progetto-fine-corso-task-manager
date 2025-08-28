CREATE TYPE task_status AS ENUM ('da fare', 'in corso', 'completata');
CREATE TYPE task_priority AS ENUM ('Alta', 'Media', 'Bassa');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status task_status DEFAULT 'da fare',
  deadline DATE,
  priority task_priority DEFAULT 'Media',
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
